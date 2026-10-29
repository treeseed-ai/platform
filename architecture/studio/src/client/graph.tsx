import { Component } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Handle,
  Position,
  applyNodeChanges,
  type Node,
  type Edge,
  type NodeProps,
  type NodeChange,
  type Connection,
  type ReactFlowInstance,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { ArchitectureGraph } from "../language/graph.js";
import {
  Data,
  type ArchitectureObject,
  type Blueprint,
} from "../model/types.js";
import { ObjectCatalog } from "./catalog.js";

export type StudioNode = Node<{
  object: ArchitectureObject;
  changed: boolean;
  selectedId: string;
}>;
class ArchitectureNode extends Component<NodeProps<StudioNode>> {
  render(): React.ReactNode {
    const { object, changed, selectedId } = this.props.data;
    return (
      <div
        className={
          "architecture-node " +
          object.kind +
          (selectedId === object.id ? " chosen" : "")
        }
      >
        <Handle type="target" position={Position.Left} id="in" />
        <div className="node-kind">
          {ObjectCatalog.icons[object.kind]} {object.kind}
        </div>
        <strong>{object.name}</strong>
        <div className="node-id">{object.id}</div>
        {changed && <span className="node-change">△ Intent differs</span>}
        <Handle type="source" position={Position.Right} id="out" />
      </div>
    );
  }
}
class ProjectBoundary extends Component<NodeProps<StudioNode>> {
  render(): React.ReactNode {
    return (
      <div className="project-boundary-label">
        {this.props.data.object.name.replace("project.", "").toUpperCase()} /
        PROJECT BOUNDARY
      </div>
    );
  }
}
interface Props {
  documents: Blueprint[];
  project: string;
  view: string;
  query: string;
  selected: string;
  changed: Set<string>;
  positions: Record<string, { x: number; y: number }>;
  viewport?: { x: number; y: number; zoom: number };
  onViewport: (viewport: { x: number; y: number; zoom: number }) => void;
  onSelect: (id: string) => void;
  onConnect: (from: string, to: string, kind: string) => void;
  onMove: (id: string, position: { x: number; y: number }) => void;
  onCreate: (kind: string) => void;
}
interface State {
  nodes: StudioNode[];
  edges: Edge[];
  focused: boolean;
}
export class GraphCanvas extends Component<Props, State> {
  state: State = { nodes: [], edges: [], focused: true };
  private neighborhood = new Set<string>();
  render(): React.ReactNode {
    return (
      <div
        className="graph-area"
        onDrop={this.drop.bind(this)}
        onDragOver={this.over.bind(this)}
      >
        {this.toolbar()}
        {this.flowView()}
        <div className="graph-legend">
          □ Current identity <span>┄ Intent draft</span>
          <span className="amber">△ Integration impact</span>
        </div>
      </div>
    );
  }
  private toolbar(): React.ReactNode {
    return (
      <div className="graph-tools">
        <span>↖ Select & drag</span>
        <span>⌁ Connect handles</span>
        <button onClick={this.fit.bind(this)}>⊞ Fit diagram</button>
        <button onClick={this.focus.bind(this)}>◎ Focus selection</button>
        <button onClick={this.toggleFocus.bind(this)}>
          {this.state.focused ? "Show all objects" : "Focus seam"}
        </button>
        <span className="grow" />
        <span>
          {this.state.nodes.length} objects · {this.props.view}
        </span>
      </div>
    );
  }
  private flowView(): React.ReactNode {
    return (
      <ReactFlow<StudioNode>
        nodes={this.state.nodes}
        edges={this.state.edges}
        nodeTypes={GraphCanvas.nodeTypes}
        onInit={this.init.bind(this)}
        onNodesChange={this.changes.bind(this)}
        onNodeClick={this.selected.bind(this)}
        onConnect={this.connect.bind(this)}
        onNodeDragStop={this.moved.bind(this)}
        minZoom={0.08}
        defaultViewport={this.props.viewport || { x: 30, y: 65, zoom: 0.75 }}
        onMoveEnd={this.viewport.bind(this)}
        colorMode="dark"
      >
        <Background gap={24} size={1} color="#263a50" />
        <Controls />
        <MiniMap nodeColor="#3d7682" maskColor="#09111bd9" />
      </ReactFlow>
    );
  }
  private flow?: ReactFlowInstance<StudioNode>;
  private architecture?: ArchitectureGraph;
  private static readonly nodeTypes = {
    architecture: ArchitectureNode,
    projectBoundary: ProjectBoundary,
  };
  componentDidMount(): void {
    this.rebuild();
  }
  componentDidUpdate(previous: Props): void {
    if (
      previous.documents !== this.props.documents ||
      previous.project !== this.props.project ||
      previous.view !== this.props.view ||
      previous.query !== this.props.query ||
      previous.selected !== this.props.selected ||
      previous.changed !== this.props.changed
    )
      this.rebuild();
  }
  private rebuild(): void {
    const graph = new ArchitectureGraph(this.props.documents);
    this.architecture = graph;
    this.neighborhood = this.neighbors(graph);
    const objects = [...graph.objects.values()].filter(this.visible.bind(this));
    const ids = new Set(objects.map(GraphCanvas.id));
    let nodes = objects.map(this.node.bind(this));
    const edges = graph.edges
      .filter(GraphCanvas.visibleEdge.bind(null, ids))
      .map(GraphCanvas.edge);
    nodes = this.group(nodes, graph);
    this.expandFlows(nodes, edges);
    this.setState({ nodes, edges });
  }
  private neighbors(graph: ArchitectureGraph): Set<string> {
    const ids = new Set([this.props.selected]);
    for (const edge of graph.edges)
      if (
        edge.from === this.props.selected ||
        edge.to === this.props.selected
      ) {
        ids.add(edge.from);
        ids.add(edge.to);
      }
    return ids;
  }
  private toggleFocus(): void {
    this.setState({ focused: !this.state.focused }, this.rebuild.bind(this));
  }
  private visible(object: ArchitectureObject): boolean {
    if (
      this.state.focused &&
      this.props.view === "Integration seams" &&
      this.props.selected &&
      !this.props.query &&
      !this.neighborhood.has(object.id)
    )
      return false;
    const owner = this.architecture?.owners.get(object.id);
    if (
      this.props.view !== "Portfolio" &&
      this.props.project !== "*" &&
      owner !== this.props.project &&
      object.id !== this.props.project
    )
      return false;
    if (this.props.query && !this.matchesQuery(object)) return false;
    return this.visibleKind(object.kind);
  }
  private matchesQuery(object: ArchitectureObject): boolean {
    return (object.name + object.id)
      .toLowerCase()
      .includes(this.props.query.toLowerCase());
  }
  private visibleKind(kind: string): boolean {
    if (this.props.view === "Portfolio") return kind === "project";
    if (this.props.view === "Flows") return kind === "flow";
    if (this.props.view === "Integration seams")
      return [
        "contract",
        "capability",
        "provider",
        "component",
        "composition",
      ].includes(kind);
    return !["rule", "decision", "placement"].includes(kind);
  }
  private node(object: ArchitectureObject, index: number): StudioNode {
    return {
      id: object.id,
      type: "architecture",
      position: this.props.positions[object.id] || {
        x: (index % 4) * 280,
        y: Math.floor(index / 4) * 165,
      },
      data: {
        object,
        changed: this.props.changed.has(object.id),
        selectedId: this.props.selected,
      },
    };
  }
  private group(nodes: StudioNode[], graph: ArchitectureGraph): StudioNode[] {
    if (this.props.view === "Portfolio" || this.props.view === "Flows")
      return nodes;
    const groups = new Map<string, StudioNode[]>();
    for (const node of nodes) {
      const owner = graph.owners.get(node.id) || "unclassified";
      const entries = groups.get(owner) || [];
      entries.push(node);
      groups.set(owner, entries);
    }
    const result: StudioNode[] = [];
    let index = 0;
    for (const [owner, children] of groups)
      this.projectGroup(result, owner, children, index++);
    return result;
  }
  private projectGroup(
    result: StudioNode[],
    owner: string,
    children: StudioNode[],
    index: number,
  ): void {
    const groupId = "layout:" + owner;
    const height = Math.ceil(children.length / 3) * 165 + 90;
    result.push(this.boundary(groupId, owner, index, height));
    for (let i = 0; i < children.length; i++) {
      const node = children[i];
      node.parentId = groupId;
      node.position = this.props.positions[node.id] || {
        x: 30 + (i % 3) * 280,
        y: 65 + Math.floor(i / 3) * 165,
      };
      result.push(node);
    }
  }
  private boundary(
    groupId: string,
    owner: string,
    index: number,
    height: number,
  ): StudioNode {
    return {
      id: groupId,
      type: "projectBoundary",
      position: { x: index * 920, y: 0 },
      style: { width: 880, height },
      data: {
        object: { id: owner, kind: "project", name: owner },
        changed: false,
        selectedId: "",
      },
      selectable: false,
    };
  }
  private expandFlows(nodes: StudioNode[], edges: Edge[]): void {
    if (this.props.view !== "Flows") return;
    const selected = nodes.find(
      GraphCanvas.byId.bind(null, this.props.selected),
    );
    if (!selected) return;
    const steps = Data.records(selected.data.object.nodes);
    nodes.splice(0, nodes.length);
    for (let index = 0; index < steps.length; index++)
      this.flowStep(selected.id, steps[index], index, nodes, edges);
  }
  private flowStep(
    flow: string,
    step: Record<string, unknown>,
    index: number,
    nodes: StudioNode[],
    edges: Edge[],
  ): void {
    const id = flow + "/" + step.id;
    const object = {
      id,
      kind: String(step.kind),
      name: String(step.label || step.id),
    };
    const node = this.node(object, index);
    node.data.selectedId = "";
    nodes.push(node);
    const targets = [step.next, ...Object.values(Data.record(step.outcomes))];
    if (step.kind === "parallel") targets.push(...Data.strings(step.branches));
    for (const target of targets)
      if (typeof target === "string")
        edges.push({
          id: id + "->" + target,
          source: id,
          target: flow + "/" + target,
          label: String(step.kind),
          type: "smoothstep",
        });
  }
  private focus(): void {
    const selected = this.state.nodes.find(
      GraphCanvas.byId.bind(null, this.props.selected),
    );
    if (!selected) {
      this.fit();
      return;
    }
    const ids = new Set([selected.id]);
    for (const edge of this.state.edges)
      if (edge.source === selected.id || edge.target === selected.id) {
        ids.add(edge.source);
        ids.add(edge.target);
      }
    void this.flow?.fitView({
      nodes: [...ids].map(GraphCanvas.nodeId),
      padding: 0.25,
      maxZoom: 1,
    });
  }
  private static nodeId(id: string): { id: string } {
    return { id };
  }
  private static id(object: ArchitectureObject): string {
    return object.id;
  }
  private static visibleEdge(
    ids: Set<string>,
    edge: { from: string; to: string },
  ): boolean {
    return ids.has(edge.from) && ids.has(edge.to);
  }
  private static edge(
    edge: { from: string; to: string; kind: string },
    index: number,
  ): Edge {
    return {
      id: "edge." + index,
      source: edge.from,
      target: edge.to,
      sourceHandle: "out",
      targetHandle: "in",
      label: edge.kind,
      type: "smoothstep",
    };
  }
  private changes(changes: NodeChange<StudioNode>[]): void {
    this.setState({ nodes: applyNodeChanges(changes, this.state.nodes) });
  }
  private selected(_event: React.MouseEvent, node: StudioNode): void {
    if (node.id.includes("/")) return;
    this.props.onSelect(node.id);
  }
  private connect(connection: Connection): void {
    const source = this.state.nodes.find(
      GraphCanvas.byId.bind(null, connection.source),
    );
    const target = this.state.nodes.find(
      GraphCanvas.byId.bind(null, connection.target),
    );
    const kind = ObjectCatalog.relationship(
      source?.data.object.kind || "",
      target?.data.object.kind || "",
    );
    if (kind) this.props.onConnect(connection.source, connection.target, kind);
  }
  private static byId(id: string, node: StudioNode): boolean {
    return node.id === id;
  }
  private moved(_event: unknown, node: StudioNode): void {
    this.props.onMove(node.id, node.position);
  }
  private init(flow: ReactFlowInstance<StudioNode>): void {
    this.flow = flow;
    if (!this.props.viewport) setTimeout(this.focus.bind(this), 100);
  }
  private viewport(
    _event: unknown,
    viewport: { x: number; y: number; zoom: number },
  ): void {
    this.props.onViewport(viewport);
  }
  private fit(): void {
    void this.flow?.fitView({ padding: 0.15 });
  }
  private drop(event: React.DragEvent): void {
    event.preventDefault();
    const kind = event.dataTransfer.getData("studio/kind");
    if (ObjectCatalog.kinds.includes(kind)) this.props.onCreate(kind);
  }
  private over(event: React.DragEvent): void {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  }
}
