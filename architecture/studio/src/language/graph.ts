import {
  Data,
  type ArchitectureObject,
  type Blueprint,
  type Relationship,
} from "../model/types.js";

export class ArchitectureGraph {
  readonly objects = new Map<string, ArchitectureObject>();
  readonly edges: Relationship[] = [];
  readonly declared: Relationship[] = [];
  readonly owners = new Map<string, string>();
  readonly duplicates: string[] = [];
  constructor(documents: Blueprint[]) {
    for (const document of documents) {
      for (const object of document.objects) {
        this.add(object);
        this.owners.set(object.id, String(object.project || document.project));
      }
      this.edges.push(...(document.relationships ?? []));
      this.declared.push(...(document.relationships ?? []));
    }
    this.infer();
  }
  private add(object: ArchitectureObject): void {
    if (this.objects.has(object.id)) this.duplicates.push(object.id);
    this.objects.set(object.id, object);
  }
  private infer(): void {
    for (const object of this.objects.values()) {
      this.fields(object);
      this.composition(object);
      if (object.kind === "provider" && object.contract)
        this.edge("implements", object.id, String(object.contract));
      if (object.kind === "component" && object.project)
        this.edge("owns", String(object.project), object.id);
    }
  }
  private composition(object: ArchitectureObject): void {
    if (object.kind !== "composition") return;
    for (const selection of Data.records(object.selections)) {
      this.edge("depends-on", object.id, String(selection.provider));
      this.edge("depends-on", object.id, String(selection.capability));
    }
    for (const scope of Data.records(object.scopes)) {
      for (const registration of Data.strings(scope.registrations))
        this.edge("depends-on", object.id, registration);
      for (const selection of Data.records(scope.selections)) {
        this.edge("depends-on", object.id, String(selection.provider));
        this.edge("depends-on", object.id, String(selection.capability));
      }
      for (const fixed of Data.records(scope.fixedBindings))
        this.edge("depends-on", object.id, String(fixed.component));
    }
  }
  private fields(object: ArchitectureObject): void {
    const fields: Record<string, string> = {
      capabilities: "provides",
      contracts: "implements",
      dependencies: "depends-on",
    };
    for (const [field, relation] of Object.entries(fields)) {
      if (!["component", "provider"].includes(object.kind)) continue;
      for (const id of Data.strings(object[field]))
        this.edge(relation, object.id, id);
    }
  }
  private edge(kind: string, from: string, to: string): void {
    for (const edge of this.edges)
      if (edge.kind === kind && edge.from === from && edge.to === to) return;
    this.edges.push({ kind, from, to });
  }
  required(subject: string): string[] {
    const seen = new Set([subject]);
    const queue = [subject];
    while (queue.length) {
      const id = queue.shift()!;
      for (const edge of this.edges)
        if (edge.from === id && edge.kind !== "owns")
          this.enqueue(edge.to, seen, queue);
    }
    seen.delete(subject);
    return [...seen].sort();
  }
  affected(subject: string): string[] {
    const seen = new Set([subject]);
    const queue = [subject];
    while (queue.length) this.expand(queue.shift()!, seen, queue);
    seen.delete(subject);
    return [...seen].sort();
  }
  private expand(id: string, seen: Set<string>, queue: string[]): void {
    for (const edge of this.edges) {
      if (edge.to === id && edge.kind !== "owns")
        this.enqueue(edge.from, seen, queue);
    }
    for (const object of this.objects.values()) {
      if (object.contract === id || object.component === id)
        this.enqueue(object.id, seen, queue);
      if (Data.strings(object.capabilities).includes(id))
        this.enqueue(object.id, seen, queue);
    }
  }
  private enqueue(id: string, seen: Set<string>, queue: string[]): void {
    if (seen.has(id)) return;
    seen.add(id);
    queue.push(id);
  }
}
