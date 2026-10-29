import { test } from "node:test";
import assert from "node:assert/strict";
import { LayoutSession } from "../../../architecture/studio/src/scene/layout-session.js";
import type {
  LayoutResult,
  LayoutService,
  Scene,
} from "../../../architecture/studio/src/scene/contracts.js";
class DeferredLayout implements LayoutService {
  callbacks: Array<{
    resolve: (value: LayoutResult) => void;
    reject: (error: Error) => void;
  }> = [];
  arrange(_scene: Scene): Promise<LayoutResult> {
    return new Promise(this.pending.bind(this));
  }
  private pending(
    resolve: (value: LayoutResult) => void,
    reject: (error: Error) => void,
  ): void {
    this.callbacks.push({ resolve, reject });
  }
}
class LayoutSessionTests {
  static async freshness(): Promise<void> {
    const engine = new DeferredLayout(),
      session = new LayoutSession(engine);
    const first = session.request(LayoutSessionTests.scene, "old");
    const second = session.request(LayoutSessionTests.scene, "new");
    engine.callbacks[1].resolve(LayoutSessionTests.result);
    assert.deepEqual(await second, LayoutSessionTests.result);
    engine.callbacks[0].resolve({
      ...LayoutSessionTests.result,
      engine: "obsolete",
    });
    assert.equal(await first, undefined);
    const failing = session.request(LayoutSessionTests.scene, "failed");
    engine.callbacks[2].reject(new Error("engine failure"));
    await assert.rejects(failing, /engine failure/);
    assert.deepEqual(session.last, LayoutSessionTests.result);
  }
  private static readonly scene: Scene = {
    context: { view: "Portfolio" },
    cells: [],
    ports: [],
    connectors: [],
    relationships: [],
    diagnostics: [],
  };
  private static readonly result: LayoutResult = {
    cells: [],
    ports: [],
    connectors: [],
    engine: "fixture",
    diagnostics: [],
  };
}
test(
  "Obsolete layout replies cannot replace current geometry and failure retains last usable result",
  LayoutSessionTests.freshness,
);
