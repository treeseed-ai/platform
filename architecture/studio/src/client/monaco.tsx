import { Component, createRef } from "react";
import * as monaco from "monaco-editor/editor/editor.api";
import EditorWorker from "monaco-editor/editor/editor.worker?worker";
import "monaco-editor/languages/definitions/yaml/register";
import "monaco-editor/languages/definitions/typescript/register";

class EditorEnvironment {
  static getWorker(): Worker {
    return new EditorWorker();
  }
}
Object.assign(globalThis, {
  MonacoEnvironment: { getWorker: EditorEnvironment.getWorker },
});
interface Props {
  value: string;
  language?: string;
  readOnly?: boolean;
  line?: number;
  onChange?: (value: string) => void;
}
export class CodeEditor extends Component<Props> {
  private host = createRef<HTMLDivElement>();
  private editor?: monaco.editor.IStandaloneCodeEditor;
  componentDidMount(): void {
    this.editor = monaco.editor.create(this.host.current!, {
      value: this.props.value,
      language: this.props.language || "yaml",
      theme: "vs-dark",
      readOnly: this.props.readOnly,
      automaticLayout: true,
      minimap: { enabled: false },
      fontSize: 12,
      scrollBeyondLastLine: false,
    });
    this.editor.onDidChangeModelContent(this.changed.bind(this));
    this.reveal();
  }
  componentDidUpdate(previous: Props): void {
    if (
      previous.value !== this.props.value &&
      this.editor?.getValue() !== this.props.value
    )
      this.editor?.setValue(this.props.value);
    if (
      previous.line !== this.props.line ||
      previous.value !== this.props.value
    )
      this.reveal();
  }
  componentWillUnmount(): void {
    this.editor?.getModel()?.dispose();
    this.editor?.dispose();
  }
  private reveal(): void {
    if (!this.props.line) return;
    this.editor?.setPosition({ lineNumber: this.props.line, column: 1 });
    this.editor?.revealLineInCenter(this.props.line);
  }
  private changed(): void {
    this.props.onChange?.(this.editor?.getValue() || "");
  }
  render(): React.ReactNode {
    return <div className="code-editor" ref={this.host} />;
  }
}
