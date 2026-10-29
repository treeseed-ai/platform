import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { LanguageService } from "../../../architecture/studio/src/language/service.js";
import { SemanticValidator } from "../../../architecture/studio/src/language/validator.js";
import type { Blueprint } from "../../../architecture/studio/src/model/types.js";

class SemanticCases {
  static run(): void {
    const language = new LanguageService(resolve("architecture/language"));
    const cases = language.parse(
      readFileSync("architecture/examples/cases.yaml", "utf8"),
    ) as { cases: Array<{ file: string; layer: string; expected: string }> };
    for (const item of cases.cases) {
      if (item.layer !== "semantic" || SemanticCases.source.has(item.file))
        continue;
      const model = language.parse(
        readFileSync("architecture/examples/" + item.file, "utf8"),
      ) as Blueprint;
      const results = new SemanticValidator().validate([model]);
      assert.ok(
        results.some(SemanticCases.code.bind(null, item.expected)),
        item.file + ": " + JSON.stringify(results),
      );
    }
  }
  private static readonly source = new Set([
    "missing-source.yaml",
    "stale-source.yaml",
    "method-size.yaml",
    "symlink-escape.yaml",
    "intent-unspecified.yaml",
  ]);
  private static code(code: string, item: { code: string }): boolean {
    return item.code === code;
  }
}
test(
  "existing model conformance examples produce their specified diagnostics",
  SemanticCases.run,
);
