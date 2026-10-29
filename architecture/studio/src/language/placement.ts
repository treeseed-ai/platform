import { Data, type ArchitectureObject } from "../model/types.js";
import { Diagnostics } from "./diagnostics.js";

export class PlacementValidator {
  private claims = new Map<string, ArchitectureObject>();
  private subjects = new Map<string, string>();
  static readonly templates: Record<string, string> = {
    contract: "src/{capability-path}/contracts",
    plugin: "src/{capability-path}/{component-slug}.plugin",
    provider: "src/{capability-path}/providers/{provider-slug}",
    helper: "src/{capability-path}/{unit-slug}",
    composition: "src/composition/{runtime-slug}",
    entrypoint: "src/entrypoints/{program-slug}",
    test: "tests/{tier}/{capability-path}/{behavior-slug}.test",
  };
  constructor(private output: Diagnostics) {}
  static path(object: ArchitectureObject): string {
    if (object.path) return String(object.path);
    const [language, role] = String(object.convention).split(".");
    let template = PlacementValidator.templates[role];
    if (language === "elixir")
      template =
        role === "test"
          ? "test/{capability-path}/{module-slug}_test.exs"
          : "lib/{capability-path}/{module-slug}.ex";
    else if (language === "rust")
      template =
        role === "integration"
          ? "tests/{behavior-slug}.rs"
          : "src/{capability-path}/{module-slug}.rs";
    else if (template && ["ts", "tsx"].includes(language))
      template += "." + language;
    else throw new Error("UNKNOWN_CONVENTION");
    return template.replace(
      /\{([^}]+)\}/g,
      PlacementValidator.input.bind(null, Data.record(object.inputs)),
    );
  }
  private static input(
    inputs: Record<string, unknown>,
    _match: string,
    key: string,
  ): string {
    if (!inputs[key]) throw new Error("MISSING_TEMPLATE_INPUT: " + key);
    return String(inputs[key]);
  }
  check(object: ArchitectureObject): void {
    try {
      this.claim(object, PlacementValidator.path(object));
    } catch (error) {
      this.output.add(
        String(error).replace("Error: ", "").split(":")[0],
        object.id,
        String(error),
      );
    }
  }
  private claim(object: ArchitectureObject, path: string): void {
    if (/^\/|^[A-Za-z]:|\\|(?:^|\/)\.{1,2}(?:\/|$)|\/\//.test(path))
      throw new Error("PATH_ESCAPE");
    const allowed = Data.strings(object.allowedRoots);
    if (
      allowed.length &&
      !allowed.some(PlacementValidator.within.bind(null, path))
    )
      throw new Error("PLACEMENT_SCOPE");
    const identity =
      String(object.project) + ":" + object.subject + ":" + object.role;
    if (this.subjects.has(identity) && this.subjects.get(identity) !== path)
      this.output.add("CONFLICTING_PLACEMENT", object.id, path);
    this.subjects.set(identity, path);
    const key = String(object.project) + ":" + path.toLocaleLowerCase("en-US");
    const prior = this.claims.get(key);
    if (prior && PlacementValidator.path(prior) !== path)
      this.output.add("PLACEMENT_COLLISION", object.id, path);
    this.claims.set(key, object);
  }
  private static within(path: string, root: string): boolean {
    return path === root || path.startsWith(root.replace(/\/$/, "") + "/");
  }
}
