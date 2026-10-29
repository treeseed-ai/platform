import { Context } from "cordis";
import { resolve } from "node:path";
import { StudioServicesPlugin } from "./services.js";
import { StudioHttpPlugin } from "./http.js";

class StudioProgram {
  private context = new Context();
  async run(): Promise<void> {
    if (process.argv.includes("--dev")) await this.development();
    const root = resolve(process.env.STUDIO_WORKSPACE || "..");
    await this.context.plugin(StudioServicesPlugin, root).await();
    await this.context
      .plugin(StudioHttpPlugin, {
        port: Number(process.env.PORT || 4317),
        client: resolve("dist/client"),
      })
      .await();
    process.on("SIGTERM", this.stop.bind(this));
    process.on("SIGINT", this.stop.bind(this));
  }
  private async development(): Promise<void> {
    const { build } = await import("vite");
    const watcher = await build({ build: { watch: {} } });
    if (!Array.isArray(watcher) && "close" in watcher)
      this.context.effect(StudioProgram.release.bind(null, watcher));
  }
  private static release(watcher: {
    close(): Promise<void>;
  }): () => Promise<void> {
    return watcher.close.bind(watcher);
  }
  private async stop(): Promise<void> {
    await this.context.fiber.dispose();
  }
  static fail(error: unknown): void {
    console.error(error);
    process.exitCode = 1;
  }
}
new StudioProgram().run().catch(StudioProgram.fail);
