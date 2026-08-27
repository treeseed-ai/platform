import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(import.meta.dirname, '..');

function option(name, fallback) {
	const index = process.argv.indexOf(`--${name}`);
	return index >= 0 ? process.argv[index + 1] : fallback;
}

function csvOption(name) {
	return new Set(String(option(name, '')).split(',').map((entry) => entry.trim()).filter(Boolean));
}

function verifierRefs(value, out = new Set()) {
	if (Array.isArray(value)) for (const entry of value) verifierRefs(entry, out);
	else if (value && typeof value === 'object') for (const [key, entry] of Object.entries(value)) {
		if (key === 'verifierRefs' && Array.isArray(entry)) for (const id of entry) out.add(String(id));
		else verifierRefs(entry, out);
	}
	return out;
}

function guaranteeVerifierRefs(manifest) {
	const refs = verifierRefs(manifest);
	if (manifest?.scene?.required === true && manifest.scene.executionKey) refs.add(String(manifest.scene.executionKey));
	for (const negative of manifest?.negativeCases ?? []) {
		if (negative?.scene?.executionKey) refs.add(String(negative.scene.executionKey));
	}
	return refs;
}

function sceneVerifierRefs(manifest) {
	return [manifest?.scene?.required === true ? manifest.scene.executionKey : null,
		...(manifest?.negativeCases ?? []).map((entry) => entry?.scene?.executionKey)].filter(Boolean).map(String);
}

function dependencyIds(manifest) {
	return Array.isArray(manifest?.dependencies?.guarantees) ? manifest.dependencies.guarantees.map(String) : [];
}

async function materializePackage(payload, temporary) {
	let body;
	if (payload.artifact.url.startsWith('file:')) body = readFileSync(fileURLToPath(payload.artifact.url));
	else {
		const response = await fetch(payload.artifact.url);
		if (!response.ok) throw new Error(`Artifact ${payload.id} returned HTTP ${response.status}.`);
		body = Buffer.from(await response.arrayBuffer());
	}
	const digest = createHash('sha256').update(body).digest('hex');
	if (digest !== payload.artifact.sha256) throw new Error(`Artifact ${payload.id} digest ${digest} does not match the composition.`);
	const archive = resolve(temporary, `${payload.id}.tgz`);
	const output = resolve(temporary, payload.id);
	writeFileSync(archive, body);
	execFileSync('mkdir', ['-p', output]);
	execFileSync('tar', ['-xzf', archive, '-C', output]);
	return resolve(output, 'package');
}

function diagnostic(code, message, detail = {}) {
	return { severity: 'error', code, message, ...detail };
}

const releasePath = resolve(root, option('release', 'deployment/integration-releases/development.json'));
const ownerFilter = option('owner-package', '@treeseed/admin');
const types = new Set(String(option('types', 'user,team')).split(',').map((entry) => entry.trim()).filter(Boolean));
const statuses = new Set(String(option('statuses', 'active')).split(',').map((entry) => entry.trim()).filter(Boolean));
const guaranteeOwners = csvOption('guarantee-owner-package');
const subtypes = csvOption('subtypes');
const gates = csvOption('gates');
const ids = csvOption('ids');
const journeyIndexes = csvOption('journey-indexes');
const includeDependencies = !process.argv.includes('--no-dependencies');
const release = JSON.parse(readFileSync(releasePath, 'utf8'));
const payload = release.hostPayloads?.find((entry) => entry.packageName === ownerFilter);
if (!payload) throw new Error(`Composition ${release.release} does not select ${ownerFilter}.`);
const payloadsByPackage = new Map((release.hostPayloads ?? []).map((entry) => [entry.packageName, entry]));

