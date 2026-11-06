import assert from 'node:assert/strict';
import { join } from 'node:path';
import { test } from 'node:test';
import { GuidanceDocument, GuidancePackage } from '../support/agent-guidance.ts';

/** Regressions for unavailable dependencies, stale resources and prescriptive examples. */
class AuthoringSkillPolicy {
  readonly package = new GuidancePackage();

  installedReferences(): void {
    for (const document of this.package.documents()) {
      assert.deepEqual(document.absentSkills(this.package.root), [], document.path);
      assert.deepEqual(document.links(), [], document.path);
    }
  }

  missingResourcesRejected(): void {
    const document = this.fixture('[missing](./missing-guidance-resource.md)');
    assert.deepEqual(document.links(), ['./missing-guidance-resource.md']);
    assert.deepEqual(this.fixture('superpowers:uninstalled-framework').absentSkills(this.package.root), ['uninstalled-framework']);
  }

  examplesRejected(): void {
    for (const source of ['```ts\nclass Example {}\n```', '~~~sh\ncommand\n~~~', '    sample implementation']) {
      assert.deepEqual(this.fixture(source).examples(), ['embedded code example']);
    }
    for (const document of this.package.documents()) assert.deepEqual(document.examples(), [], document.path);
  }

  invalidMetadataRejected(): void {
    assert.notDeepEqual(this.fixture('no metadata').metadata(), []);
    assert.notDeepEqual(this.fixture('---\nname: wrong\ndescription: valid\n---\n').metadata(), []);
    assert.deepEqual(this.fixture('---\nname: writing-skills\ndescription: Use for skill work.\n---\n').metadata(), []);
  }

  discoveryRemainsProjectSpecific(): void {
    const document = new GuidanceDocument(join(this.package.root, '.agents/skills/find-skills/SKILL.md'));
    assert.match(document.source, /Discover the target's skill location/);
    assert.match(document.source, /verify installed resources and discovery/);
    assert.doesNotMatch(document.source, /--dir\s|npx\s|bunx\s/);
  }

  fixture(source: string): GuidanceDocument {
    return new GuidanceDocument(join(this.package.root, '.agents/skills/writing-skills/SKILL.md'), source);
  }
}

const policy = new AuthoringSkillPolicy();
test('regression: installed authoring dependencies and resources resolve', policy.installedReferences.bind(policy));
test('regression: missing resources and unavailable frameworks are rejected', policy.missingResourcesRejected.bind(policy));
test('regression: embedded code examples are rejected across the installed package', policy.examplesRejected.bind(policy));
test('regression: invalid skill metadata is rejected', policy.invalidMetadataRejected.bind(policy));
test('regression: discovery uses the actual project destination and resources', policy.discoveryRemainsProjectSpecific.bind(policy));
