import {
  Data,
  type Blueprint,
  type ArchitectureObject,
  type Diagnostic,
} from "../model/types.js";
import { ArchitectureGraph } from "./graph.js";
import { Diagnostics } from "./diagnostics.js";
import { CompositionValidator } from "./composition.js";
import { PlacementValidator } from "./placement.js";
import { FlowValidator } from "./flows.js";

export class SemanticValidator {
    static readonly endpoints: Record<string, [string[], string[]]> = {
      provides: [["component", "provider"], ["capability"]],
      requires: [["component"], ["capability"]],
      implements: [["provider", "component"], ["contract"]],
      owns: [
        ["project", "component"],
        ["component", "resource"],
      ],
      calls: [["component"], ["contract"]],
      emits: [["component"], ["contract"]],
      "depends-on": [
        ["component", "project"],
        ["component", "project"],
      ],
    };

  validate(documents: Blueprint[], profiles: Blueprint[] = []): Diagnostic[] {
    const graph = new ArchitectureGraph(documents);
    const output = new Diagnostics();
    const placement = new PlacementValidator(output);
    for (const id of graph.duplicates)
      output.add("DUPLICATE_ID", id, "Duplicate architectural ID");
    for (const object of graph.objects.values())
      this.object(object, graph, output, placement);
    this.relationships(graph, output);
    for (const profile of profiles)
      for (const rule of profile.objects) this.rule(rule, graph, output);
    if (!output.items.length)
      output.add(
        "MODEL_VALID",
        "workspace",
        "Model checks passed; runtime behavior remains unverified",
        "satisfied",
      );
    return output.items;
  }
  private object(
    object: ArchitectureObject,
    graph: ArchitectureGraph,
    output: Diagnostics,
    placement: PlacementValidator,
  ): void {
    this.references(object, graph, output);
    if (object.kind === "composition")
      new CompositionValidator(graph, output).check(object);
    if (object.kind === "flow") new FlowValidator(output).check(object);
    if (object.kind === "placement") placement.check(object);
    if (object.kind === "rule") this.rule(object, graph, output);
    if (
      object.kind === "provider" &&
      Data.record(object.replacement).kind === "live"
    )
      output.add(
        "UNKNOWN_QUALIFICATION",
        object.id,
        "Live replacement requires scoped runtime assertion and artifact evidence",
        "unknown",
      );
  }
  private references(
    object: ArchitectureObject,
    graph: ArchitectureGraph,
    output: Diagnostics,
  ): void {
    const singles = ["project", "component", "contract", "owner", "subject"];
    const lists = [
      "capabilities",
      "contracts",
      "dependencies",
      "participants",
      "subjects",
      "registrations",
      "components",
    ];
    for (const field of singles)
      if (typeof object[field] === "string")
        this.reference(String(object[field]), object.id, graph, output);
    for (const field of lists)
      for (const id of Data.strings(object[field]))
        this.reference(id, object.id, graph, output);
    for (const node of Data.records(object.nodes))
      for (const field of ["component", "contract"])
        if (node[field])
          this.reference(String(node[field]), object.id, graph, output);
  }
  private reference(
    id: string,
    subject: string,
    graph: ArchitectureGraph,
    output: Diagnostics,
  ): void {
    if (!graph.objects.has(id)) output.add("UNRESOLVED_REFERENCE", subject, id);
  }
  private relationships(graph: ArchitectureGraph, output: Diagnostics): void {
    for (const edge of graph.edges) {
      this.reference(edge.from, edge.from, graph, output);
      this.reference(edge.to, edge.from, graph, output);
      const kinds = SemanticValidator.endpoints[edge.kind];
      if (
        !kinds ||
        !kinds[0].includes(graph.objects.get(edge.from)?.kind ?? "") ||
        !kinds[1].includes(graph.objects.get(edge.to)?.kind ?? "")
      )
        output.add("INVALID_ENDPOINT", edge.from, edge.kind + " → " + edge.to);
    }
  }
  private rule(
    rule: ArchitectureObject,
    graph: ArchitectureGraph,
    output: Diagnostics,
  ): void {
    const parameters = Data.record(rule.parameters);
    for (const subject of Data.strings(rule.subjects)) {
      this.reference(subject, rule.id, graph, output);
      if (
        rule.ruleType === "forbidden-dependency" ||
        rule.ruleType === "closed-boundary"
      )
        this.boundary(rule, subject, parameters, graph, output);
      else if (rule.ruleType === "native-plugin-components")
        this.plugin(subject, graph, output);
      else
        output.add(
          "EVIDENCE_REQUIRED",
          subject,
          rule.ruleType + ": requires " + rule.verification + " evidence",
          "unknown",
        );
    }
  }
  private boundary(
    rule: ArchitectureObject,
    subject: string,
    parameters: Record<string, unknown>,
    graph: ArchitectureGraph,
    output: Diagnostics,
  ): void {
    for (const edge of graph.edges) {
      if (edge.from !== subject || edge.kind !== "depends-on") continue;
      const forbidden =
        rule.ruleType === "forbidden-dependency"
          ? edge.to === parameters.target
          : !Data.strings(parameters.allowed).includes(edge.to);
      if (forbidden) output.add("FORBIDDEN_DEPENDENCY", subject, edge.to);
    }
  }
  private plugin(
    subject: string,
    graph: ArchitectureGraph,
    output: Diagnostics,
  ): void {
    for (const object of graph.objects.values()) {
      if (object.id !== subject && object.project !== subject) continue;
      if (
        object.kind === "component" &&
        (!object.componentRole || object.componentRole === "runtime") &&
        object.componentKind !== "plugin"
      )
        output.add(
          "PLUGIN_REQUIRED",
          object.id,
          "Runtime components must be plugins",
        );
    }
  }
}
