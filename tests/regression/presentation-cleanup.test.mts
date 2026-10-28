import { test, expect } from 'bun:test';
import { mkdtempSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';

class PresentationCleanupRegression {
  run(): void {
    const directory = mkdtempSync(join(tmpdir(), 'presentation-failure-'));
    try {
      const build = spawnSync(process.execPath, ['build',
        'tests/support/presentation-failure-program.mts', '--target', 'node',
        '--outfile', join(directory, 'program.mjs')], { encoding: 'utf8', timeout: 30000 });
      expect(build.status, build.stderr).toBe(0);
      for (const mode of ['success', 'primary', 'cleanup', 'primary-cleanup'])
        this.scenario(join(directory, 'program.mjs'), mode);
    } finally { rmSync(directory, { recursive: true, force: true }); }
  }
  private scenario(program: string, mode: string): void {
    const result = spawnSync('node', [program, mode], { encoding: 'utf8', timeout: 10000 });
    const failures: string[] = [];
    if (mode.includes('primary')) failures.push('primary-canary');
    if (mode.includes('cleanup')) failures.push('cleanup-canary');
    expect(result.status, result.stderr).toBe(failures.length ? 1 : 0);
    expect(result.stderr).toBe('');
    expect(JSON.parse(result.stdout)).toEqual({ events: ['operation', 'first', 'last'], failures });
  }
}
const suite = new PresentationCleanupRegression();
test('regression: built presentation lifecycle preserves primary and cleanup failures and attempts later cleanup', suite.run.bind(suite), 60000);
