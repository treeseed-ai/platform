import { Data, type ArchitectureObject } from "../model/types.js";
import type { ProviderCard, SceneContext } from "./contracts.js";
import { SceneFacts } from "./facts.js";

export class ProviderEvidence {
  constructor(
    private facts: SceneFacts,
    private context: SceneContext,
  ) {}
  card(object: ArchitectureObject): ProviderCard {
    const composition = this.facts.graph.objects.get(
      this.context.composition || "",
    );
    return {
      subject: object.id,
      name: object.name,
      contractVersion: Data.text(object.contractVersion) || "unknown",
      replacement:
        Data.text(Data.record(object.replacement).kind) || "unspecified",
      registered: composition
        ? this.registered(object.id, composition)
        : "unknown",
      selection: this.selection(object.id, composition),
      readiness: "unknown",
    };
  }
  private registered(id: string, composition: ArchitectureObject): boolean {
    if (Data.strings(composition.registrations).includes(id)) return true;
    for (const scope of Data.records(composition.scopes))
      if (
        scope.id === this.context.scope &&
        Data.strings(scope.registrations).includes(id)
      )
        return true;
    return false;
  }
  private selection(id: string, composition?: ArchitectureObject): string {
    if (!composition || !this.context.scope) return "selection varies by scope";
    const selections = Data.records(composition.selections).filter(
      this.inScope.bind(this),
    );
    for (const scope of Data.records(composition.scopes))
      if (scope.id === this.context.scope)
        selections.push(...Data.records(scope.selections));
    let count = 0;
    for (const selection of selections) if (selection.provider === id) count++;
    if (!count) return "not selected";
    for (const selection of selections)
      if (selection.provider === id && this.ambiguous(selection, selections))
        return "ambiguous selection";
    return "selected";
  }
  private inScope(selection: Record<string, unknown>): boolean {
    return selection.scope === this.context.scope;
  }
  private ambiguous(
    selected: Record<string, unknown>,
    selections: Record<string, unknown>[],
  ): boolean {
    const providers = new Set<string>();
    for (const selection of selections)
      if (selection.capability === selected.capability)
        providers.add(Data.text(selection.provider));
    return providers.size > 1;
  }
}
