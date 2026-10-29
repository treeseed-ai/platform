import { test } from "node:test";
import assert from "node:assert/strict";
import { StudioFixture } from "../../support/architecture-studio/fixture.js";
class CellPersistence {
  static async conflict(): Promise<void> {
    const fixture = await StudioFixture.start();
    try {
      const before = await fixture.request("workspace");
      const data = {
        schemaVersion: "studio-layout/0.2",
        engine: "elkjs/0.12.1:layered/1",
        views: {},
      };
      const request = { expected: before.auxiliary.layout.hash, data };
      await fixture.request("layout", request);
      await assert.rejects(fixture.request("layout", request), /CONFLICT/);
      const after = await fixture.request("workspace");
      assert.deepEqual(before.documents, after.documents);
      assert.deepEqual(JSON.parse(after.auxiliary.layout.text), data);
    } finally {
      await fixture.stop();
    }
  }
}
test(
  "Layout-only publication preserves architecture and rejects concurrent edits",
  CellPersistence.conflict,
);
