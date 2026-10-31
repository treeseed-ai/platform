import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { test } from 'node:test';

class QualificationSetupTests {
  static declaredSetupPassesBaseline(): void {
    const result = spawnSync(process.execPath, ['tests/support/assembly/prepare-qualification.mts'], {
      env: { ...process.env, NODE_TEST_CONTEXT: undefined },
      encoding: 'utf8', timeout: 120000, maxBuffer: 16 * 1024 * 1024,
    });
    assert.equal(result.status, 0, result.stderr + result.stdout);
    assert.ok(existsSync('node_modules/.cache/arcnexus/assembly'));
    assert.equal(existsSync('tests/support/assembly/.qualification'), false);
  }
}

test('declared qualification setup passes the real component baseline', QualificationSetupTests.declaredSetupPassesBaseline);