const temporary = mkdtempSync(resolve(tmpdir(), 'treeseed-guarantee-plan-'));
try {
	const packageRoot = await materializePackage(payload, temporary);
	const catalogPath = resolve(packageRoot, 'dist/standards/guarantee-catalog.json');
	const diagnostics = [];
	if (!existsSync(catalogPath)) diagnostics.push(diagnostic(
		'guarantee.catalog_missing_from_artifact',
		`${ownerFilter}@${payload.version} does not contain its package-owned guarantees.`,
		{ artifact: payload.artifact.url },
	));
	let catalog = null;
	try { if (existsSync(catalogPath)) catalog = JSON.parse(readFileSync(catalogPath, 'utf8')); }
	catch (error) { diagnostics.push(diagnostic('guarantee.invalid_catalog', error instanceof Error ? error.message : String(error))); }
	if (catalog && catalog.schemaVersion !== 'treeseed.guarantee-catalog/v1') diagnostics.push(diagnostic('guarantee.invalid_catalog', 'Packed guarantee catalog has an unsupported schema version.'));
	const loaded = Array.isArray(catalog?.guarantees) ? catalog.guarantees.map((entry) => ({ path: resolve(packageRoot, entry.sourcePath), manifest: entry.manifest })) : [];
	const byId = new Map(loaded.map((entry) => [String(entry.manifest.id ?? ''), entry]));
	const selected = loaded.filter((entry) => statuses.has(String(entry.manifest.status)) && types.has(String(entry.manifest.type))
		&& (!guaranteeOwners.size || guaranteeOwners.has(String(entry.manifest.ownerPackage)))
		&& (!subtypes.size || subtypes.has(String(entry.manifest.subtype)))
		&& (!gates.size || (entry.manifest.gates ?? []).some((gate) => gates.has(String(gate))))
		&& (!ids.size || ids.has(String(entry.manifest.id)))
		&& (!journeyIndexes.size || journeyIndexes.has(String(entry.manifest.journeyIndex))));
	const closure = new Map(selected.map((entry) => [String(entry.manifest.id), { ...entry, selected: true }]));
	const queue = [...selected];
	while (includeDependencies && queue.length) for (const dependency of dependencyIds(queue.shift().manifest)) {
		if (closure.has(dependency)) continue;
		const found = byId.get(dependency);
		if (!found) diagnostics.push(diagnostic('guarantee.dependency_missing', `Guarantee dependency ${dependency} is absent from the packed catalog.`));
		else { closure.set(dependency, { ...found, selected: false }); queue.push(found); }
	}

	const declared = {};
	const registrySources = {};
	for (const registry of catalog?.verifierRegistries ?? []) {
		for (const [id, verifier] of Object.entries(registry?.document?.verifiers ?? {})) {
			declared[id] = verifier;
			registrySources[id] = registry.sourcePath;
		}
	}
	const usedVerifierRefs = new Set();
	for (const entry of closure.values()) for (const ref of guaranteeVerifierRefs(entry.manifest)) {
		usedVerifierRefs.add(ref);
		const verifier = declared[ref];
		if (!verifier) diagnostics.push(diagnostic('guarantee.verifier_undeclared', `${entry.manifest.id} references undeclared verifier ${ref}.`));
		else if (!['artifact', 'catalogOperation'].includes(String(verifier.kind))) diagnostics.push(diagnostic(
			'guarantee.verifier_not_artifact_bound',
			`${ref} uses ${verifier.kind}; exact compositions require an immutable artifact or catalog operation verifier.`,
			{ ownerPackage: verifier.ownerPackage, sourcePath: verifier.testFile ?? verifier.command ?? verifier.caseId },
		));
	}
	for (const ref of usedVerifierRefs) {
		const verifier = declared[ref];
		if (!verifier || !['artifact', 'catalogOperation'].includes(String(verifier.kind))) continue;
		for (const field of verifier.kind === 'artifact'
			? ['ownerPackage', 'artifactId', 'entrypoint', 'caseId']
			: ['ownerPackage', 'operationId', 'caseId']) {
			if (typeof verifier[field] !== 'string' || !verifier[field].trim()) diagnostics.push(diagnostic(
				'guarantee.verifier_field_missing', `${ref} is missing required ${field}.`, { verifierRef: ref, field },
			));
		}
		if (!payloadsByPackage.has(verifier.ownerPackage)) diagnostics.push(diagnostic(
			'guarantee.verifier_payload_missing', `${ref} owner ${verifier.ownerPackage} is not selected as an exact host payload.`,
			{ verifierRef: ref, ownerPackage: verifier.ownerPackage },
		));
		if (verifier.kind === 'artifact' && (verifier.entrypoint.startsWith('/') || verifier.entrypoint.split('/').includes('..'))) diagnostics.push(diagnostic(
			'guarantee.verifier_entrypoint_unsafe', `${ref} has an unsafe artifact entrypoint.`, { verifierRef: ref, entrypoint: verifier.entrypoint },
		));
	}

	const results = [...closure.values()].map((entry) => ({
		id: String(entry.manifest.id), journey: String(entry.manifest.journey ?? entry.manifest.id), ownerPackage: String(entry.manifest.ownerPackage),
		type: String(entry.manifest.type), subtype: String(entry.manifest.subtype), status: String(entry.manifest.status), selected: entry.selected,
		dependency: !entry.selected, journeyIndex: entry.manifest.journeyIndex, gates: Array.isArray(entry.manifest.gates) ? entry.manifest.gates.map(String) : [],
		releaseBlocking: entry.manifest.run?.requiredForRelease === true,
		sourcePath: relative(packageRoot, entry.path).replaceAll('\\', '/'), sceneManifest: entry.manifest.scene?.manifest,
		sceneVerifierRefs: sceneVerifierRefs(entry.manifest),
		verifierRefs: [...guaranteeVerifierRefs(entry.manifest)].sort(),
	})).sort((a, b) => a.id.localeCompare(b.id));
	const report = {
		schemaVersion: 'treeseed.guarantee-plan/v1', ok: diagnostics.length === 0,
		composition: { release: release.release, generation: release.generation, track: release.track },
		catalog: { packageName: ownerFilter, version: payload.version, artifact: payload.artifact },
		filter: { statuses: [...statuses], types: [...types], guaranteeOwners: [...guaranteeOwners], subtypes: [...subtypes], gates: [...gates], ids: [...ids], journeyIndexes: [...journeyIndexes], includeDependencies },
		counts: { selected: results.filter((entry) => entry.selected).length, withDependencies: results.length, errors: diagnostics.length },
		verifiers: [...usedVerifierRefs].sort().map((ref) => ({ ref, registrySource: registrySources[ref], definition: declared[ref] })),
		payloads: [...new Set([...usedVerifierRefs].map((ref) => declared[ref]?.ownerPackage).filter(Boolean))].map((packageName) => payloadsByPackage.get(packageName)),
		entries: results, results, diagnostics,
	};
	process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
	process.exitCode = report.ok ? 0 : 1;
} finally {
	rmSync(temporary, { recursive: true, force: true });
}
