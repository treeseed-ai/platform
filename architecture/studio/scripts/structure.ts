import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import ts from "typescript";
export class StudioStructure {
  private errors: string[] = [];
  private file = "";
  check(): void {
    const files = execFileSync(
      "git",
      ["ls-files", "--cached", "--others", "--exclude-standard"],
      { cwd: resolve("../.."), encoding: "utf8" },
    )
      .trim()
      .split("\n");
    this.discovery(files);
    for (const file of files) if (this.owned(file)) this.inspect(file);
    if (this.errors.length) throw new Error(this.errors.join("\n"));
  }
  private discovery(files: string[]): void {
    if (!process.env.STUDIO_TEST_FILES) return;
    const expected = process.env.STUDIO_TEST_FILES.trim().split(/\s+/).sort();
    const actual = files.filter(StudioStructure.specification).sort();
    if (JSON.stringify(expected) !== JSON.stringify(actual))
      this.errors.push(
        "STUDIO_DISCOVERY_MISMATCH: update exact CI specification inventory",
      );
  }
  private static specification(file: string): boolean {
    return /^tests\/[^/]+\/architecture-studio\/.+\.test\.ts$/.test(file);
  }
  private owned(file: string): boolean {
    return (
      file.startsWith("architecture/studio/") ||
      /^tests\/[^/]+\/architecture-studio\//.test(file)
    );
  }
  private inspect(file: string): void {
    if (/\.[cm]?jsx?$/.test(file))
      this.errors.push("HANDWRITTEN_JAVASCRIPT: " + file);
    if (!/\.[cm]?tsx?$/.test(file)) return;
    this.file = file;
    const source = ts.createSourceFile(
      file,
      readFileSync(resolve("../..", file), "utf8"),
      ts.ScriptTarget.Latest,
      true,
    );
    this.visit(source);
  }
  private visit(node: ts.Node): void {
    if (
      ts.isArrowFunction(node) ||
      ts.isFunctionExpression(node) ||
      (ts.isFunctionDeclaration(node) && node.body)
    )
      this.errors.push("CLASS_BEHAVIOR_REQUIRED: " + this.file);
    if (
      ts.isCallExpression(node) &&
      /^(test|it|describe)$/.test(node.expression.getText())
    )
      this.registration();
    ts.forEachChild(node, this.visit.bind(this));
  }
  private registration(): void {
    if (
      !/^tests\/(acceptance|regression|integration|unit)\/architecture-studio\/.+\.test\.ts$/.test(
        this.file,
      ) ||
      /(?:task|phase)\d/i.test(this.file)
    )
      this.errors.push("TEST_TIER_PLACEMENT: " + this.file);
  }
}
