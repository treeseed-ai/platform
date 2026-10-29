import { CellSearch } from "./cells/search.js";
import { SceneFacts } from "../scene/facts.js";
import { Component } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  applyNodeChanges,
  type NodeChange,
  type Connection,
  type ReactFlowInstance,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Data, type Blueprint } from "../model/types.js";
import type {
  LayoutDocument,
  LayoutResult,
  Scene,
  Viewport,
  Port,
} from "../scene/contracts.js";
import { CellServices } from "../scene/services.js";
import { DigitalCell, type CellNode } from "./cells/node.js";
import { RoutedConnection, type CellEdge } from "./cells/connector.js";
import { CellPresentation } from "./cells/presentation.js";
import { BoundaryInspector } from "./cells/boundary-inspector.js";
import { ConnectionEditor } from "./cells/connection-editor.js";
import { ObjectCatalog } from "./catalog.js";

interface Props {
  documents: Blueprint[];
  comparison: Blueprint[];
  project: string;
  view: string;
  query: string;
  selected: string;
  changed: Set<string>;
  readOnly: boolean;
  initialLayout: unknown;
  onSelect: (id: string) => void;
  onConnect: (from: string, to: string, kind: string) => void;
  onCreate: (kind: string) => void;
  onNavigate: (project: string, view: string) => void;
  onSaveLayout: (document: LayoutDocument) => Promise<void>;
}
interface State {
  nodes: CellNode[];
  edges: CellEdge[];
  busy: boolean;
  error: string;
  boundary: string;
  composition: string;
  scope: string;
  connection?: { source: Port; target: Port };
}
export class GraphCanvas extends Component<Props, State> {
  state: State = {
    nodes: [],
    edges: [],
    busy: true,
    error: "",
    boundary: "",
    composition: "",
    scope: "",
  };
  private services = new CellServices(this.props.initialLayout);
  private scene?: Scene;
  private layout?: LayoutResult;
  private flow?: ReactFlowInstance<CellNode, CellEdge>;
  private sequence = 0;
  private signature = "";
  private ready = false;
  private zoom = 1;
  private restoring = false;
  private cache = new Map<string, LayoutResult>();
  private static nodeTypes = { cell: DigitalCell };
  private static edgeTypes = { routed: RoutedConnection };
  componentDidMount(): void {
    void this.start();
  }
  componentWillUnmount(): void {
    this.sequence++;
    void this.services.dispose();
  }
  private async start(): Promise<void> {
    await this.services.ready;
    this.ready = true;
    await this.rebuild();
  }
  componentDidUpdate(previous: Props): void {
    if (!this.ready) return;
    if (previous.selected !== this.props.selected)
      this.services.navigation.select(this.props.selected);
    if (
      previous.project !== this.props.project ||
      previous.view !== this.props.view
    )
      this.restoreSelection();
    if (
      previous.documents !== this.props.documents ||
      previous.project !== this.props.project ||
      previous.view !== this.props.view
    )
      void this.rebuild();
    else if (
      previous.query !== this.props.query ||
      previous.selected !== this.props.selected ||
      previous.changed !== this.props.changed
    )
      this.paint();
  }
  private sceneContext() {
    const project =
      this.props.project === "*" || this.props.view === "Portfolio"
        ? undefined
        : this.props.project;
    this.services.navigation.enter(this.props.view, project);
    return {
      view: this.props.view,
      project,
      expanded: this.services.navigation.current().expanded,
      flow: this.activeFlow(),
      composition: this.state.composition,
      scope: this.state.scope,
    };
  }
  private activeFlow(): string | undefined {
    for (const document of this.props.documents)
      for (const object of document.objects)
        if (object.id === this.props.selected && object.kind === "flow")
          return object.id;
    return undefined;
  }
  private restoreSelection(): void {
    this.restoring = true;
    this.sceneContext();
    const selected = this.services.navigation.current().selected;
    if (selected !== this.props.selected) this.props.onSelect(selected);
  }
  private async rebuild(force = false): Promise<void> {
    const scene = this.services.projection.project(
      this.union(),
      this.sceneContext(),
    );
    this.scene = scene;
    const signature = this.topology(scene);
    if (!force && signature === this.signature && this.layout) {
      this.paint();
      return;
    }
    this.signature = signature;
    const request = ++this.sequence;
    this.setState({ busy: true, error: "" });
    await this.requestLayout(scene, signature, force, request);
  }
  private async requestLayout(
    scene: Scene,
    signature: string,
    force: boolean,
    request: number,
  ): Promise<void> {
    try {
      const result =
        (!force && this.cache.get(signature)) ||
        (await this.services.layout.arrange(scene));
      if (request !== this.sequence) return;
      this.cache.set(signature, result);
      this.layout = result;
      if (force) this.services.navigation.arrange(this.positions(result));
      this.setState({ busy: false }, this.paint.bind(this));
      setTimeout(this.restoreViewport.bind(this, force), 50);
    } catch (error) {
      if (request === this.sequence)
        this.setState({ busy: false, error: String(error) });
    }
  }
  private topology(scene: Scene): string {
    return Data.canonical({
      context: scene.context,
      cells: scene.cells.map(GraphCanvas.cellShape),
      ports: scene.ports,
      connectors: scene.connectors,
    });
  }
  private static cellShape(cell: Scene["cells"][number]): unknown {
    return [cell.id, cell.width, cell.height];
  }
  private union(): Blueprint[] {
    const documents = new Map<string, Blueprint>();
    const objects = new Map<
      string,
      Map<string, Blueprint["objects"][number]>
    >();
    for (const document of [
      ...this.props.comparison,
      ...this.props.documents,
    ]) {
      const group = objects.get(document.project) || new Map();
      for (const object of document.objects) group.set(object.id, object);
      objects.set(document.project, group);
      const previous = documents.get(document.project);
      documents.set(document.project, {
        ...document,
        objects: [...group.values()],
        relationships: [
          ...(previous?.relationships || []),
          ...(document.relationships || []),
        ],
      });
    }
    return [...documents.values()];
  }
  private ghosts(): Set<string> {
    const current = new Set<string>(),
      ghosts = new Set<string>();
    for (const document of this.props.documents)
      for (const object of document.objects) current.add(object.id);
    for (const document of this.props.comparison)
      for (const object of document.objects)
        if (!current.has(object.id)) ghosts.add(object.id);
    return ghosts;
  }
  private paint(): void {
    if (!this.layout || !this.scene) return;
    const layout = this.freshPresentation();
    const presentation = new CellPresentation(layout, {
      positions: this.services.navigation.current().positions,
      zoom: this.zoom,
      selected: this.props.selected,
      changed: this.props.changed,
      impacted: this.impacted(),
      query: this.props.query,
      ghosts: this.ghosts(),
      onEnter: this.enter.bind(this),
      onExpand: this.expand.bind(this),
      onSelect: this.props.onSelect,
      onPort: this.inspect.bind(this),
    });
    this.setState({ nodes: presentation.nodes(), edges: presentation.edges() });
  }
  private freshPresentation(): LayoutResult {
    const cells = [];
    for (const geometry of this.layout!.cells) {
      const current = this.scene!.cells.find(
        GraphCanvas.id.bind(null, geometry.id),
      );
      cells.push({ ...geometry, ...current });
    }
    return { ...this.layout!, cells };
  }
  private impacted(): Set<string> {
    const result = new Set<string>();
    for (const document of this.props.documents)
      for (const object of document.objects)
        if (object.kind === "contract" && this.props.changed.has(object.id))
          result.add(object.id);
    for (const edge of this.scene?.connectors || [])
      for (const relationship of edge.relationships)
        if (result.has(relationship.from) || result.has(relationship.to)) {
          result.add(edge.source);
          result.add(edge.target);
        }
    return result;
  }
  private positions(
    layout: LayoutResult,
  ): Record<string, { x: number; y: number }> {
    const result: Record<string, { x: number; y: number }> = {};
    for (const cell of layout.cells) result[cell.id] = { x: cell.x, y: cell.y };
    return result;
  }
  private reveal(id: string): void {
    const facts = new SceneFacts(this.props.documents);
    const project = facts.project(id);
    if (!project) {
      this.props.onSelect(id);
      return;
    }
    this.services.navigation.enter("Components", project);
    const owner = facts.providerOwners.get(id);
    if (owner && !this.services.navigation.current().expanded.includes(owner))
      this.services.navigation.expand(owner);
    this.services.navigation.select(id);
    this.props.onNavigate(project, "Components");
    this.props.onSelect(id);
    this.closeBoundary();
  }
  private enter(id: string): void {
    this.props.onNavigate(id, "Components");
  }
  private portfolio(): void {
    this.props.onNavigate("*", "Portfolio");
  }
  private expand(id: string): void {
    this.services.navigation.expand(id);
    this.props.onSelect(id);
    void this.rebuild();
  }
  private inspect(id: string): void {
    this.setState({ boundary: id });
  }
  private closeBoundary(): void {
    this.setState({ boundary: "" });
  }
  private closeConnection(): void {
    this.setState({ connection: undefined });
  }
  private changes(changes: NodeChange<CellNode>[]): void {
    this.setState({ nodes: applyNodeChanges(changes, this.state.nodes) });
  }
  private selected(_event: React.MouseEvent, node: CellNode): void {
    this.props.onSelect(node.data.cell.subject);
  }
  private moved(_event: unknown, node: CellNode): void {
    this.services.navigation.move(node.id, node.position);
    this.paint();
  }
  private viewport(_event: unknown, viewport: Viewport): void {
    if (this.ready && !this.restoring)
      this.services.navigation.viewport(viewport);
    this.zoom = viewport.zoom;
    this.paint();
  }
  private init(flow: ReactFlowInstance<CellNode, CellEdge>): void {
    this.flow = flow;
  }
  private restoreViewport(fit = false): void {
    const viewport = this.services.navigation.current().viewport;
    const restored =
      viewport && !fit
        ? this.flow?.setViewport(viewport)
        : this.flow?.fitView({ padding: 0.2, maxZoom: 1 });
    void restored?.then(this.restored.bind(this));
  }
  private restored(): void {
    this.restoring = false;
    const viewport = this.flow?.getViewport();
    if (viewport) this.viewport(undefined, viewport);
  }
  private fit(): void {
    void this.flow?.fitView({ padding: 0.15, maxZoom: 1 });
  }
  private focus(): void {
    void this.flow?.fitView({
      nodes: [{ id: this.props.selected }],
      padding: 0.3,
      maxZoom: 1,
    });
  }
  private arrange(): void {
    void this.rebuild(true);
  }
  private undo(): void {
    this.services.navigation.undo();
    this.paint();
  }
  private save(): void {
    void this.props
      .onSaveLayout(this.services.navigation.serialize())
      .catch(this.failure.bind(this));
  }
  private failure(error: unknown): void {
    this.setState({ error: String(error) });
  }
  private connect(connection: Connection): void {
    if (this.props.readOnly) return;
    const source = this.scene?.ports.find(
      GraphCanvas.id.bind(null, connection.sourceHandle || ""),
    );
    const target = this.scene?.ports.find(
      GraphCanvas.id.bind(null, connection.targetHandle || ""),
    );
    if (source && target) this.setState({ connection: { source, target } });
  }
  private composition(event: React.ChangeEvent<HTMLSelectElement>): void {
    this.setState(
      { composition: event.target.value, scope: "" },
      this.refresh.bind(this),
    );
  }
  private scope(event: React.ChangeEvent<HTMLSelectElement>): void {
    this.setState({ scope: event.target.value }, this.refresh.bind(this));
  }
  private refresh(): void {
    void this.rebuild();
  }
  private drop(event: React.DragEvent): void {
    event.preventDefault();
    const kind = event.dataTransfer.getData("studio/kind");
    if (!this.props.readOnly && ObjectCatalog.kinds.includes(kind))
      this.props.onCreate(kind);
  }
  private over(event: React.DragEvent): void {
    event.preventDefault();
  }
  private static id(id: string, value: { id: string }): boolean {
    return id === value.id;
  }
  render(): React.ReactNode {
    return (
      <div
        className="graph-area cell-map"
        onDrop={this.drop.bind(this)}
        onDragOver={this.over.bind(this)}
      >
        {this.toolbar()}
        {this.search()}
        {this.breadcrumbs()}
        {this.flowView()}
        {this.overlays()}
        <div className="graph-legend">
          {this.props.view === "Flows"
            ? "Modeled behavior"
            : "Dependency topology · not runtime order"}{" "}
          · Glow = connectivity · Dashed = comparison ghost
        </div>
      </div>
    );
  }
  private search(): React.ReactNode {
    return (
      <CellSearch
        documents={this.props.documents}
        query={this.props.query}
        onReveal={this.reveal.bind(this)}
      />
    );
  }
  private toolbar(): React.ReactNode {
    return (
      <div className="graph-tools">
        <button onClick={this.arrange.bind(this)} disabled={this.state.busy}>
          Arrange by connections
        </button>
        <button disabled={this.state.busy} onClick={this.undo.bind(this)}>
          Undo layout
        </button>
        <button disabled={this.state.busy} onClick={this.save.bind(this)}>
          Save layout
        </button>
        <button onClick={this.fit.bind(this)}>Fit map</button>
        <button onClick={this.focus.bind(this)}>Focus selection</button>
        {this.state.busy && <span>Routing…</span>}
        {this.contextSelectors()}
      </div>
    );
  }
  private breadcrumbs(): React.ReactNode {
    return (
      <nav className="cell-breadcrumbs" aria-label="Architecture location">
        <button onClick={this.portfolio.bind(this)}>Portfolio</button>
        {this.props.project !== "*" && (
          <span> / {this.props.project.replace("project.", "")}</span>
        )}
        {this.props.selected && <span> / {this.props.selected}</span>}
      </nav>
    );
  }
  private contextSelectors(): React.ReactNode {
    const { compositions } = this.compositionChoices();
    return (
      <>
        <select
          aria-label="Composition context"
          value={this.state.composition}
          onChange={this.composition.bind(this)}
        >
          <option value="">Composition unknown</option>
          {compositions.map(this.option)}
        </select>
        {this.scopeSelector()}
      </>
    );
  }
  private scopeSelector(): React.ReactNode {
    return (
      <select
        aria-label="Scope context"
        value={this.state.scope}
        onChange={this.scope.bind(this)}
      >
        <option value="">Scope unknown</option>
        {this.compositionChoices().scopes.map(this.scopeOption)}
      </select>
    );
  }
  private compositionChoices() {
    const compositions = [];
    let scopes: Record<string, unknown>[] = [];
    for (const document of this.props.documents)
      for (const object of document.objects)
        if (object.kind === "composition") {
          compositions.push(object);
          if (object.id === this.state.composition)
            scopes = Data.records(object.scopes);
        }
    return { compositions, scopes };
  }
  private option(object: { id: string; name: string }): React.ReactNode {
    return (
      <option key={object.id} value={object.id}>
        {object.name}
      </option>
    );
  }
  private scopeOption(scope: Record<string, unknown>): React.ReactNode {
    return (
      <option key={String(scope.id)} value={String(scope.id)}>
        {String(scope.id)}
      </option>
    );
  }
  private flowView(): React.ReactNode {
    return (
      <ReactFlow<CellNode, CellEdge>
        nodes={this.state.nodes}
        edges={this.state.edges}
        nodeTypes={GraphCanvas.nodeTypes}
        edgeTypes={GraphCanvas.edgeTypes}
        {...this.flowEvents()}
        minZoom={0.025}
        maxZoom={2}
        colorMode="dark"
        nodesConnectable={!this.props.readOnly}
      >
        <Background gap={24} size={1} color="#263a50" />
        <Controls />
        <MiniMap nodeColor="#3d7682" maskColor="#09111bd9" />
      </ReactFlow>
    );
  }
  private flowEvents() {
    return {
      onInit: this.init.bind(this),
      onNodesChange: this.changes.bind(this),
      onNodeClick: this.selected.bind(this),
      onConnect: this.connect.bind(this),
      onNodeDragStop: this.moved.bind(this),
      onMoveEnd: this.viewport.bind(this),
    };
  }
  private overlays(): React.ReactNode {
    return (
      <>
        {this.state.error && (
          <div className="cell-error" role="alert">
            {this.state.error}
            <button onClick={this.arrange.bind(this)}>Retry layout</button>
          </div>
        )}
        {this.inspectors()}
        {!!this.scene?.diagnostics.length && (
          <details className="scene-diagnostics">
            <summary>
              {this.scene.diagnostics.length} unresolved scene findings
            </summary>
            {this.scene.diagnostics.map(GraphCanvas.diagnostic)}
          </details>
        )}
      </>
    );
  }
  private inspectors(): React.ReactNode {
    return (
      <>
        {this.state.boundary && this.scene && (
          <BoundaryInspector
            scene={this.scene}
            documents={this.union()}
            id={this.state.boundary}
            onSelect={this.reveal.bind(this)}
            onClose={this.closeBoundary.bind(this)}
          />
        )}
        {this.connectionEditor()}
      </>
    );
  }
  private connectionEditor(): React.ReactNode {
    if (!this.state.connection) return null;
    return (
      <ConnectionEditor
        {...this.state.connection}
        documents={this.props.documents}
        onConnect={this.props.onConnect}
        onClose={this.closeConnection.bind(this)}
      />
    );
  }
  private static diagnostic(
    item: Scene["diagnostics"][number],
  ): React.ReactNode {
    return (
      <p key={item.subject + item.code}>
        {item.subject}: {item.message}
      </p>
    );
  }
}
