import { execFileSync } from "node:child_process";
import { resolve } from "node:path";
import { StudioStructure } from "./structure.js";
class StudioPolicy {
  static run(): void {
    new StudioStructure().check();
    const script = resolve(
      "../../.agents/skills/release-workflow/scripts/source-readability.ts",
    );
    execFileSync(
      resolve("node_modules/.bin/esbuild"),
      [
        script,
        "--bundle",
        "--platform=node",
        "--format=esm",
        "--packages=external",
        "--outfile=dist/readability.mjs",
      ],
      { stdio: "inherit" },
    );
    execFileSync(
      process.execPath,
      [resolve("dist/readability.mjs"), "--root", resolve("../..")],
      { stdio: "inherit" },
    );
  }
}
StudioPolicy.run();
