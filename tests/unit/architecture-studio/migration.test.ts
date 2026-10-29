import { test } from "node:test";
import assert from "node:assert/strict";
import { resolve } from "node:path";
import { WorkspaceService } from "../../../architecture/studio/src/workspace/service.js";
import { MigrationService } from "../../../architecture/studio/src/migration/service.js";
import type { Finding } from "../../../architecture/studio/src/model/types.js";
class MigrationCases {
  static review(): void {
    const workspace = new WorkspaceService(resolve("architecture"));
    const state = workspace.load();
    const changes: Finding[] = [
      MigrationCases.finding("agent.activities", true),
      MigrationCases.finding("agent.execution", false),
    ];
    const result = new MigrationService(workspace).build(
      state,
      changes,
      changes.map(MigrationCases.id),
      [],
    );
    const manifest = result.manifest as {
      tasks: Record<string, unknown[]>;
      proposals: unknown[];
      baselineHash: string;
    };
    assert.equal(manifest.tasks["project.agent"].length, 1);
    assert.equal(manifest.proposals.length, 1);
    assert.equal(manifest.baselineHash, state.baselineHash);
  }
  private static id(finding: Finding): string {
    return finding.id;
  }
  private static finding(subject: string, accepted: boolean): Finding {
    return {
      id: subject + "/purpose",
      subject,
      field: "purpose",
      category: "architecture-mismatch",
      before: "Old",
      after: "New",
      impact: [],
      accepted,
    };
  }
}
test(
  "migration groups only accepted work by owning repository and preserves the baseline",
  MigrationCases.review,
);
