import { readFileSync } from "node:fs";
import { join } from "node:path";
import { Ajv2020, type ValidateFunction } from "ajv/dist/2020.js";
import { parseAllDocuments, visit, isScalar, isMap, isAlias } from "yaml";
import type { Diagnostic } from "../model/types.js";

export class LanguageService {
  private readonly validators = new Map<string, ValidateFunction>();
  readonly schemas: Record<string, unknown> = {};
  constructor(directory: string) {
    const ajv = new Ajv2020({ strict: false, allErrors: true });
    for (const name of ["architecture", "workspace", "findings", "exception"]) {
      const schema = JSON.parse(
        readFileSync(join(directory, name + ".schema.json"), "utf8"),
      );
      this.schemas[name] = schema;
      this.validators.set(name, ajv.compile(schema));
    }
  }
  parse(text: string): unknown {
    const documents = parseAllDocuments(text, {
      version: "1.2",
      uniqueKeys: true,
      keepSourceTokens: true,
    });
    if (documents.length !== 1)
      throw new Error("MULTIPLE_DOCUMENTS: one document required");
    const document = documents[0];
    if (document.errors.length)
      throw new Error(
        document.errors[0].code + ": " + document.errors[0].message,
      );
    visit(document, { Node: LanguageService.node });
    return document.toJS({ maxAliasCount: 0 });
  }
  private static node(_key: unknown, node: unknown): void {
    if (isAlias(node)) throw new Error("YAML_ALIAS: aliases are forbidden");
    if (!node || typeof node !== "object") return;
    if ("anchor" in node && node.anchor)
      throw new Error("YAML_ANCHOR: anchors are forbidden");
    if ("tag" in node && node.tag)
      throw new Error("YAML_TAG: explicit tags are forbidden");
    if (
      isScalar(node) &&
      typeof node.value === "number" &&
      !Number.isFinite(node.value)
    )
      throw new Error("YAML_VALUE: non-finite number");
    if (isMap(node))
      for (const pair of node.items) LanguageService.key(pair.key);
  }
  private static key(key: unknown): void {
    if (!isScalar(key) || typeof key.value !== "string")
      throw new Error("YAML_KEY: string keys required");
    if (key.value === "<<")
      throw new Error("YAML_MERGE_KEY: merge keys are forbidden");
  }
  shape(value: unknown, kind = "architecture"): Diagnostic[] {
    const validator = this.validators.get(kind)!;
    if (validator(value)) return [];
    const result: Diagnostic[] = [];
    for (const error of validator.errors ?? [])
      result.push({
        code: "SCHEMA_INVALID",
        status: "violated",
        message: error.instancePath + " " + error.message,
      });
    return result;
  }
  inspect(text: string, kind = "architecture"): Diagnostic[] {
    try {
      return this.shape(this.parse(text), kind);
    } catch (error) {
      return [
        {
          code: String(error).split(":")[1]?.trim() || "YAML_INVALID",
          status: "violated",
          message: String(error),
        },
      ];
    }
  }
}
