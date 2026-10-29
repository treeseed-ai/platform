import { MarkerType } from "@xyflow/react";
import type {
  LayoutResult,
  Point,
  RoutedConnector,
} from "../../scene/contracts.js";
import type { CellNode } from "./node.js";
import type { CellEdge } from "./connector.js";
export interface PresentationOptions {
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
    const ports = this.layout.ports.filter(
      CellPresentation.owner.bind(null, cell.id),
    );
    return {
      id: cell.id,
      type: "cell",
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
        dimmed: !!this.options.selected && !this.related(connector),
        changed: this.affected(connector),
        onInspect: this.options.onPort,
      },
    };
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
    const first = copy.sections[0],
      last = copy.sections[copy.sections.length - 1];
    first.startPoint = {
      x: first.startPoint.x + source.x,
      y: first.startPoint.y + source.y,
    };
    last.endPoint = {
      x: last.endPoint.x + target.x,
      y: last.endPoint.y + target.y,
    };
    return copy;
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
