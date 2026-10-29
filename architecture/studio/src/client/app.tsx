import type { LayoutDocument } from "../scene/contracts.js";
import { Component } from "react";
import {
  Data,
  type Blueprint,
  type Finding,
  type Diagnostic,
  type Binding,
  type Pattern,
  type Workspace,
  type ArchitectureObject,
  type Relationship,
} from "../model/types.js";
import { DraftStore } from "./store.js";
import { ObjectCatalog } from "./catalog.js";
import { Sidebar } from "./sidebar.js";
import { GraphCanvas } from "./graph.js";
import { Inspector } from "./inspector.js";
import { ReviewDock } from "./dock.js";
import { Dialog } from "./dialog.js";
import { SourceBrowser } from "./source-browser.js";
import { CodeEditor } from "./monaco.js";

interface State {
  ready: boolean;
  layer: "intent" | "implementation";
  selected: string;
  project: string;
  view: string;
  query: string;
  dock: string;
  findings: Finding[];
  diagnostics: Diagnostic[];
  yaml: string;
  yamlPath: string;
  source: string;
  error: string;
  message: string;
  busy: boolean;
  dialog: string;
  dialogText: string;
  positions: Record<string, { x: number; y: number }>;
  viewport?: { x: number; y: number; zoom: number };
  binding?: Binding;
  assessment: "useful" | "avoid";
  target: string;
  relation: string;
  refreshId: string;
  migration?: Record<string, unknown>;
}
export class StudioApp extends Component<object, State> {
  private store = new DraftStore();
  state: State = {
    ready: false,
    layer: "intent",
    selected: "",
    project: "*",
    view: "Portfolio",
    query: "",
    dock: "",
    findings: [],
    diagnostics: [],
    yaml: "",
    yamlPath: "",
    source: "",
    error: "",
    message: "",
    busy: false,
    dialog: "",
    dialogText: "",
    positions: {},
    assessment: "useful",
    target: "",
    relation: "requires",
    refreshId: "",
  };
  componentDidMount(): void {
    void this.load();
  }
  private async load(): Promise<void> {
    try {
      await this.store.load();
      this.setState({
        ready: true,
        positions: this.layout(),
        viewport: this.savedViewport(),
        selected: "",
      });
      await this.compare();
    } catch (error) {
      this.failure(error);
    }
  }
  private static initial(object: { id: string; kind: string }): boolean {
    return object.id === "agent.composition.execution";
  }
  private layout(): State["positions"] {
    const text = this.store.state.auxiliary.layout.text;
    return text ? JSON.parse(text).positions || {} : {};
  }
  private savedViewport(): State["viewport"] {
    const text = this.store.state.auxiliary.layout.text;
    return text ? JSON.parse(text).viewport : undefined;
  }
  private viewport(viewport: State["viewport"]): void {
    this.setState({ viewport });
  }
  private failure(error: unknown): void {
    this.setState({
      error: String(error).replace(/^Error: /, ""),
      busy: false,
    });
  }
  private async compare(): Promise<void> {
    this.setState({
      findings: await this.store.api.call<Finding[]>("compare", {
        drafts: this.store.drafts(),
      }),
    });
  }
  private changed(): void {
    this.forceUpdate();
    void this.compare().catch(this.failure.bind(this));
  }
  private select(id: string): void {
    this.setState({ selected: id });
  }
  private project(project: string): void {
    this.setState({ project, view: project === "*" ? "Portfolio" : "Components" });
  }
  private view(view: string): void {
    this.setState({
      view,
      project: view === "Portfolio" ? "*" : this.state.project,
    });
  }
  private query(query: string): void {
    this.setState({ query });
  }
  private create(kind: string): void {
    if (this.state.layer === "implementation") {
      this.failure(new Error("Switch to intent to design"));
      return;
    }
    try {
      const project =
        this.state.project === "*" ? "project.agent" : this.state.project;
      const object = ObjectCatalog.create(kind, project);
      this.store.add(object, project);
      this.setState({
        selected: object.id,
        message:
          "Created draft. Resolve unassigned references before acceptance.",
      });
      this.changed();
    } catch (error) {
      this.failure(error);
    }
  }
  private update(field: string, value: unknown): void {
    if (this.state.layer === "implementation") return;
    this.store.update(this.state.selected, field, value);
    this.changed();
  }
  private connect(from: string, to: string, kind: string): void {
    if (this.state.layer === "implementation") return;
    this.store.connect(from, to, kind);
    this.changed();
  }
  private disconnect(edge: Relationship): void {
    this.store.disconnect(edge);
    this.changed();
  }
  private connections(): Relationship[] {
    const result: Relationship[] = [];
    for (const model of this.documents())
      for (const edge of model.relationships ?? [])
        if (edge.from === this.state.selected) result.push(edge);
    return result;
  }
  private move(id: string, position: { x: number; y: number }): void {
    this.setState({ positions: { ...this.state.positions, [id]: position } });
  }
  private undo(): void {
    this.store.undo();
    this.changed();
  }
  private redo(): void {
    this.store.redo();
    this.changed();
  }
  private remove(): void {
    this.store.remove(this.state.selected);
    this.setState({ selected: "" });
    this.changed();
  }
  private accept(): void {
    this.store.accept(this.state.selected);
    this.setState({
      message: "Acceptance recorded in the draft. Save to persist.",
    });
    this.changed();
  }
  private async save(): Promise<void> {
    this.setState({ busy: true, error: "" });
    try {
      await this.store.save();
      this.setState({
        busy: false,
        message: "Intent saved. Implementation unchanged.",
      });
      this.changed();
    } catch (error) {
      this.failure(error);
    }
  }
  private async validate(): Promise<void> {
    this.setState({ busy: true, error: "" });
    try {
      const diagnostics = await this.store.api.call<Diagnostic[]>("validate", {
        drafts: this.store.drafts(),
      });
      this.setState({ diagnostics, dock: "Validation results", busy: false });
    } catch (error) {
      this.failure(error);
    }
  }
  private async sourceValidate(): Promise<void> {
    this.setState({ busy: true, error: "" });
    try {
      const diagnostics =
        await this.store.api.call<Diagnostic[]>("validate-source");
      this.setState({ diagnostics, dock: "Validation results", busy: false });
    } catch (error) {
      this.failure(error);
    }
  }
  private async quality(): Promise<void> {
    this.setState({ busy: true, error: "" });
    try {
      const diagnostics = await this.store.api.call<Diagnostic[]>("quality", {
        project: this.state.project,
      });
      this.setState({ diagnostics, dock: "Validation results", busy: false });
    } catch (error) {
      this.failure(error);
    }
  }
  private yaml(): void {
    const document =
      this.store.document(this.state.selected) || this.store.documents()[0];
    this.setState({
      yaml: document.text,
      yamlPath: document.path,
      dock: "YAML",
    });
  }
  private yamlChanged(yaml: string): void {
    this.setState({ yaml });
  }
  private async applyYaml(): Promise<void> {
    try {
      await this.store.applyYaml(this.state.yamlPath, this.state.yaml);
      this.setState({ message: "YAML applied to intent draft", error: "" });
      this.changed();
    } catch (error) {
      this.failure(error);
    }
  }
  private async source(): Promise<void> {
    const binding = this.selectedObject()?.sourceBindings?.[0];
    this.setState({ dock: "Source review", binding });
  }
  private sourceBinding(binding: Binding): void {
    this.setState({ binding });
  }
  private sourceBrowser(): React.ReactNode {
    return (
      <SourceBrowser
        api={this.store.api}
        repositories={this.store.state.baseline.repositories}
        binding={this.state.binding}
        onBinding={this.sourceBinding.bind(this)}
      />
    );
  }
  private openDock(dock: string): void {
    this.setState({ dock });
  }
  private closeDock(): void {
    this.setState({ dock: "" });
  }
  private openConnection(): void {
    this.setState({ dialog: "Connect objects", target: "" });
  }
  private closeDialog(): void {
    this.setState({ dialog: "" });
  }
  private dialogText(event: React.ChangeEvent<HTMLTextAreaElement>): void {
    this.setState({ dialogText: event.target.value });
  }
  private target(event: React.ChangeEvent<HTMLSelectElement>): void {
    this.setState({ target: event.target.value });
  }
  private relation(event: React.ChangeEvent<HTMLSelectElement>): void {
    this.setState({ relation: event.target.value });
  }
  private connectSelected(): void {
    this.connect(this.state.selected, this.state.target, this.state.relation);
    this.closeDialog();
  }
  private async mappings(): Promise<void> {
    try {
      const entries = await this.store.api.call("mappings-read");
      this.setState({
        dialog: "Source mappings",
        dialogText: JSON.stringify(
          { schemaVersion: "studio-mappings/0.1", entries },
          null,
          2,
        ),
      });
    } catch (error) {
      this.failure(error);
    }
  }
  private async saveMappings(): Promise<void> {
    try {
      await this.store.api.call("mappings", {
        expected: this.store.state.auxiliary.mappings.hash,
        data: JSON.parse(this.state.dialogText),
      });
      this.closeDialog();
      await this.reloadAuxiliary();
    } catch (error) {
      this.failure(error);
    }
  }
  private refresh(): void {
    if (this.store.dirty) {
      this.failure(new Error("Save intent before refreshing source snapshots"));
      return;
    }
    const revisions: Record<string, string> = {};
    for (const repository of this.store.state.baseline.repositories)
      revisions[repository.project] = repository.revision;
    this.setState({
      dialog: "Refresh source snapshots",
      dialogText: JSON.stringify(revisions, null, 2),
      refreshId: "",
    });
  }
  private async previewRefresh(): Promise<void> {
    this.setState({ busy: true });
    try {
      const result = await this.store.api.call<{ id: string; gaps: string[] }>(
        "refresh-preview",
        { revisions: JSON.parse(this.state.dialogText) },
      );
      this.setState({
        refreshId: result.id,
        dialogText: JSON.stringify(result, null, 2),
        busy: false,
      });
    } catch (error) {
      this.failure(error);
    }
  }
  private async publishRefresh(): Promise<void> {
    try {
      await this.store.api.call("refresh-publish", {
        id: this.state.refreshId,
      });
      this.closeDialog();
      await this.load();
      this.setState({
        message: "Snapshot published. Historical baseline retained.",
      });
    } catch (error) {
      this.failure(error);
    }
  }
  private async reloadAuxiliary(): Promise<void> {
    const state = await this.store.api.call<Workspace>("workspace");
    this.store.state.auxiliary = state.auxiliary;
    this.forceUpdate();
  }
  private patterns(): void {
    const text = this.store.state.auxiliary.patterns.text;
    this.setState({
      dialog: "Review pattern guidance",
      dialogText:
        text ||
        JSON.stringify(
          { schemaVersion: "studio-patterns/0.1", entries: [] },
          null,
          2,
        ),
    });
  }
  private async reviewPatterns(): Promise<void> {
    try {
      await this.store.api.call("patterns", {
        expected: this.store.state.auxiliary.patterns.hash,
        data: JSON.parse(this.state.dialogText),
      });
      await this.reloadAuxiliary();
      this.closeDialog();
    } catch (error) {
      this.failure(error);
    }
  }
  private pattern(): void {
    if (!this.state.binding?.fingerprint) {
      this.setState({
        error: "Select a pinned declaration before recording feedback.",
      });
      return;
    }
    this.setState({
      dialog: "Pattern feedback",
      dialogText: "",
      assessment: "useful",
    });
  }
  private assessment(event: React.ChangeEvent<HTMLSelectElement>): void {
    this.setState({ assessment: event.target.value as State["assessment"] });
  }
  private async savePattern(): Promise<void> {
    try {
      if (!this.state.dialogText.trim())
        throw new Error("Explain the pattern rationale");
      const existing = this.store.state.auxiliary.patterns.text;
      const entries: Pattern[] = existing ? JSON.parse(existing).entries : [];
      entries.push(this.patternEntry());
      await this.store.api.call("patterns", {
        expected: this.store.state.auxiliary.patterns.hash,
        data: { schemaVersion: "studio-patterns/0.1", entries },
      });
      this.closeDialog();
      await this.reloadAuxiliary();
    } catch (error) {
      this.failure(error);
    }
  }
  private patternEntry(): Pattern {
    return {
      id: crypto.randomUUID(),
      binding: this.state.binding!,
      assessment: this.state.assessment,
      rationale: this.state.dialogText,
      applicability: [this.state.selected],
      review: "proposed",
    };
  }
  private async migration(): Promise<void> {
    try {
      const findings = await this.store.api.call<Finding[]>("compare", {
        drafts: this.store.drafts(),
      });
      const selected = findings
        .filter(this.selectedFinding.bind(this))
        .map(StudioApp.findingId);
      const migration = await this.store.api.call<Record<string, unknown>>(
        "migration",
        { selected, drafts: this.store.drafts() },
      );
      this.setState({ dialog: "Migration package", migration });
    } catch (error) {
      this.failure(error);
    }
  }
  private selectedFinding(finding: Finding): boolean {
    return !this.state.selected || finding.subject === this.state.selected;
  }
  private static findingId(finding: Finding): string {
    return finding.id;
  }
  private download(name: string, text: string): void {
    const url = URL.createObjectURL(
      new Blob([text], { type: "application/octet-stream" }),
    );
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = name;
    anchor.click();
    URL.revokeObjectURL(url);
  }
  private exportManifest(): void {
    this.download(
      "manifest.json",
      JSON.stringify(this.state.migration?.manifest, null, 2),
    );
  }
  private exportInstructions(): void {
    this.download("MIGRATION.md", String(this.state.migration?.markdown));
  }
  private toggleLayer(): void {
    this.setState({
      layer: this.state.layer === "intent" ? "implementation" : "intent",
    });
  }
  private selectedObject(): ArchitectureObject | undefined {
    for (const model of this.documents())
      for (const object of model.objects)
        if (object.id === this.state.selected) return object;
    return undefined;
  }
  private documents(): Blueprint[] {
    const documents: Blueprint[] = [];
    for (const document of this.store.state.documents)
      if (document.model.view === this.state.layer)
        documents.push(document.model);
    return documents;
  }
  private static model(document: { model: Blueprint }): Blueprint {
    return document.model;
  }
  private static subject(finding: Finding): string {
    return finding.subject;
  }
  private matching(finding: Finding): boolean {
    return finding.subject === this.state.selected;
  }
  private option(object: { id: string; name: string }): React.ReactNode {
    return (
      <option key={object.id} value={object.id}>
        {object.name} · {object.id}
      </option>
    );
  }
  private relationOption(kind: string): React.ReactNode {
    return <option key={kind}>{kind}</option>;
  }
  private dialogContent(): React.ReactNode {
    if (this.state.dialog === "Connect objects") return this.connectionDialog();
    if (this.state.dialog === "Migration package")
      return this.migrationContent();
    return (
      <div className="dialog-body">
        {this.dialogDescription()}
        <textarea
          aria-label={this.state.dialog}
          rows={15}
          value={this.state.dialogText}
          onChange={this.dialogText.bind(this)}
        />
        {this.dialogAction()}
      </div>
    );
  }
  private connectionDialog(): React.ReactNode {
    return (
      <div className="dialog-body">
        <p>From: {this.state.selected}</p>
        {this.connectionFields()}
        <button
          disabled={!this.state.target}
          onClick={this.connectSelected.bind(this)}
        >
          Add relationship
        </button>
      </div>
    );
  }
  private static readonly relationshipKinds = [
    "requires",
    "provides",
    "implements",
    "owns",
    "calls",
    "emits",
    "depends-on",
  ];
  private connectionFields(): React.ReactNode {
    return (
      <>
        <select
          aria-label="Relationship kind"
          onChange={this.relation.bind(this)}
          value={this.state.relation}
        >
          {StudioApp.relationshipKinds.map(this.relationOption)}
        </select>
        <select
          aria-label="Target object"
          value={this.state.target}
          onChange={this.target.bind(this)}
        >
          <option value="">Choose target…</option>
          {this.store.objects().map(this.option)}
        </select>
      </>
    );
  }
  private dialogDescription(): React.ReactNode {
    if (this.state.dialog === "Pattern feedback")
      return this.patternDescription();
    if (this.state.dialog === "Source mappings")
      return (
        <p>Review source identity before changing a mapping to accepted.</p>
      );
    return (
      <p>
        Exact Git commits only.{" "}
        {this.state.refreshId
          ? "Inspect gaps before publication."
          : "Edit revisions, then extract a preview."}
      </p>
    );
  }
  private patternDescription(): React.ReactNode {
    return (
      <>
        <p>Guidance attached to exact bound source, not a mandatory rule.</p>
        <select
          value={this.state.assessment}
          onChange={this.assessment.bind(this)}
        >
          <option value="useful">Useful pattern</option>
          <option value="avoid">Avoid pattern</option>
        </select>
      </>
    );
  }
  private dialogAction(): React.ReactNode {
    if (this.state.dialog === "Review pattern guidance")
      return (
        <button onClick={this.reviewPatterns.bind(this)}>
          Save reviewed guidance
        </button>
      );
    if (this.state.dialog === "Pattern feedback")
      return (
        <button onClick={this.savePattern.bind(this)}>Save feedback</button>
      );
    if (this.state.dialog === "Source mappings")
      return (
        <button onClick={this.saveMappings.bind(this)}>Save mappings</button>
      );
    return (
      <button
        disabled={this.state.busy}
        onClick={
          this.state.refreshId
            ? this.publishRefresh.bind(this)
            : this.previewRefresh.bind(this)
        }
      >
        {this.state.refreshId ? "Publish snapshot" : "Extract preview"}
      </button>
    );
  }
  private migrationContent(): React.ReactNode {
    const manifest = Data.record(this.state.migration?.manifest);
    return (
      <div className="dialog-body">
        <p>
          Status: <strong>{String(manifest.status)}</strong> · accepted tasks
          and proposed changes remain separate.
        </p>
        <div className="toolbar">
          <button onClick={this.exportManifest.bind(this)}>
            Download manifest
          </button>
          <button onClick={this.exportInstructions.bind(this)}>
            Download instructions
          </button>
        </div>
        <pre>{JSON.stringify(manifest, null, 2)}</pre>
      </div>
    );
  }
  private header(): React.ReactNode {
    return (
      <>
        <header className="app-header">
          <span className="brand-icon">⌘</span>
          <strong>Architecture Studio</strong>
          <span className="workspace-name">TreeSeed / Cordis</span>
          <span className="grow" />
          {this.navigation()}
        </header>
        {this.commands()}
      </>
    );
  }
  private navigation(): React.ReactNode {
    return (
      <>
        <button onClick={this.closeDock.bind(this)}>Design</button>
        <button onClick={this.openDock.bind(this, "Compare")}>
          Compare <em>{this.state.findings.length}</em>
        </button>
        <button onClick={this.source.bind(this)}>Source review</button>
        <button aria-label="Validate" onClick={this.validate.bind(this)}>
          ✓ Validate
        </button>
        <button className="primary" onClick={this.migration.bind(this)}>
          ⬡ Migration package
        </button>
      </>
    );
  }
  private commands(): React.ReactNode {
    return (
      <div className="command-bar">
        {this.layerStatus()}
        <button onClick={this.toggleLayer.bind(this)}>
          {this.state.layer === "intent"
            ? "Inspect implementation"
            : "Edit intent"}
        </button>
        <button onClick={this.undo.bind(this)}>↶ Undo</button>
        <button onClick={this.redo.bind(this)}>↷ Redo</button>
        <button onClick={this.save.bind(this)} disabled={this.state.busy}>
          Save intent
        </button>
        <span className="grow" />
        {this.sourceCommands()}
      </div>
    );
  }
  private layerStatus(): React.ReactNode {
    return (
      <span className="pill">
        {this.state.layer} ·{" "}
        {this.state.layer === "implementation"
          ? "read only"
          : this.store.dirty
            ? "unsaved draft"
            : "saved"}
      </span>
    );
  }
  private sourceCommands(): React.ReactNode {
    return (
      <>
        <button onClick={this.mappings.bind(this)}>Mappings</button>
        <button onClick={this.refresh.bind(this)}>Refresh sources</button>
        <button onClick={this.sourceValidate.bind(this)}>Check bindings</button>
        <button onClick={this.quality.bind(this)}>Source quality</button>
        <button onClick={this.pattern.bind(this)}>Pattern feedback</button>
        <button onClick={this.patterns.bind(this)}>Review guidance</button>
      </>
    );
  }
  private workspace(): React.ReactNode {
    return (
      <main className="workspace">
        {this.sidebar()}
        <section className="canvas-column">
          {this.breadcrumbs()}
          {this.graph()}
        </section>
        {this.inspector()}
      </main>
    );
  }
  private sidebar(): React.ReactNode {
    return (
      <Sidebar
        repositories={this.store.state.baseline.repositories}
        project={this.state.project}
        view={this.state.view}
        query={this.state.query}
        onProject={this.project.bind(this)}
        onView={this.view.bind(this)}
        onQuery={this.query.bind(this)}
        onCreate={this.create.bind(this)}
      />
    );
  }
  private breadcrumbs(): React.ReactNode {
    return (
      <div className="breadcrumbs">
        Portfolio <span>/</span>
        {this.state.project.replace("project.", "")}
        <span>/</span>
        <b>{this.state.view}</b>
        <span className="grow" />
        <small>
          {this.state.layer === "intent"
            ? "Editing intent"
            : "Pinned implementation · read only"}
        </small>
      </div>
    );
  }
  private layoutData(): unknown {
    const text = this.store.state.auxiliary.layout.text;
    return text ? JSON.parse(text) : undefined;
  }
  private navigate(project: string, view: string): void {
    this.setState({ project, view, selected: "" });
  }
  private async saveLayout(data: LayoutDocument): Promise<void> {
    await this.store.api.call("layout", { expected: this.store.state.auxiliary.layout.hash, data });
    const state = await this.store.api.call<Workspace>("workspace");
    this.store.state.auxiliary.layout = state.auxiliary.layout;
    this.setState({ message: "Layout saved. Architecture unchanged." });
  }
  private graph(): React.ReactNode {
    return (
      <GraphCanvas
        documents={this.documents()}
        project={this.state.project}
        view={this.state.view}
        query={this.state.query}
        selected={this.state.selected}
        changed={new Set(this.state.findings.map(StudioApp.subject))}
        comparison={this.store.state.documents.map(StudioApp.model)}
        readOnly={this.state.layer === "implementation"}
        initialLayout={this.layoutData()}
        onNavigate={this.navigate.bind(this)}
        onSaveLayout={this.saveLayout.bind(this)}
        onSelect={this.select.bind(this)}
        onConnect={this.connect.bind(this)}
        onCreate={this.create.bind(this)}
      />
    );
  }
  private inspector(): React.ReactNode {
    return (
      <Inspector
        object={this.selectedObject()}
        readOnly={this.state.layer === "implementation"}
        findings={this.state.findings.filter(this.matching.bind(this))}
        onChange={this.update.bind(this)}
        relationships={this.connections()}
        onDisconnect={this.disconnect.bind(this)}
        onNavigate={this.select.bind(this)}
        onSource={this.source.bind(this)}
        onYaml={this.yaml.bind(this)}
        onAccept={this.accept.bind(this)}
        onDelete={this.remove.bind(this)}
        onConnect={this.openConnection.bind(this)}
      />
    );
  }
  render(): React.ReactNode {
    if (!this.state.ready)
      return (
        <div className="loading">
          <h1>Architecture Studio</h1>
          <p>{this.state.error || "Reading architectural workspace…"}</p>
        </div>
      );
    return (
      <div className="studio">
        {this.header()}
        {this.status()}
        {this.workspace()}
        {this.review()}
        {this.footer()}
        {this.modal()}
      </div>
    );
  }
  private modal(): React.ReactNode {
    return this.state.dialog ? (
      <Dialog title={this.state.dialog} onClose={this.closeDialog.bind(this)}>
        {this.dialogContent()}
      </Dialog>
    ) : null;
  }
  private status(): React.ReactNode {
    return (
      <>
        {this.state.error && (
          <div role="alert" className="error-banner">
            {this.state.error}
          </div>
        )}
        {this.state.busy && (
          <div className="busy">Working against the pinned workspace…</div>
        )}
      </>
    );
  }
  private review(): React.ReactNode {
    if (!this.state.dock) return null;
    return (
      <ReviewDock
        mode={this.state.dock}
        findings={this.state.findings}
        diagnostics={this.state.diagnostics}
        selected={this.state.selected}
        yaml={this.state.yaml}
        source={this.state.source}
        sourceBrowser={
          this.state.dock === "Source review" ? this.sourceBrowser() : undefined
        }
        onSelect={this.select.bind(this)}
        onYaml={this.yamlChanged.bind(this)}
        onApply={this.applyYaml.bind(this)}
        onClose={this.closeDock.bind(this)}
      />
    );
  }
  private footer(): React.ReactNode {
    return (
      <footer>
        <span>● Local workspace</span>
        <span>
          {this.state.message ||
            "Pinned observations · Intent draft · Runtime evidence separate"}
        </span>
        <span className="grow" />
        <span>{this.store.state.baseline.id}</span>
      </footer>
    );
  }
}
