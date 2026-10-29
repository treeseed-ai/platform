import { resolve } from "node:path";
import { stringify } from "yaml";
import {
  Data,
  type Workspace,
  type Blueprint,
  type Change,
  type Baseline,
  type Mapping,
  type Pattern,
} from "../model/types.js";
import { LanguageService } from "../language/service.js";
import { WorkspaceFiles } from "./files.js";

import { AuxiliarySchemas } from "./auxiliary.js";

export class WorkspaceService {
  private auxiliarySchemas = new AuxiliarySchemas();
  readonly files: WorkspaceFiles;
  readonly language: LanguageService;
  constructor(root: string) {
    this.files = new WorkspaceFiles(root);
    this.language = new LanguageService(resolve(root, "language"));
    this.files.recover();
  }
  load(): Workspace {
    const manifest = Data.record(
      this.language.parse(this.files.read("workspace.yaml")),
    );
    if (this.language.shape(manifest, "workspace").length)
      throw new Error("WORKSPACE_INVALID");
    const documents = this.documents(Data.strings(manifest.documents));
    const profiles = Data.strings(manifest.profiles).map(
      this.profile.bind(this),
    );
    const baselineText = this.files.read(String(manifest.baseline));
    return {
      documents,
      profiles,
      baseline: JSON.parse(baselineText),
      baselineHash: WorkspaceFiles.hash(baselineText),
      auxiliary: this.auxiliary(),
      schemas: this.language.schemas,
    };
  }
  private documents(paths: string[]): Workspace["documents"] {
    const documents = [];
    for (const path of paths) {
      const text = this.files.read(path);
      documents.push({
        path,
        text,
        hash: WorkspaceFiles.hash(text),
        model: this.language.parse(text) as Blueprint,
      });
    }
    return documents;
  }
  private profile(path: string): Blueprint {
    return this.language.parse(this.files.read(path)) as Blueprint;
  }
  private auxiliary(): Workspace["auxiliary"] {
    const result: Workspace["auxiliary"] = {};
    for (const name of ["layout", "mappings", "patterns"]) {
      const path = ".studio/" + name + ".json";
      result[name] = {
        hash: this.files.current(path),
        text: this.files.current(path) ? this.files.read(path) : "",
      };
    }
    return result;
  }
  save(changes: Change[]): { saved: boolean } {
    const state = this.load();
    for (const change of changes) this.allowed(change, state);
    this.files.transaction(changes);
    return { saved: true };
  }
  private allowed(change: Change, state: Workspace): void {
    const document = state.documents.find(
      WorkspaceService.pathMatch.bind(null, change.path),
    );
    if (!document || document.model.view !== "intent")
      throw new Error("WRITE_FORBIDDEN");
    const diagnostics = this.language.inspect(change.text);
    if (diagnostics.length)
      throw new Error("SCHEMA_INVALID: " + diagnostics[0].message);
    const model = this.language.parse(change.text) as Blueprint;
    if (model.view !== "intent" || model.project !== document.model.project)
      throw new Error("WRITE_FORBIDDEN");
  }
  private static pathMatch(path: string, document: { path: string }): boolean {
    return document.path === path;
  }
  roots(baseline: Baseline): Record<string, string> {
    const roots: Record<string, string> = {};
    for (const repository of baseline.repositories)
      roots[repository.project] = resolve(
        this.files.root,
        "..",
        repository.checkout,
      );
    return { ...roots, ...JSON.parse(process.env.STUDIO_REPOSITORIES || "{}") };
  }
  mappings(state: Workspace): Mapping[] {
    if (state.auxiliary.mappings.text)
      return JSON.parse(state.auxiliary.mappings.text).entries;
    const entries: Mapping[] = [];
    for (const document of state.documents) {
      if (document.model.view !== "implementation") continue;
      for (const object of document.model.objects)
        if (object.sourceBindings?.length)
          entries.push({
            subject: object.id,
            bindings: object.sourceBindings,
            provenance: "Initial authored baseline: " + state.baseline.id,
            review: "proposed",
          });
    }
    return entries;
  }
  patterns(state: Workspace): Pattern[] {
    return state.auxiliary.patterns.text
      ? JSON.parse(state.auxiliary.patterns.text).entries
      : [];
  }
  saveAuxiliary(
    name: string,
    expected: string,
    data: unknown,
  ): { saved: boolean } {
    if (!["layout", "mappings", "patterns"].includes(name))
      throw new Error("WRITE_FORBIDDEN");
    this.auxiliarySchemas.check(name, data);
    const value = Data.record(data);
    if (value.schemaVersion !== "studio-" + name + "/0.1")
      throw new Error("SCHEMA_INVALID");
    this.files.transaction([
      {
        path: ".studio/" + name + ".json",
        expected,
        text: JSON.stringify(data, null, 2) + "\n",
      },
    ]);
    return { saved: true };
  }
  static serialize(model: Blueprint): string {
    return stringify(model, { lineWidth: 100 });
  }
}
