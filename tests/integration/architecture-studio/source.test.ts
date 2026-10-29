import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync, symlinkSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { GitSource } from "../../../architecture/studio/src/source/git.js";
import { SourceService } from "../../../architecture/studio/src/source/service.js";
import { WorkspaceFiles } from "../../../architecture/studio/src/workspace/files.js";
import type {
  Binding,
  Diagnostic,
} from "../../../architecture/studio/src/model/types.js";

class SourceIntegration {
  private root = mkdtempSync(join(tmpdir(), "studio-source-"));
  private git(args: string[]): string {
    return execFileSync("git", ["-C", this.root, ...args], {
      encoding: "utf8",
    }).trim();
  }
  private initialize(): string {
    this.git(["init", "-q"]);
    this.git(["config", "user.email", "fixture@example.invalid"]);
    this.git(["config", "user.name", "Fixture"]);
    const lines = Array.from({ length: 21 }, SourceIntegration.statement);
    writeFileSync(
      join(this.root, "sample.ts"),
      "export class Sample { run() {\n" + lines.join("\n") + "\n} }\n",
    );
    writeFileSync(
      join(this.root, "sample.ex"),
      "defmodule Sample do\n  def run(), do: :ok\nend",
    );
    symlinkSync("/outside", join(this.root, "escape.ts"));
    this.git(["add", "."]);
    this.git(["commit", "-qm", "fixture"]);
    return this.git(["rev-parse", "HEAD"]);
  }
  private static statement(_value: unknown, index: number): string {
    return "console.log(" + index + ");";
  }
  static async run(): Promise<void> {
    const fixture = new SourceIntegration();
    try {
      await fixture.inspect();
    } finally {
      rmSync(fixture.root, { recursive: true, force: true });
    }
  }
  private async inspect(): Promise<void> {
    const revision = this.initialize();
    const service = new SourceService(
      new GitSource({ "project.sample": this.root }),
    );
    const binding: Binding = {
      project: "project.sample",
      revision,
      path: "sample.ts",
      symbol: "Sample.run",
    };
    const pins = new Map([["project.sample", revision]]);
    assert.ok(
      (await service.validate(binding, pins)).some(
        SourceIntegration.code.bind(null, "METHOD_TOO_LONG"),
      ),
    );
    await this.invalidBindings(service, binding, pins);
    await this.native(service, binding, pins);
    await this.determinism(service, revision);
  }
  private async invalidBindings(
    service: SourceService,
    binding: Binding,
    pins: Map<string, string>,
  ): Promise<void> {
    assert.ok(
      (await service.validate({ ...binding, path: "missing.ts" }, pins)).some(
        SourceIntegration.code.bind(null, "MISSING_SOURCE"),
      ),
    );
    assert.ok(
      (
        await service.validate(
          { ...binding, fingerprint: "0".repeat(64) },
          pins,
        )
      ).some(SourceIntegration.code.bind(null, "STALE_EVIDENCE")),
    );
    assert.ok(
      (await service.validate({ ...binding, path: "escape.ts" }, pins)).some(
        SourceIntegration.code.bind(null, "RESOLVED_PATH_ESCAPE"),
      ),
    );
  }
  private async native(
    service: SourceService,
    binding: Binding,
    pins: Map<string, string>,
  ): Promise<void> {
    const result = await service.validate(
      { ...binding, path: "sample.ex", symbol: "Sample.run/0" },
      pins,
    );
    assert.ok(
      result.some(SourceIntegration.code.bind(null, "UNSUPPORTED_EXTRACTION")),
    );
    assert.ok(
      !result.some(SourceIntegration.code.bind(null, "MISSING_SOURCE")),
    );
  }
  private async determinism(
    service: SourceService,
    revision: string,
  ): Promise<void> {
    const repository = {
      project: "project.sample",
      revision,
      repository: "https://example.invalid/sample.git",
      checkout: ".",
      manifest: {},
    };
    const before = await service.inventory(repository);
    writeFileSync(join(this.root, "sample.ts"), "uncommitted change");
    assert.deepEqual(await service.inventory(repository), before);
  }
  private static code(code: string, diagnostic: Diagnostic): boolean {
    return diagnostic.code === code;
  }
  static recovery(): void {
    const root = mkdtempSync(join(tmpdir(), "studio-recovery-"));
    try {
      const files = new WorkspaceFiles(root);
      files.write("intent.yaml", "before");
      const change = {
        path: "intent.yaml",
        expected: files.current("intent.yaml"),
        text: "after",
      };
      files.write(".studio/transaction.json", JSON.stringify([change]));
      files.recover();
      assert.equal(files.read("intent.yaml"), "after");
      files.write(".studio/transaction.json", JSON.stringify([change]));
      files.write("intent.yaml", "external");
      assert.throws(files.recover.bind(files), /RECOVERY_CONFLICT/);
      assert.equal(files.read("intent.yaml"), "external");
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  }
}
test(
  "source checks use exact Git bytes and real source evidence",
  SourceIntegration.run,
);
test(
  "interrupted writes recover without discarding external edits",
  SourceIntegration.recovery,
);
