import { test, expect } from 'bun:test';
import { readFileSync, mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
class UiAssemblyGate {
    program(): void { const composition = JSON.parse(readFileSync('composition/task3c.json', 'utf8')), root = mkdtempSync(join(tmpdir(), 'cordis-task3c-ui-input-')); try {
        expect(composition.fixturesOnly).toBe(true);
        for (const pin of Object.values(composition.owners) as Array<{
            archive: string;
            sha256: string;
        }>)
            expect(createHash('sha256').update(readFileSync(pin.archive)).digest('hex')).toBe(pin.sha256);
        const input = join(root, 'input.json');
        writeFileSync(input, readFileSync('verification/task3c/dist/ui/input.json'), { mode: 0o600 });
        const result = spawnSync(process.execPath, [resolve('verification/task3c/ui-program.mts'), input], { encoding: 'utf8', timeout: 840000, maxBuffer: 4 * 1024 * 1024 });
        if (result.status !== 0)
            throw new Error('Assembled UI programme failed: ' + result.stderr);
        expect(result.stderr).toBe('');
        expect(JSON.parse(result.stdout)).toEqual({ fixtureOnly: true, genuineKeycloak: true, browserProviderChanged: true, terminalProviderChanged: true, explicitRestart: true, retainedIdentity: true, retainedTls: true, machineBytesUnchanged: true, sourceFree: true });
    }
    finally {
        rmSync(root, { recursive: true, force: true });
    } }
}
const suite = new UiAssemblyGate();
test('task3c: reusable UI changes browser and terminal through an explicitly restarted exact closure', suite.program.bind(suite), 900000);
