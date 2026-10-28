import assert from 'node:assert/strict';
import { dlopen, FFIType } from 'bun:ffi';
import {
  closeSync,
  constants,
  mkdtempSync,
  openSync,
  readFileSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { arch, release, tmpdir } from 'node:os';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { spawn, spawnSync, type ChildProcess } from 'node:child_process';

/** Harmless qualification fixture only; no Agent execution or production runtime selection. */
class KataFixture {
  static readonly image =
    'docker.io/library/busybox@sha256:66a6306db78bf2dbf3487f293aa8d6990d8e506fdffab9cc43fe422becf886e4';
  static readonly runtime = '4.1.0';
  static readonly archiveDigest =
    '3dc6b69c4acb787b967b04b64599a20d02a8beb1a8eaab3084110df9d0b08c96';
  static readonly guest = 'printf "cordis-kata-guest-ok\\n"; uname -r';
}

class KvmQualification {
  run(): { kvmApi: number; virtualMachineCreated: true } {
    assert.equal(statSync('/dev/kvm').isCharacterDevice(), true);
    const library = dlopen('libc.so.6', {
      ioctl: { args: ['i32', FFIType.u64_fast, FFIType.u64_fast], returns: 'i32' },
    });
    const device = openSync('/dev/kvm', constants.O_RDWR | 0x80000); // Linux O_CLOEXEC.
    try {
      const kvmApi = library.symbols.ioctl(device, 0xae00, 0);
      assert.equal(kvmApi, 12, 'KVM_GET_API_VERSION');
      const machine = library.symbols.ioctl(device, 0xae01, 0);
      assert.ok(machine >= 0, 'KVM_CREATE_VM must succeed');
      closeSync(machine);
      return { kvmApi, virtualMachineCreated: true };
    } finally {
      closeSync(device);
      library.close();
    }
  }
}

class QualificationCommand {
  static run(program: string, args: string[], timeout = 120_000): string {
    const result = spawnSync(program, args, {
      encoding: 'utf8',
      timeout,
      maxBuffer: 2 * 1024 * 1024,
    });
    if (result.status !== 0) {
      throw new Error(`${program} failed: ${result.error?.message ?? result.stderr.slice(-8000)}`);
    }
    if (result.stderr) process.stderr.write(result.stderr);
    return result.stdout.trim();
  }

  static attempt(program: string, args: string[]): void {
    const result = spawnSync(program, args, { encoding: 'utf8', timeout: 15_000 });
    if (result.status !== 0) process.stderr.write(`cleanup attempt: ${result.stderr}\n`);
  }
}

class PrivateContainerd {
  readonly directory = mkdtempSync(join(process.env.RUNNER_TEMP ?? tmpdir(), 'cordis-kata-'));
  readonly socket = join(this.directory, 'containerd.sock');
  readonly namespace = `cordis-qualification-${randomUUID()}`;
  private daemon: ChildProcess | undefined;
  private log: number | undefined;
  private readonly daemonArguments = [
    '--config',
    join(this.directory, 'config.toml'),
    '--root',
    join(this.directory, 'root'),
    '--state',
    join(this.directory, 'state'),
    '--address',
    this.socket,
    '--log-level',
    'debug',
  ];

  async start(): Promise<void> {
    this.launch();
    await this.ready();
  }

  private launch(): void {
    const config = join(this.directory, 'config.toml');
    writeFileSync(config, 'version = 2\ndisabled_plugins = ["io.containerd.grpc.v1.cri"]\n');
    this.log = openSync(join(this.directory, 'containerd.log'), 'wx', 0o600);
    this.daemon = spawn('containerd', this.daemonArguments, {
      stdio: ['ignore', this.log, this.log],
    });
    this.daemon.on('error', this.daemonError.bind(this));
  }

  private async ready(): Promise<void> {
    for (let count = 0; count < 100; count++) {
      if (this.daemon?.exitCode !== null)
        throw new Error('Private containerd exited during startup');
      const result = spawnSync('ctr', ['--address', this.socket, 'version'], { timeout: 1000 });
      if (result.status === 0) return;
      await Bun.sleep(50);
    }
    throw new Error('Private containerd readiness deadline exceeded');
  }

  private daemonError(error: Error): void {
    process.stderr.write(`Private containerd process error: ${error.message}\n`);
  }

  run(args: string[], timeout?: number): string {
    return QualificationCommand.run('ctr', this.arguments(args), timeout);
  }

  attempt(args: string[]): void {
    QualificationCommand.attempt('ctr', this.arguments(args));
  }

  private arguments(args: string[]): string[] {
    return ['--address', this.socket, '--namespace', this.namespace, ...args];
  }

  async stop(): Promise<void> {
    if (this.daemon?.exitCode === null) {
      this.daemon.kill('SIGTERM');
      for (let count = 0; count < 100 && this.daemon.exitCode === null; count++)
        await Bun.sleep(50);
      if (this.daemon.exitCode === null) {
        this.daemon.kill('SIGKILL');
        throw new Error('Private containerd did not stop cleanly');
      }
    }
    if (this.log !== undefined) closeSync(this.log);
  }
}

class KataGuestQualification {
  private readonly daemon = new PrivateContainerd();
  private readonly id = `cordis-kata-probe-${randomUUID()}`;
  private readonly pullArguments = [
    'images',
    'pull',
    '--local',
    '--platform',
    'linux/amd64',
    '--snapshotter',
    'native',
    KataFixture.image,
  ];
  private readonly guestArguments = [
    'run',
    '--snapshotter',
    'native',
    '--runtime',
    'io.containerd.kata.v2',
    '--rm',
    KataFixture.image,
    this.id,
    '/bin/sh',
    '-c',
    KataFixture.guest,
  ];

  async run(): Promise<string> {
    const failures: unknown[] = [];
    let kernel = '';
    try {
      await this.daemon.start();
      kernel = this.guest();
    } catch (error) {
      failures.push(error);
    }
    await this.finish(failures);
    return kernel;
  }

  private async finish(failures: unknown[]): Promise<void> {
    try {
      this.cleanup();
    } catch (error) {
      failures.push(error);
    }
    try {
      await this.daemon.stop();
    } catch (error) {
      failures.push(error);
    }
    if (failures.length) throw new AggregateError(failures, 'Kata qualification or cleanup failed');
  }

  private guest(): string {
    this.daemon.run(this.pullArguments);
    const output = this.daemon.run(this.guestArguments);
    const [marker, guestKernel, ...extra] = output.split('\n');
    assert.equal(marker, 'cordis-kata-guest-ok');
    assert.equal(extra.length, 0);
    assert.ok(guestKernel && guestKernel !== release(), 'Must boot a distinct guest kernel');
    return guestKernel;
  }

  private cleanup(): void {
    this.removeExecution();
    for (const key of this.snapshots()) {
      this.daemon.run(['snapshots', '--snapshotter', 'native', 'remove', key]);
    }
    this.daemon.attempt(['images', 'remove', KataFixture.image]);
    assert.deepEqual(this.snapshots(), [], 'No retained snapshots');
  }

  private removeExecution(): void {
    const tasks = this.daemon.run(['tasks', 'list', '--quiet']).split('\n');
    if (tasks.includes(this.id)) {
      this.daemon.attempt(['tasks', 'kill', '--signal', 'SIGKILL', this.id]);
      this.daemon.attempt(['tasks', 'delete', '--force', this.id]);
    }
    const containers = this.daemon.run(['containers', 'list', '--quiet']).split('\n');
    if (containers.includes(this.id)) this.daemon.run(['containers', 'delete', this.id]);
    assert.equal(this.daemon.run(['tasks', 'list', '--quiet']), '', 'No retained Kata tasks');
    assert.equal(
      this.daemon.run(['containers', 'list', '--quiet']),
      '',
      'No retained Kata containers',
    );
  }

  private snapshots(): string[] {
    const listing = this.daemon.run(['snapshots', '--snapshotter', 'native', 'list']);
    const lines = listing.split('\n');
    assert.match(lines.shift() ?? '', /^KEY\s+PARENT\s+KIND/);
    const keys: string[] = [];
    for (const line of lines) {
      const key = line.trim().split(/\s+/)[0];
      if (key) keys.push(key);
    }
    return keys;
  }
}

class HostedKataProgram {
  async run(): Promise<void> {
    this.host();
    const kvm = new KvmQualification().run();
    this.runtime();
    const guestKernel = await new KataGuestQualification().run();
    const evidence = {
      ...kvm,
      hostKernel: release(),
      guestKernel,
      marker: 'cordis-kata-guest-ok',
      runtime: KataFixture.runtime,
      archiveDigest: KataFixture.archiveDigest,
      image: KataFixture.image,
      containerd: QualificationCommand.run('containerd', ['--version']),
      runnerImage: process.env.ImageVersion,
      runnerOS: readFileSync('/etc/os-release', 'utf8'),
      cleanup: 'verified',
    };
    process.stdout.write(`${JSON.stringify(evidence)}\n`);
  }

  private runtime(): void {
    const version = QualificationCommand.run('/opt/kata/runtime-rs/bin/containerd-shim-kata-v2', [
      '--version',
    ]);
    assert.match(version, /version: 4\.1\.0(?:,|\s|$)/);
    const config =
      '/opt/kata/share/defaults/kata-containers/runtime-rs/configuration-qemu-runtime-rs.toml';
    assert.equal(process.env.KATA_CONF_FILE, config);
    assert.match(readFileSync(config, 'utf8'), /^\[hypervisor\.qemu\]$/m);
    process.stderr.write(`${version}\n`);
  }

  private host(): void {
    assert.equal(
      process.env.GITHUB_ACTIONS,
      'true',
      'Qualification only runs on disposable Actions VMs',
    );
    assert.equal(process.env.RUNNER_ENVIRONMENT, 'github-hosted');
    assert.equal(process.getuid?.(), 0, 'Kata qualification requires root in its disposable VM');
    assert.equal(process.platform, 'linux');
    assert.equal(arch(), 'x64');
    assert.match(readFileSync('/etc/os-release', 'utf8'), /^VERSION_ID="26\.04"$/m);
  }

  static failure(error: unknown): void {
    process.stderr.write(`${error instanceof Error ? error.stack : String(error)}\n`);
    if (error instanceof AggregateError) {
      for (const cause of error.errors) HostedKataProgram.failure(cause);
    }
    process.exitCode = 1;
  }
}

if (import.meta.main) await new HostedKataProgram().run().catch(HostedKataProgram.failure);
