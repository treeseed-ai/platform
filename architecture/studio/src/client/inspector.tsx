import { Component } from "react";
import { Data, type ArchitectureObject, type Finding } from "../model/types.js";
import { ObjectCatalog } from "./catalog.js";

interface Props {
  object?: ArchitectureObject;
  findings: Finding[];
  onChange: (field: string, value: unknown) => void;
  onSource: () => void;
  onYaml: () => void;
  onAccept: () => void;
  onDelete: () => void;
  onConnect: () => void;
}
class PropertyField extends Component<
  {
    name: string;
    value: unknown;
    onChange: (field: string, value: unknown) => void;
  },
  { text: string; error: string }
> {
  state = { text: this.display(), error: "" };
  private display(): string {
    return typeof this.props.value === "string"
      ? this.props.value
      : JSON.stringify(this.props.value, null, 2);
  }
  componentDidUpdate(
    previous: Readonly<{ name: string; value: unknown }>,
  ): void {
    if (previous.value !== this.props.value)
      this.setState({ text: this.display(), error: "" });
  }
  private change(event: React.ChangeEvent<HTMLTextAreaElement>): void {
    this.setState({ text: event.target.value });
  }
  private apply(): void {
    try {
      this.props.onChange(
        this.props.name,
        typeof this.props.value === "string"
          ? this.state.text
          : JSON.parse(this.state.text),
      );
      this.setState({ error: "" });
    } catch (error) {
      this.setState({ error: String(error) });
    }
  }
  render(): React.ReactNode {
    return <label className="property-field">{this.props.name}<textarea value={this.state.text} rows={typeof this.props.value === 'object' ? 5 : 2} onChange={this.change.bind(this)} onBlur={this.apply.bind(this)}/>{this.state.error && <span className="error">{this.state.error}</span>}</label>;
  }
}
export class Inspector extends Component<Props> {
  render(): React.ReactNode {
    const object = this.props.object;
    if (!object) return <aside className="inspector"><h3>Object inspector</h3><p>Select an object to inspect its intent and source.</p></aside>;
    return <aside className="inspector">{this.identity(object)}{this.impactPanel()}{this.actions(object)}{Object.entries(object).map(this.field.bind(this))}{this.reviewActions()}</aside>;
  }
  private identity(object: ArchitectureObject): React.ReactNode {
    return <><div className="eyebrow">{object.kind} inspector</div><h2>{object.name}</h2><code className="object-id">{object.id}</code><div className="help"><strong>ⓘ What is a {object.kind}?</strong><p>{ObjectCatalog.help[object.kind]}</p></div></>;
  }
  private impactPanel(): React.ReactNode {
    if (!this.props.findings.length) return null;
    return <div className="impact">△ {this.props.findings.length} differences<br/>Known impact: {new Set(this.props.findings.flatMap(Inspector.impact)).size} objects<br/><small>Dynamic dependencies may be unresolved.</small></div>;
  }
  private actions(object: ArchitectureObject): React.ReactNode {
    return <div className="inspector-actions"><button onClick={this.props.onYaml}>Edit YAML</button><button onClick={this.props.onSource}>Source bindings ({Data.list(object.sourceBindings).length})</button><button onClick={this.props.onConnect}>Connect…</button></div>;
  }
  private reviewActions(): React.ReactNode {
    return <div className="inspector-actions"><button onClick={this.props.onAccept}>Accept intent</button><button className="danger" onClick={this.props.onDelete}>Delete object</button></div>;
  }
  private field([name, value]: [string, unknown]): React.ReactNode {
    if (["id", "kind", "sourceBindings"].includes(name)) return null;
    return (
      <PropertyField
        key={name}
        name={name}
        value={value}
        onChange={this.props.onChange}
      />
    );
  }
  private static impact(finding: Finding): string[] {
    return finding.impact;
  }
}
