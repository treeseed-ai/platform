import { test } from "node:test";
import assert from "node:assert/strict";
import { StudioFixture } from "../../support/architecture-studio/fixture.js";

class StudioAcceptance {
  static async journey(): Promise<void> {
    const fixture = await StudioFixture.start();
    try {
      const workspace = await fixture.request("workspace");
      assert.equal(workspace.documents.length, 20);
      const page = await fixture.page();
      await page.goto(fixture.url);
      await page.getByText("Architecture Studio", { exact: true }).waitFor();
      await page.getByRole("button", { name: "Validate", exact: true }).click();
      await page.getByText("Validation results", { exact: true }).waitFor();
      assert.equal(await page.locator(".react-flow").count(), 1);
      await fixture.editorJourney(page);
      StudioAcceptance.persisted(workspace, await fixture.request("workspace"));
    } finally {
      await fixture.stop();
    }
  }
  private static persisted(
    before: import("../../../architecture/studio/src/model/types.js").Workspace,
    after: import("../../../architecture/studio/src/model/types.js").Workspace,
  ): void {
    for (const document of before.documents) {
      const saved = after.documents.find(
        StudioAcceptance.path.bind(null, document.path),
      )!;
      if (document.model.view === "implementation")
        assert.equal(saved.text, document.text);
    }
    const agent = after.documents.find(
      StudioAcceptance.path.bind(null, "intent/agent.yaml"),
    )!;
    const created = agent.model.objects.find(StudioAcceptance.created)!;
    assert.ok(created.id.startsWith("component."));
    assert.ok(
      agent.model.relationships?.some(
        StudioAcceptance.connected.bind(null, created.id),
      ),
    );
  }
  private static path(path: string, document: { path: string }): boolean {
    return document.path === path;
  }
  private static created(object: { name: string }): boolean {
    return object.name === "Acceptance component";
  }
  private static connected(
    id: string,
    edge: { from: string; to: string },
  ): boolean {
    return edge.from === id && edge.to === "agent.activities";
  }
}
test(
  "Studio built program edits intent and exports a bounded migration",
  StudioAcceptance.journey,
);
