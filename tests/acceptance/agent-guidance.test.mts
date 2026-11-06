import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test } from 'node:test';
import { GuidancePackage } from '../support/agent-guidance.ts';

const sections: Record<string, string> = {
  'Cordis Migration Branch Boundary (MANDATORY)': '9d0d253d3a6cc92c4a06fb8c359c292de9273a1805ca82f4a0f5db42880faae2',
  'Repository and Plugin Ownership (MANDATORY)': '64c45b72b27bb5153886276dbb3e869e0c8b375bc104de55b5644cfdbbebb649',
  'Architecture: TypeScript Classes and Swappable Plugins (MANDATORY)': '17ef8797e45a14bcc61356f0746533ec6e4f5353b0e7ad8eab8c2381a7761677',
  'Critical Architecture Rule: Readable Capability Layers (MANDATORY)': '4cfd9d08bf17fdbcd949f0fd6793391590eb806e2f9ea513306bbc3c3d72f954',
  'Permanent Test Organization (MANDATORY)': 'c4009127830626295635c2bacc0822f078e2e398092ff2575f56b55de2f42e35',
};
const resources: Record<string, string> = {
  '.agents/skills/initialize-project/SKILL.md': '56666474b3962b2ab2c033a73405c6bdb8d07431a20673358097e1b1b2284ff5',
  '.agents/skills/initialize-project/agents/openai.yaml': 'b0b3ecc2e40422a86d018a2c5fbfd81503676ba6e7a09e96b5d3a219b19910bd',
  '.agents/skills/release-workflow/scripts/source-readability.ts': '6182b8fe7fc7287ca368ad88f0ca70c2f67449bf406361044b764fb8d5483c39',
  '.agents/skills/release-workflow/scripts/test-layout.ts': '7f993b536d4acb7dbd6256af5c216c2b9500feea8d465e1896da396392f1a30e',
};

/** Acceptance of the installed package plus explicitly retained policy from the approved base. */
class AgentGuidanceAcceptance {
  readonly package = new GuidancePackage();

  installed(): void {
    assert.deepEqual(this.package.problems(), []);
    assert.equal(this.package.documents().length, 12, 'Expected the approved twelve-skill migration');
  }

  preservedDirectives(): void {
    const root = readFileSync(join(this.package.root, 'AGENTS.md'), 'utf8');
    for (const [heading, digest] of Object.entries(sections)) {
      const start = root.indexOf('## ' + heading + '\n');
      assert.ok(start >= 0, heading);
      const end = root.indexOf('\n## ', start + 3);
      assert.equal(this.digest(root.slice(start, end < 0 ? undefined : end)), digest, heading);
    }
  }

  preservedResources(): void {
    for (const [path, digest] of Object.entries(resources)) {
      assert.equal(this.digest(readFileSync(join(this.package.root, path), 'utf8')), digest, path);
    }
  }

  digest(source: string): string {
    return createHash('sha256').update(source).digest('hex');
  }
}

const suite = new AgentGuidanceAcceptance();
test('acceptance: installed agent guidance has complete code-free procedures', suite.installed.bind(suite));
test('acceptance: binding migration architecture ownership and test rules remain unchanged', suite.preservedDirectives.bind(suite));
test('acceptance: specialized initializer and enforcement helpers remain unchanged', suite.preservedResources.bind(suite));
