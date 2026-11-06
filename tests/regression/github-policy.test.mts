import assert from 'node:assert/strict';
import { join } from 'node:path';
import { test } from 'node:test';
import { GuidanceDocument, GuidancePackage } from '../support/agent-guidance.ts';

/** Keep generic adapters subordinate to the binding Cordis policy without command recipes. */
class GitHubSkillPolicy {
  readonly package = new GuidancePackage();

  adaptersDeferToRoot(): void {
    for (const name of ['gh-cli', 'github-ops', 'release-workflow']) {
      const document = new GuidanceDocument(join(this.package.root, '.agents/skills', name, 'SKILL.md'));
      assert.match(document.source, /\[project instructions\]\(\.\.\/\.\.\/\.\.\/AGENTS\.md\)/);
      assert.deepEqual(document.links(), [], name);
    }
  }

  installedInstructionsAreSafe(): void {
    for (const document of this.package.documents()) {
      assert.deepEqual(document.githubCommands(), [], document.path);
    }
  }

  wrongBaseRejected(): void {
    for (const command of ['gh pr create', 'gh pr create --base staging', 'gh pr create --base main']) {
      assert.notDeepEqual(this.fixture(command).githubCommands(), [], command);
    }
    assert.deepEqual(this.fixture('gh pr create --base cordis').githubCommands(), []);
  }

  approvalAndSecretsRejected(): void {
    this.reject(['gh pr review --approve', 'gh auth token']);
  }

  productionMutationRejected(): void {
    this.reject(['gh release create', 'gh release upload', 'gh release delete', 'gh release edit']);
    this.reject(['git tag -s version', 'git tag -a version', 'git tag -d version', 'npm publish', 'npm dist-tag add']);
  }

  foreignTargetAndClosureRejected(): void {
    this.reject(['gh pr list --repo affaan-m/ECC', 'gh issue close 123', 'Closes #123']);
  }

  reject(commands: string[]): void {
    for (const command of commands) assert.notDeepEqual(this.fixture(command).githubCommands(), [], command);
  }

  fixture(source: string): GuidanceDocument {
    return new GuidanceDocument(join(this.package.root, '.agents/skills/github-ops/SKILL.md'), source);
  }
}

const policy = new GitHubSkillPolicy();
test('regression: GitHub adapters defer branch and authority policy to the project root', policy.adaptersDeferToRoot.bind(policy));
test('regression: installed instructions contain no unsafe GitHub command recipes', policy.installedInstructionsAreSafe.bind(policy));
test('regression: unspecified and legacy PR bases are rejected', policy.wrongBaseRejected.bind(policy));
test('regression: PR approval and secret output recipes are rejected', policy.approvalAndSecretsRejected.bind(policy));
test('regression: production publication recipes are rejected', policy.productionMutationRejected.bind(policy));
test('regression: foreign targets and premature migration closure are rejected', policy.foreignTargetAndClosureRejected.bind(policy));
