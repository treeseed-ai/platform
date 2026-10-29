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
    } finally {
      await fixture.stop();
    }
  }
}
test(
  "Studio built program edits intent and exports a bounded migration",
  StudioAcceptance.journey,
);
