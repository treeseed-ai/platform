import { Component } from "react";
interface ToolbarProps {
  busy: boolean;
  flow: boolean;
  context: React.ReactNode;
  onArrange: () => void;
  onUndo: () => void;
  onSave: () => void;
  onFit: () => void;
  onFocus: () => void;
  onFlowOverview: () => void;
}
export class CellToolbar extends Component<ToolbarProps> {
  render(): React.ReactNode {
    const p = this.props;
    return (
      <div className="graph-tools">
        <button disabled={p.busy} onClick={p.onArrange}>
          Arrange by connections
        </button>
        <button disabled={p.busy} onClick={p.onUndo}>
          Undo layout
        </button>
        <button disabled={p.busy} onClick={p.onSave}>
          Save layout
        </button>
        <button onClick={p.onFit}>Fit map</button>
        <button onClick={p.onFocus}>Focus selection</button>
        {p.flow && <button onClick={p.onFlowOverview}>Flow overview</button>}
        {p.busy && <span>Routing…</span>}
        {p.context}
      </div>
    );
  }
}
interface BreadcrumbProps {
  project: string;
  selected: string;
  onPortfolio: () => void;
}
export class CellBreadcrumbs extends Component<BreadcrumbProps> {
  render(): React.ReactNode {
    const { project, selected, onPortfolio } = this.props;
    return (
      <nav className="cell-breadcrumbs" aria-label="Architecture location">
        <button onClick={onPortfolio}>Portfolio</button>
        {project !== "*" && <span> / {project.replace("project.", "")}</span>}
        {selected && <span> / {selected}</span>}
      </nav>
    );
  }
}
