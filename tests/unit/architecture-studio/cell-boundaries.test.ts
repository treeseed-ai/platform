import { test } from "node:test";
import assert from "node:assert/strict";
import { CellSceneFixture } from "../../support/architecture-studio/cell-scene.js";
import { SceneProjection } from "../../../architecture/studio/src/scene/projection.js";

class BoundaryTests {
  static invalidOwnership(): void {
    const documents = CellSceneFixture.documents();
    documents[1].objects[2].component = "plugin.client";
    const scene = new SceneProjection().project(documents, {
      view: "Components",
      project: "project.agent",
    });
    assert.ok(scene.diagnostics.some(BoundaryTests.ownership));
    assert.ok(scene.cells.some(BoundaryTests.orphan));
  }
  static unresolved(): void {
    const documents = CellSceneFixture.documents();
    documents[2].relationships!.push({
      kind: "depends-on",
      from: "plugin.client",
      to: "external.database",
    });
    const scene = new SceneProjection().project(documents, {
      view: "Portfolio",
    });
    assert.ok(scene.cells.some(BoundaryTests.external));
    assert.ok(scene.connectors.some(BoundaryTests.unresolvedEdge));
  }
  static scope(): void {
    const documents = CellSceneFixture.documents();
    documents[1].objects.push(BoundaryTests.composition);
    const scene = new SceneProjection().project(documents, {
      view: "Components",
      project: "project.agent",
      expanded: ["plugin.run"],
      composition: "composition.agent",
      scope: "scope.root",
    });
    const plugin = scene.cells.find(BoundaryTests.plugin)!;
    assert.equal(plugin.providers[0].selection, "selected");
    assert.equal(plugin.providers[0].registered, true);
    assert.equal(plugin.providers[0].readiness, "unknown");
  }
  private static readonly composition = {
    id: "composition.agent",
    kind: "composition",
    name: "Agent root",
    registrations: ["provider.run"],
    scopes: [{ id: "scope.root", lifetime: "process" }],
    selections: [
      {
        scope: "scope.root",
        capability: "capability.run",
        provider: "provider.run",
      },
    ],
  };
  private static ownership(diagnostic: { code: string }): boolean {
    return diagnostic.code === "PROVIDER_OWNERSHIP";
  }
  private static orphan(cell: { subject: string }): boolean {
    return cell.subject === "provider.run";
  }
  private static external(cell: { subject: string }): boolean {
    return cell.subject === "external.database";
  }
  private static unresolvedEdge(edge: {
    relationships: Array<{ to: string }>;
  }): boolean {
    return edge.relationships.some(BoundaryTests.endpoint);
  }
  private static endpoint(edge: { to: string }): boolean {
    return edge.to === "external.database";
  }
  private static plugin(cell: { subject: string }): boolean {
    return cell.subject === "plugin.run";
  }
}
test(
  "Cross-project provider ownership is diagnosed and never guessed",
  BoundaryTests.invalidOwnership,
);
test(
  "Unresolved external endpoints stay visible at project boundaries",
  BoundaryTests.unresolved,
);
test(
  "Provider selection uses composition and scope without implying readiness",
  BoundaryTests.scope,
);
