import { test } from "node:test";
import assert from "node:assert/strict";
import { CellSceneFixture } from "../../support/architecture-studio/cell-scene.js";
import { SceneProjection } from "../../../architecture/studio/src/scene/projection.js";

class ProjectionTests {
  static ownership(): void {
    const projection = new SceneProjection();
    const scene = projection.project(CellSceneFixture.documents(), {
      view: "Components",
      project: "project.agent",
      expanded: ["plugin.run"],
    });
    const plugin = scene.cells.find(ProjectionTests.plugin)!;
    assert.ok(plugin.providers.some(ProjectionTests.provider));
    assert.ok(scene.connectors.some(ProjectionTests.trace));
    assert.ok(scene.cells.some(ProjectionTests.sdk));
  }
  static deduplication(): void {
    const scene = new SceneProjection().project(CellSceneFixture.documents(), {
      view: "Portfolio",
    });
    const identities = scene.relationships.map(ProjectionTests.identity);
    assert.equal(new Set(identities).size, identities.length);
    assert.equal(scene.cells.length, 3);
    assert.ok(scene.ports.length > 0);
  }
  private static plugin(cell: { subject: string }): boolean {
    return cell.subject === "plugin.run";
  }
  private static provider(item: { subject: string }): boolean {
    return item.subject === "provider.run";
  }
  private static sdk(cell: { subject: string }): boolean {
    return cell.subject === "project.sdk";
  }
  private static trace(edge: {
    relationships: Array<{ from: string; to: string }>;
  }): boolean {
    return edge.relationships.some(ProjectionTests.endpoint);
  }
  private static endpoint(edge: { from: string; to: string }): boolean {
    return edge.from === "provider.run" && edge.to === "contract.run";
  }
  private static identity(edge: {
    kind: string;
    from: string;
    to: string;
  }): string {
    return JSON.stringify([edge.kind, edge.from, edge.to]);
  }
}
test(
  "Cell projection preserves explicit provider and SDK contract ownership",
  ProjectionTests.ownership,
);
test(
  "Cell projection deduplicates inferred and explicit relationships",
  ProjectionTests.deduplication,
);
