import { Component } from "react";
import { Data, type Finding, type Diagnostic } from "../model/types.js";
import { CodeEditor } from "./monaco.js";

interface Props {
  mode: string;
  findings: Finding[];
  diagnostics: Diagnostic[];
  selected: string;
  yaml: string;
  source: string;
  onSelect: (id: string) => void;
  onYaml: (value: string) => void;
  onApply: () => void;
  onClose: () => void;
}
export class ReviewDock extends Component<Props> {
  private finding(finding: Finding): React.ReactNode {
    return (
      <button
        key={finding.id}
        onClick={this.props.onSelect.bind(null, finding.subject)}
        className="finding"
      >
        <span className="amber">△</span> {finding.subject}
        <small>
          {finding.category} · {finding.field}
        </small>
      </button>
    );
  }
  private diagnostic(item: Diagnostic, index: number): React.ReactNode {
    return (
      <div className={"diagnostic " + item.status} key={index}>
        <b>{item.code}</b> <span>{item.subject}</span>
        <p>{item.message}</p>
      </div>
    );
  }
  private difference(): React.ReactNode {
    const findings = this.props.findings.filter(this.selected.bind(this));
    return (
      <div className="comparison">
        <div className="findings">
          {this.props.findings.map(this.finding.bind(this))}
        </div>
        <div className="diff-pair">
          <div>
            <h4>Implementation · read only</h4>
            <CodeEditor
              value={JSON.stringify(findings.map(ReviewDock.before), null, 2)}
              readOnly
            />
          </div>
          <div>
            <h4>
              Intent ·{" "}
              {findings.some(ReviewDock.accepted) ? "reviewed" : "proposed"}
            </h4>
            <CodeEditor
              value={JSON.stringify(findings.map(ReviewDock.after), null, 2)}
              readOnly
            />
          </div>
        </div>
      </div>
    );
  }
  private selected(item: Finding): boolean {
    return item.subject === this.props.selected;
  }
  private static accepted(item: Finding): boolean {
    return item.accepted;
  }
  private static before(item: Finding): unknown {
    return { field: item.field, value: item.before ?? "(not observed)" };
  }
  private static after(item: Finding): unknown {
    return { field: item.field, value: item.after ?? "(unspecified)" };
  }
  private content(): React.ReactNode {
    if (this.props.mode === "Compare") return this.difference();
    if (this.props.mode === "YAML")
      return (
        <>
          <div className="dock-actions">
            <span>Intent YAML · invalid text stays here until corrected</span>
            <button onClick={this.props.onApply}>Apply YAML to draft</button>
          </div>
          <CodeEditor value={this.props.yaml} onChange={this.props.onYaml} />
        </>
      );
    if (this.props.mode === "Validation results")
      return (
        <div className="diagnostics">
          {this.props.diagnostics.map(this.diagnostic)}
        </div>
      );
    return (
      <CodeEditor
        value={
          this.props.source ||
          "Select an object with source bindings to inspect its pinned source."
        }
        language="typescript"
        readOnly
      />
    );
  }
  render(): React.ReactNode {
    return (
      <section className="review-dock">
        <div className="dock-heading">
          <strong>{this.props.mode}</strong>
          <span className="muted">
            Pinned observations → architectural intent
          </span>
          <span className="grow" />
          <button aria-label="Close review panel" onClick={this.props.onClose}>
            ×
          </button>
        </div>
        {this.content()}
      </section>
    );
  }
}
