import { EvidenceValidator } from "../language/evidence.js";
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

import type { StudioServices } from "./contracts.js";
export type { StudioServices } from "./contracts.js";
declare module "cordis" {
  interface Context {
    studio: StudioServices;
    studioWorkspace: StudioServices["workspace"];
    studioSource: StudioServices["source"];
    studioRefresh: StudioServices["refresh"];
    studioComparison: StudioServices["comparison"];
    studioValidator: StudioServices["validator"];
    studioMigration: StudioServices["migration"];
  }
}
export class StudioServicesPlugin {
  constructor(context: Context, root: string) {
    context.plugin(WorkspacePlugin, root);
    context.plugin(SourcePlugin);
    context.plugin(RefreshPlugin);
    context.plugin(ComparisonPlugin);
    context.plugin(ValidationPlugin);
    context.plugin(MigrationPlugin);
    context.plugin(StudioFacadePlugin);
  }
}
class WorkspacePlugin {
  static readonly provide = ["studioWorkspace"];
  constructor(context: Context, root: string) {
    context.provide("studioWorkspace", new WorkspaceService(root));
  }
}
class SourcePlugin {
  static readonly inject = ["studioWorkspace"];
  static readonly provide = ["studioSource"];
  constructor(context: Context) {
    const workspace = context.studioWorkspace;
    context.provide(
      "studioSource",
      new SourceService(
        new GitSource(workspace.roots(workspace.load().baseline)),
      ),
    );
  }
}
class RefreshPlugin {
  static readonly inject = ["studioWorkspace", "studioSource"];
  static readonly provide = ["studioRefresh"];
  constructor(context: Context) {
    context.provide(
      "studioRefresh",
      new RefreshService(context.studioWorkspace, context.studioSource),
    );
  }
}
class ComparisonPlugin {
  static readonly provide = ["studioComparison"];
  constructor(context: Context) {
    context.provide("studioComparison", new ComparisonService());
  }
}
class ValidationPlugin {
  static readonly provide = ["studioValidator"];
  constructor(context: Context) {
    context.provide("studioValidator", new SemanticValidator());
  }
}
class MigrationPlugin {
  static readonly inject = ["studioWorkspace"];
  static readonly provide = ["studioMigration"];
  constructor(context: Context) {
    context.provide(
      "studioMigration",
      new MigrationService(context.studioWorkspace),
    );
  }
}
class StudioFacadePlugin {
  static readonly inject = [
    "studioWorkspace",
    "studioSource",
    "studioRefresh",
    "studioComparison",
    "studioValidator",
    "studioMigration",
  ];
  static readonly provide = ["studio"];
  constructor(context: Context) {
    context.provide("studio", {
      workspace: context.studioWorkspace,
      source: context.studioSource,
      refresh: context.studioRefresh,
      comparison: context.studioComparison,
      validator: context.studioValidator,
      migration: context.studioMigration,
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
    const result: Diagnostic[] = new EvidenceValidator().check(state);
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
