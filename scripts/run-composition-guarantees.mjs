import { createHash, randomUUID } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(import.meta.dirname, '..');

function option(name, fallback) {
	const index = process.argv.indexOf(`--${name}`);
	return index >= 0 ? process.argv[index + 1] : fallback;
}

function options(name) {
	return process.argv.flatMap((entry, index) => entry === `--${name}` ? [process.argv[index + 1]] : []).filter(Boolean);
}

function safePackagePath(packageName) {
	if (!/^(@[a-z0-9._-]+\/)?[a-z0-9._-]+$/iu.test(packageName)) throw new Error(`Unsafe package name ${packageName}.`);
	return packageName.split('/');
}

function redact(value) {
	return String(value ?? '')
		.replace(/Bearer\s+[A-Za-z0-9._~-]+/giu, 'Bearer [REDACTED]')
		.replace(/(?:confirm|reset)_[A-Za-z0-9_-]+/gu, '[REDACTED]')
		.replace(/("(?:access_token|refresh_token|password|token)"\s*:\s*")[^"]+/giu, '$1[REDACTED]');
}

async function artifactBody(payload) {
	if (payload.artifact.url.startsWith('file:')) return readFileSync(fileURLToPath(payload.artifact.url));
	const response = await fetch(payload.artifact.url);
	if (!response.ok) throw new Error(`Artifact ${payload.id} returned HTTP ${response.status}.`);
	return Buffer.from(await response.arrayBuffer());
}

async function materializePayloads(release, temporary) {
	const nodeModules = resolve(temporary, 'node_modules');
	const roots = new Map();
	for (const payload of release.hostPayloads ?? []) {
		const body = await artifactBody(payload);
		const digest = createHash('sha256').update(body).digest('hex');
		if (digest !== payload.artifact.sha256) throw new Error(`Artifact ${payload.id} digest ${digest} does not match the composition.`);
		const archive = resolve(temporary, `${payload.id}.tgz`);
		const packageRoot = resolve(nodeModules, ...safePackagePath(payload.packageName));
		mkdirSync(packageRoot, { recursive: true });
		writeFileSync(archive, body);
		const unpacked = spawnSync('tar', ['-xzf', archive, '-C', packageRoot, '--strip-components=1'], { encoding: 'utf8' });
		if (unpacked.status !== 0) throw new Error(`Unable to unpack ${payload.id}: ${redact(unpacked.stderr)}`);
		roots.set(payload.packageName, packageRoot);
	}
	return { nodeModules, roots };
}

function parseReport(stdout, definition) {
	let report;
	try { report = JSON.parse(stdout.trim()); }
	catch { throw new Error(`${definition.artifactId} did not emit one JSON verifier result.`); }
	if (report?.schemaVersion !== 'treeseed.guarantee-verifier-result/v1' || !Array.isArray(report.checks)) {
		throw new Error(`${definition.artifactId} emitted an unsupported verifier result.`);
	}
	return report;
}

function verifierArgs({ adminPackageRoot } = {}) {
	const args = [
		'--api-origin', option('api-origin', 'http://api:3000'),
		'--mailpit-origin', option('mailpit-origin', 'http://mailpit:8025'),
		'--admin-origin', option('admin-origin', 'https://admin.treeseed.localhost'),
	];
	for (const name of ['device', 'scene-artifacts']) if (option(name, '')) args.push(`--${name}`, option(name, ''));
	if (adminPackageRoot) args.push('--admin-package-root', adminPackageRoot);
	args.push('--device-profile', option('device', 'desktop_chromium'));
	return args;
}

