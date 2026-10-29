import { Component } from "react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  type EdgeTypes,
  type Edge,
} from "@xyflow/react";
import type { RoutedConnector, Point } from "../../scene/contracts.js";
export type CellEdge = Edge<{
  connector: RoutedConnector;
  status: string;
  dimmed: boolean;
  changed: boolean;
  onInspect: (id: string) => void;
}>;
export class RoutedConnection extends Component<
  React.ComponentProps<EdgeTypes[string]>
> {
  private get data(): NonNullable<CellEdge["data"]> {
    return this.props.data as NonNullable<CellEdge["data"]>;
  }
  render(): React.ReactNode {
    const data = this.data;
    const sections = data.connector.sections;
    const first = sections[0];
    if (!first) return null;
    return (
      <g
        className={
          "cell-connection " +
          data.connector.category +
          " " +
          data.status +
          (data.dimmed ? " dimmed" : "") +
          (data.changed ? " impacted" : "")
        }
      >
        {sections.map(this.section.bind(this))}
        {this.label()}
      </g>
    );
  }
  private label(): React.ReactNode {
    const data = this.data;
    const first = data.connector.sections[0];
    return (
      <EdgeLabelRenderer>
        <button
          className={
            "connection-label nodrag nopan" + (data.dimmed ? " dimmed" : "")
          }
          style={{
            transform: `translate(-50%, -50%) translate(${first.startPoint.x + 40}px,${first.startPoint.y - 12}px)`,
          }}
          onClick={this.inspect.bind(this)}
        >
          {data.connector.label} · {data.connector.relationships.length}
          {data.status !== "unchanged" && " · " + data.status}
        </button>
      </EdgeLabelRenderer>
    );
  }
  private section(
    section: RoutedConnector["sections"][number],
    index: number,
  ): React.ReactNode {
    const points = [
      section.startPoint,
      ...(section.bendPoints || []),
      section.endPoint,
    ];
    return (
      <BaseEdge
        key={index}
        id={this.props.id + "/" + index}
        path={"M" + points.map(RoutedConnection.point).join(" L")}
        markerEnd={this.props.markerEnd}
        style={{
          stroke: this.data.changed ? "#ffc66d" : "#6499ac",
          strokeWidth: this.props.selected ? 3 : 1.6,
        }}
      />
    );
  }
  private static point(point: Point): string {
    return point.x + "," + point.y;
  }
  private inspect(): void {
    this.data.onInspect(this.data.connector.id);
  }
}
