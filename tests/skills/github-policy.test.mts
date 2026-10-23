import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { test } from 'node:test';

class GitHubSkillPolicy {
  readonly root = resolve(process.env.SKILL_REVIEW_ROOT ?? process.cwd());

  documents(): Map<string, string> {
    const documents = new Map<string, string>();
    for (const name of ['gh-cli', 'github-ops']) {
      this.read(resolve(this.root, '.agents/skills', name, 'SKILL.md'), documents);
    }
    return documents;
  }

  read(path: string, documents: Map<string, string>): void {
    if (documents.has(path)) return;
    const source = readFileSync(path, 'utf8');
    documents.set(path, source);
    for (const link of source.matchAll(/\]\(([^)#]+\.md)(?:#[^)]*)?\)/g)) {
      if (!link[1].includes('://')) this.read(resolve(dirname(path), link[1]), documents);
    }
  }

  commands(): string[] {
    const commands: string[] = [];
    for (const [path, source] of this.documents()) {
      for (const block of source.matchAll(/^```(?:bash|sh|shell)\n([\s\S]*?)^```/gm)) {
        for (const line of block[1].split('\n')) {
          if (line.trim() && !line.trim().startsWith('#')) commands.push(`${path}: ${line}`);
        }
      }
    }
    assert.ok(commands.length > 0, 'Skills must supply actual command examples');
    return commands;
  }

  prTargets(): void {
    const creates = this.commands().filter(this.isPrCreate.bind(this));
    assert.ok(creates.length > 0, 'Exercise at least one explicit PR example');
    for (const command of creates) {
      assert.match(command, /--base\s+cordis\b/, command);
      assert.doesNotMatch(command, /\bCloses\s+#/i, command);
    }
  }

  isPrCreate(command: string): boolean {
    return /\bgh pr create\b/.test(command);
  }

  noApprovalOrSecretOutput(): void {
    for (const command of this.commands()) {
      assert.doesNotMatch(command, /--approve\b|\bgh auth token\b/, command);
    }
  }

  noProductionMutation(): void {
    for (const command of this.commands()) {
      assert.doesNotMatch(command,
        /\bgh release (?:create|upload|delete|edit)\b|\bgit tag -(?:s|a|d)\b|\bnpm (?:publish|dist-tag)\b/,
        command);
    }
  }

  noForeignRepositoryOrAutomaticClosure(): void {
    for (const command of this.commands()) {
      assert.doesNotMatch(command, /\baffaan-m\/ECC\b|\bgh issue close\b/, command);
    }
  }
}

const policy = new GitHubSkillPolicy();
test('GitHub skill PR examples explicitly target cordis', policy.prTargets.bind(policy));
test('GitHub skill examples cannot approve PRs or print tokens', policy.noApprovalOrSecretOutput.bind(policy));
test('GitHub skills and routed references contain no production publication commands', policy.noProductionMutation.bind(policy));
test('GitHub examples do not target foreign repositories or close migration issues', policy.noForeignRepositoryOrAutomaticClosure.bind(policy));
