import type { ArchitectureObject } from "../model/types.js";

export class ObjectCatalog {
  static readonly kinds = [
    "component",
    "capability",
    "contract",
    "provider",
    "composition",
    "flow",
    "resource",
    "placement",
    "rule",
    "decision",
    "project",
  ];
  static readonly icons: Record<string, string> = {
    component: "⬡",
    capability: "◇",
    contract: "▤",
    provider: "▱",
    composition: "▦",
    flow: "⇢",
    resource: "▰",
    placement: "⌖",
    rule: "⊢",
    decision: "◆",
    project: "▣",
  };
  static readonly help: Record<string, string> = {
    component:
      "A cohesive responsibility. Runtime TreeSeed components are plugins; helpers and records can stay ordinary objects.",
    capability:
      "A named behavior consumers require. A capability has one owner contract and a fixed or selectable implementation.",
    contract:
      "The public agreement between consumers and implementations. Changes can require coordinated updates across projects.",
    provider:
      "A plugin-supplied implementation. Registration, scope selection and readiness are separate facts.",
    composition:
      "A process-local runtime assembly: scopes, registered plugins, selected providers and evidence of readiness.",
    flow: "Named interactions and outcomes, including cancellation, failure and cleanup. A diagram is not runtime proof.",
    resource:
      "Owned state or infrastructure with explicit lifecycle and cleanup obligations.",
    placement:
      "Where an architectural unit belongs. Explicit paths override naming defaults, not ownership constraints.",
    rule: "An obligation with a verification method. Static checks cannot satisfy runtime or architectural-review requirements.",
    decision:
      "A reviewable rationale affecting stable architectural identities.",
    project: "A canonical repository and ownership boundary.",
  };
    static readonly defaults: Record<string, unknown> = {
      component: { project: "", componentKind: "plugin", componentRole: "runtime" },
      capability: {
        contract: "contract.unassigned",
        cardinality: "singleton",
        implementationMode: "selectable",
      },
      contract: { project: "", version: "1", operations: [] },
      provider: {
        component: "component.unassigned",
        capabilities: [],
        contractVersion: "1",
        replacement: { kind: "restart" },
      },
      composition: {
        project: "",
        target: "local",
        process: "",
        scopes: [{ id: "root", lifetime: "process" }],
      },
      flow: {
        participants: [],
        entry: "done",
        nodes: [{ id: "done", kind: "complete", description: "Complete" }],
        outcomes: ["done"],
      },
      resource: { owner: "component.unassigned", lifecycle: "process" },
      placement: {
        project: "",
        subject: "component.unassigned",
        role: "plugin",
        path: "src/new.plugin.ts",
        language: "typescript",
      },
      rule: {
        subjects: [],
        ruleType: "cohesive-responsibility",
        parameters: {},
        verification: "review",
        severity: "review",
      },
      decision: {
        subjects: [],
        status: "proposed",
        rationale: "Explain the decision",
      },
      project: { repository: "https://example.invalid/project.git" },
    };

  static create(kind: string, project: string): ArchitectureObject {
    const id = kind + "." + crypto.randomUUID();
    const base = {
      id,
      kind,
      name: "New " + kind,
      purpose: "Describe this responsibility",
    };
    const defaults = structuredClone(ObjectCatalog.defaults[kind]) as Record<string, unknown>;
    if ('project' in defaults) defaults.project = project;
    if ('process' in defaults) defaults.process = id;
    return { ...base, ...defaults };
  }
  static relationship(from: string, to: string): string | undefined {
    if (["component", "provider"].includes(from) && to === "capability")
      return "provides";
    if (["component", "provider"].includes(from) && to === "contract")
      return "implements";
    if (from === "project" && to === "component") return "owns";
    if (from === "component" && to === "component") return "depends-on";
    return undefined;
  }
}
