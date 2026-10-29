import { Data } from "../model/types.js";
import type { Connector, Port, SceneRelationship } from "./contracts.js";
import { CellCatalog } from "./cells.js";
import { SceneFacts } from "./facts.js";

export class BoundaryConnections {
  readonly ports = new Map<string, Port>();
  readonly connectors = new Map<string, Connector>();
  constructor(private catalog: CellCatalog) {}
  project(edge: SceneRelationship): void {
    if (edge.kind === "owns" || !this.seam(edge)) return;
    const source = this.catalog.boundary(edge.from),
      target = this.catalog.boundary(edge.to);
    if (source === target || !this.relevant(source, target)) return;
    this.catalog.add(source);
    this.catalog.add(target);
    const face =
      this.catalog.facts.interface(edge.to) ||
      this.catalog.facts.interface(edge.from) ||
      edge.kind;
    const sourcePort = this.port(source, face, edge, "out");
    const targetPort = this.port(target, face, edge, "in");
    const id = SceneFacts.identity(edge.kind, sourcePort.id, targetPort.id);
    this.bundle(edge, source, target, sourcePort, targetPort, id);
  }
  private seam(edge: SceneRelationship): boolean {
    if (this.catalog.context.view !== "Integration seams") return true;
    const facts = this.catalog.facts;
    return (
      facts.project(edge.from) !== facts.project(edge.to) ||
      !!facts.interface(edge.from) ||
      !!facts.interface(edge.to)
    );
  }
  private bundle(
    edge: SceneRelationship,
    source: string,
    target: string,
    sourcePort: Port,
    targetPort: Port,
    id: string,
  ): void {
    const connector = this.connectors.get(id) || {
      id,
      source,
      target,
      sourcePort: sourcePort.id,
      targetPort: targetPort.id,
      category: edge.kind,
      label: edge.kind,
      relationships: [],
    };
    connector.relationships.push(edge);
    this.connectors.set(id, connector);
  }
  private relevant(source: string, target: string): boolean {
    if (!this.catalog.context.project) return true;
    return (
      this.catalog.facts.project(source) === this.catalog.context.project ||
      this.catalog.facts.project(target) === this.catalog.context.project
    );
  }
  private port(
    cell: string,
    face: string,
    edge: SceneRelationship,
    direction: "in" | "out",
  ): Port {
    const side = [
      "calls",
      "emits",
      "requires",
      "provides",
      "implements",
      "depends-on",
    ].includes(edge.kind)
      ? direction
      : "neutral";
    const id = JSON.stringify(["port", cell, face, side, edge.kind, direction]);
    const port =
      this.ports.get(id) || this.newPort(id, cell, face, side, edge.kind);
    const endpoint = direction === "out" ? edge.from : edge.to;
    if (!port.endpoints.includes(endpoint)) port.endpoints.push(endpoint);
    port.attachment = direction === "out" ? "source" : "target";
    port.count++;
    this.ports.set(id, port);
    return port;
  }
  private newPort(
    id: string,
    cell: string,
    face: string,
    direction: Port["direction"],
    category: string,
  ): Port {
    return {
      id,
      cell,
      interface: face,
      label: this.catalog.facts.graph.objects.get(face)?.name || face,
      direction,
      category,
      endpoints: [],
      count: 0,
    };
  }
  declared(): void {
    for (const cell of this.catalog.cells.values()) {
      if (cell.object?.kind !== "component") continue;
      for (const face of [
        ...Data.strings(cell.object.capabilities),
        ...Data.strings(cell.object.contracts),
      ]) {
        if (this.connected(cell.id, face)) continue;
        const id = JSON.stringify(["declared", cell.id, face]);
        const port = this.newPort(
          id,
          cell.id,
          face,
          "out",
          "declared interface",
        );
        port.endpoints = [cell.id];
        port.unused = true;
        this.ports.set(id, port);
      }
    }
  }
  private connected(cell: string, face: string): boolean {
    const contract = this.catalog.facts.interface(face) || face;
    for (const port of this.ports.values())
      if (port.cell === cell && port.interface === contract && port.count)
        return true;
    return false;
  }
  finish(): void {
    for (const cell of this.catalog.cells.values()) {
      const peers = new Set<string>();
      for (const edge of this.connectors.values()) {
        if (edge.source === cell.id) peers.add(edge.target);
        if (edge.target === cell.id) peers.add(edge.source);
      }
      cell.peers = peers.size;
      cell.height = this.height(
        cell.id,
        cell.expanded ? cell.providers.length : 0,
      );
    }
  }
  private height(id: string, providers: number): number {
    let left = 0,
      right = 0;
    for (const port of this.ports.values())
      if (port.cell === id) {
        if (port.direction === "out") right++;
        else left++;
      }
    return Math.max(200, 160 + Math.max(left, right) * 32) + providers * 110;
  }
}
