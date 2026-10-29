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
    this.scopeGraph(composition.id, scopes);
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
  private scopeGraph(subject: string, scopes: Record<string, unknown>[]): void {
    const parents = new Map<string, string>();
    for (const scope of scopes) {
      if (parents.has(String(scope.id)))
        this.output.add("DUPLICATE_ID", subject, String(scope.id));
      parents.set(String(scope.id), String(scope.parent || ""));
    }
    for (const id of parents.keys()) {
      const seen = new Set<string>();
      let cursor = id;
      while (cursor) {
        if (seen.has(cursor)) {
          this.output.add(
            "INVALID_SCOPE_PARENT",
            subject,
            "Scope cycle: " + id,
          );
          break;
        }
        seen.add(cursor);
        cursor = parents.get(cursor) || "";
      }
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
    for (const binding of Data.records(scope.fixedBindings))
      required.add(String(binding.capability));
    const members = [
      ...Data.strings(scope.components),
      ...(!scope.parent ? Data.strings(composition.components) : []),
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
    const fixed = Data.records(scope.fixedBindings).find(
      CompositionValidator.capability.bind(null, id),
    )?.component;
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
    this.fixed(composition.id, id, cap, fixed, selected.length);
  }
  private static capability(
    id: string,
    binding: Record<string, unknown>,
  ): boolean {
    return binding.capability === id;
  }
  private fixed(
    subject: string,
    id: string,
    cap: ArchitectureObject | undefined,
    fixed: unknown,
    selected: number,
  ): void {
    if (
      fixed &&
      (cap?.implementationMode !== "fixed" ||
        !Data.strings(
          this.graph.objects.get(String(fixed))?.capabilities,
        ).includes(id))
    )
      this.output.add("INVALID_FIXED_BINDING", subject, id);
    if (selected && cap?.implementationMode === "fixed")
      this.output.add("INVALID_FIXED_BINDING", subject, id);
  }
  private match(
    scope: unknown,
    capability: string,
    selection: Record<string, unknown>,
  ): boolean {
    return selection.scope === scope && selection.capability === capability;
  }
  private registration(
    composition: ArchitectureObject,
    selection: Record<string, unknown>,
  ): void {
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
  }
  private selection(
    composition: ArchitectureObject,
    selection: Record<string, unknown>,
  ): void {
    const provider = this.graph.objects.get(String(selection.provider));
    const capability = this.graph.objects.get(String(selection.capability));
    this.registration(composition, selection);
    const contract = this.graph.objects.get(String(capability?.contract));
    if (!provider || !capability || !contract) {
      this.output.add(
        "UNRESOLVED_REFERENCE",
        composition.id,
        "Provider selection or capability contract is unresolved",
      );
      return;
    }
    if (
      provider.kind !== "provider" ||
      capability.kind !== "capability" ||
      contract.kind !== "contract" ||
      !Data.strings(provider.capabilities).includes(capability.id) ||
      provider.contractVersion !== contract.version
    )
      this.output.add("INCOMPATIBLE_CONTRACT", composition.id, capability.id);
  }
}
