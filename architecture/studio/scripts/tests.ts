import { execFileSync } from "node:child_process";
import { readdirSync, existsSync } from "node:fs";
import { resolve } from "node:path";

class StudioTests {
  static run(): void {
    const root = resolve("../..");
    const tiers = process.argv[2]
      ? [process.argv[2]]
      : ["unit", "regression", "integration", "acceptance"];
    for (const tier of tiers) {
      const directory = resolve(root, "tests", tier, "architecture-studio");
      if (!existsSync(directory)) {
        console.log("Studio " + tier + ": no specifications in this tier");
        continue;
      }
      StudioTests.execute(root, directory);
    }
  }
  private static execute(root: string, directory: string): void {
    const files = readdirSync(directory)
      .filter(StudioTests.testFile)
      .map(StudioTests.path.bind(null, directory));
    execFileSync(
      process.execPath,
      [
        "--import",
        resolve("node_modules/tsx/dist/loader.mjs"),
        "--test",
        "--test-concurrency=1",
        ...files,
      ],
      { cwd: root, stdio: "inherit" },
    );
  }
  private static testFile(file: string): boolean {
    return file.endsWith(".test.ts");
  }
  private static path(directory: string, file: string): string {
    return resolve(directory, file);
  }
}
StudioTests.run();
