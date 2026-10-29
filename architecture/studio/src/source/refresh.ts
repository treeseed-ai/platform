import {
  Data,
  type Workspace,
  type Change,
  type Inventory,
  type Baseline,
} from "../model/types.js";
import { WorkspaceFiles } from "../workspace/files.js";
import { WorkspaceService } from "../workspace/service.js";
import { SourceService } from "./service.js";
import type { WorkspacePort, SourcePort } from "../server/contracts.js";
import { SourceProjection } from "./projection.js";

export interface RefreshPreview {
  id: string;
  inventories: Inventory[];
  changes: Change[];
  gaps: string[];
  baselineHash: string;
  mappingHash: string;
  previous: Workspace;
}
export class RefreshService {
  private previews = new Map<string, RefreshPreview>();
  constructor(
    private workspace: WorkspacePort,
    private source: SourcePort,
  ) {}
  async preview(revisions: Record<string, string>): Promise<RefreshPreview> {
    const state = this.workspace.load();
    const baseline = structuredClone(state.baseline);
    const inventories = await this.extract(baseline, revisions);
    const gaps: string[] = [];
    const changes = this.project(state, inventories, gaps, baseline.id);
    changes.push(this.baselineChange(state, baseline));
    const payload = {
      inventories,
      changes,
      gaps,
      baselineHash: state.baselineHash,
      mappingHash: state.auxiliary.mappings.hash,
      previous: state,
    };
    const preview = {
      ...payload,
      id: WorkspaceFiles.hash(Data.canonical(payload)),
    };
    this.previews.set(preview.id, preview);
    return preview;
  }
  private baselineChange(state: Workspace, baseline: Baseline): Change {
    const manifest = Data.record(
      this.workspace.language.parse(
        this.workspace.files.read("workspace.yaml"),
      ),
    );
    return {
      path: String(manifest.baseline),
      expected: state.baselineHash,
      text: JSON.stringify(baseline, null, 2) + "\n",
    };
  }
  private async extract(
    baseline: Baseline,
    revisions: Record<string, string>,
  ): Promise<Inventory[]> {
    const inventories: Inventory[] = [];
    for (const repository of baseline.repositories) {
      repository.revision =
        revisions[repository.project] || repository.revision;
      inventories.push(await this.source.inventory(repository));
      repository.manifest = JSON.parse(
        this.source.git.read({
          project: repository.project,
          revision: repository.revision,
          path: "package.json",
        }),
      );
    }
    baseline.id =
      "studio." + WorkspaceFiles.hash(Data.canonical(inventories)).slice(0, 24);
    return inventories;
  }
  private project(
    state: Workspace,
    inventories: Inventory[],
    gaps: string[],
    baseline: string,
  ): Change[] {
    const changes: Change[] = [];
    const projection = new SourceProjection(
      inventories,
      this.workspace.mappings(state),
      gaps,
    );
    for (const document of state.documents) {
      if (document.model.view !== "implementation") continue;
      const model = structuredClone(document.model);
      projection.apply(model);
      model.metadata.baseline = baseline;
      changes.push({
        path: document.path,
        expected: document.hash,
        text: WorkspaceService.serialize(model),
      });
    }
    changes.push(
      this.snapshotChange(".studio/active-inventory.json", inventories),
    );
    return changes;
  }
  private snapshotChange(path: string, value: unknown): Change {
    const current = this.workspace.files.current(path);
    const text = Data.canonical(value) + "\n";
    if (
      path.startsWith(".studio/snapshots/") &&
      current &&
      current !== WorkspaceFiles.hash(text)
    )
      throw new Error("IMMUTABLE_SNAPSHOT_CONFLICT");
    return {
      path,
      expected: current,
      text,
    };
  }
  publish(id: string): { saved: boolean } {
    const preview = this.previews.get(id);
    if (!preview) throw new Error("PREVIEW_EXPIRED");
    const state = this.workspace.load();
    if (
      state.auxiliary.mappings.hash !== preview.mappingHash ||
      state.baselineHash !== preview.baselineHash
    )
      throw new Error("CONFLICT");
    const previousId = WorkspaceFiles.hash(Data.canonical(preview.previous));
    const changes = [...preview.changes];
    changes.push(
      this.snapshotChange(
        ".studio/snapshots/" + previousId + ".json",
        preview.previous,
      ),
    );
    changes.push(
      this.snapshotChange(".studio/snapshots/" + id + ".json", preview),
    );
    this.workspace.files.transaction(changes);
    this.previews.delete(id);
    return { saved: true };
  }
}