async function executeLocal(definition, packageRoot, roots) {
	const entrypoint = resolve(packageRoot, definition.entrypoint);
	if (!entrypoint.startsWith(`${packageRoot}/`) || !existsSync(entrypoint)) throw new Error(`Missing safe entrypoint ${definition.entrypoint}.`);
	if (definition.exportName) {
		const module = await import(`${pathToFileURL(entrypoint).href}?run=${randomUUID()}`);
		if (typeof module[definition.exportName] !== 'function') throw new Error(`${definition.exportName} is not exported by ${definition.entrypoint}.`);
		const report = await module[definition.exportName]();
		return { report: parseReport(JSON.stringify(report), definition), execution: { mode: 'local-export' } };
	}
	const child = spawnSync(process.execPath, [entrypoint, ...verifierArgs({ adminPackageRoot: roots.get('@treeseed/admin') })], { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
	const report = parseReport(redact(child.stdout), definition);
	if (child.status !== 0 && report.ok) throw new Error(`${definition.artifactId} exited ${child.status}: ${redact(child.stderr)}`);
	return { report, execution: { mode: 'local-process', exitCode: child.status } };
}

function containerMap() {
	return new Map(options('container').map((entry) => {
		const separator = entry.indexOf('=');
		if (separator < 1) throw new Error(`Invalid --container mapping ${entry}.`);
		return [entry.slice(0, separator), entry.slice(separator + 1)];
	}));
}

function executeInContainer(definition, container, nodeModules, runId) {
	if (!/^[A-Za-z0-9_.-]+$/u.test(container)) throw new Error(`Unsafe container name ${container}.`);
	const target = `/app/.treeseed-guarantees/${runId}`;
	const packagePath = `${target}/node_modules/${definition.ownerPackage}`;
	try {
		let child = spawnSync('docker', ['exec', container, 'mkdir', '-p', `${target}/node_modules`], { encoding: 'utf8' });
		if (child.status !== 0) throw new Error(redact(child.stderr));
		child = spawnSync('docker', ['cp', `${nodeModules}/.`, `${container}:${target}/node_modules`], { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
		if (child.status !== 0) throw new Error(redact(child.stderr));
		child = spawnSync('docker', ['exec', container, 'node', `${packagePath}/${definition.entrypoint}`,
			...verifierArgs({ adminPackageRoot: `${target}/node_modules/@treeseed/admin` })], {
			encoding: 'utf8', maxBuffer: 10 * 1024 * 1024,
		});
		const report = parseReport(redact(child.stdout), definition);
		if (child.status !== 0 && report.ok) throw new Error(`${definition.artifactId} exited ${child.status}: ${redact(child.stderr)}`);
		return { report, execution: { mode: 'component-container', container, exitCode: child.status } };
	} finally {
		spawnSync('docker', ['exec', container, 'rm', '-rf', target], { encoding: 'utf8' });
	}
}

function markdown(report) {
	const rows = report.results.map((entry) => `| ${entry.status} | ${entry.id} | ${entry.verifierRefs.join(', ')} |`).join('\n');
	return `# TreeSeed composition guarantee run\n\n- Run: ${report.runId}\n- Composition: ${report.composition.release} generation ${report.composition.generation}\n- Result: ${report.ok ? 'PASS' : 'FAIL'}\n- Passed: ${report.counts.passed}\n- Failed: ${report.counts.failed}\n- Blocked: ${report.counts.blocked}\n\n| Status | Guarantee | Verifiers |\n| --- | --- | --- |\n${rows}\n`;
}

const releasePath = resolve(root, option('release', 'deployment/integration-releases/development.json'));
const outputRoot = resolve(root, option('output', '.treeseed/guarantees/runs'));
const environment = option('environment', 'local');
const runId = option('run-id', `${new Date().toISOString().replace(/[:.]/gu, '-')}-${randomUUID().slice(0, 8)}`);
const startedAt = new Date().toISOString();
if (!/^[A-Za-z0-9_.-]+$/u.test(runId)) throw new Error('Run ID must be filesystem and container safe.');
const release = JSON.parse(readFileSync(releasePath, 'utf8'));
const plannerArgs = [resolve(root, 'scripts/plan-composition-guarantees.mjs'), '--release', releasePath,
	'--owner-package', option('owner-package', '@treeseed/admin'), '--types', option('types', 'user,team'), '--statuses', option('statuses', 'active')];
for (const name of ['guarantee-owner-package', 'subtypes', 'gates', 'ids', 'journey-indexes']) if (option(name, '')) plannerArgs.push(`--${name}`, option(name, ''));
if (process.argv.includes('--no-dependencies')) plannerArgs.push('--no-dependencies');
const planner = spawnSync(process.execPath, plannerArgs,
	{ cwd: root, encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
const plan = JSON.parse(planner.stdout);
const finalRoot = resolve(outputRoot, runId);
if (existsSync(finalRoot)) throw new Error(`Guarantee run ${runId} already exists.`);
const stagingRoot = resolve(outputRoot, `.${runId}.partial-${randomUUID()}`);
mkdirSync(resolve(stagingRoot, 'evidence'), { recursive: true });
writeFileSync(resolve(stagingRoot, 'plan.json'), `${JSON.stringify(plan, null, 2)}\n`);

const temporary = mkdtempSync(resolve(tmpdir(), 'treeseed-guarantee-run-'));
try {
	const executions = new Map();
	if (plan.ok) {
		const { nodeModules, roots } = await materializePayloads(release, temporary);
		const containers = containerMap();
		for (const verifier of plan.verifiers) {
			const definition = verifier.definition;
			const key = JSON.stringify([definition.kind, definition.ownerPackage, definition.artifactId, definition.entrypoint, definition.exportName]);
			if (!executions.has(key)) {
				try {
					if (definition.kind !== 'artifact') throw new Error(`Catalog operation execution is not configured for ${verifier.ref}.`);
					const container = containers.get(definition.ownerPackage);
					const executed = container
						? executeInContainer(definition, container, nodeModules, runId)
						: await executeLocal(definition, roots.get(definition.ownerPackage), roots);
					executions.set(key, executed);
				} catch (error) {
					executions.set(key, { error: redact(error instanceof Error ? error.message : error), execution: { mode: 'failed' } });
				}
			}
			const executed = executions.get(key);
			verifier.executionKey = createHash('sha256').update(key).digest('hex').slice(0, 16);
			verifier.execution = executed.execution;
			verifier.error = executed.error;
			verifier.report = executed.report;
			if (executed.report) writeFileSync(resolve(stagingRoot, 'evidence', `${verifier.executionKey}.json`), `${JSON.stringify(executed.report, null, 2)}\n`);
		}
	}
	const verifierByRef = new Map(plan.verifiers.map((entry) => [entry.ref, entry]));
	const results = plan.results.map((entry) => {
		const checks = entry.verifierRefs.map((ref) => {
			const verifier = verifierByRef.get(ref), definition = verifier?.definition;
			const check = verifier?.report?.checks?.find((candidate) => candidate.id === definition?.caseId);
			return { ref, caseId: definition?.caseId, status: check?.status ?? 'blocked', error: verifier?.error ?? check?.error };
		});
		const status = checks.some((check) => check.status === 'failed') ? 'failed'
			: checks.length > 0 && checks.every((check) => check.status === 'passed') ? 'passed' : 'blocked';
		const steps = checks.map((check) => {
			const verifier = verifierByRef.get(check.ref);
			const evidence = verifier?.executionKey ? [`evidence/${verifier.executionKey}.json`] : [];
			const diagnostics = check.error ? [{ severity: 'error', code: 'guarantee.verifier_failed', message: check.error }] : [];
			return { id: check.ref, kind: entry.sceneVerifierRefs?.includes(check.ref) ? 'scene' : 'verifier', status: check.status, summary: check.caseId ?? check.ref, evidence, diagnostics };
		});
		return { ...entry, status, checks, steps, diagnostics: steps.flatMap((step) => step.diagnostics), evidence: [...new Set(steps.flatMap((step) => step.evidence))] };
	});
	const counts = { passed: results.filter((entry) => entry.status === 'passed').length,
		failed: results.filter((entry) => entry.status === 'failed').length, skipped: 0,
		blocked: results.filter((entry) => entry.status === 'blocked').length,
		releaseBlockingFailures: results.filter((entry) => entry.releaseBlocking && ['failed', 'blocked'].includes(entry.status)).length };
	const report = { schemaVersion: 'treeseed.guarantee-run/v1', runId, startedAt, completedAt: new Date().toISOString(),
		ok: plan.ok && counts.failed === 0 && counts.blocked === 0, environment, composition: plan.composition,
		source: { platform: release.platform, deployment: release.deployment, releasePath }, catalog: plan.catalog, filter: plan.filter,
		payloads: plan.payloads, counts, results, diagnostics: plan.diagnostics, verifiers: plan.verifiers.map(({ report: _report, ...entry }) => entry) };
	writeFileSync(resolve(stagingRoot, 'report.json'), `${JSON.stringify(report, null, 2)}\n`);
	writeFileSync(resolve(stagingRoot, 'report.md'), markdown(report));
	mkdirSync(dirname(finalRoot), { recursive: true });
	renameSync(stagingRoot, finalRoot);
	process.stdout.write(`${JSON.stringify({ ok: report.ok, runId, runRoot: finalRoot, counts }, null, 2)}\n`);
	process.exitCode = report.ok ? 0 : 1;
} finally {
	rmSync(temporary, { recursive: true, force: true });
	if (existsSync(stagingRoot)) rmSync(stagingRoot, { recursive: true, force: true });
}
