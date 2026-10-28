import { expect, test } from 'bun:test';
import { mkdtempSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';

class ReadbackRegression {
  private static readonly cases: Record<string, { error: string | null; calls: number | null }> = {
    normal: { error: null, calls: 2 }, transient: { error: null, calls: 3 },
    fatal: { error: 'UNKNOWN_FAILURE', calls: 1 }, failed: { error: 'NOT_READY', calls: 1 },
    cancelled: { error: 'NOT_READY', calls: 1 }, blocked: { error: 'BLOCKER_UNCHANGED', calls: 1 },
    disconnect: { error: 'SERVICE_WORKER_EXCHANGE_FAILED', calls: null },
    late: { error: 'UI_APPLICATION_DEADLINE', calls: 1 },
  };
  run(): void {
    const directory = mkdtempSync(join(tmpdir(), 'presentation-readback-'));
    const program = join(directory, 'program.mjs');
    try {
      this.build(program);
      for (const mode of Object.keys(ReadbackRegression.cases))
        this.scenario(program, mode);
    } finally { rmSync(directory, { recursive: true, force: true }); }
  }
  private build(program: string): void {
    const result = spawnSync(process.execPath, ['build',
      'tests/support/assembly/presentation-readback-program.mts', '--target', 'node',
      '--outfile', program], { encoding: 'utf8', timeout: 30000 });
    expect(result.status, result.stderr).toBe(0);
  }
  private scenario(program: string, mode: string): void {
    const expected = ReadbackRegression.cases[mode]!;
    const child = spawnSync('node', [program, mode], { encoding: 'utf8', timeout: 10000 });
    expect(child.status, child.stderr).toBe(expected.error === null ? 0 : 1);
    expect(child.stderr).toBe('');
    const output = JSON.parse(child.stdout);
    expect(output.error).toBe(expected.error);
    if (expected.calls === null) expect(output.calls).toBeLessThanOrEqual(3);
    else expect(output.calls).toBe(expected.calls);
  }
}
const suite = new ReadbackRegression();
test('regression: built presentation observation retries only transient reads within its original deadline', suite.run.bind(suite), 60000);
