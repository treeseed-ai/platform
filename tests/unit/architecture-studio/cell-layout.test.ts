import { test } from "node:test";
import assert from "node:assert/strict";
import { CellSceneFixture } from "../../support/architecture-studio/cell-scene.js";
import { SceneProjection } from "../../../architecture/studio/src/scene/projection.js";
import { ElkLayout } from "../../../architecture/studio/src/scene/layout.js";

interface Rectangle {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}
class LayoutTests {
  static async geometry(): Promise<void> {
    const scene = LayoutTests.scene();
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
    LayoutTests.routes(result);
    assert.deepEqual(result, await engine.arrange(scene));
  }
  private static routes(
    result: Awaited<ReturnType<ElkLayout["arrange"]>>,
  ): void {
    for (const edge of result.connectors) {
      const source = result.cells.find(LayoutTests.id.bind(null, edge.source))!;
      const target = result.cells.find(LayoutTests.id.bind(null, edge.target))!;
      const out = result.ports.find(
        LayoutTests.id.bind(null, edge.sourcePort),
      )!;
      const into = result.ports.find(
        LayoutTests.id.bind(null, edge.targetPort),
      )!;
      assert.deepEqual(edge.sections[0].startPoint, {
        x: source.x + out.x,
        y: source.y + out.y,
      });
      assert.deepEqual(edge.sections.at(-1)!.endPoint, {
        x: target.x + into.x,
        y: target.y + into.y,
      });
      for (const section of edge.sections)
        LayoutTests.segments(section, result.cells, edge.source, edge.target);
    }
  }
  private static segments(
    section: {
      startPoint: { x: number; y: number };
      endPoint: { x: number; y: number };
      bendPoints?: { x: number; y: number }[];
    },
    cells: Rectangle[],
    source: string,
    target: string,
  ): void {
    const points = [
      section.startPoint,
      ...(section.bendPoints || []),
      section.endPoint,
    ];
    for (let i = 1; i < points.length; i++) {
      const a = points[i - 1],
        b = points[i];
      assert.ok(a.x === b.x || a.y === b.y, "Route must be orthogonal");
      for (const cell of cells) {
        if (cell.id === source || cell.id === target) continue;
        const crosses = LayoutTests.crosses(a, b, cell);
        assert.equal(crosses, false, "Route crosses unrelated cell " + cell.id);
      }
    }
  }
  private static crosses(
    a: { x: number; y: number },
    b: { x: number; y: number },
    cell: Rectangle,
  ): boolean {
    return a.x === b.x
      ? a.x > cell.x &&
          a.x < cell.x + cell.width &&
          Math.max(a.y, b.y) > cell.y &&
          Math.min(a.y, b.y) < cell.y + cell.height
      : a.y > cell.y &&
          a.y < cell.y + cell.height &&
          Math.max(a.x, b.x) > cell.x &&
          Math.min(a.x, b.x) < cell.x + cell.width;
  }
  private static id(id: string, value: { id: string }): boolean {
    return id === value.id;
  }
  private static scene() {
    const documents = CellSceneFixture.documents();
    documents[1].relationships!.push({
      kind: "calls",
      from: "provider.run",
      to: "plugin.client",
    });
    documents[2].objects.push({
      id: "isolated",
      kind: "component",
      name: "Disconnected helper with a deliberately long label",
      componentKind: "object",
    });
    return new SceneProjection().project(documents, {
      view: "Components",
      project: "project.api",
    });
  }
  private static disjoint(first: Rectangle, second: Rectangle): void {
    assert.ok(
      first.x + first.width <= second.x ||
        second.x + second.width <= first.x ||
        first.y + first.height <= second.y ||
        second.y + second.height <= first.y,
      "Cell interiors overlap: " + first.id + " / " + second.id,
    );
  }
}
test(
  "ELK lays out cycles, disconnected cells and long labels without interior overlaps",
  LayoutTests.geometry,
);
