import { mkdirSync, copyFileSync, readFileSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { spawnSync } from 'node:child_process';
/** Historical fixture orchestration only. All migration behaviour is Deployment-owned. */
class MigrationAssembly {
    private readonly root = resolve('verification/task3c/dist/legacy');
    private readonly cli = resolve('packages/cli');
    private require(value: unknown): asserts value { if (!value)
        throw new Error('LEGACY_ASSEMBLY_REFUSED'); }
    private command(program: string, args: string[], cwd: string, env?: NodeJS.ProcessEnv): string { const result = spawnSync(program, args, { cwd, env: env ?? process.env, encoding: 'utf8', timeout: 840000, maxBuffer: 8 * 1024 * 1024 }); if (result.status !== 0)
        throw new Error('LEGACY_ASSEMBLY_FAILED:' + result.stderr.slice(-6000)); return result.stdout + result.stderr; }
    run(): void {
        const evidence = JSON.parse(readFileSync('composition/task3b.json', 'utf8')), directory = join(this.root, 'packages/cli');
        this.require(evidence.fixturesOnly === true && evidence.cli.repository === 'https://github.com/treeseed-ai/cli.git' && /^[a-f0-9]{40}$/.test(evidence.cli.commit) && !existsSync(this.root));
        this.require(this.command('git', ['remote', 'get-url', 'origin'], this.cli).trim() === evidence.cli.repository);
        mkdirSync(join(this.root, 'packages'), { recursive: true, mode: 0o700 });
        this.command('git', ['worktree', 'add', '--detach', directory, evidence.cli.commit], this.cli);
        try {
            for (const file of ['package.json', 'bun.lock', 'composition/task3b.json', 'tests/task3b-installed.test.ts', 'vendor/task3b/api.tgz', 'vendor/task3b/admin.tgz', 'vendor/task3b/identity.tgz']) {
                const destination = join(this.root, file);
                mkdirSync(resolve(destination, '..'), { recursive: true, mode: 0o700 });
                copyFileSync(resolve(file), destination);
            }
            this.command(process.execPath, ['install', '--frozen-lockfile', '--ignore-scripts'], directory);
            this.command(process.execPath, ['run', 'build'], directory);
            this.command(process.execPath, ['install', '--frozen-lockfile', '--ignore-scripts'], this.root);
            const output = this.command(process.execPath, ['test', 'tests/task3b-installed.test.ts', '--timeout', '900000'], this.root, { ...process.env, CORDIS_TASK3C_MIGRATION_CHECK: resolve('verification/task3c/migration-check.mts') });
            this.require(output.includes('1 pass') && output.includes('0 fail') && !/\b[1-9][0-9]* (skip|todo)/.test(output));
            process.stdout.write(output);
            this.command('git', ['worktree', 'remove', directory], this.cli);
        }
        catch (error) {
            throw error;
        }
    }
}
new MigrationAssembly().run();
