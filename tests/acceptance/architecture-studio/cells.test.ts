import { test } from "node:test";
import assert from "node:assert/strict";
import { StudioFixture } from "../../support/architecture-studio/fixture.js";
import type { Page } from "../../../architecture/studio/node_modules/playwright/index.js";

class CellAcceptance {
  static async journey(): Promise<void> {
    const fixture = await StudioFixture.start();
    try {
      const before = await fixture.request("workspace");
      const page = await fixture.page();
      await page.goto(fixture.url);
      await page.getByRole("button", { name: "Enter project Agent", exact: true }).waitFor();
      assert.equal(await page.locator(".project-cell").count(), 9);
      await CellAcceptance.navigate(page);
      await CellAcceptance.save(page);
      const after = await fixture.request("workspace");
      assert.deepEqual(after.documents, before.documents);
      assert.equal(JSON.parse(after.auxiliary.layout.text).schemaVersion, "studio-layout/0.2");
    } finally {
      await fixture.stop();
    }
  }
  private static async navigate(page: Page): Promise<void> {
    await page.getByRole("button", { name: "Enter project Agent", exact: true }).click();
    await page.getByRole("navigation", { name: "Architecture location" }).waitFor();
    await page.getByRole("button", { name: /^Expand plugin / }).first().click();
    await page.locator(".provider-card").first().waitFor();
    await page.locator(".provider-card").first().click();
    await page.getByText(/selection (unknown|varies by scope)/).first().waitFor();
    await page.getByRole("button", { name: "Portfolio", exact: true }).click();
    await page.getByRole("button", { name: "Enter project Agent", exact: true }).click();
    await page.locator(".provider-card").first().waitFor();
  }
  private static async save(page: Page): Promise<void> {
    await page.getByRole("button", { name: "Arrange by connections", exact: true }).click();
    await page.getByRole("button", { name: "Undo layout", exact: true }).click();
    await page.getByRole("button", { name: "Save layout", exact: true }).click();
    await page.getByText("Layout saved. Architecture unchanged.", { exact: true }).waitFor();
    await page.reload();
    await page.getByRole("button", { name: "Enter project Agent", exact: true }).click();
    await page.locator(".provider-card").first().waitFor();
  }
}

test("Digital cells navigate the real portfolio and save layout without architectural writes", CellAcceptance.journey);
