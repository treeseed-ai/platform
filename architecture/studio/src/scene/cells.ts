import { Data, type ArchitectureObject } from "../model/types.js";
import type { Cell, SceneContext } from "./contracts.js";
import { SceneFacts } from "./facts.js";
import { ProviderEvidence } from "./providers.js";

export class CellCatalog {
  readonly cells = new Map<string, Cell>();
  constructor(
    readonly facts: SceneFacts,
    readonly context: SceneContext,
  ) {}
  initialize(): void {
    for (const object of this.facts.graph.objects.values())
      if (this.visible(object)) this.add(object.id);
  }
  private visible(object: ArchitectureObject): boolean {
    if (!this.context.project) return object.kind === "project";
    if (this.facts.project(object.id) !== this.context.project) return false;
    if (object.kind === "provider")
      return !this.facts.providerOwners.has(object.id);
    if (this.context.view === "Flows") return object.kind === "flow";
    return (
      ["component", "resource"].includes(object.kind) ||
      object.id === this.context.composition
    );
  }
  boundary(id: string): string {
    const project = this.facts.project(id);
    if (!project) return id;
    if (!this.context.project || project !== this.context.project)
      return project;
    if (this.facts.providerOwners.has(id))
      return this.facts.providerOwners.get(id)!;
    return this.interfaceBoundary(id);
  }
  private interfaceBoundary(id: string): string {
    const owners = new Set<string>();
    for (const object of this.facts.graph.objects.values())
      if (
        object.kind === "component" &&
        this.facts.project(object.id) === this.context.project &&
        [
          ...Data.strings(object.capabilities),
          ...Data.strings(object.contracts),
        ].includes(id)
      )
        owners.add(object.id);
    return owners.size === 1 ? [...owners][0] : id;
  }
  add(id: string): Cell {
    const previous = this.cells.get(id);
    if (previous) return previous;
    const object = this.facts.graph.objects.get(id);
    const cell = this.create(id, object);
    this.populate(cell);
    this.cells.set(id, cell);
    return cell;
  }
  private create(id: string, object?: ArchitectureObject): Cell {
    return {
      id,
      subject: id,
      name: object?.name || id,
      kind: object?.kind || "unresolved",
      owner: this.facts.project(id),
      purpose: object?.purpose || "Unresolved architectural endpoint",
      external:
        !!this.context.project &&
        this.facts.project(id) !== this.context.project,
      unresolved: !object,
      expanded: this.context.expanded?.includes(id) || false,
      providers: [],
      pluginCount: 0,
      providerCount: 0,
      peers: 0,
      children: [],
      width: 380,
      height: 190,
      object,
    };
  }
  private populate(cell: Cell): void {
    const evidence = new ProviderEvidence(this.facts, this.context);
    for (const object of this.facts.graph.objects.values()) {
      if (
        cell.kind === "project" &&
        this.facts.project(object.id) === cell.subject
      ) {
        if (object.kind === "component" && object.componentKind === "plugin")
          cell.pluginCount++;
        if (object.kind === "provider") cell.providerCount++;
      }
      if (this.facts.providerOwners.get(object.id) !== cell.subject) continue;
      cell.children.push(object.id);
      cell.providers.push(evidence.card(object));
    }
    cell.providers.sort(CellCatalog.bySubject);
    if (cell.kind !== "project") cell.providerCount = cell.providers.length;
  }
  private static bySubject(
    a: { subject: string },
    b: { subject: string },
  ): number {
    return a.subject.localeCompare(b.subject, "en");
  }
}
