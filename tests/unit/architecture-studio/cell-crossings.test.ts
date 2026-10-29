import { test } from "node:test";
import assert from "node:assert/strict";
import { ElkLayout } from "../../../architecture/studio/src/scene/layout.js";
import { SceneProjection } from "../../../architecture/studio/src/scene/projection.js";
import type { Blueprint } from "../../../architecture/studio/src/model/types.js";
import type { Point } from "../../../architecture/studio/src/scene/contracts.js";
type Segment = [Point, Point];
class CrossingTests {
  static async tangled(): Promise<void> {
    const documents: Blueprint[] = [];
    const old: Segment[] = [];
    for (let i = 0; i < 8; i++) documents.push(CrossingTests.project(i));
    for (let i = 0; i < 4; i++) {
      documents[i].relationships = [
        { kind: "calls", from: "p" + i, to: "p" + (7 - i) },
      ];
      old.push([
        { x: 100, y: i * 200 },
        { x: 700, y: (3 - i) * 200 },
      ]);
    }
    const result = await new ElkLayout().arrange(
      new SceneProjection().project(documents, { view: "Portfolio" }),
    );
    const routed: Segment[] = [];
    for (const edge of result.connectors)
      for (const section of edge.sections) {
        const points = [
          section.startPoint,
          ...(section.bendPoints || []),
          section.endPoint,
        ];
        for (let i = 1; i < points.length; i++)
          routed.push([points[i - 1], points[i]]);
      }
    assert.ok(CrossingTests.count(routed) < CrossingTests.count(old));
  }
  private static project(index: number): Blueprint {
    return {
      schemaVersion: "0.1",
      id: "doc" + index,
      project: "p" + index,
      view: "implementation",
      metadata: {},
      objects: [{ id: "p" + index, kind: "project", name: "Project " + index }],
    } as Blueprint;
  }
  private static count(segments: Segment[]): number {
    let count = 0;
    for (let i = 0; i < segments.length; i++)
      for (let j = i + 1; j < segments.length; j++)
        if (CrossingTests.crosses(segments[i], segments[j])) count++;
    return count;
  }
  private static crosses([a, b]: Segment, [c, d]: Segment): boolean {
    return (
      CrossingTests.side(a, b, c) * CrossingTests.side(a, b, d) < 0 &&
      CrossingTests.side(c, d, a) * CrossingTests.side(c, d, b) < 0
    );
  }
  private static side(a: Point, b: Point, c: Point): number {
    return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
  }
}
test(
  "Connection layout reduces crossings in a reversed-grid fixture",
  CrossingTests.tangled,
);
