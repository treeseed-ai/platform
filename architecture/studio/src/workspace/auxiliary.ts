import { Ajv2020, type ValidateFunction } from "ajv/dist/2020.js";
import mappings from "../../schemas/mappings.schema.json";
import patterns from "../../schemas/patterns.schema.json";
import layout from "../../schemas/layout.schema.json";
import migration from "../../schemas/migration.schema.json";
export class AuxiliarySchemas {
  private validators = new Map<string, ValidateFunction>();
  constructor() {
    const ajv = new Ajv2020({ strict: false, allErrors: true });
    for (const [name, schema] of Object.entries({
      mappings,
      patterns,
      layout,
      migration,
    }))
      this.validators.set(name, ajv.compile(schema));
  }
  check(name: string, value: unknown): void {
    const validator = this.validators.get(name);
    if (!validator || !validator(value))
      throw new Error("SCHEMA_INVALID: " + JSON.stringify(validator?.errors));
  }
}
