import { test } from "node:test";
import assert from "node:assert/strict";
import { resolve } from "node:path";
import { ObjectCatalog } from "../../../architecture/studio/src/client/catalog.js";
import { LanguageService } from "../../../architecture/studio/src/language/service.js";
import { WorkspaceService } from "../../../architecture/studio/src/workspace/service.js";
import { DraftStore } from "../../../architecture/studio/src/client/store.js";
import { ComparisonService } from "../../../architecture/studio/src/comparison/service.js";
class AuthoringCases {
  static palette(): void {
    const workspace = new WorkspaceService(resolve("architecture")).load();
    const document = workspace.documents.find(AuthoringCases.intent)!.model;
    const language = new LanguageService(resolve("architecture/language"));
    for (const kind of ObjectCatalog.kinds) {
      const draft = structuredClone(document);
      draft.objects.push(ObjectCatalog.create(kind, draft.project));
      assert.deepEqual(
        language.inspect(WorkspaceService.serialize(draft)),
        [],
        kind,
      );
    }
  }
  private static intent(document: { model: { view: string } }): boolean {
    return document.model.view === "intent";
  }
  static commands(): void {
    const store = new DraftStore();
    store.state = new WorkspaceService(resolve("architecture")).load();
    const object = store.objects()[0];
    const name = object.name;
    store.accept(object.id);
    store.update(object.id, "name", "Changed");
    assert.ok(
      !store
        .document(object.id)!
        .model.metadata.acceptedSubjects?.toString()
        .includes(object.id),
    );
    store.undo();
    assert.equal(store.find(object.id)!.name, name);
    store.redo();
    assert.equal(store.find(object.id)!.name, "Changed");
  }
  static relationships(): void {
    const object = { id: "component.a", kind: "component", name: "A" };
    const model = {
      schemaVersion: "0.1",
      project: "project.a",
      view: "intent",
      metadata: {},
      objects: [object],
    };
    const intent = {
      ...model,
      relationships: [
        { kind: "requires", from: "component.a", to: "capability.b" },
      ],
    };
    assert.ok(
      new ComparisonService()
        .workspace([model], [intent])
        .some(AuthoringCases.edge),
    );
  }
  private static edge(finding: { field: string }): boolean {
    return finding.field.startsWith("relationship:");
  }
}
test(
  "every palette kind creates structurally valid incomplete intent",
  AuthoringCases.palette,
);
test(
  "editing accepted intent revokes acceptance and supports undo redo",
  AuthoringCases.commands,
);
test(
  "explicit relationship additions are migration differences",
  AuthoringCases.relationships,
);
