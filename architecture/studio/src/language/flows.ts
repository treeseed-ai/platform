import { Data, type ArchitectureObject } from "../model/types.js";
import { Diagnostics } from "./diagnostics.js";

export class FlowValidator {
  constructor(private output: Diagnostics) {}
  check(flow: ArchitectureObject): void {
    const nodes = new Map<string, Record<string, unknown>>();
    for (const node of Data.records(flow.nodes)) {
      if (nodes.has(String(node.id)))
        this.output.add("DUPLICATE_ID", flow.id, String(node.id));
      nodes.set(String(node.id), node);
    }
    for (const cleanup of Data.strings(flow.requiredCleanup))
      if (!nodes.has(cleanup))
        this.output.add("MISSING_CLEANUP", flow.id, cleanup);
    this.walk(flow, nodes, String(flow.entry), new Set(), new Set());
  }
  private walk(
    flow: ArchitectureObject,
    nodes: Map<string, Record<string, unknown>>,
    id: string,
    path: Set<string>,
    clean: Set<string>,
  ): void {
    const node = nodes.get(id);
    if (!node) {
      this.output.add("UNRESOLVED_REFERENCE", flow.id, id);
      return;
    }
    if (path.has(id)) {
      if (node.kind !== "repeat")
        this.output.add("UNBOUNDED_FLOW", flow.id, id);
      return;
    }
    const visited = new Set([...path, id]);
    const cleanup = new Set(clean);
    if (node.kind === "cleanup") cleanup.add(id);
    const next = this.edges(node);
    if (!next.length) this.terminal(flow, node, cleanup);
    for (const edge of next) this.walk(flow, nodes, edge, visited, cleanup);
  }
  private edges(node: Record<string, unknown>): string[] {
    const result = Data.strings(node.branches);
    for (const field of ["next", "body", "exhausted"])
      if (typeof node[field] === "string") result.push(String(node[field]));
    for (const target of Object.values(Data.record(node.outcomes)))
      if (typeof target === "string") result.push(target);
    if (node.kind === "parallel" && node.join) result.push(String(node.join));
    return [...new Set(result)];
  }
  private terminal(
    flow: ArchitectureObject,
    node: Record<string, unknown>,
    clean: Set<string>,
  ): void {
    if (!Data.strings(flow.outcomes).includes(String(node.id)))
      this.output.add("MISSING_OUTCOME", flow.id, String(node.id));
    for (const cleanup of Data.strings(flow.requiredCleanup))
      if (!clean.has(cleanup))
        this.output.add(
          "MISSING_CLEANUP",
          flow.id,
          String(node.id) + " lacks " + cleanup,
        );
  }
}
