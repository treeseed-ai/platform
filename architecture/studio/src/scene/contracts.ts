import type {
  ArchitectureObject,
  Blueprint,
  Relationship,
} from "../model/types.js";

export interface Point {
  x: number;
  y: number;
}
export interface Viewport extends Point {
  zoom: number;
}
export interface SceneContext {
  view: string;
  project?: string;
  plugin?: string;
  expanded?: string[];
  composition?: string;
  scope?: string;
  flow?: string;
}
export interface SceneRelationship extends Relationship {
  id: string;
  provenance: string[];
}
export interface ProviderCard {
  subject: string;
  name: string;
  contractVersion: string;
  replacement: string;
  registered: boolean | "unknown";
  selection: string;
  readiness: string;
}
export interface Cell {
  id: string;
  subject: string;
  name: string;
  kind: string;
  owner?: string;
  purpose: string;
  external: boolean;
  unresolved: boolean;
  expanded: boolean;
  providers: ProviderCard[];
  pluginCount: number;
  providerCount: number;
  peers: number;
  children: string[];
  width: number;
  height: number;
  object?: ArchitectureObject;
}
export interface Port {
  id: string;
  cell: string;
  interface: string;
  label: string;
  direction: "in" | "out" | "neutral";
  category: string;
  attachment?: "source" | "target";
  endpoints: string[];
  count: number;
  unused?: boolean;
}
export interface Connector {
  id: string;
  source: string;
  target: string;
  sourcePort: string;
  targetPort: string;
  category: string;
  label: string;
  relationships: SceneRelationship[];
}
export interface SceneDiagnostic {
  code: string;
  subject: string;
  message: string;
}
export interface Scene {
  context: SceneContext;
  cells: Cell[];
  ports: Port[];
  connectors: Connector[];
  relationships: SceneRelationship[];
  diagnostics: SceneDiagnostic[];
}
export interface Section {
  startPoint: Point;
  endPoint: Point;
  bendPoints?: Point[];
}
export interface CellGeometry extends Cell, Point {}
export interface PortGeometry extends Port, Point {
  comparison?: string;
}
export interface RoutedConnector extends Connector {
  sections: Section[];
}
export interface LayoutResult {
  cells: CellGeometry[];
  ports: PortGeometry[];
  connectors: RoutedConnector[];
  engine: string;
  diagnostics: SceneDiagnostic[];
}
export interface ProjectionService {
  project(documents: Blueprint[], context: SceneContext): Scene;
}
export interface LayoutService {
  arrange(scene: Scene): Promise<LayoutResult>;
  dispose?(): void;
}
export interface NavigationView {
  positions: Record<string, Point>;
  viewport?: Viewport;
  expanded: string[];
  selected: string;
}
export interface LayoutDocument {
  schemaVersion: "studio-layout/0.2";
  engine: string;
  views: Record<string, NavigationView>;
  legacy?: unknown;
}

export interface NavigationService {
  load(value?: unknown): void;
  enter(view: string, project?: string): void;
  current(): NavigationView;
  initialize(
    cells: Array<Point & { id: string; width: number; height: number }>,
  ): void;
  move(id: string, position: Point): void;
  expand(id: string): void;
  select(id: string): void;
  viewport(viewport: Viewport): void;
  arrange(positions: Record<string, Point>): void;
  undo(): void;
  canUndo(): boolean;
  serialize(): LayoutDocument;
}
