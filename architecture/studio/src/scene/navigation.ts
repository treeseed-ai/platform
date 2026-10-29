import { Data } from "../model/types.js";
import type {
  LayoutDocument,
  NavigationView,
  Point,
  Viewport,
} from "./contracts.js";

export class CellNavigation {
  private document: LayoutDocument = {
    schemaVersion: "studio-layout/0.2",
    engine: "elkjs/0.12.1:layered/1",
    views: {},
  };
  private key = "Portfolio/portfolio";
  private history = new Map<string, NavigationView[]>();
  constructor(value?: unknown) {
    this.load(value);
  }
  load(value?: unknown): void {
    const data = Data.record(value);
    if (data.schemaVersion === "studio-layout/0.2")
      this.document = structuredClone(data) as unknown as LayoutDocument;
    else if (data.schemaVersion === "studio-layout/0.1")
      this.document.legacy = structuredClone(value);
    this.current();
  }
  enter(view: string, project?: string): void {
    this.key = view + "/" + (project || "portfolio");
    this.current();
  }
  current(): NavigationView {
    return (this.document.views[this.key] ||= {
      positions: {},
      expanded: [],
      selected: "",
    });
  }
  move(id: string, position: Point): void {
    this.checkpoint();
    this.current().positions[id] = { ...position };
  }
  expand(id: string): void {
    this.checkpoint();
    const expanded = this.current().expanded;
    const index = expanded.indexOf(id);
    if (index < 0) expanded.push(id);
    else expanded.splice(index, 1);
  }
  select(id: string): void {
    this.current().selected = id;
  }
  viewport(viewport: Viewport): void {
    this.current().viewport = { ...viewport };
  }
  arrange(positions: Record<string, Point>): void {
    this.checkpoint();
    this.current().positions = structuredClone(positions);
  }
  undo(): void {
    const previous = this.history.get(this.key)?.pop();
    if (previous) this.document.views[this.key] = previous;
  }
  canUndo(): boolean {
    return !!this.history.get(this.key)?.length;
  }
  serialize(): LayoutDocument {
    return structuredClone(this.document);
  }
  private checkpoint(): void {
    const entries = this.history.get(this.key) || [];
    entries.push(structuredClone(this.current()));
    if (entries.length > 50) entries.shift();
    this.history.set(this.key, entries);
  }
}
