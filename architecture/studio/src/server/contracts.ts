import type { WorkspaceService } from "../workspace/service.js";
import type { SourceService } from "../source/service.js";
import type { RefreshService } from "../source/refresh.js";
import type { ComparisonService } from "../comparison/service.js";
import type { SemanticValidator } from "../language/validator.js";
import type { MigrationService } from "../migration/service.js";
export interface WorkspacePort
  extends Pick<WorkspaceService, keyof WorkspaceService> {}
export interface SourcePort extends Pick<SourceService, keyof SourceService> {}
export interface StudioServices {
  workspace: WorkspacePort;
  source: SourcePort;
  refresh: Pick<RefreshService, "preview" | "publish">;
  comparison: Pick<ComparisonService, "objects" | "workspace">;
  validator: Pick<SemanticValidator, "validate">;
  migration: Pick<MigrationService, "build">;
}
