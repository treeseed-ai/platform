import type { Blueprint } from "../../../architecture/studio/src/model/types.js";

const documents: Blueprint[] = [
  {
    schemaVersion: "0.1",
    view: "intent",
    project: "project.sdk",
    metadata: {},
    objects: [
      { id: "project.sdk", kind: "project", name: "SDK" },
      {
        id: "contract.run",
        kind: "contract",
        name: "Run",
        project: "project.sdk",
        version: "1",
      },
      {
        id: "capability.run",
        kind: "capability",
        name: "Run capability",
        contract: "contract.run",
      },
    ],
  },
  {
    schemaVersion: "0.1",
    view: "intent",
    project: "project.agent",
    metadata: {},
    objects: [
      { id: "project.agent", kind: "project", name: "Agent" },
      {
        id: "plugin.run",
        kind: "component",
        componentKind: "plugin",
        name: "Run plugin",
        contracts: ["contract.run"],
      },
      {
        id: "provider.run",
        kind: "provider",
        name: "Run provider",
        component: "plugin.run",
        capabilities: ["capability.run"],
        contract: "contract.run",
        contractVersion: "1",
      },
    ],
    relationships: [
      { kind: "implements", from: "provider.run", to: "contract.run" },
      { kind: "implements", from: "provider.run", to: "contract.run" },
    ],
  },
  {
    schemaVersion: "0.1",
    view: "intent",
    project: "project.api",
    metadata: {},
    objects: [
      { id: "project.api", kind: "project", name: "API" },
      {
        id: "plugin.client",
        kind: "component",
        componentKind: "plugin",
        name: "Client",
        dependencies: ["provider.run"],
      },
    ],
    relationships: [
      { kind: "calls", from: "plugin.client", to: "provider.run" },
    ],
  },
];
export class CellSceneFixture {
  static documents(): Blueprint[] {
    return structuredClone(documents);
  }
}
