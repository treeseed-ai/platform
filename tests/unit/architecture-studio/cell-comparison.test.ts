import { test } from "node:test";
import assert from "node:assert/strict";
import { CellSceneFixture } from "../../support/architecture-studio/cell-scene.js";
import { SceneComparison } from "../../../architecture/studio/src/scene/comparison.js";
import { SceneFacts } from "../../../architecture/studio/src/scene/facts.js";
class ComparisonTests {
  static statuses(): void {
    const observed = CellSceneFixture.documents();
    const intended = structuredClone(observed);
    for (const document of intended) document.view = "intent";
    intended[1].relationships!.push({
      kind: "calls",
      from: "provider.run",
      to: "plugin.client",
    });
    const comparison = new SceneComparison([...observed, ...intended]);
    const id = SceneFacts.identity("calls", "provider.run", "plugin.client");
    assert.equal(comparison.relationship(id), "added");
    assert.equal(new SceneComparison(observed).relationship(id), "unchanged");
    assert.equal(
      comparison.relationship(
        SceneFacts.identity("owns", "missing", "missing"),
      ),
      "unchanged",
    );
  }
}
test(
  "Comparison classifies relationship additions independently from layout and active layer",
  ComparisonTests.statuses,
);
