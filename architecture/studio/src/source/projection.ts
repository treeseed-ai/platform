import {
  Data,
  type Binding,
  type Blueprint,
  type Inventory,
  type Mapping,
  type ArchitectureObject,
} from "../model/types.js";

/** Refreshes evidence, never promotes extracted syntax into architectural approval. */
export class SourceProjection {
  constructor(
    private inventories: Inventory[],
    private mappings: Mapping[],
    private gaps: string[],
  ) {}
  apply(model: Blueprint): void {
    for (const object of model.objects) this.object(object);
    model.metadata.notes = [
      ...new Set([
        ...Data.strings(model.metadata.notes),
        "Studio: authored meaning retained; extracted syntax does not prove runtime behavior.",
      ]),
    ];
  }
  private object(object: ArchitectureObject): void {
    const mapping = this.mappings.find(
      SourceProjection.subject.bind(null, object.id),
    );
    if (!mapping) return;
    const bindings = mapping.bindings.map(this.binding.bind(this));
    const supported =
      mapping.review === "accepted" && bindings.every(SourceProjection.present);
    if (supported) object.sourceBindings = bindings as Binding[];
    else
      this.gaps.push(object.id + ": unreviewed, missing or ambiguous mapping");
    object.extensions = {
      ...Data.record(object.extensions),
      "studio:observation-v1": {
        status: supported ? "mapped" : "unknown",
        provenance: mapping.provenance,
        authoredMeaning: "retained; not re-established by syntax extraction",
        sourceRevisions: this.inventories.map(SourceProjection.identity),
      },
    };
  }
  private binding(binding: Binding): Binding | undefined {
    const inventory = this.inventories.find(
      SourceProjection.project.bind(null, binding.project),
    );
    const file = inventory?.files.find(
      SourceProjection.path.bind(null, binding.path),
    );
    if (!inventory || !file) return undefined;
    if (!binding.symbol) return this.fileBinding(binding, inventory.revision);
    const declarations = file.declarations.filter(
      SourceProjection.symbol.bind(null, binding.symbol),
    );
    if (declarations.length !== 1) return undefined;
    const { fingerprint, start, end } = declarations[0];
    return {
      ...binding,
      revision: inventory.revision,
      fingerprint,
      start,
      end,
    };
  }
  private fileBinding(binding: Binding, revision: string): Binding {
    const result = { ...binding, revision };
    delete result.fingerprint;
    return result;
  }
  private static present(value: Binding | undefined): boolean {
    return !!value;
  }
  private static identity(value: Inventory): unknown {
    return {
      project: value.project,
      revision: value.revision,
      parser: value.parser,
    };
  }
  private static subject(id: string, value: Mapping): boolean {
    return value.subject === id;
  }
  private static project(id: string, value: Inventory): boolean {
    return value.project === id;
  }
  private static path(path: string, value: { path: string }): boolean {
    return value.path === path;
  }
  private static symbol(symbol: string, value: { symbol: string }): boolean {
    return value.symbol === symbol;
  }
}
