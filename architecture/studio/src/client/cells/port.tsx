import { Component } from "react";
import { Handle, Position } from "@xyflow/react";
import type { PortGeometry } from "../../scene/contracts.js";
interface Props {
  port: PortGeometry;
  onInspect: (id: string) => void;
  changed: boolean;
}
export class BoundaryPort extends Component<Props> {
  render(): React.ReactNode {
    const { port } = this.props;
    const out = port.direction === "out";
    return (
      <div
        className={
          "cell-port " +
          (out ? "out" : "in") +
          (this.props.changed ? " impacted" : "")
        }
        style={{ top: port.y }}
      >
        <Handle
          id={port.id}
          type={out ? "source" : "target"}
          position={out ? Position.Right : Position.Left}
        />
        {this.label()}
      </div>
    );
  }
  private label(): React.ReactNode {
    const { port } = this.props;
    const out = port.direction === "out";
    return (
      <button
        className="nodrag nopan"
        onClick={this.inspect.bind(this)}
        title={port.label + " · " + port.category}
        aria-label={"Inspect boundary " + port.label}
      >
        {out ? "↗ " : "↙ "}
        {port.label} <span>{port.count}</span>
      </button>
    );
  }
  private inspect(event: React.MouseEvent): void {
    event.stopPropagation();
    this.props.onInspect(this.props.port.id);
  }
}
