import { test } from "node:test";
import assert from "node:assert/strict";
import { StudioFixture } from "../../support/architecture-studio/fixture.js";
class CompanionBoundaries {
  static async verify(): Promise<void> {
    const fixture = await StudioFixture.start();
    try {
      const response = await fetch(fixture.url + "/api/workspace", {
        method: "POST",
        body: "{}",
      });
      assert.equal(response.status, 400);
      await CompanionBoundaries.readOnly(fixture);
      await assert.rejects(
        fixture.request("patterns", {
          expected: "",
          data: { schemaVersion: "wrong", entries: [] },
        }),
        /SCHEMA_INVALID/,
      );
    } finally {
      await fixture.stop();
    }
  }
  private static async readOnly(fixture: StudioFixture): Promise<void> {
    const state = await fixture.request("workspace");
    const document = state.documents.find(CompanionBoundaries.observed);
    await assert.rejects(
      fixture.request("save", {
        changes: [
          {
            path: document.path,
            expected: document.hash,
            text: document.text,
          },
        ],
      }),
      /WRITE_FORBIDDEN/,
    );
  }
  private static observed(document: { model: { view: string } }): boolean {
    return document.model.view === "implementation";
  }
}
test(
  "companion protects its session, read-only observations and auxiliary schemas",
  CompanionBoundaries.verify,
);
