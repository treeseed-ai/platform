import type { LayoutResult, LayoutService, Scene } from "./contracts.js";
export class LayoutSession {
  private sequence = 0;
  private cache = new Map<string, LayoutResult>();
  last?: LayoutResult;
  constructor(private engine: LayoutService) {}
  async request(
    scene: Scene,
    key: string,
    force = false,
  ): Promise<LayoutResult | undefined> {
    const sequence = ++this.sequence;
    const result =
      (!force && this.cache.get(key)) || (await this.engine.arrange(scene));
    if (sequence !== this.sequence) return undefined;
    this.cache.set(key, result);
    this.last = result;
    return result;
  }
  cancel(): void {
    this.sequence++;
  }
}
