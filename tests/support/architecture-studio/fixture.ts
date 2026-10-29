import { spawn, type ChildProcess } from "node:child_process";
import { cpSync, mkdtempSync, rmSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve, join } from "node:path";
import { createRequire } from "node:module";
import type {
  Page,
  Browser,
} from "../../../architecture/studio/node_modules/playwright/index.js";

export class StudioFixture {
  private directory = mkdtempSync(join(tmpdir(), "studio-test-"));
  private process!: ChildProcess;
  private browser?: Browser;
  private token = "";
  url = "";
  static async start(): Promise<StudioFixture> {
    const fixture = new StudioFixture();
    await fixture.launch();
    return fixture;
  }
  private async launch(): Promise<void> {
    this.copyWorkspace();
    this.process = spawn(process.execPath, ["dist/server.mjs"], {
      cwd: resolve("architecture/studio"),
      env: {
        ...process.env,
        PORT: "0",
        STUDIO_WORKSPACE: this.directory,
        STUDIO_REPOSITORIES: JSON.stringify(this.repositories()),
      },
      stdio: ["ignore", "pipe", "pipe"],
    });
    await new Promise<void>(this.waitReady.bind(this));
    this.token = (
      (await (await fetch(this.url + "/api/session")).json()) as {
        token: string;
      }
    ).token;
  }
  private repositories(): Record<string, string> {
    const repositories: Record<string, string> = {};
    for (const item of JSON.parse(
      readFileSync("architecture/baselines/repositories.json", "utf8"),
    ).repositories)
      repositories[item.project] = resolve(item.checkout);
    return repositories;
  }
  private copyWorkspace(): void {
    for (const name of [
      "language",
      "implementation",
      "intent",
      "profiles",
      "baselines",
      "comparisons",
    ])
      cpSync(resolve("architecture", name), join(this.directory, name), {
        recursive: true,
      });
    cpSync(
      "architecture/workspace.yaml",
      join(this.directory, "workspace.yaml"),
    );
  }
  private waitReady(
    resolveReady: () => void,
    reject: (error: Error) => void,
  ): void {
    const timer = setTimeout(
      reject,
      15000,
      new Error("Studio startup timeout"),
    );
    this.process.stdout!.on(
      "data",
      this.output.bind(this, resolveReady, timer),
    );
    this.process.stderr!.on("data", this.stderr.bind(this));
    this.process.once("exit", this.exited.bind(this, reject, timer));
  }
  private output(
    ready: () => void,
    timer: NodeJS.Timeout,
    bytes: Buffer,
  ): void {
    const match = bytes.toString().match(/STUDIO_URL=(http:\/\/[^\s]+)/);
    if (match) {
      this.url = match[1];
      clearTimeout(timer);
      ready();
    }
  }
  private stderr(bytes: Buffer): void {
    process.stderr.write(bytes);
  }
  private exited(
    reject: (error: Error) => void,
    timer: NodeJS.Timeout,
    code: number,
  ): void {
    clearTimeout(timer);
    if (!this.url) reject(new Error("Studio exited: " + code));
  }
  async request(operation: string, body: unknown = {}): Promise<any> {
    const response = await fetch(this.url + "/api/" + operation, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-studio-token": this.token,
      },
      body: JSON.stringify(body),
    });
    const data = (await response.json()) as { error?: string };
    if (!response.ok) throw new Error(data.error);
    return data;
  }
  async page(): Promise<Page> {
    const require = createRequire(resolve("architecture/studio/package.json"));
    const { chromium } = require("playwright");
    this.browser = await chromium.launch({ headless: true });
    const page = await this.browser!.newPage({
      viewport: { width: 1600, height: 1000 },
    });
    page.setDefaultTimeout(15000);
    return page;
  }
  async editorJourney(page: Page): Promise<void> {
    await page.getByRole("button", { name: "Close review panel" }).click();
    await page
      .getByRole("button", { name: "Create component", exact: true })
      .click();
    await page.getByLabel("name", { exact: true }).fill("Acceptance component");
    await page.getByLabel("purpose", { exact: true }).click();
    await page.getByRole("button", { name: "Connect…", exact: true }).click();
    await page.getByLabel("Relationship kind").selectOption("depends-on");
    await page.getByLabel("Target object").selectOption("agent.activities");
    await page
      .getByRole("button", { name: "Add relationship", exact: true })
      .click();
    await page.getByRole("button", { name: "Undo", exact: false }).click();
    await page.getByRole("button", { name: "Redo", exact: false }).click();
    await page
      .getByRole("button", { name: "Save intent", exact: true })
      .click();
    await page.getByText("Intent saved. Implementation unchanged.").waitFor();
    await page.reload();
    await page
      .getByRole("button", { name: "Migration package", exact: false })
      .click();
    await page.getByRole("button", { name: "Download manifest" }).waitFor();
    await page.getByRole("button", { name: "Close dialog" }).click();
    await page.screenshot({ path: "/tmp/architecture-studio-acceptance.png" });
  }
  async stop(): Promise<void> {
    await this.browser?.close();
    this.process.kill("SIGTERM");
    rmSync(this.directory, { recursive: true, force: true });
  }
}
