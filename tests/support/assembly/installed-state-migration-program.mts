import { mkdirSync, copyFileSync, readFileSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { spawnSync } from 'node:child_process';
/** Historical fixture orchestration only. All migration behaviour is Deployment-owned. */
class MigrationAssembly {
    private readonly root = resolve('tests/support/assembly/dist/legacy');
    private readonly cli = resolve('packages/cli');
    private readonly directory = join(this.root, 'packages/cli');
    private readonly inputs = [
        'package.json', 'bun.lock', 'composition/task3b.json',
        'tests/acceptance/installed-composition.test.ts',
        'tests/support/assembly/qualified-fixture-lock.ts',
        'vendor/task3b/api.tgz', 'vendor/task3b/admin.tgz', 'vendor/task3b/identity.tgz',
    ];
    private require(value: unknown): asserts value { if (!value)
        throw new Error('LEGACY_ASSEMBLY_REFUSED'); }
    private command(program: string, args: string[], cwd: string, env?: NodeJS.ProcessEnv): string { const result = spawnSync(program, args, { cwd, env: env ?? process.env, encoding: 'utf8', timeout: 840000, maxBuffer: 8 * 1024 * 1024 }); if (result.status !== 0)
        throw new Error('LEGACY_ASSEMBLY_FAILED:' + result.stderr.slice(-6000)); return result.stdout + result.stderr; }
    run(): void {
        this.prepareCheckout();
        this.copyInputs();
        this.command(process.execPath, ['install', '--frozen-lockfile', '--ignore-scripts'], this.directory);
        this.command(process.execPath, ['run', 'build'], this.directory);
        this.command(process.execPath, ['install', '--frozen-lockfile', '--ignore-scripts'], this.root);
        this.verifyMigration();
        this.command('git', ['worktree', 'remove', this.directory], this.cli);
    }
    private prepareCheckout(): void {
        const evidence = JSON.parse(readFileSync('composition/task3b.json', 'utf8'));
        this.require(evidence.fixturesOnly === true && !existsSync(this.root));
        this.require(evidence.cli.repository === 'https://github.com/treeseed-ai/cli.git');
        this.require(/^[a-f0-9]{40}$/.test(evidence.cli.commit));
        this.require(this.command('git', ['remote', 'get-url', 'origin'], this.cli).trim() === evidence.cli.repository);
        mkdirSync(join(this.root, 'packages'), { recursive: true, mode: 0o700 });
        this.command('git', ['worktree', 'add', '--detach', this.directory, evidence.cli.commit], this.cli);
    }
    private copyInputs(): void {
        for (const file of this.inputs) {
            const destination = join(this.root, file);
            mkdirSync(resolve(destination, '..'), { recursive: true, mode: 0o700 });
            copyFileSync(resolve(file), destination);
        }
    }
    private verifyMigration(): void {
        const env = { ...process.env, CORDIS_TASK3C_MIGRATION_CHECK: resolve('tests/support/assembly/installed-state-migration-check.mts') };
        const args = ['test', 'tests/acceptance/installed-composition.test.ts', '--timeout', '900000'];
        const output = this.command(process.execPath, args, this.root, env);
        this.require(output.includes('1 pass') && output.includes('0 fail'));
        this.require(!/\b[1-9][0-9]* (skip|todo)/.test(output));
        process.stdout.write(output);
    }
}
new MigrationAssembly().run();
