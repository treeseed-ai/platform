import { stringify, parseDocument } from "yaml";
import {
  Data,
  type Workspace,
  type Blueprint,
  type ArchitectureObject,
  type DocumentRecord,
} from "../model/types.js";
import { ApiClient } from "./api.js";

export class DraftStore {
  state!: Workspace;
  private history: string[] = [];
  private future: string[] = [];
  readonly api = new ApiClient();
  async load(): Promise<void> {
    this.state = await this.api.call<Workspace>("workspace");
    this.history = [];
    this.future = [];
  }
  get dirty(): boolean {
    return this.history.length > 0;
  }
  documents(): DocumentRecord[] {
    return this.state.documents.filter(DraftStore.intent);
  }
  private static intent(document: DocumentRecord): boolean {
    return document.model.view === "intent";
  }
  objects(): ArchitectureObject[] {
    return Data.objects(this.state.documents, "intent");
  }
  find(id: string): ArchitectureObject | undefined {
    return this.objects().find(DraftStore.matches.bind(null, id));
  }
  private static matches(id: string, object: ArchitectureObject): boolean {
    return object.id === id;
  }
  document(id: string): DocumentRecord | undefined {
    for (const document of this.documents())
      if (document.model.objects.some(DraftStore.matches.bind(null, id)))
        return document;
    return undefined;
  }
  checkpoint(): void {
    this.history.push(JSON.stringify(this.state.documents));
    this.future = [];
  }
  undo(): void {
    if (this.history.length) {
      this.future.push(JSON.stringify(this.state.documents));
      this.state.documents = JSON.parse(this.history.pop()!);
    }
  }
  redo(): void {
    if (this.future.length) {
      this.history.push(JSON.stringify(this.state.documents));
      this.state.documents = JSON.parse(this.future.pop()!);
    }
  }
  update(id: string, field: string, value: unknown): void {
    const object = this.find(id);
    if (!object || field === "id" || field === "kind") return;
    this.checkpoint();
    object[field] = value;
    this.unaccept(id);
    this.serialize();
  }
  add(object: ArchitectureObject, project: string): void {
    const document = this.documents().find(
      DraftStore.project.bind(null, project),
    );
    if (!document) throw new Error("Select an existing owning project");
    this.checkpoint();
    document.model.objects.push(object);
    this.serialize();
  }
  private static project(project: string, document: DocumentRecord): boolean {
    return document.model.project === project;
  }
  connect(from: string, to: string, kind: string): void {
    const document = this.document(from);
    if (!document || !this.find(to))
      throw new Error("Both endpoints must be intent objects");
    this.checkpoint();
    document.model.relationships ??= [];
    document.model.relationships.push({ from, to, kind });
    this.unaccept(from);
    this.serialize();
  }
  remove(id: string): void {
    this.checkpoint();
    for (const document of this.documents()) {
      document.model.objects = document.model.objects.filter(
        DraftStore.notId.bind(null, id),
      );
      document.model.relationships = document.model.relationships?.filter(
        DraftStore.notEdge.bind(null, id),
      );
    }
    this.serialize();
  }
  private static notId(id: string, object: ArchitectureObject): boolean {
    return object.id !== id;
  }
  private static notEdge(
    id: string,
    edge: { from: string; to: string },
  ): boolean {
    return edge.from !== id && edge.to !== id;
  }
  accept(id: string): void {
    const document = this.document(id);
    if (!document) return;
    this.checkpoint();
    document.model.metadata.status = "mixed";
    document.model.metadata.acceptedSubjects = [
      ...new Set([
        ...Data.strings(document.model.metadata.acceptedSubjects),
        id,
      ]),
    ];
    document.model.objects.push({
      id: "decision." + crypto.randomUUID(),
      kind: "decision",
      name: "Accept " + id,
      purpose: "Explicit architectural acceptance in Studio",
      subjects: [id],
      status: "accepted",
      rationale: "Reviewed by the local architect in Architecture Studio.",
    });
    this.serialize();
  }
  drafts(): Array<{ path: string; text: string }> {
    return this.documents().map(DraftStore.text);
  }
  private static text(document: DocumentRecord): {
    path: string;
    text: string;
  } {
    return { path: document.path, text: document.text };
  }
  async save(): Promise<void> {
    await this.api.call("save", {
      changes: this.documents().map(DraftStore.change),
    });
    await this.load();
  }
  private static change(document: DocumentRecord): unknown {
    return {
      path: document.path,
      text: document.text,
      expected: document.hash,
    };
  }
  async applyYaml(path: string, text: string): Promise<void> {
    await this.api.call("validate", { drafts: [{ path, text }] });
    const document = this.documents().find(DraftStore.path.bind(null, path));
    if (!document) return;
    const model = parseDocument(text).toJS() as Blueprint;
    if (model.view !== "intent" || model.project !== document.model.project)
      throw new Error("Intent owner cannot change");
    this.checkpoint();
    document.model = model;
    document.text = text;
  }
  private static path(path: string, document: DocumentRecord): boolean {
    return document.path === path;
  }
  private unaccept(id: string): void {
    const document = this.document(id);
    if (!document) return;
    const accepted = document.model.metadata.status === 'accepted' ? document.model.objects.map(DraftStore.objectId) : Data.strings(document.model.metadata.acceptedSubjects);
    document.model.metadata.status = 'mixed';
    document.model.metadata.acceptedSubjects = accepted.filter(DraftStore.otherId.bind(null, id));
  }
  private static objectId(object: ArchitectureObject): string { return object.id; }
  private static otherId(id: string, value: string): boolean { return value !== id; }
  private serialize(): void {
    for (const document of this.documents())
      document.text = stringify(document.model, { lineWidth: 100 });
  }
}
