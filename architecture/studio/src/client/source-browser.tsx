import { Component } from "react";
import {
  Data,
  type Binding,
  type Declaration,
  type Repository,
} from "../model/types.js";
import type { ApiClient } from "./api.js";
import { CodeEditor } from "./monaco.js";
interface Props {
  api: ApiClient;
  repositories: Repository[];
  binding?: Binding;
  onBinding: (binding: Binding) => void;
}
interface State {
  project: string;
  paths: string[];
  path: string;
  text: string;
  declarations: Declaration[];
  error: string;
}
export class SourceBrowser extends Component<Props, State> {
  state: State = {
    project: this.props.binding?.project || this.props.repositories[0].project,
    paths: [],
    path: "",
    text: "Choose a pinned source file.",
    declarations: [],
    error: "",
  };
  componentDidMount(): void {
    void this.load();
  }
  private async load(): Promise<void> {
    try {
      const result = await this.props.api.call<{ files: { path: string }[] }>(
        "inventory",
        { project: this.state.project },
      );
      this.setState({ paths: result.files.map(SourceBrowser.path), error: "" });
      if (this.props.binding?.project === this.state.project)
        await this.open(this.props.binding.path);
    } catch (error) {
      this.setState({ error: String(error) });
    }
  }
  private static path(file: { path: string }): string {
    return file.path;
  }
  private project(event: React.ChangeEvent<HTMLSelectElement>): void {
    this.setState(
      { project: event.target.value, path: "", declarations: [] },
      this.load.bind(this),
    );
  }
  private file(event: React.ChangeEvent<HTMLSelectElement>): void {
    void this.open(event.target.value);
  }
  private async open(path: string): Promise<void> {
    try {
      const repository = this.props.repositories.find(this.matches.bind(this))!;
      const binding = this.binding(repository, path);
      const view = await this.props.api.call<{
        text: string;
        declarations: Declaration[];
      }>("source", { binding });
      this.loaded(path, view);
      this.props.onBinding(this.resolvedBinding(binding, view.declarations));
    } catch (error) {
      this.setState({ error: String(error) });
    }
  }
  private resolvedBinding(
    binding: Binding,
    declarations: Declaration[],
  ): Binding {
    if (!binding.symbol) return binding;
    const matches = declarations.filter(
      SourceBrowser.symbol.bind(null, binding.symbol),
    );
    if (matches.length !== 1) return binding;
    const { start, end, fingerprint } = matches[0];
    return { ...binding, start, end, fingerprint };
  }
  private static symbol(symbol: string, declaration: Declaration): boolean {
    return declaration.symbol === symbol;
  }
  private binding(repository: Repository, path: string): Binding {
    if (
      this.props.binding?.path === path &&
      this.props.binding.project === repository.project
    )
      return this.props.binding;
    return { project: repository.project, revision: repository.revision, path };
  }
  private loaded(
    path: string,
    view: { text: string; declarations: Declaration[] },
  ): void {
    this.setState({
      path,
      text: view.text,
      declarations: view.declarations,
      error: "",
    });
  }
  private matches(repository: Repository): boolean {
    return repository.project === this.state.project;
  }
  private declaration(event: React.ChangeEvent<HTMLSelectElement>): void {
    const selected = this.state.declarations[Number(event.target.value)];
    if (!selected) return;
    const repository = this.props.repositories.find(this.matches.bind(this))!;
    const { symbol, start, end, fingerprint } = selected;
    this.props.onBinding({
      project: repository.project,
      revision: repository.revision,
      path: this.state.path,
      symbol,
      start,
      end,
      fingerprint,
    });
    this.setState({ text: this.state.text });
  }
  private projectOption(repository: Repository): React.ReactNode {
    return <option key={repository.project}>{repository.project}</option>;
  }
  private pathOption(path: string): React.ReactNode {
    return <option key={path}>{path}</option>;
  }
  private symbolOption(item: Declaration, index: number): React.ReactNode {
    return (
      <option key={index} value={index}>
        {item.kind} · {item.symbol} · L{item.start}–{item.end}
      </option>
    );
  }
  private controls(): React.ReactNode {
    return (
      <div className="dock-actions">
        <select
          aria-label="Source project"
          value={this.state.project}
          onChange={this.project.bind(this)}
        >
          {this.props.repositories.map(this.projectOption)}
        </select>
        <select
          aria-label="Source file"
          value={this.state.path}
          onChange={this.file.bind(this)}
        >
          <option value="">Choose file…</option>
          {this.state.paths.map(this.pathOption)}
        </select>
        <select
          aria-label="Source declaration"
          onChange={this.declaration.bind(this)}
        >
          <option value="">Choose symbol for feedback…</option>
          {this.state.declarations.map(this.symbolOption)}
        </select>
      </div>
    );
  }
  render(): React.ReactNode {
    return (
      <div className="source-browser">
        {this.controls()}
        <small>
          {this.props.binding?.revision} ·{" "}
          {this.props.binding?.symbol || "Read-only pinned file"} ·{" "}
          {this.state.error}
        </small>
        <CodeEditor
          line={this.props.binding?.start}
          value={this.state.text}
          language="typescript"
          readOnly
        />
      </div>
    );
  }
}
