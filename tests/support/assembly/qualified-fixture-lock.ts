import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { parse, type ParseError } from "jsonc-parser";

/** Exact registry constraints; archive custody stays with the installed fixture. */
export class QualifiedFixtureLock {
  private readonly packages: Record<string, unknown[]>;

  constructor(source: string) {
    const errors: ParseError[] = [];
    const lock = parse(source, errors, { allowTrailingComma: true });
    if (
      errors.length ||
      !lock?.packages ||
      typeof lock.packages !== "object" ||
      Array.isArray(lock.packages)
    ) {
      throw new Error("QUALIFIED_LOCK_INVALID");
    }
    this.packages = lock.packages;
  }

  overrides(): Record<string, string> {
    const overrides: Record<string, string> = {};
    for (const [name, record] of Object.entries(this.packages)) {
      this.requireIdentity(name, record);
      if (record.length === 3) continue;
      overrides[name] = String(record[0]).slice(name.length + 1);
    }
    return overrides;
  }

  static finalize(directory: string): void {
    for (const name of ["package.json", "bun.lock"]) {
      const path = join(directory, name);
      const data = parse(readFileSync(path, "utf8"));
      delete data.overrides;
      writeFileSync(path, JSON.stringify(data, null, 2) + "\n", {
        mode: 0o600,
      });
    }
  }

  private requireIdentity(name: string, record: unknown[]): void {
    if (!/^(@[^/]+\/)?[^/]+$/.test(name) || !Array.isArray(record)) {
      throw new Error("QUALIFIED_LOCK_AMBIGUOUS:" + name);
    }
    const identity = record[0];
    if (typeof identity !== "string" || !identity.startsWith(name + "@")) {
      throw new Error("QUALIFIED_LOCK_IDENTITY:" + name);
    }
    this.requireResolution(name, record, identity.slice(name.length + 1));
  }

  private requireResolution(
    name: string,
    record: unknown[],
    version: string,
  ): void {
    const local = record.length === 3 && /^[^:]+\.tgz$/.test(version);
    const registry =
      record.length === 4 &&
      /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/.test(version);
    if ((!local && !registry) || !String(record.at(-1)).startsWith("sha512-")) {
      throw new Error("QUALIFIED_LOCK_RESOLUTION:" + name);
    }
  }
}
