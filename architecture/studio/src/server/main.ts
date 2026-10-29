import { Context } from "cordis";
import { resolve } from "node:path";
import { build } from "vite";
import { StudioServicesPlugin } from "./services.js";
import { StudioHttpPlugin } from "./http.js";

class StudioProgram {
  private context = new Context();
  async run(): Promise<void> {
    if (process.argv.includes("--dev")) await build({ build: { watch: {} } });
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
  private async stop(): Promise<void> {
    await this.context.fiber.dispose();
  }
  static fail(error: unknown): void {
    console.error(error);
    process.exitCode = 1;
  }
}
new StudioProgram().run().catch(StudioProgram.fail);
