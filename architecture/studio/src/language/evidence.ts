import {
  Data,
  type Workspace,
  type Diagnostic,
  type ArchitectureObject,
} from "../model/types.js";
export class EvidenceValidator {
  check(state: Workspace): Diagnostic[] {
    const result: Diagnostic[] = [];
    const pins = new Map<string, string>();
    for (const repository of state.baseline.repositories)
      pins.set(repository.project, repository.revision);
    for (const view of ["intent", "implementation"])
      this.view(state, view, pins, result);
    return result;
  }
  private view(
    state: Workspace,
    view: string,
    pins: Map<string, string>,
    result: Diagnostic[],
  ): void {
    const records = new Map<string, Record<string, unknown>>();
    const objects: ArchitectureObject[] = [];
    for (const document of state.documents) {
      if (document.model.view !== view) continue;
      objects.push(...document.model.objects);
      for (const record of Data.records(document.model.metadata.evidence)) {
        records.set(String(record.id), record);
        if (
          record.stale ||
          pins.get(String(record.project)) !== record.revision
        )
          result.push({
            code: "STALE_EVIDENCE",
            status: "unknown",
            subject: String(record.subject),
            path: view,
            message: String(record.id),
          });
      }
    }
    for (const object of objects)
      if (object.kind === "provider")
        this.qualification(object, records, result);
  }
  private qualification(
    object: ArchitectureObject,
    records: Map<string, Record<string, unknown>>,
    result: Diagnostic[],
  ): void {
    const id = Data.text(Data.record(object.replacement).qualification);
    if (!id) return;
    const record = records.get(id);
    if (
      !record ||
      record.subject !== object.id ||
      record.method !== "runtime"
    ) {
      result.push({
        code: "INVALID_QUALIFICATION_RECORD",
        status: "violated",
        subject: object.id,
        message:
          id + " must identify scoped runtime evidence for this provider",
      });
      return;
    }
    result.push({
      code: "QUALIFICATION_RECORDED",
      status: "satisfied",
      subject: object.id,
      message:
        "Qualification record resolves; its assertion and artifact still require runtime review",
      evidence: id,
    });
  }
}
