import type { LayoutResult, LayoutService, Scene } from "./contracts.js";
interface Pending {
  resolve: (result: LayoutResult) => void;
  reject: (error: Error) => void;
}
export class WorkerLayout implements LayoutService {
  private worker?: Worker;
  private sequence = 0;
  private pending = new Map<number, Pending>();
  private open(): Worker {
    const worker = new Worker(new URL("./layout-worker.ts", import.meta.url), {
      type: "module",
    });
    worker.onmessage = this.received.bind(this);
    worker.onerror = this.failed.bind(this);
    this.worker = worker;
    return worker;
  }
  arrange(scene: Scene): Promise<LayoutResult> {
    return new Promise<LayoutResult>(this.send.bind(this, scene));
  }
  private send(
    scene: Scene,
    resolve: Pending["resolve"],
    reject: Pending["reject"],
  ): void {
    const id = ++this.sequence;
    this.pending.set(id, { resolve, reject });
    (this.worker || this.open()).postMessage({ id, scene });
  }
  private received(
    event: MessageEvent<{ id: number; result: LayoutResult; error?: string }>,
  ): void {
    const pending = this.pending.get(event.data.id);
    if (event.data.error) pending?.reject(new Error(event.data.error));
    else pending?.resolve(event.data.result);
    this.pending.delete(event.data.id);
  }
  private failed(event: ErrorEvent): void {
    this.worker?.terminate();
    this.worker = undefined;
    for (const pending of this.pending.values())
      pending.reject(new Error(event.message));
    this.pending.clear();
  }
  dispose(): void {
    this.worker?.terminate();
    for (const pending of this.pending.values())
      pending.reject(new Error("Layout worker disposed"));
    this.pending.clear();
  }
}
