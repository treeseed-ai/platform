import { Component } from "react";
import { ObjectCatalog } from "./catalog.js";
import type { Repository } from "../model/types.js";
interface Props {
  repositories: Repository[];
  project: string;
  view: string;
  query: string;
  onProject: (value: string) => void;
  onView: (value: string) => void;
  onQuery: (value: string) => void;
  onCreate: (kind: string) => void;
}
export class Sidebar extends Component<Props> {
  private create(kind: string): void {
    this.props.onCreate(kind);
  }
  private drag(kind: string, event: React.DragEvent): void {
    event.dataTransfer.setData("studio/kind", kind);
  }
  private palette(kind: string): React.ReactNode {
    return (
      <button
        className="palette-item"
        key={kind}
        draggable
        onDragStart={this.drag.bind(this, kind)}
        onClick={this.create.bind(this, kind)}
      >
        <span>{ObjectCatalog.icons[kind]}</span>
        {kind}
      </button>
    );
  }
  private view(view: string): React.ReactNode {
    return (
      <button
        key={view}
        className={"view-button " + (view === this.props.view ? "active" : "")}
        onClick={this.props.onView.bind(null, view)}
      >
        {view}
      </button>
    );
  }
  private repository(repository: Repository): React.ReactNode {
    return (
      <option key={repository.project} value={repository.project}>
        {repository.project.replace("project.", "")}
      </option>
    );
  }
  private projectChanged(event: React.ChangeEvent<HTMLSelectElement>): void {
    this.props.onProject(event.target.value);
  }
  private queryChanged(event: React.ChangeEvent<HTMLInputElement>): void {
    this.props.onQuery(event.target.value);
  }
  render(): React.ReactNode {
    return <aside className="sidebar"><input aria-label="Find architectural objects" placeholder="⌕ Find an object…" value={this.props.query} onChange={this.queryChanged.bind(this)}/><h3>Create</h3><div className="palette">{ObjectCatalog.kinds.map(this.palette.bind(this))}</div><h3>Views</h3>{['Portfolio','Integration seams','Components','Flows'].map(this.view.bind(this))}{this.projects()}<p className="muted small">Drag or click to create. Edits change intent only.</p></aside>;
  }
  private projects(): React.ReactNode {
    return <><h3>Owning project</h3><select aria-label="Owning project" value={this.props.project} onChange={this.projectChanged.bind(this)}><option value="*">All projects</option>{this.props.repositories.map(this.repository)}</select></>;
  }
}
