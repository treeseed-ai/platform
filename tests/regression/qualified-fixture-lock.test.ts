import { test, expect } from 'bun:test';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { QualifiedFixtureLock } from '../support/assembly/qualified-fixture-lock.ts';
import { RegistryDriftFixture } from '../support/assembly/registry-drift-fixture.ts';

class QualifiedFixtureLockTests {
  async registryPatch(): Promise<void> {
    const fixture = new RegistryDriftFixture();
    try {
      const fresh = await fixture.resolve('unqualified', {});
      expect(fresh.jose![0]).toBe('jose@6.2.14');
      const overrides = new QualifiedFixtureLock(fixture.qualified()).overrides();
      const pinned = await fixture.resolve('qualified', overrides);
      expect(pinned.jose![0]).toBe('jose@6.2.13');
      expect(pinned.jose!.at(-1)).toBe(fixture.oldIntegrity);
      expect(Object.keys(pinned).sort()).toEqual(['consumer', 'jose']);
      expect(existsSync(join(fixture.root, 'qualified/SCRIPT_EXECUTED'))).toBe(false);
    } finally {
      fixture.close();
    }
  }

  scopedAndLocal(): void {
    const lock = JSON.stringify({ packages: {
      '@owner/sdk': ['@owner/sdk@vendor/sdk.tgz', {}, 'sha512-local'],
      '@scope/package': ['@scope/package@1.2.3', '', {}, 'sha512-registry'],
    } });
    expect(new QualifiedFixtureLock(lock).overrides()).toEqual({ '@scope/package': '1.2.3' });
  }

  rejectsAmbiguity(): void {
    const nested = JSON.stringify({ packages: { 'a/jose': ['jose@6.2.13', '', {}, 'sha512-value'] } });
    expect(this.overrides.bind(this, nested)).toThrow('QUALIFIED_LOCK');
    const malformed = JSON.stringify({ packages: { jose: ['other@6.2.13', '', {}, 'sha512-value'] } });
    expect(this.overrides.bind(this, malformed)).toThrow('QUALIFIED_LOCK');
    expect(this.overrides.bind(this, '{broken')).toThrow('QUALIFIED_LOCK');
  }

  private overrides(source: string): void {
    new QualifiedFixtureLock(source).overrides();
  }
}
const suite = new QualifiedFixtureLockTests();
test('regression: newer registry patches cannot change a qualified fixture', suite.registryPatch.bind(suite), 30000);
test('regression: scoped registry identities exclude local archives', suite.scopedAndLocal.bind(suite));
test('regression: ambiguous or malformed qualified locks fail closed', suite.rejectsAmbiguity.bind(suite));
