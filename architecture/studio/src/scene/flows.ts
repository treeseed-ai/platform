import { Data, type ArchitectureObject } from "../model/types.js";
import type {
  Cell,
  Connector,
  Port,
  Scene,
  SceneContext,
  SceneRelationship,
  SceneDiagnostic,
} from "./contracts.js";
export class FlowProjection {
  private static readonly geometry = {
    providers: [],
    pluginCount: 0,
    providerCount: 0,
    peers: 0,
    children: [],
    width: 300,
    height: 180,
  };
  private cells: Cell[] = [];
  private diagnostics: SceneDiagnostic[] = [];
  private ports: Port[] = [];
  private connectors: Connector[] = [];
  private relationships: SceneRelationship[] = [];
  project(flow: ArchitectureObject, context: SceneContext): Scene {
    for (const node of Data.records(flow.nodes)) this.node(flow, node);
    for (const node of Data.records(flow.nodes)) this.transitions(flow, node);
    this.complete(flow);
    return {
      context,
      cells: this.cells,
      ports: this.ports,
      connectors: this.connectors,
      relationships: this.relationships,
      diagnostics: this.diagnostics,
    };
  }
  private complete(flow: ArchitectureObject): void {
    for (const port of this.ports) {
      let cell = this.cells.find(FlowProjection.matches.bind(null, port.cell));
      if (!cell) {
        this.node(flow, {
          id: port.cell.slice(flow.id.length + 1),
          kind: "unresolved",
        });
        cell = this.cells[this.cells.length - 1];
        cell.unresolved = true;
        this.diagnostics.push({
          code: "FLOW_ENDPOINT",
          subject: flow.id,
          message: "Unresolved flow target: " + port.cell,
        });
      }
      cell.height += 32;
    }
  }
  private static matches(id: string, cell: Cell): boolean {
    return cell.id === id;
  }
  private node(flow: ArchitectureObject, node: Record<string, unknown>): void {
    const id = flow.id + "/" + node.id;
    this.cells.push({
      id,
      subject: flow.id,
      name: Data.text(node.label) || Data.text(node.id),
      kind: Data.text(node.kind),
      purpose:
        Data.text(node.predicate) ||
        "Modeled flow step; inspect flow for participants and evidence",
      owner: Data.text(flow.project),
      external: false,
      unresolved: false,
      expanded: false,
      ...FlowProjection.geometry,
    });
  }
  private transitions(
    flow: ArchitectureObject,
    node: Record<string, unknown>,
  ): void {
    if (typeof node.next === "string")
      this.connect(flow.id, node, "next", node.next);
    for (const [label, target] of Object.entries(Data.record(node.outcomes)))
      if (typeof target === "string")
        this.connect(flow.id, node, label, target);
    for (const target of Data.strings(node.branches))
      this.connect(flow.id, node, "parallel", target);
    if (typeof node.target === "string")
      this.connect(flow.id, node, "bounded repetition", node.target);
  }
  private connect(
    flow: string,
    node: Record<string, unknown>,
    label: string,
    target: string,
  ): void {
    const source = flow + "/" + node.id,
      destination = flow + "/" + target;
    const id = JSON.stringify([source, label, destination]);
    const relationship = {
      id,
      kind: "transition",
      from: source,
      to: destination,
      provenance: ["modeled flow transition: " + flow],
    };
    this.relationships.push(relationship);
    const sourcePort = this.port(source, "out", label, id),
      targetPort = this.port(destination, "in", label, id);
    this.bundle(
      id,
      source,
      destination,
      sourcePort,
      targetPort,
      node,
      label,
      relationship,
    );
  }
  private bundle(
    id: string,
    source: string,
    destination: string,
    sourcePort: Port,
    targetPort: Port,
    node: Record<string, unknown>,
    label: string,
    relationship: SceneRelationship,
  ): void {
    this.connectors.push({
      id,
      source,
      target: destination,
      sourcePort: sourcePort.id,
      targetPort: targetPort.id,
      category: Data.text(node.kind),
      label,
      relationships: [relationship],
    });
  }
  private port(
    cell: string,
    direction: "in" | "out",
    label: string,
    edge: string,
  ): Port {
    const port = {
      id: JSON.stringify([edge, direction]),
      cell,
      interface: label,
      label,
      direction,
      category: "transition",
      endpoints: [cell],
      count: 1,
    };
    this.ports.push(port);
    return port;
  }
}
