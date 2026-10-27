import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
interface Pin {
    repository: string;
    commit: string;
    archive: string;
    sha256: string;
    checkout: string;
}
interface Composition {
    runtimeLock: {path:string;sha256:string};
    owners: Record<'sdk' | 'deployment' | 'identity' | 'admin' | 'api' | 'ui', Pin>;
    cli: {
        repository: string;
        commit: string;
        checkout: string;
        binary: string;
        sha256: string;
    };
    uiQualification: {
        expectedArtifacts: Record<'admin'|'api'|'cli',{sha256:string;lockSha256?:string}>;
        fixture: {
            archive: string;
            sha256: string;
            version: string;
            source: {
                repository: string;
                baseCommit: string;
                treeDigest: string;
            };
            recipeDigest: string;
        };
    };
}
/** Only assembles public owner artefacts and their unchanged owner build programmes. */
class PrepareUiAssembly {
    private readonly composition = JSON.parse(readFileSync('composition/task3c.json', 'utf8')) as Composition;
    private readonly output = resolve('tests/support/assembly/dist/ui');
    private require(value: unknown): asserts value { if (!value)
        throw new Error('ASSEMBLY_SELECTION_REFUSED'); }
    private sha(path: string): string { return createHash('sha256').update(readFileSync(path)).digest('hex'); }
    private command(program: string, args: string[], cwd: string): string { const result = spawnSync(program, args, { cwd, encoding: 'utf8', timeout: 600000, maxBuffer: 8 * 1024 * 1024 }); if (result.status !== 0)
        throw new Error('ASSEMBLY_PREPARATION_FAILED:' + result.stderr.slice(-3000)); return result.stdout.trim(); }
    run(): void {
        const composition = this.composition, owners = composition.owners;
        this.require(this.sha(composition.runtimeLock.path)===composition.runtimeLock.sha256);
        for (const [owner, pin] of Object.entries(owners)) {
            this.require(pin.repository === 'https://github.com/treeseed-ai/' + owner + '.git' && /^[a-f0-9]{40}$/.test(pin.commit) && this.sha(pin.archive) === pin.sha256);
        }
        const sources: Record<string, {
            repository: string;
            directory: string;
            commit: string;
        }> = {};
        for (const owner of ['admin', 'api', 'cli'] as const) {
            const pin = owner === 'cli' ? composition.cli : owners[owner], directory = resolve(pin.checkout);
            this.require(this.command('git', ['remote', 'get-url', 'origin'], directory) === pin.repository && this.command('git', ['rev-parse', 'HEAD'], directory) === pin.commit);
            sources[owner] = { repository: pin.repository, directory, commit: pin.commit };
        }
        this.require(this.sha(composition.cli.binary) === composition.cli.sha256);
        const fixture = composition.uiQualification.fixture;
        this.require(this.sha(fixture.archive) === fixture.sha256 && !existsSync(this.output));
        mkdirSync(this.output, { recursive: true, mode: 0o700 });
        const request = join(this.output, 'request.json');
        writeFileSync(request, JSON.stringify({ output: join(this.output, 'closure'), ui: { ...fixture, archive: resolve(fixture.archive) }, owners: sources }), { mode: 0o600, flag: 'wx' });
        this.command(process.execPath, [resolve('tests/support/assembly/presentation-owner-closure.mts'), request], process.cwd());
        const receipt = JSON.parse(readFileSync(join(this.output, 'closure/ui-owner-closure.json'), 'utf8'));
        for(const owner of ['admin','api','cli'] as const){const actual=receipt.owners[owner],expected=composition.uiQualification.expectedArtifacts[owner];if(actual.sha256!==expected.sha256||this.sha(actual.path)!==expected.sha256){const diagnosis=this.command(process.execPath,[resolve('tests/support/assembly/artifact-inventory.mts'),owner,actual.path],process.cwd());throw new Error('ASSEMBLY_ARTIFACT_CHANGED:'+diagnosis);}}
        this.require(this.sha(join(this.output,'closure/api/bun.lock'))===composition.uiQualification.expectedArtifacts.api.lockSha256);
        const archives: Record<string, string> = {};
        for (const [owner, pin] of Object.entries(owners))
            archives[owner] = resolve(pin.archive);
        const variant = { ...archives, ui: resolve(fixture.archive), admin: receipt.owners.admin.path, api: receipt.owners.api.path };
        writeFileSync(join(this.output, 'input.json'), JSON.stringify({ base: { archives, lockfile: resolve(composition.runtimeLock.path) }, variant: { archives: variant, lockfile: join(this.output, 'closure/api/bun.lock') }, cli: resolve(composition.cli.binary), variantCli: receipt.owners.cli.path }), { mode: 0o600, flag: 'wx' });
        process.stdout.write('Exact UI assembly prepared\n');
    }
}
new PrepareUiAssembly().run();
