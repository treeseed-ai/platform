import { test } from "node:test";
import assert from "node:assert/strict";
import { CellSceneFixture } from "../../support/architecture-studio/cell-scene.js";
import { CellServices } from "../../../architecture/studio/src/scene/services.js";

class CellServicesTests {
  static async production(): Promise<void> {
    const services = new CellServices();
    try {
      await services.ready;
      const scene = services.projection.project(CellSceneFixture.documents(), {
        view: "Portfolio",
      });
      const first = await services.layout.arrange(scene);
      const second = await services.layout.arrange(scene);
      assert.deepEqual(first, second);
      assert.equal(first.cells.length, 3);
      for (const cell of first.cells) {
        assert.ok(Number.isFinite(cell.x) && Number.isFinite(cell.y));
        assert.ok(cell.width > 0 && cell.height > 0);
      }
      assert.ok(first.connectors.every(CellServicesTests.routed));
    } finally {
      await services.dispose();
    }
  }
  private static routed(edge: { sections: unknown[] }): boolean {
    return edge.sections.length > 0;
  }
}
test(
  "Cell production composition projects and deterministically routes real service collaborators",
  CellServicesTests.production,
);
