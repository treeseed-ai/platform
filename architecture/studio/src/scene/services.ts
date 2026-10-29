import { Context } from "cordis";
import type {
  LayoutService,
  ProjectionService,
  NavigationService,
} from "./contracts.js";
import { SceneProjection } from "./projection.js";
import { CellNavigation } from "./navigation.js";
import { ElkLayout } from "./layout.js";
import { WorkerLayout } from "./worker-client.js";
declare module "cordis" {
  interface Context {
    cellProjection: ProjectionService;
    cellLayout: LayoutService;
    cellNavigation: NavigationService;
  }
}
class ProjectionPlugin {
  static readonly provide = ["cellProjection"];
  constructor(context: Context) {
    context.provide("cellProjection", new SceneProjection());
  }
}
class LayoutPlugin {
  static readonly provide = ["cellLayout"];
  constructor(context: Context) {
    const layout =
      typeof Worker === "undefined" ? new ElkLayout() : new WorkerLayout();
    context.provide("cellLayout", layout);
    if ("dispose" in layout)
      context.effect(LayoutPlugin.release.bind(null, layout));
  }
  private static release(layout: LayoutService): () => void {
    return layout.dispose!.bind(layout);
  }
}
class NavigationPlugin {
  static readonly provide = ["cellNavigation"];
  constructor(context: Context, initial: unknown) {
    context.provide("cellNavigation", new CellNavigation(initial));
  }
}
export class CellServices {
  private context = new Context();
  readonly ready: Promise<void>;
  constructor(initial?: unknown) {
    this.ready = this.initialize(initial);
  }
  private async initialize(initial?: unknown): Promise<void> {
    await this.context.plugin(ProjectionPlugin).await();
    await this.context.plugin(LayoutPlugin).await();
    await this.context.plugin(NavigationPlugin, initial).await();
  }
  get projection(): ProjectionService {
    return this.context.cellProjection;
  }
  get layout(): LayoutService {
    return this.context.cellLayout;
  }
  get navigation(): NavigationService {
    return this.context.cellNavigation;
  }
  async dispose(): Promise<void> {
    await this.context.fiber.dispose();
  }
}
