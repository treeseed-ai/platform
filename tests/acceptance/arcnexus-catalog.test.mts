import { readFileSync, readdirSync } from "node:fs";
import assert from "node:assert/strict";
import { test } from "node:test";

class ArcNexusCatalogTests {
  private read(path: string): any {
    return JSON.parse(readFileSync(path, "utf8"));
  }

  ownership(): void {
    const diagnostics = this.read("architecture/components/artifact-diagnostics.json");
    assert.equal(diagnostics.repository, "platform");
    assert.equal(diagnostics.parentId, "platform-integration");
    assert.ok(diagnostics.relatedIds.includes("sdk-contracts"));
    assert.ok(diagnostics.allowedWritePaths.every((path: string) => !path.startsWith("packages/")));
  }

  noRetiredBlueprintAuthority(): void {
    for (const directory of ['architecture/components', 'architecture/roles']) {
      for (const file of readdirSync(directory)) {
        assert.doesNotMatch(readFileSync(`${directory}/${file}`, 'utf8'), /blueprint|architecture\/(intent|implementation)|architectural language/i);
      }
    }
  }

  operations(): void {
    const profile = this.read("architecture/execution-profiles/luna.json");
    const diagnostics = this.read("architecture/components/artifact-diagnostics.json");
    const operation = this.read("architecture/operations/artifact-diagnostics-tests.json");
    assert.equal(profile.schemaVersion, 2);
    assert.equal(profile.maxTurns, 4);
    assert.deepEqual(diagnostics.operationIds, [operation.id]);
    assert.equal(operation.repository, "platform");
    assert.equal(operation.cwd, ".");
    assert.deepEqual(operation.args, ["run", "test:artifact-diagnostics"]);
    assert.ok(operation.probes.length > 0);
    assert.equal(operation.kind, "command");
  }

  exactDependencies(): void {
    const environment = this.read("architecture/environment.json");
    const selection = this.read("composition/arcnexus-qualification.json");
    const dependencies = environment.workspace.dependencies;
    assert.equal(environment.workspace.primary.id, "platform");
    assert.equal(dependencies.find((entry: any) => entry.id === "cli").commit, selection.cli.commit);
    assert.equal(dependencies.find((entry: any) => entry.id === "sdk").commit, selection.sdk.commit);
    assert.ok(!environment.generatedDirectories.includes("packages"));
  }
}
const suite = new ArcNexusCatalogTests();
test("ArcNexus execution scope preserves package ownership", suite.ownership.bind(suite));
test("ArcNexus setup pins independent dependency worktrees", suite.exactDependencies.bind(suite));
test("ArcNexus catalog has no retired blueprint authority", suite.noRetiredBlueprintAuthority.bind(suite));

test("ArcNexus operations use the bound toolchain without wider ownership", suite.operations.bind(suite));
