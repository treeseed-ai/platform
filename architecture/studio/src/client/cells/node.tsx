import { Component } from "react";
import type { Node, NodeProps } from "@xyflow/react";
import type {
  CellGeometry,
  PortGeometry,
  ProviderCard,
} from "../../scene/contracts.js";
import { BoundaryPort } from "./port.js";
export type CellNode = Node<{
  zoom: number;
  cell: CellGeometry;
  ports: PortGeometry[];
  selected: string;
  changed: Set<string>;
  impacted: Set<string>;
  dimmed: boolean;
  ghost: boolean;
  onEnter: (id: string) => void;
  onExpand: (id: string) => void;
  onSelect: (id: string) => void;
  onPort: (id: string) => void;
}>;
export class DigitalCell extends Component<NodeProps<CellNode>> {
  private classes(): string {
    const { cell, selected, dimmed, ghost } = this.props.data;
    return [
      "digital-cell",
      this.props.data.zoom < 0.45 ? "zoom-far" : "",
      cell.kind + "-cell",
      cell.object?.componentKind === "plugin" ? "plugin-cell" : "",
      selected === cell.subject ? "chosen" : "",
      cell.external ? "external-cell" : "",
      dimmed ? "dimmed" : "",
      ghost ? "ghost" : "",
    ].join(" ");
  }
  private style(): React.CSSProperties {
    const { cell } = this.props.data;
    return {
      "--screen-font": Math.min(64, 14 / this.props.data.zoom) + "px",
      width: cell.width,
      height: cell.height,
      "--connectivity": Math.min(
        0.55,
        0.12 + Math.log2(cell.peers + 1) * 0.065,
      ),
    } as React.CSSProperties;
  }
  render(): React.ReactNode {
    return (
      <article className={this.classes()} style={this.style()}>
        {this.header()}
        {this.badges()}
        {this.actions()}
        {this.ports()}
        {this.providers()}
      </article>
    );
  }
  private header(): React.ReactNode {
    const { cell, changed } = this.props.data;
    return (
      <header className="cell-header">
        <span className="cell-type">
          {cell.external ? "NEIGHBOR / " : ""}
          {String(cell.object?.componentKind || cell.kind)}
        </span>
        <strong title={cell.purpose}>{cell.name}</strong>
        <small className="cell-purpose" title={cell.purpose}>
          {cell.purpose}
        </small>
        <span
          className="cell-degree"
          title="Distinct connected architectural peers"
        >
          {cell.peers} links
        </span>
      </header>
    );
  }
  private badges(): React.ReactNode {
    const { cell, changed } = this.props.data;
    return (
      <div className="cell-badges">
        {this.props.data.impacted.has(cell.subject) && (
          <span className="cell-impact">⚡ Contract impact</span>
        )}{" "}
        {changed.has(cell.subject) && (
          <span className="cell-impact">△ Intent differs</span>
        )}
        {cell.unresolved && (
          <span className="cell-problem">Unresolved endpoint</span>
        )}
        {cell.kind === "project" && (
          <small>
            {cell.pluginCount} plugins · {cell.providerCount} providers
          </small>
        )}
      </div>
    );
  }
  private actions(): React.ReactNode {
    const { cell, ghost } = this.props.data;
    if (cell.kind === "project")
      return (
        <button
          className="cell-action nodrag"
          onClick={this.enter.bind(this)}
          aria-label={"Enter project " + cell.name}
        >
          Enter project ↗
        </button>
      );
    return cell.providerCount ? this.expansionAction() : null;
  }
  private expansionAction(): React.ReactNode {
    const { cell, ghost } = this.props.data;
    return (
      <button
        className="cell-action nodrag"
        onClick={this.expand.bind(this)}
        aria-label={
          (cell.expanded ? "Collapse plugin " : "Expand plugin ") + cell.name
        }
      >
        {cell.expanded ? "−" : "+"} {cell.providerCount} provider
        {cell.providerCount === 1 ? "" : "s"}
        {ghost ? " · removed" : ""}
      </button>
    );
  }
  private ports(): React.ReactNode {
    return this.props.data.ports.map(this.port.bind(this));
  }
  private port(port: PortGeometry): React.ReactNode {
    return (
      <BoundaryPort
        key={port.id}
        port={port}
        onInspect={this.props.data.onPort}
        changed={this.props.data.changed.has(port.interface)}
      />
    );
  }
  private providers(): React.ReactNode {
    const { cell } = this.props.data;
    if (!cell.expanded) return null;
    return (
      <div className="cell-inhabitants">
        {cell.providers.map(this.provider.bind(this))}
      </div>
    );
  }
  private provider(card: ProviderCard): React.ReactNode {
    return (
      <button
        key={card.subject}
        className="provider-card nodrag"
        onClick={this.providerSelect.bind(this, card.subject)}
      >
        <b>{card.name}</b>
        <small>
          Contract {card.contractVersion} · {card.replacement}
        </small>
        <small>
          {card.selection} · registered {String(card.registered)}
        </small>
        <small>Readiness {card.readiness}</small>
      </button>
    );
  }
  private providerSelect(id: string, event: React.MouseEvent): void {
    event.stopPropagation();
    this.props.data.onSelect(id);
  }
  private enter(event: React.MouseEvent): void {
    event.stopPropagation();
    this.props.data.onEnter(this.props.data.cell.subject);
  }
  private expand(event: React.MouseEvent): void {
    event.stopPropagation();
    this.props.data.onExpand(this.props.data.cell.subject);
  }
}
