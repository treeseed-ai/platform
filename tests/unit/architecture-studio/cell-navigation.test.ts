import { test } from "node:test";
import assert from "node:assert/strict";
import { CellNavigation } from "../../../architecture/studio/src/scene/navigation.js";

class NavigationTests {
  static custody(): void {
    const navigation = new CellNavigation();
    navigation.enter("Components", "project.agent");
    navigation.move("plugin.run", { x: 40, y: 80 });
    navigation.expand("plugin.run");
    navigation.viewport({ x: 10, y: 20, zoom: 0.7 });
    navigation.enter("Portfolio");
    assert.deepEqual(navigation.current().positions, {});
    navigation.enter("Components", "project.agent");
    assert.deepEqual(navigation.current().positions["plugin.run"], {
      x: 40,
      y: 80,
    });
    assert.ok(navigation.current().expanded.includes("plugin.run"));
    navigation.arrange({ "plugin.run": { x: 200, y: 200 } });
    navigation.undo();
    assert.deepEqual(navigation.current().positions["plugin.run"], {
      x: 40,
      y: 80,
    });
  }
  static legacy(): void {
    const legacy = {
      schemaVersion: "studio-layout/0.1",
      positions: { old: { x: 5, y: 6 } },
    };
    const navigation = new CellNavigation(legacy);
    assert.deepEqual(navigation.current().positions, {});
    assert.deepEqual(navigation.serialize().legacy, legacy);
    assert.equal(navigation.serialize().schemaVersion, "studio-layout/0.2");
    const restored = new CellNavigation(navigation.serialize());
    assert.deepEqual(restored.serialize(), navigation.serialize());
  }
}
test(
  "Cell layout custody restores scoped geometry and makes arrange undoable",
  NavigationTests.custody,
);
test(
  "Legacy grid coordinates remain recoverable without becoming nested cell geometry",
  NavigationTests.legacy,
);
