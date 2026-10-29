import {
  Data,
  type Binding,
  type Repository,
  type Inventory,
  type Diagnostic,
} from "../model/types.js";
import { GitSource } from "./git.js";
import { SourceParser } from "./parser.js";

export class SourceService {
  constructor(readonly git: GitSource) {}
  async inventory(repository: Repository): Promise<Inventory> {
    const files = [];
    for (const entry of this.git.files(repository)) files.push(await this.file(repository, entry));
    return { project: repository.project, revision: repository.revision, parser: 'typescript@5.9.3/studio@0.1', files, limitations: ['Syntax extraction; dynamic registrations and calls remain unresolved.', 'No runtime execution or behavioral proof.'] };
  }
  private async file(repository: Repository, entry: {path: string; blob: string; mode: string}): Promise<Inventory['files'][number]> {
    if (/\.[cm]?tsx?$/.test(entry.path) && entry.mode !== '120000') {
      const binding = { project: repository.project, revision: repository.revision, path: entry.path };
      return new SourceParser().parse(entry.path, this.git.read(binding), entry.blob);
    }
    return { ...entry, category: SourceParser.category(entry.path), declarations: [], imports: [], exports: [], registrations: [], diagnostics: [] };
  }
  async view(binding: Binding): Promise<Record<string, unknown>> {
    const text = this.git.read(binding);
    if (!/\.[cm]?tsx?$/.test(binding.path))
      return {
        text,
        binding,
        declarations: [],
        diagnostics: ["UNSUPPORTED_EXTRACTION"],
      };
    const parsed = await new SourceParser().parse(binding.path, text);
    return { text, binding, ...parsed };
  }
  async validate(binding: Binding, revisions: Map<string, string>): Promise<Diagnostic[]> {
    const result: Diagnostic[] = [];
    if (revisions.get(binding.project) !== binding.revision) result.push({ code: 'STALE_EVIDENCE', status: 'unknown', message: binding.path });
    try { result.push(...this.inspectBinding(binding, await this.view(binding))); }
    catch (error) { result.push({ code: String(error).includes('RESOLVED_PATH_ESCAPE') ? 'RESOLVED_PATH_ESCAPE' : 'MISSING_SOURCE', status: 'violated', message: String(error) }); }
    return result;
  }
  private inspectBinding(binding: Binding, view: Record<string, unknown>): Diagnostic[] {
    const result: Diagnostic[] = [];
    const selected = Data.records(view.declarations).filter(SourceService.symbol.bind(null, binding.symbol));
    if (binding.symbol && selected.length !== 1) result.push({ code: 'MISSING_SOURCE', status: 'violated', message: 'Missing/ambiguous symbol: ' + binding.symbol });
    if (binding.fingerprint && selected[0]?.fingerprint !== binding.fingerprint) result.push({ code: 'STALE_EVIDENCE', status: 'unknown', message: 'Fingerprint changed: ' + binding.symbol });
    for (const declaration of selected) if (Number(declaration.bodyLines) > 20) result.push({ code: 'METHOD_TOO_LONG', status: 'violated', message: declaration.symbol + ': ' + declaration.bodyLines + ' formatted body lines' });
    for (const diagnostic of Data.strings(view.diagnostics)) result.push({ code: diagnostic.split(':')[0], status: 'unknown', message: diagnostic });
    return result;
  }
  private static symbol(
    symbol: string | undefined,
    declaration: Record<string, unknown>,
  ): boolean {
    return !symbol || declaration.symbol === symbol;
  }
}
