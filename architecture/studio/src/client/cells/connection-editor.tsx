import { Component } from "react";
import { ArchitectureGraph } from "../../language/graph.js";
import type { Blueprint } from "../../model/types.js";
import type { Port } from "../../scene/contracts.js";
import { ObjectCatalog } from "../catalog.js";
interface Props {
  source: Port;
  target: Port;
  documents: Blueprint[];
  onConnect: (from: string, to: string, kind: string) => void;
  onClose: () => void;
}
interface State {
  from: string;
  to: string;
}
export class ConnectionEditor extends Component<Props, State> {
  state: State = {
    from:
      this.props.source.endpoints.length === 1
        ? this.props.source.endpoints[0]
        : "",
    to:
      this.props.target.endpoints.length === 1
        ? this.props.target.endpoints[0]
        : "",
  };
  render(): React.ReactNode {
    const kind = this.kind();
    return (
      <div
        className="cell-connection-editor"
        role="dialog"
        aria-label="Connect architectural endpoints"
      >
        <h3>Connect actual subjects</h3>
        <p>
          Boundary ports represent internal subjects. Choose the architectural
          endpoints explicitly.
        </p>
        {this.endpoint("source")}
        {this.endpoint("target")}
        <p>{kind || "No supported relationship for these endpoints"}</p>
        <button disabled={!kind} onClick={this.apply.bind(this)}>
          Create relationship
        </button>
        <button onClick={this.props.onClose}>Cancel connection</button>
      </div>
    );
  }
  private endpoint(side: "source" | "target"): React.ReactNode {
    const source = side === "source";
    return (
      <label>
        {source ? "From" : "To"}
        <select
          aria-label={"Connection " + side}
          value={source ? this.state.from : this.state.to}
          onChange={source ? this.from.bind(this) : this.to.bind(this)}
        >
          <option value="">Choose endpoint</option>
          {this.props[side].endpoints.map(this.option)}
        </select>
      </label>
    );
  }
  private option(id: string): React.ReactNode {
    return (
      <option key={id} value={id}>
        {id}
      </option>
    );
  }
  private from(event: React.ChangeEvent<HTMLSelectElement>): void {
    this.setState({ from: event.target.value });
  }
  private to(event: React.ChangeEvent<HTMLSelectElement>): void {
    this.setState({ to: event.target.value });
  }
  private kind(): string | undefined {
    const graph = new ArchitectureGraph(this.props.documents);
    return ObjectCatalog.relationship(
      graph.objects.get(this.state.from)?.kind || "",
      graph.objects.get(this.state.to)?.kind || "",
    );
  }
  private apply(): void {
    const kind = this.kind();
    if (kind) this.props.onConnect(this.state.from, this.state.to, kind);
    this.props.onClose();
  }
}
