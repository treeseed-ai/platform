import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { test } from 'node:test';

class RetiredStudioTests {
  static assertRetired(): void {
    for (const path of ['studio', 'language', 'intent', 'implementation', 'workspace.yaml']) {
      assert.equal(existsSync(`architecture/${path}`), false, `${path} is retired`);
    }
    assert.equal(existsSync('.github/workflows/architecture-studio.yml'), false);
  }

  static assertOwnerEvidencePreserved(): void {
    for (const path of ['task2.json', 'task3a.json', 'task3b.json', 'task3c.json']) {
      assert.doesNotThrow(() => JSON.parse(readFileSync(`composition/${path}`, 'utf8')));
    }
    assert.match(readFileSync('.gitignore', 'utf8'), /^\/packages\/$/m);
  }
}

test('retired studio and blueprint artifacts are absent', RetiredStudioTests.assertRetired);
test('independent owner composition evidence remains available', RetiredStudioTests.assertOwnerEvidencePreserved);
