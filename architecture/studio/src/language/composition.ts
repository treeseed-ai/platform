import { Data, type ArchitectureObject } from "../model/types.js";
import { ArchitectureGraph } from "./graph.js";
import { Diagnostics } from "./diagnostics.js";

export class CompositionValidator {
  constructor(
    private graph: ArchitectureGraph,
    private output: Diagnostics,
  ) {}
  check(composition: ArchitectureObject): void {
    const scopes = Data.records(composition.scopes);
    const ids = scopes.map(CompositionValidator.id);
    for (const scope of scopes) {
      if (
        scope.parent &&
        (!ids.includes(String(scope.parent)) || scope.parent === scope.id)
      )
        this.output.add(
          "INVALID_SCOPE_PARENT",
          composition.id,
          "Parent must resolve within this process",
        );
      this.scope(composition, scope);
    }
    for (const selection of Data.records(composition.selections)) {
      if (!ids.includes(String(selection.scope)))
        this.output.add(
          "INVALID_SCOPE_PARENT",
          composition.id,
          "Selection scope does not exist",
        );
      this.selection(composition, selection);
    }
  }
  private static id(value: Record<string, unknown>): string {
    return String(value.id);
  }
  private scope(
    composition: ArchitectureObject,
    scope: Record<string, unknown>,
  ): void {
    const required = new Set(Data.strings(scope.requiredCapabilities));
    const members = [
      ...Data.strings(scope.components),
      ...Data.strings(composition.components),
    ];
    for (const edge of this.graph.edges)
      if (edge.kind === "requires" && members.includes(edge.from))
        required.add(edge.to);
    for (const id of required) this.required(composition, scope, id);
    const seen = new Set<string>();
    for (const selection of Data.records(composition.selections)) {
      if (selection.scope !== scope.id) continue;
      const cap = this.graph.objects.get(String(selection.capability));
      const key =
        String(selection.capability) +
        (cap?.cardinality === "collection" ? ":" + selection.provider : "");
      if (seen.has(key))
        this.output.add("DUPLICATE_SELECTION", composition.id, key);
      seen.add(key);
    }
  }
  private required(
    composition: ArchitectureObject,
    scope: Record<string, unknown>,
    id: string,
  ): void {
    const cap = this.graph.objects.get(id);
    const fixed = Data.record(scope.fixedBindings)[id];
    const selected = Data.records(composition.selections).filter(
      this.match.bind(this, scope.id, id),
    );
    if (!fixed && selected.length === 0)
      this.output.add(
        "MISSING_SELECTION",
        composition.id,
        String(scope.id) + ": " + id,
      );
    if (fixed && selected.length)
      this.output.add(
        "DUPLICATE_SELECTION",
        composition.id,
        "Fixed and selectable binding overlap",
      );
    if (
      fixed &&
      (cap?.implementationMode !== "fixed" ||
        !Data.strings(
          this.graph.objects.get(String(fixed))?.capabilities,
        ).includes(id))
    )
      this.output.add("INVALID_FIXED_BINDING", composition.id, id);
    if (selected.length && cap?.implementationMode === "fixed")
      this.output.add("INVALID_FIXED_BINDING", composition.id, id);
  }
  private match(
    scope: unknown,
    capability: string,
    selection: Record<string, unknown>,
  ): boolean {
    return selection.scope === scope && selection.capability === capability;
  }
  private selection(
    composition: ArchitectureObject,
    selection: Record<string, unknown>,
  ): void {
    const provider = this.graph.objects.get(String(selection.provider));
    const capability = this.graph.objects.get(String(selection.capability));
    if (
      !Data.strings(composition.registrations).includes(
        String(selection.provider),
      )
    )
      this.output.add(
        "UNREGISTERED_PROVIDER",
        composition.id,
        String(selection.provider),
      );
    const contract = this.graph.objects.get(String(capability?.contract));
    if (!provider || !capability || !contract) return;
    if (
      !Data.strings(provider.capabilities).includes(capability.id) ||
      provider.contractVersion !== contract.version
    )
      this.output.add("INCOMPATIBLE_CONTRACT", composition.id, capability.id);
  }
}
