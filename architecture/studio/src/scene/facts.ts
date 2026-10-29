import { ArchitectureGraph } from "../language/graph.js";
import {
  Data,
  type ArchitectureObject,
  type Blueprint,
} from "../model/types.js";
import type { SceneDiagnostic, SceneRelationship } from "./contracts.js";

export class SceneFacts {
  readonly graph: ArchitectureGraph;
  readonly relationships: SceneRelationship[] = [];
  readonly diagnostics: SceneDiagnostic[] = [];
  readonly providerOwners = new Map<string, string>();
  constructor(documents: Blueprint[]) {
    this.graph = new ArchitectureGraph(documents);
    this.normalize(documents);
    for (const object of this.graph.objects.values())
      if (object.kind === "provider") this.providerOwner(object);
  }
  static identity(kind: string, from: string, to: string): string {
    return JSON.stringify([kind, from, to]);
  }
  private normalize(documents: Blueprint[]): void {
    const records = new Map<string, SceneRelationship>();
    for (const document of documents) this.documentEdges(document, records);
    this.relationships.push(...records.values());
    this.relationships.sort(SceneFacts.ordered);
  }
  private documentEdges(
    document: Blueprint,
    records: Map<string, SceneRelationship>,
  ): void {
    const explicit = new Set<string>();
    for (const edge of document.relationships || [])
      explicit.add(SceneFacts.identity(edge.kind, edge.from, edge.to));
    for (const edge of new ArchitectureGraph([document]).edges) {
      const id = SceneFacts.identity(edge.kind, edge.from, edge.to);
      const record = records.get(id) || { ...edge, id, provenance: [] };
      const origin =
        document.view +
        ": " +
        (explicit.has(id) ? "explicit" : "derived from declared fields");
      if (!record.provenance.includes(origin)) record.provenance.push(origin);
      records.set(id, record);
    }
  }
  private providerOwner(object: ArchitectureObject): void {
    const owner = Data.text(object.component);
    const component = this.graph.objects.get(owner);
    if (
      component?.kind === "component" &&
      component.componentKind === "plugin" &&
      this.project(owner) === this.project(object.id)
    ) {
      this.providerOwners.set(object.id, owner);
      return;
    }
    this.diagnostics.push({
      code: "PROVIDER_OWNERSHIP",
      subject: object.id,
      message:
        "Provider component is missing, not a plugin, or belongs to another project: " +
        owner,
    });
  }
  project(id: string): string | undefined {
    return this.graph.objects.get(id)?.kind === "project"
      ? id
      : this.graph.owners.get(id);
  }
  interface(id: string): string {
    const object = this.graph.objects.get(id);
    if (object?.kind === "contract") return id;
    return (
      Data.text(object?.contract) || (object?.kind === "capability" ? id : "")
    );
  }
  static ordered(a: { id: string }, b: { id: string }): number {
    return a.id.localeCompare(b.id, "en");
  }
}
