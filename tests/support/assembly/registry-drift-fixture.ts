import { createHash } from 'node:crypto';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';
import { parse } from 'jsonc-parser';

/** Private registry fixture: real resolver, fresh caches, no ambient registry state. */
export class RegistryDriftFixture {
  readonly root = mkdtempSync(join(tmpdir(), 'qualified-registry-'));
  private readonly server = Bun.serve({ hostname: '127.0.0.1', port: 0, fetch: this.respond.bind(this) });
  readonly oldIntegrity = this.integrity('qualified archive');
  readonly newIntegrity = this.integrity('new archive');

  private integrity(bytes: string): string {
    return 'sha512-' + createHash('sha512').update(bytes).digest('base64');
  }

  private version(version: string, integrity: string): unknown {
    return { name: 'jose', version, dist: { integrity, tarball: this.server.url + 'jose-' + version + '.tgz' } };
  }

  private respond(request: Request): Response {
    if (new URL(request.url).pathname !== '/jose') return new Response('Unexpected request', { status: 404 });
    return Response.json({ name: 'jose', 'dist-tags': { latest: '6.2.14' }, versions: {
      '6.2.13': this.version('6.2.13', this.oldIntegrity),
      '6.2.14': this.version('6.2.14', this.newIntegrity),
    } });
  }

  qualified(): string {
    return JSON.stringify({ packages: { jose: ['jose@6.2.13', '', {}, this.oldIntegrity] } });
  }

  private prepare(name: string, overrides: Record<string, string>): string {
    const directory = join(this.root, name);
    mkdirSync(join(directory, 'package'), { recursive: true });
    writeFileSync(join(directory, 'package/package.json'), JSON.stringify({
      name: 'consumer', version: '1.0.0', dependencies: { jose: '^6.2.12' },
    }));
    execFileSync('tar', ['-czf', 'consumer.tgz', 'package'], { cwd: directory });
    writeFileSync(join(directory, 'package.json'), JSON.stringify({
      name: 'fixture', dependencies: { consumer: 'file:consumer.tgz' }, overrides,
      scripts: { postinstall: 'touch SCRIPT_EXECUTED' },
    }));
    return directory;
  }

  async resolve(name: string, overrides: Record<string, string>): Promise<Record<string, unknown[]>> {
    const directory = this.prepare(name, overrides);
    const child = Bun.spawn([process.execPath, 'install', '--lockfile-only', '--ignore-scripts', '--registry', String(this.server.url)], {
      cwd: directory, stdout: 'pipe', stderr: 'pipe',
      env: { ...process.env, BUN_INSTALL_CACHE_DIR: join(directory, 'cache') },
    });
    const [code, output, errors] = await Promise.all([child.exited, new Response(child.stdout).text(), new Response(child.stderr).text()]);
    if (code !== 0) throw new Error(output + errors);
    return parse(readFileSync(join(directory, 'bun.lock'), 'utf8')).packages;
  }

  close(): void {
    this.server.stop(true);
    rmSync(this.root, { recursive: true, force: true });
  }
}
