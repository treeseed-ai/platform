import { expect, test } from 'bun:test';
import { mkdtempSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';

class ReadbackRegression {
  run(): void {
    const directory = mkdtempSync(join(tmpdir(), 'presentation-readback-'));
    const program = join(directory, 'program.mjs');
    try {
      const build = spawnSync(process.execPath, ['build',
        'tests/support/presentation-readback-program.mts', '--target', 'node',
        '--outfile', program], { encoding: 'utf8', timeout: 30000 });
      expect(build.status, build.stderr).toBe(0);
      for (const mode of ['normal', 'transient', 'fatal', 'failed', 'disconnect', 'late'])
        this.scenario(program, mode);
    } finally { rmSync(directory, { recursive: true, force: true }); }
  }
  private scenario(program: string, mode: string): void {
    const expected: Record<string, string | null> = { normal: null, transient: null,
      fatal: 'UNKNOWN_FAILURE', failed: 'NOT_READY',
      disconnect: 'SERVICE_WORKER_EXCHANGE_FAILED', late: 'UI_APPLICATION_DEADLINE' };
    const child = spawnSync('node', [program, mode], { encoding: 'utf8', timeout: 10000 });
    expect(child.status, child.stderr).toBe(expected[mode] === null ? 0 : 1);
    expect(child.stderr).toBe('');
    const output = JSON.parse(child.stdout);
    expect(output.error).toBe(expected[mode]);
    if (mode === 'normal') expect(output.calls).toBe(2);
    if (mode === 'transient') expect(output.calls).toBe(3);
    if (mode === 'fatal' || mode === 'failed' || mode === 'late') expect(output.calls).toBe(1);
    if (mode === 'disconnect') expect(output.calls).toBeLessThanOrEqual(3);
  }
}
const suite = new ReadbackRegression();
test('regression: built presentation observation retries only transient reads within its original deadline', suite.run.bind(suite), 60000);
