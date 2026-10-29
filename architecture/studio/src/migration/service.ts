import {
  Data,
  type Workspace,
  type Finding,
  type Diagnostic,
  type Blueprint,
} from "../model/types.js";
import { WorkspaceFiles } from "../workspace/files.js";
import { WorkspaceService } from "../workspace/service.js";
import { ArchitectureGraph } from "../language/graph.js";

export class MigrationService {
  constructor(private workspace: WorkspaceService) {}
  build(
    state: Workspace,
    findings: Finding[],
    selected: string[],
    diagnostics: Diagnostic[],
  ): Record<string, unknown> {
    const graph = new ArchitectureGraph(
      state.documents
        .filter(MigrationService.intent)
        .map(MigrationService.model),
    );
    const wanted = findings.filter(
      MigrationService.selected.bind(null, selected),
    );
    if (!wanted.length) throw new Error("EMPTY_SELECTION");
    const subjects = new Set(wanted.map(MigrationService.subject));
    for (const finding of wanted)
      for (const id of finding.impact) subjects.add(id);
    const closure = findings.filter(
      MigrationService.inClosure.bind(null, subjects),
    );
    const blockers = diagnostics.filter(MigrationService.violated);
    const tasks = this.tasks(closure, graph);
    const manifest = this.manifest(
      state,
      closure,
      tasks,
      blockers,
      diagnostics,
    );
    return {
      manifest,
      markdown: this.markdown(manifest),
      id: WorkspaceFiles.hash(Data.canonical(manifest)),
    };
  }
  private manifest(
    state: Workspace,
    findings: Finding[],
    tasks: Record<string, unknown[]>,
    blockers: Diagnostic[],
    diagnostics: Diagnostic[],
  ): Record<string, unknown> {
    return {
      schemaVersion: "studio-migration/0.1",
      status:
        blockers.length || !findings.some(MigrationService.accepted)
          ? "draft"
          : "reviewed",
      baseline: state.baseline,
      baselineHash: state.baselineHash,
      documents: state.documents.map(MigrationService.documentIdentity),
      findings,
      tasks,
      proposals: findings.filter(MigrationService.proposed),
      diagnostics,
      blockers,
      patterns: this.workspace.patterns(state),
      limitations: [
        "Known dependency closure only; dynamic boundaries remain unresolved.",
        "Runtime qualification must be supplied before implementation is called conformant.",
      ],
      constraints: state.profiles,
      acceptance: [
        "Run owning repository checks and built-program acceptance.",
        "Refresh exact source pins and revalidate; do not copy observations into intent.",
      ],
      intent: state.documents
        .filter(MigrationService.intent)
        .map(MigrationService.model),
    };
  }
  private tasks(
    findings: Finding[],
    graph: ArchitectureGraph,
  ): Record<string, unknown[]> {
    const result: Record<string, unknown[]> = {};
    for (const finding of findings) {
      if (!finding.accepted) continue;
      const object = graph.objects.get(finding.subject);
      const project = String(
        object?.project ||
          graph.objects.get(String(object?.component))?.project ||
          "cross-project",
      );
      (result[project] ??= []).push({
        subject: finding.subject,
        change: finding,
        sourceBindings: object?.sourceBindings ?? [],
        instruction:
          "Implement the accepted intent in its owning repository; preserve public contract consumers and qualify provider behavior.",
      });
    }
    return result;
  }
  private markdown(manifest: Record<string, unknown>): string {
    return (
      "# Architectural migration package\n\nStatus: " +
      manifest.status +
      "\n\nBaseline: " +
      manifest.baselineHash +
      "\n\n## Repository tasks\n\n```json\n" +
      JSON.stringify(manifest.tasks, null, 2) +
      "\n```\n\n## Proposals awaiting acceptance\n\n```json\n" +
      JSON.stringify(manifest.proposals, null, 2) +
      "\n```\n\n## Evidence and constraints\n\nSee manifest.json for exact intent, source revisions, diagnostics, patterns and acceptance requirements. This package does not execute source changes.\n"
    );
  }
  private static intent(document: { model: Blueprint }): boolean {
    return document.model.view === "intent";
  }
  private static model(document: { model: Blueprint }): Blueprint {
    return document.model;
  }
  private static subject(finding: Finding): string {
    return finding.subject;
  }
  private static selected(ids: string[], finding: Finding): boolean {
    return ids.includes(finding.id);
  }
  private static inClosure(subjects: Set<string>, finding: Finding): boolean {
    return subjects.has(finding.subject);
  }
  private static violated(diagnostic: Diagnostic): boolean {
    return diagnostic.status === "violated";
  }
  private static accepted(finding: Finding): boolean {
    return finding.accepted;
  }
  private static proposed(finding: Finding): boolean {
    return !finding.accepted;
  }
  private static documentIdentity(document: {
    path: string;
    hash: string;
  }): unknown {
    return { path: document.path, hash: document.hash };
  }
}
