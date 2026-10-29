import { Component } from "react";
interface Props {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}
export class Dialog extends Component<Props> {
  render(): React.ReactNode {
    return (
      <div className="modal-scrim">
        <section
          role="dialog"
          aria-modal="true"
          aria-label={this.props.title}
          className="modal"
        >
          <div className="dock-heading">
            <h2>{this.props.title}</h2>
            <span className="grow" />
            <button onClick={this.props.onClose} aria-label="Close dialog">
              ×
            </button>
          </div>
          {this.props.children}
        </section>
      </div>
    );
  }
}
