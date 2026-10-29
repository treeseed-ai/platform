import { test } from "node:test";
import assert from "node:assert/strict";
import { CellSceneFixture } from "../../support/architecture-studio/cell-scene.js";
import { SceneProjection } from "../../../architecture/studio/src/scene/projection.js";
class FlowTests {
  static transitions(): void {
    const documents = CellSceneFixture.documents();
    documents[1].objects.push(FlowTests.flow);
    const scene = new SceneProjection().project(documents, {
      view: "Flows",
      project: "project.agent",
      flow: "flow.run",
    });
    assert.equal(scene.cells.length, 4);
    assert.equal(scene.connectors.length, 4);
    assert.ok(scene.connectors.some(FlowTests.failure));
    assert.ok(scene.cells.every(FlowTests.subject));
  }
  static unresolved(): void {
    const documents = CellSceneFixture.documents();
    documents[1].objects.push({
      id: "flow.broken",
      kind: "flow",
      name: "Missing step",
      nodes: [{ id: "entry", kind: "entry", next: "missing" }],
    });
    const scene = new SceneProjection().project(documents, {
      view: "Flows",
      project: "project.agent",
      flow: "flow.broken",
    });
    assert.ok(scene.cells.some(FlowTests.unknown));
    assert.equal(scene.diagnostics[0].code, "FLOW_ENDPOINT");
  }
  private static unknown(cell: { unresolved: boolean }): boolean {
    return cell.unresolved;
  }
  private static failure(edge: { label: string }): boolean {
    return edge.label === "failed";
  }
  private static subject(cell: { subject: string }): boolean {
    return cell.subject === "flow.run";
  }
  private static readonly flow = {
    id: "flow.run",
    kind: "flow",
    name: "Execution",
    nodes: [
      { id: "entry", kind: "entry", next: "call" },
      {
        id: "call",
        kind: "call",
        outcomes: { success: "done", failed: "cleanup" },
      },
      { id: "cleanup", kind: "cleanup", next: "done" },
      { id: "done", kind: "complete" },
    ],
  };
}
test(
  "Flow scenes project modeled outcomes and cleanup rather than dependency order",
  FlowTests.transitions,
);

test("Missing flow targets remain visible diagnostics", FlowTests.unresolved);
