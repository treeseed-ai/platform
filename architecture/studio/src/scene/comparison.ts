import {
  Data,
  type Blueprint,
  type ArchitectureObject,
} from "../model/types.js";
import { SceneFacts } from "./facts.js";
export type ComparisonStatus =
  | "added"
  | "removed"
  | "observed-only"
  | "unchanged";
export class SceneComparison {
  private observed = new Set<string>();
  private intended = new Set<string>();
  private subjects = new Map<string, ArchitectureObject>();
  constructor(documents: Blueprint[]) {
    for (const document of documents) {
      const target = document.view === "intent" ? this.intended : this.observed;
      for (const edge of new SceneFacts([document]).relationships)
        target.add(edge.id);
      if (document.view === "intent")
        for (const object of document.objects)
          this.subjects.set(object.id, object);
    }
  }
  relationship(id: string): ComparisonStatus {
    if (!this.intended.has(id) && !this.observed.has(id)) return "unchanged";
    if (!this.intended.has(id))
      return this.removed(id) ? "removed" : "observed-only";
    return this.observed.has(id) ? "unchanged" : "added";
  }
  private removed(id: string): boolean {
    const [kind, from, to] = JSON.parse(id) as string[];
    const fields: Record<string, string> = {
      "depends-on": "dependencies",
      provides: "capabilities",
      implements: "contracts",
    };
    const object = this.subjects.get(from),
      field = fields[kind];
    if (!object || !field || !Object.hasOwn(object, field)) return false;
    return !Data.strings(object[field]).includes(to);
  }
  relationships(ids: string[]): ComparisonStatus {
    const statuses = new Set<ComparisonStatus>();
    for (const id of ids) statuses.add(this.relationship(id));
    if (statuses.size === 1) return [...statuses][0];
    return "unchanged";
  }
}
