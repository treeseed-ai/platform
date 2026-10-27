import { test, expect } from 'bun:test';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
interface CliPin {
    repository: string;
    commit: string;
    checkout: string;
    binary: string;
    sha256: string;
}
interface Composition {
    formatVersion: 1;
    task: '3C';
    fixturesOnly: true;
    cli: CliPin;
    owners: Record<string, {
        archive: string;
        sha256: string;
        commit: string;
        repository: string;
    }>;
}
/** The owner supplies its programme suite; Platform verifies the assembled exact selection. */
class ExtensibleAssembly {
    private evidence(): Composition { const value = JSON.parse(readFileSync('composition/task3c.json', 'utf8')) as Composition; expect(value.formatVersion).toBe(1); expect(value.task).toBe('3C'); expect(value.fixturesOnly).toBe(true); for (const pin of Object.values(value.owners)) {
        expect(pin.repository).toMatch(/^https:\/\/github\.com\/treeseed-ai\/[a-z-]+\.git$/);
        expect(pin.commit).toMatch(/^[a-f0-9]{40}$/);
        expect(createHash('sha256').update(readFileSync(pin.archive)).digest('hex')).toBe(pin.sha256);
    } return value; }
    private scene(pattern: string): void { const evidence = this.evidence(), pin = evidence.cli; expect(pin.repository).toBe('https://github.com/treeseed-ai/cli.git'); const current = spawnSync('git', ['rev-parse', 'HEAD'], { cwd: pin.checkout, encoding: 'utf8' }); expect(current.status).toBe(0); expect(current.stdout.trim()).toBe(pin.commit); expect(createHash('sha256').update(readFileSync(pin.binary)).digest('hex')).toBe(pin.sha256); const result = spawnSync(process.execPath, ['test', 'tests/cli-program.test.ts', '--test-name-pattern', pattern], { cwd: resolve(pin.checkout), encoding: 'utf8', timeout: 600000, maxBuffer: 4 * 1024 * 1024, env: { ...process.env, CORDIS_REQUIRE_PLAN: '1' } }); if (result.status !== 0)
        throw new Error('Assembled built CLI scene failed: ' + result.stderr); expect(result.stderr).toContain('1 pass'); expect(result.stderr).toContain('0 fail'); expect(result.stderr).not.toMatch(/\b[1-9][0-9]* (?:skip|todo)/); }
    npm(): void { this.scene('^smoke: built CLI installs two typed'); }
    git(): void { this.scene('^smoke: built CLI installs packaged'); }
    build(): void { this.scene('^smoke: built CLI installs approved'); }
    registeredGit(): void { this.scene('^smoke: built CLI selects registered packaged'); }
    registeredBuild(): void { this.scene('^smoke: built CLI selects registered built'); }
    live(): void { this.scene('^smoke: built CLI installs and selects'); }
}
const suite = new ExtensibleAssembly();
test('acceptance: assembled NPM instances and safe migration refusal', suite.npm.bind(suite), 660000);
test('acceptance: assembled packaged Git acquisition and exact replay', suite.git.bind(suite), 660000);
test('acceptance: assembled approved Git build acquisition and exact replay', suite.build.bind(suite), 660000);
test('acceptance: assembled registered packaged Git source-free selection', suite.registeredGit.bind(suite), 660000);
test('acceptance: assembled registered Git build source-free selection', suite.registeredBuild.bind(suite), 660000);
test('acceptance: assembled qualified native live install and unsafe reverse refusal', suite.live.bind(suite), 660000);
