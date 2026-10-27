import { test, expect } from 'bun:test';
import { spawnSync } from 'node:child_process';

class HostedKataAcceptance {
  run(): void {
    const result = spawnSync(process.execPath, ['.qualification/kata-host.js'], {
      encoding: 'utf8',
      timeout: 240_000,
      maxBuffer: 4 * 1024 * 1024,
    });
    process.stderr.write(result.stderr ?? '');
    expect(result.error).toBeUndefined();
    expect(result.status).toBe(0);
    const evidence = JSON.parse(result.stdout.trim());
    expect(evidence.kvmApi).toBe(12);
    expect(evidence.virtualMachineCreated).toBe(true);
    expect(evidence.guestKernel).not.toBe(evidence.hostKernel);
    expect(evidence.marker).toBe('cordis-kata-guest-ok');
    expect(evidence.cleanup).toBe('verified');
    expect(evidence.runtime).toBe('4.1.0');
    process.stdout.write(`${JSON.stringify(evidence)}\n`);
  }
}

const suite = new HostedKataAcceptance();
test(
  'acceptance: hosted KVM boots a real pinned Kata guest and verifies cleanup',
  suite.run.bind(suite),
  250_000,
);
