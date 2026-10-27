import { test, expect } from 'bun:test';
import { readFileSync, mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
class UiAssemblyGate {
    private sha(path:string):string{return createHash('sha256').update(readFileSync(path)).digest('hex');}
    program(): void { const composition = JSON.parse(readFileSync('composition/task3c.json', 'utf8')), root = mkdtempSync(join(tmpdir(), 'cordis-task3c-ui-input-')); try {
        expect(composition.fixturesOnly).toBe(true);
        for (const pin of Object.values(composition.owners) as Array<{
            archive: string;
            sha256: string;
        }>)
            expect(createHash('sha256').update(readFileSync(pin.archive)).digest('hex')).toBe(pin.sha256);
        const selected=JSON.parse(readFileSync('tests/support/assembly/dist/ui/input.json','utf8'));
        expect(Object.keys(selected.base.archives).sort()).toEqual(Object.keys(composition.owners).sort());
        expect(Object.keys(selected.variant.archives).sort()).toEqual(Object.keys(composition.owners).sort());
        for(const[owner,pin]of Object.entries(composition.owners)as Array<[string,{archive:string;version:string}]>){expect(selected.base.archives[owner]).toBe(resolve(pin.archive));const variant=owner==='ui'?resolve(composition.uiQualification.fixture.archive):owner==='admin'||owner==='api'?resolve('tests/support/assembly/dist/ui/closure/'+owner+'-archive/treeseed-cordis-'+owner+'-'+pin.version+'.tgz'):resolve(pin.archive);expect(selected.variant.archives[owner]).toBe(variant);}
        expect(selected.cli).toBe(resolve(composition.cli.binary));expect(this.sha(selected.cli)).toBe(composition.cli.sha256);
        expect(selected.base.lockfile).toBe(resolve(composition.runtimeLock.path));expect(this.sha(selected.base.lockfile)).toBe(composition.runtimeLock.sha256);
        expect(this.sha(selected.variant.archives.ui)).toBe(composition.uiQualification.fixture.sha256);
        for(const owner of ['admin','api'])expect(this.sha(selected.variant.archives[owner])).toBe(composition.uiQualification.expectedArtifacts[owner].sha256);
        expect(selected.variant.lockfile).toBe(resolve('tests/support/assembly/dist/ui/closure/api/bun.lock'));expect(this.sha(selected.variant.lockfile)).toBe(composition.uiQualification.expectedArtifacts.api.lockSha256);
        expect(selected.variantCli).toBe(resolve('tests/support/assembly/dist/ui/closure/cli/dist/trsd-linux-x64'));expect(this.sha(selected.variantCli)).toBe(composition.uiQualification.expectedArtifacts.cli.sha256);
        const input = join(root, 'input.json');
        writeFileSync(input, JSON.stringify(selected), { mode: 0o600 });
        const result = spawnSync(process.execPath, [resolve('tests/support/assembly/presentation-program.mts'), input], { encoding: 'utf8', timeout: 840000, maxBuffer: 4 * 1024 * 1024 });
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
test('acceptance: reusable UI changes browser and terminal through an explicitly restarted exact closure', suite.program.bind(suite), 900000);
