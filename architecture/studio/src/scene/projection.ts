import { FlowProjection } from "./flows.js";
import type { Blueprint } from "../model/types.js";
import type { Scene, SceneContext, ProjectionService } from "./contracts.js";
import { SceneFacts } from "./facts.js";
import { CellCatalog } from "./cells.js";
import { BoundaryConnections } from "./connections.js";

export class SceneProjection implements ProjectionService {
  project(documents: Blueprint[], context: SceneContext): Scene {
    const facts = new SceneFacts(documents);
    const flow = facts.graph.objects.get(context.flow || "");
    if (context.view === "Flows" && flow?.kind === "flow")
      return new FlowProjection().project(flow, context);
    const catalog = new CellCatalog(facts, context);
    catalog.initialize();
    const connections = new BoundaryConnections(catalog);
    for (const edge of facts.relationships) connections.project(edge);
    connections.declared();
    connections.finish();
    return {
      context,
      cells: [...catalog.cells.values()].sort(SceneFacts.ordered),
      ports: [...connections.ports.values()].sort(SceneFacts.ordered),
      connectors: [...connections.connectors.values()].sort(SceneFacts.ordered),
      relationships: facts.relationships,
      diagnostics: facts.diagnostics,
    };
  }
}
