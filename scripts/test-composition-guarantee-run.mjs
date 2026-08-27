import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = resolve(import.meta.dirname, '..');
const temporary = mkdtempSync(resolve(tmpdir(), 'treeseed-guarantee-run-test-'));

try {
	const packageRoot = resolve(temporary, 'source/package');
	mkdirSync(resolve(packageRoot, 'dist/standards'), { recursive: true });
	writeFileSync(resolve(packageRoot, 'dist/verifier.js'), `#!/usr/bin/env node\nprocess.stdout.write(JSON.stringify({schemaVersion:'treeseed.guarantee-verifier-result/v1',verifierId:'fixture',startedAt:new Date().toISOString(),completedAt:new Date().toISOString(),ok:true,checks:[{id:'fixture.case',status:'passed',durationMs:1}]}));\n`);
	writeFileSync(resolve(packageRoot, 'dist/standards/guarantee-catalog.json'), JSON.stringify({
		schemaVersion: 'treeseed.guarantee-catalog/v1', package: { name: '@treeseed/admin', version: '1.0.0-rc.1' },
		guarantees: [{ sourcePath: 'guarantees/example.guarantee.yaml', manifest: {
			schemaVersion: 'treeseed.guarantee/v1', id: 'guarantee.user.auth.example.001', journey: 'Example', ownerPackage: '@treeseed/admin',
			type: 'user', subtype: 'auth', status: 'active', dependencies: { guarantees: [] }, api: { required: true, verifierRefs: ['fixture.verifier'] },
		} }],
		verifierRegistries: [{ sourcePath: 'guarantees/verifiers/composition.yaml', document: {
			schemaVersion: 'treeseed.guarantee-verifiers/v1', ownerPackage: '@treeseed/admin', verifiers: {
				'fixture.verifier': { kind: 'artifact', ownerPackage: '@treeseed/admin', artifactId: '@treeseed/admin/fixture', entrypoint: 'dist/verifier.js', caseId: 'fixture.case' },
			},
		} }],
	}));
	const archive = resolve(temporary, 'admin.tgz');
	execFileSync('tar', ['-czf', archive, '-C', resolve(temporary, 'source'), 'package']);
	const digest = createHash('sha256').update(readFileSync(archive)).digest('hex');
	const releasePath = resolve(temporary, 'release.json');
	writeFileSync(releasePath, JSON.stringify({ schemaVersion: 'treeseed.integration-release/v1', release: 'fixture', generation: 7, track: 'development',
		platform: { commit: 'a'.repeat(40) }, deployment: { commit: 'b'.repeat(40) },
		hostPayloads: [{ id: 'admin', packageName: '@treeseed/admin', version: '1.0.0-rc.1', artifact: { url: pathToFileURL(archive).href, sha256: digest } }] }));
	const output = resolve(temporary, 'runs');
	const child = spawnSync(process.execPath, ['scripts/run-composition-guarantees.mjs', '--release', releasePath, '--output', output, '--run-id', 'fixture-run'], { cwd: root, encoding: 'utf8' });
	assert.equal(child.status, 0, child.stderr || child.stdout);
	const summary = JSON.parse(child.stdout);
	const report = JSON.parse(readFileSync(resolve(summary.runRoot, 'report.json'), 'utf8'));
	assert.equal(report.ok, true);
	assert.deepEqual(report.counts, { passed: 1, failed: 0, skipped: 0, blocked: 0, releaseBlockingFailures: 0 });
	assert.equal(report.environment, 'local');
	assert.equal(report.results[0].steps[0].status, 'passed');
	assert.equal(report.results[0].checks[0].caseId, 'fixture.case');
	assert.equal(report.payloads[0].artifact.sha256, digest);
	process.stdout.write(`${JSON.stringify({ ok: true, cases: 1 })}\n`);
} finally {
	rmSync(temporary, { recursive: true, force: true });
}
