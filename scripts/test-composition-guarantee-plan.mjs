import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = resolve(import.meta.dirname, '..');
const temporary = mkdtempSync(resolve(tmpdir(), 'treeseed-guarantee-plan-test-'));

function fixture(name, withCatalog) {
	const source = resolve(temporary, `${name}-source/package`);
	mkdirSync(source, { recursive: true });
	if (withCatalog) {
		mkdirSync(resolve(source, 'dist/standards'), { recursive: true });
		writeFileSync(resolve(source, 'dist/standards/guarantee-catalog.json'), JSON.stringify({
			schemaVersion: 'treeseed.guarantee-catalog/v1', package: { name: '@treeseed/admin', version: '1.0.0-rc.1' },
			guarantees: [{ sourcePath: 'guarantees/example.guarantee.yaml', manifest: {
				schemaVersion: 'treeseed.guarantee/v1', id: 'guarantee.user.auth.example.001', journey: 'Example',
				ownerPackage: '@treeseed/admin', type: 'user', subtype: 'auth', status: 'active', dependencies: { guarantees: [] },
				scene: { required: true, manifest: './example.scene.yaml', executionKey: 'admin.example.scene' },
				api: { required: true, verifierRefs: ['api.example'] },
			} }],
			verifierRegistries: [{ sourcePath: 'guarantees/verifiers/legacy.verifiers.yaml', document: {
				schemaVersion: 'treeseed.guarantee-verifiers/v1', ownerPackage: '@treeseed/admin',
				verifiers: { 'api.example': { kind: 'nodeScript', ownerPackage: '@treeseed/admin', testFile: 'removed.ts' } },
			} }, { sourcePath: 'guarantees/verifiers/composition.verifiers.yaml', document: {
				schemaVersion: 'treeseed.guarantee-verifiers/v1', ownerPackage: '@treeseed/admin',
				verifiers: {
					'api.example': { kind: 'artifact', ownerPackage: '@treeseed/admin', artifactId: '@treeseed/admin/example', entrypoint: 'dist/example.js', caseId: 'example' },
					'admin.example.scene': { kind: 'artifact', ownerPackage: '@treeseed/admin', artifactId: '@treeseed/admin/example', entrypoint: 'dist/example.js', caseId: 'scene' },
				},
			} }],
		}));
	}
	const archive = resolve(temporary, `${name}.tgz`);
	execFileSync('tar', ['-czf', archive, '-C', resolve(temporary, `${name}-source`), 'package']);
	const digest = createHash('sha256').update(readFileSync(archive)).digest('hex');
	const release = resolve(temporary, `${name}.json`);
	writeFileSync(release, JSON.stringify({
		schemaVersion: 'treeseed.integration-release/v1', release: name, generation: 1, track: 'development',
		hostPayloads: [{ id: 'admin', packageName: '@treeseed/admin', version: '1.0.0-rc.1', artifact: { url: pathToFileURL(archive).href, sha256: digest } }],
	}));
	return release;
}

function run(release, args = []) {
	const result = spawnSync(process.execPath, ['scripts/plan-composition-guarantees.mjs', '--release', release, ...args], { cwd: root, encoding: 'utf8' });
	return { ...result, report: JSON.parse(result.stdout) };
}

try {
	const accepted = run(fixture('accepted', true));
	assert.equal(accepted.status, 0);
	assert.equal(accepted.report.ok, true);
	assert.deepEqual(accepted.report.counts, { selected: 1, withDependencies: 1, errors: 0 });
	assert.equal(accepted.report.verifiers.length, 2);
	assert.equal(accepted.report.verifiers[0].registrySource, 'guarantees/verifiers/composition.verifiers.yaml');
	assert.equal(accepted.report.verifiers[0].definition.kind, 'artifact');
	const focused = run(fixture('focused', true), ['--ids', 'guarantee.user.auth.example.001', '--no-dependencies']);
	assert.equal(focused.status, 0);
	assert.equal(focused.report.filter.includeDependencies, false);
	assert.deepEqual(focused.report.filter.ids, ['guarantee.user.auth.example.001']);

	const missing = run(fixture('missing', false));
	assert.equal(missing.status, 1);
	assert.equal(missing.report.ok, false);
	assert.equal(missing.report.diagnostics[0].code, 'guarantee.catalog_missing_from_artifact');
	process.stdout.write(`${JSON.stringify({ ok: true, cases: 3 })}\n`);
} finally {
	rmSync(temporary, { recursive: true, force: true });
}
