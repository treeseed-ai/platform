export type Value =
  | null
  | boolean
  | number
  | string
  | Value[]
  | { [key: string]: Value };
export interface Binding {
  project: string;
  revision: string;
  path: string;
  symbol?: string;
  start?: number;
  end?: number;
  fingerprint?: string;
}
export interface ArchitectureObject {
  id: string;
  kind: string;
  name: string;
  purpose?: string;
  sourceBindings?: Binding[];
  [key: string]: unknown;
}
export interface Relationship {
  kind: string;
  from: string;
  to: string;
}
export interface Blueprint {
  schemaVersion: string;
  view: string;
  project: string;
  objects: ArchitectureObject[];
  relationships?: Relationship[];
  metadata: Record<string, unknown>;
}
export interface DocumentRecord {
  path: string;
  text: string;
  hash: string;
  model: Blueprint;
}
export interface Repository {
  project: string;
  repository: string;
  revision: string;
  checkout: string;
  manifest: Record<string, unknown>;
}
export interface Baseline {
  schemaVersion: string;
  id: string;
  repositories: Repository[];
  [key: string]: unknown;
}
export interface Workspace {
  documents: DocumentRecord[];
  profiles: Blueprint[];
  baseline: Baseline;
  baselineHash: string;
  auxiliary: Record<string, Auxiliary>;
  schemas: Record<string, unknown>;
}
export interface Auxiliary {
  hash: string;
  text: string;
}
export interface Change {
  path: string;
  expected: string;
  text: string;
}
export interface Diagnostic {
  code: string;
  status: "satisfied" | "violated" | "unknown";
  message: string;
  subject?: string;
  path?: string;
  evidence?: string;
}
export interface Finding {
  id: string;
  subject: string;
  field: string;
  category: string;
  before?: unknown;
  after?: unknown;
  impact: string[];
  accepted: boolean;
}
export interface Mapping {
  subject: string;
  bindings: Binding[];
  provenance: string;
  review: "proposed" | "accepted";
}
export interface Pattern {
  id: string;
  assessment: "useful" | "avoid";
  rationale: string;
  applicability: string[];
  binding: Binding;
  review: "proposed" | "accepted";
}
export interface Declaration {
  kind: string;
  symbol: string;
  start: number;
  end: number;
  fingerprint: string;
  exported: boolean;
  bodyLines?: number;
}
export interface InventoryFile {
  path: string;
  blob: string;
  category: string;
  declarations: Declaration[];
  imports: string[];
  exports: string[];
  registrations: string[];
  facts?: Array<{
    kind: string;
    symbol: string;
    value: unknown;
    resolved: boolean;
  }>;
  diagnostics: string[];
}
export interface Inventory {
  project: string;
  revision: string;
  parser: string;
  files: InventoryFile[];
  limitations: string[];
}

export class Data {
  static record(value: unknown): Record<string, unknown> {
    return value && typeof value === "object" && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {};
  }
  static list(value: unknown): unknown[] {
    return Array.isArray(value) ? value : [];
  }
  static strings(value: unknown): string[] {
    return Data.list(value).filter(Data.isString);
  }
  static isString(value: unknown): value is string {
    return typeof value === "string";
  }
  static records(value: unknown): Record<string, unknown>[] {
    return Data.list(value).map(Data.record);
  }
  static text(value: unknown): string {
    return typeof value === "string" ? value : "";
  }
  static canonical(value: unknown): string {
    return JSON.stringify(Data.ordered(value));
  }
  static ordered(value: unknown): unknown {
    if (Array.isArray(value)) return value.map(Data.ordered);
    if (!value || typeof value !== "object") return value;
    const result: Record<string, unknown> = {};
    for (const key of Object.keys(value).sort())
      result[key] = Data.ordered(Data.record(value)[key]);
    return result;
  }
  static objects(
    documents: DocumentRecord[],
    view: string,
  ): ArchitectureObject[] {
    const result: ArchitectureObject[] = [];
    for (const document of documents)
      if (document.model.view === view) result.push(...document.model.objects);
    return result;
  }
}
