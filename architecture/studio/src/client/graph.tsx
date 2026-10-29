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
    const {object, changed, selectedId} = this.props.data;
    return <div className={'architecture-node ' + object.kind + (selectedId === object.id ? ' chosen' : '')}><Handle type="target" position={Position.Left} id="in"/><div className="node-kind">{ObjectCatalog.icons[object.kind]} {object.kind}</div><strong>{object.name}</strong><div className="node-id">{object.id}</div>{changed && <span className="node-change">△ Intent differs</span>}<Handle type="source" position={Position.Right} id="out"/></div>;
  }
}
interface Props { documents: Blueprint[]; project: string; view: string; query: string; selected: string; changed: Set<string>; positions: Record<string, {x: number; y: number}>; onSelect: (id: string) => void; onConnect: (from: string, to: string, kind: string) => void; onMove: (id: string, position: {x: number; y: number}) => void; onCreate: (kind: string) => void }
interface State {nodes: StudioNode[]; edges: Edge[]}
export class GraphCanvas extends Component<Props, State> {
  state: State = {nodes: [], edges: []};
  render(): React.ReactNode {
    return <div className="graph-area" onDrop={this.drop.bind(this)} onDragOver={this.over.bind(this)}>{this.toolbar()}{this.flowView()}<div className="graph-legend">□ Current identity <span>┄ Intent draft</span><span className="amber">△ Integration impact</span></div></div>;
  }
  private toolbar(): React.ReactNode {
    return <div className="graph-tools"><span>↖ Select & drag</span><span>⌁ Connect handles</span><button onClick={this.fit.bind(this)}>⊞ Fit diagram</button><span className="grow"/><span>{this.state.nodes.length} objects · {this.props.view}</span></div>;
  }
  private flowView(): React.ReactNode {
    return <ReactFlow<StudioNode> nodes={this.state.nodes} edges={this.state.edges} nodeTypes={GraphCanvas.nodeTypes} onInit={this.init.bind(this)} onNodesChange={this.changes.bind(this)} onNodeClick={this.selected.bind(this)} onConnect={this.connect.bind(this)} onNodeDragStop={this.moved.bind(this)} minZoom={0.08} defaultViewport={{x: 30,y:65,zoom:0.75}} colorMode="dark"><Background gap={24} size={1} color="#263a50"/><Controls/><MiniMap nodeColor="#3d7682" maskColor="#09111bd9"/></ReactFlow>;
  }
  private flow?: ReactFlowInstance<StudioNode>;
  private static readonly nodeTypes = { architecture: ArchitectureNode };
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
    const objects = [...graph.objects.values()].filter(this.visible.bind(this));
    const ids = new Set(objects.map(GraphCanvas.id));
    const nodes = objects.map(this.node.bind(this));
    const edges = graph.edges
      .filter(GraphCanvas.visibleEdge.bind(null, ids))
      .map(GraphCanvas.edge);
    this.setState({ nodes, edges });
  }
  private visible(object: ArchitectureObject): boolean {
    const owner = new ArchitectureGraph(this.props.documents).owners.get(object.id);
    if (
      this.props.project !== "*" &&
      owner !== this.props.project &&
      object.id !== this.props.project
    )
      return false;
    if (
      this.props.query &&
      !(object.name + object.id)
        .toLowerCase()
        .includes(this.props.query.toLowerCase())
    )
      return false;
    if (this.props.view === "Portfolio") return object.kind === "project";
    if (this.props.view === "Flows") return object.kind === "flow";
    if (this.props.view === "Integration seams")
      return [
        "contract",
        "capability",
        "provider",
        "component",
        "composition",
      ].includes(object.kind);
    return !["rule", "decision", "placement"].includes(object.kind);
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
