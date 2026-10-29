import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import type { Page } from "../../../architecture/studio/node_modules/playwright/index.js";
import { StudioFixture } from "../../support/architecture-studio/fixture.js";
class BoundaryJourney {
  static async run(): Promise<void> {
    const fixture = await StudioFixture.start();
    try {
      const page = await fixture.page();
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(fixture.url);
      await page
        .getByRole("button", { name: "Enter project Agent", exact: true })
        .waitFor();
      await BoundaryJourney.capture(page, "portfolio");
      await BoundaryJourney.follow(page);
      await BoundaryJourney.changeContract(page);
      await page.setViewportSize({ width: 1100, height: 800 });
      await page.getByRole("button", { name: "Fit map", exact: true }).click();
      assert.ok(
        await page
          .getByRole("button", { name: "Save layout", exact: true })
          .isVisible(),
      );
    } finally {
      await fixture.stop();
    }
  }
  private static async follow(page: Page): Promise<void> {
    await page
      .getByRole("button", { name: /^requires · 6/ })
      .first()
      .click();
    await page
      .locator(".cell-connection.dimmed")
      .first()
      .waitFor({ state: "attached" });
    const inspector = page.getByRole("complementary", {
      name: "Boundary inspector",
    });
    await inspector
      .getByRole("button", {
        name: "agent.plugin.AgentHostPlugin",
        exact: true,
      })
      .click();
    await BoundaryJourney.expand(page);
  }
  private static async expand(page: Page): Promise<void> {
    const expand = page.getByRole("button", {
      name: "Expand plugin AgentHostPlugin",
      exact: true,
    });
    await expand.waitFor();
    await BoundaryJourney.capture(page, "agent");
    await expand.click();
    await page.locator(".provider-card").first().waitFor();
    await page
      .getByRole("button", { name: "Focus selection", exact: true })
      .click();
    await BoundaryJourney.capture(page, "provider");
    await page.getByRole("button", { name: "Fit map", exact: true }).click();
    await page
      .getByRole("button", { name: "Enter project Sdk", exact: true })
      .click();
    await page
      .getByRole("navigation", { name: "Architecture location" })
      .getByText("/ sdk", { exact: false })
      .waitFor();
  }
  private static async changeContract(page: Page): Promise<void> {
    await page
      .getByPlaceholder("Find an object…")
      .fill("sdk.contract.cordis.composition");
    await page
      .getByRole("complementary", { name: "Architecture search results" })
      .getByRole("button")
      .click();
    await page.getByPlaceholder("Find an object…").fill("");
    await page
      .getByLabel("purpose", { exact: true })
      .fill("Reviewed contract change for boundary acceptance");
    await page.getByLabel("name", { exact: true }).click();
    await page
      .getByRole("navigation", { name: "Architecture location" })
      .getByRole("button", { name: "Portfolio", exact: true })
      .click();
    await page.getByRole("button", { name: "Fit map", exact: true }).click();
    await page
      .locator(".cell-connection.impacted")
      .first()
      .waitFor({ state: "attached" });
    await BoundaryJourney.capture(page, "contract-impact");
  }
  private static async capture(page: Page, name: string): Promise<void> {
    const directory = process.env.STUDIO_SCREENSHOTS;
    if (!directory) return;
    mkdirSync(directory, { recursive: true });
    await page
      .getByRole("button", { name: "Arrange by connections", exact: true })
      .waitFor();
    await page.screenshot({ path: join(directory, name + ".png") });
  }
}
test(
  "Boundary routes reveal original plugins, providers and cross-project contract impact",
  BoundaryJourney.run,
);
