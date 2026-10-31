import { test } from "bun:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";

class ArtifactDiagnosticsTests {
  selectedArchive(): void {
    const result = this.inspect("admin");
    assert.equal(result.status, 0, result.stderr);
    const report = JSON.parse(result.stdout);
    const bytes = readFileSync("vendor/task3c/admin.tgz");
    assert.equal(report.owner, "admin");
    assert.equal(report.actualSha, createHash("sha256").update(bytes).digest("hex"));
    assert.ok(Array.isArray(report.changes));
    assert.match(report.expectedSha, /^[a-f0-9]{64}$/);
  }

  unknownOwner(): void {
    const result = this.inspect("unknown");
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /ARTIFACT_SELECTION_REQUIRED/);
  }

  private inspect(owner: string) {
    return spawnSync(process.execPath, [
      "tests/support/assembly/artifact-inventory.mts", owner,
      "vendor/task3c/admin.tgz",
    ], { encoding: "utf8", timeout: 30000 });
  }
}
const suite = new ArtifactDiagnosticsTests();
test("artifact diagnostics inspect a real archive through the public API", suite.selectedArchive.bind(suite));
test("artifact diagnostics reject an unknown selection", suite.unknownOwner.bind(suite));
