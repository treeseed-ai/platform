import { Component, createRef } from "react";
import * as monaco from "monaco-editor/editor/editor.api";
interface Props {
  before: string;
  after: string;
}
export class DiffEditor extends Component<Props> {
  private host = createRef<HTMLDivElement>();
  private editor?: monaco.editor.IStandaloneDiffEditor;
  componentDidMount(): void {
    this.editor = monaco.editor.createDiffEditor(this.host.current!, {
      theme: "vs-dark",
      readOnly: true,
      automaticLayout: true,
      renderSideBySide: true,
      minimap: { enabled: false },
      fontSize: 12,
    });
    this.editor.setModel({
      original: monaco.editor.createModel(this.props.before, "yaml"),
      modified: monaco.editor.createModel(this.props.after, "yaml"),
    });
  }
  componentDidUpdate(): void {
    const model = this.editor?.getModel();
    if (model?.original.getValue() !== this.props.before)
      model?.original.setValue(this.props.before);
    if (model?.modified.getValue() !== this.props.after)
      model?.modified.setValue(this.props.after);
  }
  componentWillUnmount(): void {
    const model = this.editor?.getModel();
    model?.original.dispose();
    model?.modified.dispose();
    this.editor?.dispose();
  }
  render(): React.ReactNode {
    return (
      <div
        className="code-editor"
        aria-label="Implementation to intent textual diff"
        ref={this.host}
      />
    );
  }
}
