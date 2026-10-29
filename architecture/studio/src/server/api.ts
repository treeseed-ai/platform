import {
  Data,
  type Binding,
  type Change,
  type Workspace,
} from "../model/types.js";
import { StudioAnalysis, type StudioServices } from "./services.js";

export class StudioApi {
  constructor(private services: StudioServices) {}
  async handle(operation: string, body: Record<string, unknown>): Promise<unknown> {
    if (operation === 'workspace') return this.services.workspace.load();
    if (operation === 'save') return this.services.workspace.save(body.changes as Change[]);
    if (operation === 'source') return this.services.source.view(body.binding as Binding);
    if (operation === 'refresh-preview') return this.services.refresh.preview(Data.record(body.revisions) as Record<string, string>);
    if (operation === 'refresh-publish') return this.services.refresh.publish(String(body.id));
    if (['patterns', 'mappings', 'layout'].includes(operation)) return this.services.workspace.saveAuxiliary(operation, String(body.expected ?? ''), body.data);
    return this.analysis(operation, body, this.draft(body));
  }
  private analysis(operation: string, body: Record<string, unknown>, state: Workspace): unknown {
    const analysis = new StudioAnalysis(this.services);
    if (operation === 'compare') return analysis.compare(state);
    if (operation === 'validate') return analysis.validate(state);
    if (operation === 'validate-source') return this.sourceValidation(state);
    if (operation === 'mappings-read') return this.services.workspace.mappings(state);
    if (operation === 'inventory') return this.inventory(state, String(body.project));
    if (operation === 'migration') return this.services.migration.build(state, analysis.compare(state), Data.strings(body.selected), analysis.validate(state));
    throw new Error('UNKNOWN_OPERATION');
  }
  private draft(body: Record<string, unknown>): Workspace {
    const state = this.services.workspace.load();
    for (const change of Data.records(body.drafts)) {
      for (const document of state.documents) {
        if (document.path !== change.path || document.model.view !== "intent")
          continue;
        if (
          this.services.workspace.language.inspect(String(change.text)).length
        )
          throw new Error("SCHEMA_INVALID");
        document.text = String(change.text);
        document.model = this.services.workspace.language.parse(
          document.text,
        ) as typeof document.model;
      }
    }
    return state;
  }
  private async sourceValidation(state: Workspace): Promise<unknown> {
    const revisions = new Map<string, string>();
    for (const repository of state.baseline.repositories)
      revisions.set(repository.project, repository.revision);
    const result = [];
    for (const document of state.documents) {
      if (document.model.view !== "implementation") continue;
      for (const object of document.model.objects)
        for (const binding of object.sourceBindings ?? []) {
          for (const diagnostic of await this.services.source.validate(
            binding,
            revisions,
          ))
            result.push({ ...diagnostic, subject: object.id });
        }
    }
    return result;
  }
  private async inventory(state: Workspace, project: string): Promise<unknown> {
    for (const repository of state.baseline.repositories)
      if (repository.project === project)
        return this.services.source.inventory(repository);
    throw new Error("UNKNOWN_PROJECT");
  }
}
