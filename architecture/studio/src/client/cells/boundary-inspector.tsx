import { Component } from "react";
import type { Blueprint } from "../../model/types.js";
import type { Connector, Port, Scene } from "../../scene/contracts.js";
interface Props {
  scene: Scene;
  id: string;
  documents: Blueprint[];
  onSelect: (id: string) => void;
  onClose: () => void;
}
export class BoundaryInspector extends Component<Props> {
  render(): React.ReactNode {
    const port = this.props.scene.ports.find(this.matches.bind(this));
    const connector = this.props.scene.connectors.find(this.matches.bind(this));
    const edges = connector
      ? [connector]
      : this.props.scene.connectors.filter(this.attached.bind(this, port));
    return (
      <aside className="boundary-inspector" aria-label="Boundary inspector">
        <button
          onClick={this.props.onClose}
          aria-label="Close boundary inspector"
        >
          ×
        </button>
        <h3>{port?.label || connector?.label || "Boundary connection"}</h3>
        <p>
          Projected boundary route · original architectural endpoints preserved.
        </p>
        {port && this.interface(port.interface)}
        {edges.map(this.connection.bind(this))}
        <small>
          Dependencies are structural, not execution order. Runtime readiness
          and unresolved dynamic impact require separate evidence.
        </small>
      </aside>
    );
  }
  private interface(id: string): React.ReactNode {
    for (const document of this.props.documents)
      for (const object of document.objects)
        if (object.id === id)
          return (
            <div>
              <button onClick={this.props.onSelect.bind(null, id)}>
                Inspect {object.name}
              </button>
              <p>{object.purpose}</p>
              <pre>{this.details(object)}</pre>
            </div>
          );
    return <p>Interface evidence unresolved: {id}</p>;
  }
  private details(object: Record<string, unknown>): string {
    return JSON.stringify(
      {
        version: object.version,
        operations: object.operations,
        sourceBindings: object.sourceBindings,
      },
      null,
      2,
    );
  }
  private connection(edge: Connector): React.ReactNode {
    return (
      <section key={edge.id}>
        <b>
          {edge.category} · {edge.relationships.length} relationships
        </b>
        {edge.relationships.map(this.relationship.bind(this))}
      </section>
    );
  }
  private relationship(
    edge: Connector["relationships"][number],
  ): React.ReactNode {
    return (
      <div key={edge.id} className="boundary-relationship">
        <button onClick={this.props.onSelect.bind(null, edge.from)}>
          {edge.from}
        </button>
        <span> → </span>
        <button onClick={this.props.onSelect.bind(null, edge.to)}>
          {edge.to}
        </button>
        <small>{edge.provenance.join("; ")}</small>
      </div>
    );
  }
  private attached(port: Port | undefined, edge: Connector): boolean {
    return edge.sourcePort === port?.id || edge.targetPort === port?.id;
  }
  private matches(item: { id: string }): boolean {
    return item.id === this.props.id;
  }
}
