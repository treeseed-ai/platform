import type { SceneComparison } from "../../scene/comparison.js";
import { MarkerType } from "@xyflow/react";
import type {
  LayoutResult,
  Point,
  RoutedConnector,
} from "../../scene/contracts.js";
import type { CellNode } from "./node.js";
import type { CellEdge } from "./connector.js";
export interface PresentationOptions {
  comparison: SceneComparison;
  zoom: number;
  positions: Record<string, Point>;
  selected: string;
  changed: Set<string>;
  impacted: Set<string>;
  query: string;
  ghosts: Set<string>;
  onEnter: (id: string) => void;
  onExpand: (id: string) => void;
  onSelect: (id: string) => void;
  onPort: (id: string) => void;
}
export class CellPresentation {
  constructor(
    private layout: LayoutResult,
    private options: PresentationOptions,
  ) {}
  nodes(): CellNode[] {
    return this.layout.cells.map(this.node.bind(this));
  }
  edges(): CellEdge[] {
    return this.layout.connectors.map(this.edge.bind(this));
  }
  private node(cell: LayoutResult["cells"][number]): CellNode {
    const ports = this.layout.ports
      .filter(CellPresentation.owner.bind(null, cell.id))
      .map(this.port.bind(this));
    return {
      id: cell.id,
      type: "cell",
      selected:
        cell.id === this.options.selected ||
        cell.children.includes(this.options.selected),
      position: this.options.positions[cell.id] || { x: cell.x, y: cell.y },
      style: { width: cell.width, height: cell.height },
      data: {
        ...this.options,
        cell,
        ports,
        dimmed: !this.matches(cell),
        ghost: this.options.ghosts.has(cell.id),
      },
    };
  }
  private port(
    port: LayoutResult["ports"][number],
  ): LayoutResult["ports"][number] {
    const ids: string[] = [];
    for (const edge of this.layout.connectors)
      if (edge.sourcePort === port.id || edge.targetPort === port.id)
        for (const relationship of edge.relationships)
          ids.push(relationship.id);
    return { ...port, comparison: this.options.comparison.relationships(ids) };
  }
  private edge(connector: RoutedConnector): CellEdge {
    return {
      id: connector.id,
      source: connector.source,
      target: connector.target,
      sourceHandle: connector.sourcePort,
      targetHandle: connector.targetPort,
      type: "routed",
      markerEnd: { type: MarkerType.ArrowClosed },
      data: {
        connector: this.adjusted(connector),
        status: this.options.comparison.relationships(
          connector.relationships.map(CellPresentation.relationshipId),
        ),
        dimmed: !!this.options.selected && !this.related(connector),
        changed: this.affected(connector),
        onInspect: this.options.onPort,
      },
    };
  }
  private static relationshipId(edge: { id: string }): string {
    return edge.id;
  }
  private related(connector: RoutedConnector): boolean {
    if ([connector.source, connector.target].includes(this.options.selected))
      return true;
    for (const edge of connector.relationships)
      if ([edge.from, edge.to].includes(this.options.selected)) return true;
    return false;
  }
  private affected(connector: RoutedConnector): boolean {
    for (const edge of connector.relationships)
      if (
        this.options.impacted.has(edge.from) ||
        this.options.impacted.has(edge.to)
      )
        return true;
    return false;
  }
  private adjusted(connector: RoutedConnector): RoutedConnector {
    const copy = structuredClone(connector);
    const source = this.offset(connector.source),
      target = this.offset(connector.target);
    if (
      !copy.sections.length ||
      (!source.x && !source.y && !target.x && !target.y)
    )
      return copy;
    this.attach(copy.sections[0], source, true);
    this.attach(copy.sections[copy.sections.length - 1], target, false);
    return copy;
  }
  private attach(
    section: RoutedConnector["sections"][number],
    offset: Point,
    source: boolean,
  ): void {
    const key = source ? "startPoint" : "endPoint";
    const original = section[key];
    const moved = { x: original.x + offset.x, y: original.y + offset.y };
    const side = source ? 24 : -24;
    const bridge = [
      { x: moved.x + side, y: moved.y },
      { x: moved.x + side, y: original.y },
      original,
    ];
    section[key] = moved;
    section.bendPoints = source
      ? [...bridge, ...(section.bendPoints || [])]
      : [...(section.bendPoints || []), ...bridge.reverse()];
  }
  private offset(id: string): Point {
    const cell = this.layout.cells.find(CellPresentation.id.bind(null, id))!;
    const position = this.options.positions[id] || cell;
    return { x: position.x - cell.x, y: position.y - cell.y };
  }
  private matches(cell: LayoutResult["cells"][number]): boolean {
    return (
      !this.options.query ||
      (cell.name + cell.subject + cell.children.join(" "))
        .toLowerCase()
        .includes(this.options.query.toLowerCase())
    );
  }
  private static owner(id: string, port: { cell: string }): boolean {
    return port.cell === id;
  }
  private static id(id: string, cell: { id: string }): boolean {
    return cell.id === id;
  }
}
