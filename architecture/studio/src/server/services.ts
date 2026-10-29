import { Context } from "cordis";
import { WorkspaceService } from "../workspace/service.js";
import { SourceService } from "../source/service.js";
import { GitSource } from "../source/git.js";
import { RefreshService } from "../source/refresh.js";
import { ComparisonService } from "../comparison/service.js";
import { SemanticValidator } from "../language/validator.js";
import { MigrationService } from "../migration/service.js";
import type {
  Workspace,
  Finding,
  Diagnostic,
  Blueprint,
} from "../model/types.js";

export interface StudioServices {
  workspace: WorkspaceService;
  source: SourceService;
  refresh: RefreshService;
  comparison: ComparisonService;
  validator: SemanticValidator;
  migration: MigrationService;
}
declare module "cordis" {
  interface Context {
    studio: StudioServices;
  }
}
export class StudioServicesPlugin {
  static readonly provide = ["studio"];
  constructor(context: Context, root: string) {
    const workspace = new WorkspaceService(root);
    const source = new SourceService(
      new GitSource(workspace.roots(workspace.load().baseline)),
    );
    context.provide("studio", {
      workspace,
      source,
      refresh: new RefreshService(workspace, source),
      comparison: new ComparisonService(),
      validator: new SemanticValidator(),
      migration: new MigrationService(workspace),
    });
  }
}
export class StudioAnalysis {
  constructor(private services: StudioServices) {}
  compare(state: Workspace): Finding[] {
    const current: Blueprint[] = [],
      intent: Blueprint[] = [];
    for (const document of state.documents)
      (document.model.view === "intent" ? intent : current).push(
        document.model,
      );
    return this.services.comparison.workspace(current, intent);
  }
  validate(state: Workspace): Diagnostic[] {
    const result: Diagnostic[] = [];
    for (const view of ["implementation", "intent"]) {
      const models = [];
      for (const document of state.documents) {
        if (document.model.view !== view) continue;
        for (const diagnostic of this.services.workspace.language.inspect(
          document.text,
        ))
          result.push({ ...diagnostic, path: document.path });
        models.push(document.model);
      }
      for (const diagnostic of this.services.validator.validate(
        models,
        state.profiles,
      ))
        result.push({ ...diagnostic, path: view });
    }
    return result;
  }
}
