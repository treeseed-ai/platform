import { Component } from "react";
import type { ArchitectureObject, Blueprint } from "../../model/types.js";
interface Props {
  documents: Blueprint[];
  query: string;
  onReveal: (id: string) => void;
}
export class CellSearch extends Component<Props> {
  render(): React.ReactNode {
    if (!this.props.query.trim()) return null;
    const matches = this.matches();
    return (
      <aside className="cell-search" aria-label="Architecture search results">
        <b>{matches.length} matching subjects</b>
        <p>
          Unmatched cells are dimmed; connections and positions are retained.
        </p>
        {matches.slice(0, 30).map(this.result.bind(this))}
      </aside>
    );
  }
  private matches(): ArchitectureObject[] {
    const result: ArchitectureObject[] = [];
    for (const document of this.props.documents)
      for (const object of document.objects)
        if (
          (object.name + " " + object.id)
            .toLowerCase()
            .includes(this.props.query.toLowerCase())
        )
          result.push(object);
    return result;
  }
  private result(object: ArchitectureObject): React.ReactNode {
    return (
      <button
        key={object.id}
        onClick={this.props.onReveal.bind(null, object.id)}
      >
        <b>{object.name}</b>
        <small>
          {object.kind} · {object.id}
        </small>
      </button>
    );
  }
}
