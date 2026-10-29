import { test } from "node:test";
import assert from "node:assert/strict";
import { CellSceneFixture } from "../../support/architecture-studio/cell-scene.js";
import { SceneProjection } from "../../../architecture/studio/src/scene/projection.js";
import { ElkLayout } from "../../../architecture/studio/src/scene/layout.js";

interface Rectangle { id: string; x: number; y: number; width: number; height: number }
class LayoutTests {
  static async geometry(): Promise<void> {
    const documents = CellSceneFixture.documents();
    documents[1].relationships!.push({ kind: "calls", from: "provider.run", to: "plugin.client" });
    documents[2].objects.push({ id: "isolated", kind: "component", name: "Disconnected helper with a deliberately long label", componentKind: "object" });
    const scene = new SceneProjection().project(documents, { view: "Components", project: "project.api" });
    const engine = new ElkLayout();
    const result = await engine.arrange(scene);
    for (const first of result.cells)
      for (const second of result.cells)
        if (first.id !== second.id) LayoutTests.disjoint(first, second);
    for (const edge of result.connectors) {
      assert.ok(edge.sections.length > 0);
      for (const section of edge.sections) {
        assert.ok(Number.isFinite(section.startPoint.x));
        assert.ok(Number.isFinite(section.endPoint.y));
      }
    }
    assert.deepEqual(result, await engine.arrange(scene));
  }
  private static disjoint(first: Rectangle, second: Rectangle): void {
    assert.ok(first.x + first.width <= second.x || second.x + second.width <= first.x ||
      first.y + first.height <= second.y || second.y + second.height <= first.y,
      "Cell interiors overlap: " + first.id + " / " + second.id);
  }
}
test("ELK lays out cycles, disconnected cells and long labels without interior overlaps", LayoutTests.geometry);
