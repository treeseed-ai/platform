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
      <div className={this.classes()} style={{ top: port.y }}>
        <Handle
          id={port.id}
          type={port.attachment || (out ? "source" : "target")}
          position={out ? Position.Right : Position.Left}
        />
        {this.label()}
      </div>
    );
  }
  private classes(): string {
    const { port, changed } = this.props;
    return [
      "cell-port",
      port.direction === "out" ? "out" : "in",
      port.comparison || "",
      changed ? "impacted" : "",
    ].join(" ");
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
        {port.direction === "neutral" ? "◇ " : out ? "↗ " : "↙ "}
        {port.label} <span>{port.count}</span>
        {["added", "removed"].includes(port.comparison || "") &&
          " · " + port.comparison}
      </button>
    );
  }
  private inspect(event: React.MouseEvent): void {
    event.stopPropagation();
    this.props.onInspect(this.props.port.id);
  }
}
