import { ElkLayout } from "./layout.js";
import type { Scene } from "./contracts.js";
class LayoutWorker {
  private engine = new ElkLayout();
  async receive(
    event: MessageEvent<{ id: number; scene: Scene }>,
  ): Promise<void> {
    try {
      const result = await this.engine.arrange(event.data.scene);
      globalThis.postMessage({ id: event.data.id, result });
    } catch (error) {
      globalThis.postMessage({ id: event.data.id, error: String(error) });
    }
  }
}
const worker = new LayoutWorker();
globalThis.onmessage = worker.receive.bind(worker);
