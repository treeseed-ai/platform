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
    assert.equal(
      report.actualSha,
      createHash("sha256").update(bytes).digest("hex"),
    );
    assert.ok(Array.isArray(report.changes));
    assert.match(report.expectedSha, /^[a-f0-9]{64}$/);
  }

  mixedChangesAreClassifiedAndSorted(): void {
    const result = this.inspect("admin", "vendor/task3c/api.tgz");
    assert.equal(result.status, 0, result.stderr);
    const report = JSON.parse(result.stdout);
    const kinds = report.changes.map(
      (change: { kind?: string }) => change.kind,
    );
    assert.deepEqual(
      [...new Set(kinds)].sort(),
      ["added", "modified", "removed"],
      "ARTIFACT_CHANGE_KINDS_REQUIRED",
    );
    const paths = report.changes.map((change: { path: string }) => change.path);
    assert.deepEqual(paths, [...paths].sort(this.compareCodePoints.bind(this)));
  }

  private compareCodePoints(left: string, right: string): number {
    const leftPoints = Array.from(left, this.codePoint.bind(this));
    const rightPoints = Array.from(right, this.codePoint.bind(this));
    const limit = Math.min(leftPoints.length, rightPoints.length);
    for (let index = 0; index < limit; index += 1) {
      if (leftPoints[index] !== rightPoints[index]) {
        return leftPoints[index]! - rightPoints[index]!;
      }
    }
    return leftPoints.length - rightPoints.length;
  }

  private codePoint(value: string): number {
    return value.codePointAt(0)!;
  }

  unknownOwner(): void {
    const result = this.inspect("unknown");
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /ARTIFACT_SELECTION_REQUIRED/);
  }

  private inspect(owner: string, archive = "vendor/task3c/admin.tgz") {
    return spawnSync(
      process.execPath,
      ["tests/support/assembly/artifact-inventory.mts", owner, archive],
      { encoding: "utf8", timeout: 30000 },
    );
  }
}
const suite = new ArtifactDiagnosticsTests();
test(
  "artifact diagnostics inspect a real archive through the public API",
  suite.selectedArchive.bind(suite),
);
test(
  "artifact diagnostics classify and sort mixed archive changes",
  suite.mixedChangesAreClassifiedAndSorted.bind(suite),
);
test(
  "artifact diagnostics reject an unknown selection",
  suite.unknownOwner.bind(suite),
);
