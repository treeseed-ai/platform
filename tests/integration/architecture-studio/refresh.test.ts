import { test } from "node:test";
import assert from "node:assert/strict";
import {
  mkdtempSync,
  cpSync,
  writeFileSync,
  rmSync,
  readdirSync,
} from "node:fs";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { execFileSync } from "node:child_process";
import { WorkspaceService } from "../../../architecture/studio/src/workspace/service.js";
import { RefreshService } from "../../../architecture/studio/src/source/refresh.js";
import { SourceService } from "../../../architecture/studio/src/source/service.js";
import { GitSource } from "../../../architecture/studio/src/source/git.js";
class RefreshIntegration {
  private root = mkdtempSync(join(tmpdir(), "studio-refresh-"));
  private source = mkdtempSync(join(tmpdir(), "studio-git-"));
  static async run(): Promise<void> {
    const fixture = new RefreshIntegration();
    try {
      await fixture.verify();
    } finally {
      rmSync(fixture.root, { recursive: true, force: true });
      rmSync(fixture.source, { recursive: true, force: true });
    }
  }
  private initialize(): WorkspaceService {
    for (const name of [
      "language",
      "implementation",
      "intent",
      "profiles",
      "baselines",
      "workspace.yaml",
    ])
      cpSync(resolve("architecture", name), join(this.root, name), {
        recursive: true,
      });
    this.commitSource();
    const workspace = new WorkspaceService(this.root);
    this.baseline(workspace);
    this.mapping(workspace);
    return workspace;
  }
  private mapping(workspace: WorkspaceService): void {
    workspace.saveAuxiliary("mappings", "", {
      schemaVersion: "studio-mappings/0.1",
      entries: [
        {
          subject: "agent.activities",
          provenance: "Reviewed fixture identity",
          review: "accepted",
          bindings: [
            {
              project: "project.agent",
              revision: this.git(["rev-parse", "HEAD"]).trim(),
              path: "sample.ts",
              symbol: "Sample.run",
            },
          ],
        },
      ],
    });
  }
  private baseline(workspace: WorkspaceService): void {
    const baseline = workspace.load().baseline;
    baseline.repositories = [
      {
        project: "project.agent",
        checkout: ".",
        repository: "https://example.invalid/agent.git",
        revision: this.git(["rev-parse", "HEAD"]).trim(),
        manifest: {},
      },
    ];
    workspace.files.write(
      "baselines/repositories.json",
      JSON.stringify(baseline),
    );
  }
  private commitSource(): void {
    writeFileSync(join(this.source, "package.json"), "{}");
    writeFileSync(
      join(this.source, "sample.ts"),
      "export class Sample { run():void {} }",
    );
    this.git(["init", "-q"]);
    this.git(["add", "."]);
    this.git([
      "-c",
      "user.name=Fixture",
      "-c",
      "user.email=fixture@example.invalid",
      "commit",
      "-qm",
      "fixture",
    ]);
  }
  private git(args: string[]): string {
    return execFileSync("git", ["-C", this.source, ...args], {
      encoding: "utf8",
    });
  }
  private async verify(): Promise<void> {
    const workspace = this.initialize();
    const service = new RefreshService(
      workspace,
      new SourceService(new GitSource({ "project.agent": this.source })),
    );
    const intent = workspace.files.read("intent/agent.yaml");
    const first = await service.preview({});
    assert.deepEqual(await service.preview({}), first);
    assert.equal(first.inventories[0].files.length, 2);
    assert.equal(workspace.files.read("intent/agent.yaml"), intent);
    service.publish(first.id);
    assert.equal(workspace.files.read("intent/agent.yaml"), intent);
    assert.equal(readdirSync(join(this.root, ".studio/snapshots")).length, 2);
    assert.ok(workspace.files.current(".studio/active-inventory.json"));
    await this.rename(workspace, service);
    await this.conflict(workspace, service);
  }
  private async rename(
    workspace: WorkspaceService,
    service: RefreshService,
  ): Promise<void> {
    const observed = workspace
      .load()
      .documents.find(RefreshIntegration.agent)!.model;
    const binding = observed.objects.find(RefreshIntegration.subject)!
      .sourceBindings![0];
    assert.equal(binding.fingerprint?.length, 64);
    writeFileSync(
      join(this.source, "sample.ts"),
      "export class Renamed { run():void {} }",
    );
    this.git(["add", "."]);
    this.git([
      "-c",
      "user.name=Fixture",
      "-c",
      "user.email=fixture@example.invalid",
      "commit",
      "-qm",
      "rename",
    ]);
    const preview = await service.preview({
      "project.agent": this.git(["rev-parse", "HEAD"]).trim(),
    });
    assert.ok(preview.gaps.some(RefreshIntegration.ambiguous));
  }
  private static agent(document: { path: string }): boolean {
    return document.path === "implementation/agent.yaml";
  }
  private static subject(object: { id: string }): boolean {
    return object.id === "agent.activities";
  }
  private static ambiguous(gap: string): boolean {
    return gap.startsWith("agent.activities:");
  }
  private async conflict(
    workspace: WorkspaceService,
    service: RefreshService,
  ): Promise<void> {
    const preview = await service.preview({});
    const path = "implementation/agent.yaml";
    workspace.files.write(
      path,
      workspace.files.read(path) + "\n# external edit\n",
    );
    assert.throws(service.publish.bind(service, preview.id), /CONFLICT/);
    assert.ok(workspace.files.read(path).endsWith("# external edit\n"));
  }
}
test(
  "refresh is deterministic, retains history and rejects concurrent publication",
  RefreshIntegration.run,
);
