import {
  Data,
  type Workspace,
  type Change,
  type Inventory,
  type Blueprint,
} from "../model/types.js";
import { WorkspaceFiles } from "../workspace/files.js";
import { WorkspaceService } from "../workspace/service.js";
import { SourceService } from "./service.js";

export interface RefreshPreview {
  id: string;
  inventories: Inventory[];
  changes: Change[];
  gaps: string[];
  baselineHash: string;
  mappingHash: string;
}
export class RefreshService {
  private previews = new Map<string, RefreshPreview>();
  constructor(
    private workspace: WorkspaceService,
    private source: SourceService,
  ) {}
  async preview(revisions: Record<string, string>): Promise<RefreshPreview> {
    const state = this.workspace.load();
    const baseline = structuredClone(state.baseline);
    const inventories: Inventory[] = [];
    for (const repository of baseline.repositories) {
      repository.revision =
        revisions[repository.project] || repository.revision;
      inventories.push(await this.source.inventory(repository));
    }
    const gaps: string[] = [];
    const changes = this.project(state, inventories, gaps);
    const manifest = Data.record(
      this.workspace.language.parse(
        this.workspace.files.read("workspace.yaml"),
      ),
    );
    changes.push({
      path: String(manifest.baseline),
      expected: state.baselineHash,
      text: JSON.stringify(baseline, null, 2) + "\n",
    });
    const payload = {
      inventories,
      changes,
      gaps,
      baselineHash: state.baselineHash,
      mappingHash: state.auxiliary.mappings.hash,
    };
    const preview = {
      ...payload,
      id: WorkspaceFiles.hash(Data.canonical(payload)),
    };
    this.previews.set(preview.id, preview);
    return preview;
  }
  private project(
    state: Workspace,
    inventories: Inventory[],
    gaps: string[],
  ): Change[] {
    const changes: Change[] = [];
    const mappings = this.workspace.mappings(state);
    for (const document of state.documents) {
      if (document.model.view !== "implementation") continue;
      const model = structuredClone(document.model);
      this.bindings(model, mappings, inventories, gaps);
      model.metadata.notes = [
        ...Data.strings(model.metadata.notes),
        "Studio refresh: authored meaning retained as mapped provenance; behavioral observations require fresh evidence.",
      ];
      changes.push({
        path: document.path,
        expected: document.hash,
        text: WorkspaceService.serialize(model),
      });
    }
    return changes;
  }
  private bindings(
    model: Blueprint,
    mappings: ReturnType<WorkspaceService["mappings"]>,
    inventories: Inventory[],
    gaps: string[],
  ): void {
    for (const object of model.objects) {
      const mapping = mappings.find(
        RefreshService.subject.bind(null, object.id),
      );
      if (!mapping) continue;
      if (mapping.review !== "accepted") {
        gaps.push(object.id + ": mapping requires review");
        continue;
      }
      object.sourceBindings = structuredClone(mapping.bindings);
      for (const binding of object.sourceBindings) {
        const inventory = inventories.find(
          RefreshService.projectMatch.bind(null, binding.project),
        );
        const file = inventory?.files.find(
          RefreshService.pathMatch.bind(null, binding.path),
        );
        const declarations =
          file?.declarations.filter(
            RefreshService.symbolMatch.bind(null, binding.symbol),
          ) ?? [];
        if (!file || (binding.symbol && declarations.length !== 1)) {
          gaps.push(object.id + ": missing or ambiguous source binding");
          continue;
        }
        binding.revision = inventory!.revision;
        if (declarations[0])
          Object.assign(binding, {
            fingerprint: declarations[0].fingerprint,
            start: declarations[0].start,
            end: declarations[0].end,
          });
      }
    }
  }
  private static subject(id: string, item: { subject: string }): boolean {
    return item.subject === id;
  }
  private static projectMatch(id: string, item: Inventory): boolean {
    return item.project === id;
  }
  private static pathMatch(path: string, item: { path: string }): boolean {
    return item.path === path;
  }
  private static symbolMatch(
    symbol: string | undefined,
    item: { symbol: string },
  ): boolean {
    return !symbol || item.symbol === symbol;
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
    const path = ".studio/snapshots/" + id + ".json";
    const changes = [
      ...preview.changes,
      {
        path,
        expected: this.workspace.files.current(path),
        text: Data.canonical(preview),
      },
    ];
    this.workspace.files.transaction(changes);
    this.previews.delete(id);
    return { saved: true };
  }
}
