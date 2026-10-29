import { test } from "node:test";
import assert from "node:assert/strict";
import { StudioFixture } from "../../support/architecture-studio/fixture.js";

class WorkspaceIntegration {
  static async conflicts(): Promise<void> {
    const fixture = await StudioFixture.start();
    try {
      const state = await fixture.request("workspace");
      const doc = state.documents.find(
        (item: { path: string }) => item.path === "intent/agent.yaml",
      );
      const changes = [
        { path: doc.path, expected: doc.hash, text: doc.text + "\n# saved\n" },
      ];
      assert.equal((await fixture.request("save", { changes })).saved, true);
      await assert.rejects(fixture.request("save", { changes }), /CONFLICT/);
      changes[0].path = "../outside.yaml";
      await assert.rejects(fixture.request("save", { changes }), /PATH|WRITE/);
    } finally {
      await fixture.stop();
    }
  }
}
test(
  "workspace saves reject stale hashes and escaping paths",
  WorkspaceIntegration.conflicts,
);
