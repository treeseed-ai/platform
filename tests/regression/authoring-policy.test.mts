import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { test } from 'node:test';

class AuthoringSkillPolicy {
  readonly root = resolve(process.env.SKILL_REVIEW_ROOT ?? process.cwd());
  readonly skills = resolve(this.root, '.agents/skills');
  readonly names = ['brainstorming', 'writing-plans', 'writing-skills', 'documentation-writer', 'find-skills'];

  documents(): Map<string, string> {
    const documents = new Map<string, string>();
    for (const name of this.names) {
      const path = resolve(this.skills, name, 'SKILL.md');
      documents.set(path, readFileSync(path, 'utf8'));
    }
    const reference = resolve(this.skills, 'writing-skills/testing-skills-with-subagents.md');
    documents.set(reference, readFileSync(reference, 'utf8'));
    return documents;
  }

  requiredSkillsExist(): void {
    const missing: string[] = [];
    for (const [path, source] of this.documents()) {
      for (const match of source.matchAll(/superpowers:([a-z-]+)/g)) {
        if (!existsSync(resolve(this.skills, match[1], 'SKILL.md'))) missing.push(`${path}: ${match[0]}`);
      }
    }
    assert.deepEqual(missing, [], 'Named execution/background skill packages must exist locally');
  }

  localReferencesExist(): void {
    const missing: string[] = [];
    for (const [path, source] of this.documents()) {
      for (const link of source.matchAll(/\]\(([^)#]+)(?:#[^)]*)?\)/g)) {
        if (!link[1].includes('://') && !existsSync(resolve(dirname(path), link[1]))) {
          missing.push(`${path}: ${link[1]}`);
        }
      }
    }
    assert.deepEqual(missing, [], 'Local skill links must resolve');
  }

  planningExamplesUseClasses(): void {
    const source = readFileSync(resolve(this.skills, 'writing-plans/SKILL.md'), 'utf8');
    assert.doesNotMatch(source, /```python\b|\bdef test_\w+\(/, 'Implementation templates must follow Cordis TypeScript class policy');
    assert.match(source, /class\s+\w+/, 'Provide a usable class-based example');
  }

  installationPathsResolve(): void {
    const path = resolve(this.skills, 'find-skills/SKILL.md');
    const source = readFileSync(path, 'utf8');
    const destinations: string[] = [];
    for (const match of source.matchAll(/--dir\s+([.\w/-]+)/g)) {
      destinations.push(resolve(this.root, match[1]));
    }
    for (const link of source.matchAll(/\[\.agents\/skills\/\]\(([^)]+)\)/g)) {
      destinations.push(resolve(dirname(path), link[1]));
    }
    assert.ok(destinations.length > 0, 'The installer instructions must identify the project destination');
    for (const destination of destinations) {
      assert.equal(destination, this.skills, 'Project skill examples must select the discoverable project directory');
      assert.ok(existsSync(destination), destination);
    }
  }
}

const policy = new AuthoringSkillPolicy();
test("regression: Authoring instructions reference available skill packages", policy.requiredSkillsExist.bind(policy));
test("regression: Authoring skill local references resolve", policy.localReferencesExist.bind(policy));
test("regression: Planning implementation examples use TypeScript classes", policy.planningExamplesUseClasses.bind(policy));
test("regression: Skill installation examples select the discoverable project directory", policy.installationPathsResolve.bind(policy));
