import {
  Data,
  type ArchitectureObject,
  type Blueprint,
  type Finding,
} from "../model/types.js";
import { ArchitectureGraph } from "../language/graph.js";

export class ComparisonService {
  private static readonly excluded = new Set([
    "id",
    "metadata",
    "sourceBindings",
    "extensions",
    "revision",
    "ownedFiles",
  ]);
  objects(
    observed: ArchitectureObject[],
    intended: ArchitectureObject[],
  ): Finding[] {
    const baseline = new Map<string, ArchitectureObject>();
    for (const object of observed) baseline.set(object.id, object);
    const findings: Finding[] = [];
    for (const object of intended)
      this.compare(baseline.get(object.id), object, findings);
    return findings;
  }
  workspace(implementation: Blueprint[], intent: Blueprint[]): Finding[] {
    const current = new ArchitectureGraph(implementation);
    const desired = new ArchitectureGraph(intent);
    const findings = this.objects(
      [...current.objects.values()],
      [...desired.objects.values()],
    );
    this.relationships(implementation, intent, findings);
    for (const finding of findings) {
      finding.impact = [
        ...new Set([
          ...current.affected(finding.subject),
          ...desired.affected(finding.subject),
        ]),
      ].sort();
      finding.accepted = this.accepted(finding.subject, intent);
    }
    for (const object of current.objects.values())
      if (!desired.objects.has(object.id))
        findings.push(
          this.finding(object.id, "*", "unclassified", object, undefined),
        );
    return findings;
  }
  private compare(
    before: ArchitectureObject | undefined,
    after: ArchitectureObject,
    findings: Finding[],
  ): void {
    if (!before) {
      findings.push(
        this.finding(after.id, "*", "missing-implementation", undefined, after),
      );
      return;
    }
    for (const field of Object.keys(after).sort()) {
      if (ComparisonService.excluded.has(field)) continue;
      if (this.agrees(before[field], after[field], field)) continue;
      findings.push(
        this.finding(
          after.id,
          field,
          this.category(after.kind, field),
          before[field],
          after[field],
        ),
      );
    }
    this.sourceDrift(before, after, findings);
  }
  private agrees(before: unknown, after: unknown, field: string): boolean {
    if (Array.isArray(after))
      return (
        Data.canonical(this.normalize(before, field)) ===
        Data.canonical(this.normalize(after, field))
      );
    if (after && typeof after === "object") {
      for (const [key, value] of Object.entries(after))
        if (!this.agrees(Data.record(before)[key], value, key)) return false;
      return true;
    }
    return Data.canonical(before) === Data.canonical(after);
  }
  private relationships(
    current: Blueprint[],
    intent: Blueprint[],
    findings: Finding[],
  ): void {
    const observed = new Set<string>();
    for (const document of current)
      for (const edge of document.relationships ?? [])
        observed.add(Data.canonical(edge));
    for (const document of intent)
      for (const edge of document.relationships ?? []) {
        if (observed.has(Data.canonical(edge))) continue;
        findings.push(
          this.finding(
            edge.from,
            "relationship:" + edge.kind + ":" + edge.to,
            "dependency-mismatch",
            undefined,
            edge,
          ),
        );
      }
  }
  private sourceDrift(
    before: ArchitectureObject,
    after: ArchitectureObject,
    findings: Finding[],
  ): void {
    if (
      !after.sourceBindings ||
      Data.canonical(before.sourceBindings) ===
        Data.canonical(after.sourceBindings)
    )
      return;
    findings.push(
      this.finding(
        after.id,
        "sourceBindings",
        "source-drift",
        before.sourceBindings,
        after.sourceBindings,
      ),
    );
  }
  private normalize(value: unknown, field: string): unknown {
    if (!Array.isArray(value)) return value;
    if (
      [
        "dependencies",
        "capabilities",
        "contracts",
        "participants",
        "subjects",
        "registrations",
        "components",
      ].includes(field)
    )
      return [...value].sort();
    if (["nodes", "operations", "scopes"].includes(field))
      return [...value].sort(ComparisonService.order);
    return value;
  }
  private static order(a: unknown, b: unknown): number {
    return String(Data.record(a).id ?? Data.record(a).name).localeCompare(
      String(Data.record(b).id ?? Data.record(b).name),
    );
  }
  private category(kind: string, field: string): string {
    if (field === "dependencies") return "dependency-mismatch";
    return (
      (
        {
          contract: "contract-mismatch",
          provider: "provider-mismatch",
          composition: "scope-mismatch",
          placement: "placement-mismatch",
          flow: "lifecycle-mismatch",
        } as Record<string, string>
      )[kind] ?? "architecture-mismatch"
    );
  }
  private finding(
    subject: string,
    field: string,
    category: string,
    before: unknown,
    after: unknown,
  ): Finding {
    return {
      id: subject + "/" + field,
      subject,
      field,
      category,
      before,
      after,
      impact: [],
      accepted: false,
    };
  }
  private accepted(subject: string, documents: Blueprint[]): boolean {
    for (const document of documents) {
      if (!document.objects.some(ComparisonService.matches.bind(null, subject)))
        continue;
      return (
        document.metadata.status === "accepted" ||
        Data.strings(document.metadata.acceptedSubjects).includes(subject)
      );
    }
    return false;
  }
  private static matches(id: string, object: ArchitectureObject): boolean {
    return object.id === id;
  }
}
