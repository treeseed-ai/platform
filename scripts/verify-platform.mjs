import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { basename, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const fail = (message) => { throw new Error(message); };
execFileSync(process.execPath, [resolve(root, 'scripts/verify-treeseed-skill.mjs')], { cwd: root, stdio: 'inherit' });
if (existsSync(resolve(root, '.gitmodules'))) fail('Platform must not encode team inventory as gitlinks.');
if (existsSync(resolve(root, 'treeseed.portfolio.json'))) fail('Platform must read live team inventory instead of a repository portfolio file.');
const index = execFileSync('git', ['ls-files', '--stage'], { cwd: root, encoding: 'utf8' });
const gitlinks = index.split('\n').filter((line) => line.startsWith('160000 '));
if (gitlinks.length > 0) fail(`Platform contains forbidden gitlinks: ${gitlinks.join(', ')}`);
const nestedRepositoryRoots = ['packages', 'templates', '.fixtures', 'starters']
	.flatMap((directory) => {
		const absolute = resolve(root, directory);
		if (!existsSync(absolute) || !statSync(absolute).isDirectory()) return [];
		return readdirSync(absolute, { withFileTypes: true })
			.filter((entry) => entry.isDirectory() && existsSync(resolve(absolute, entry.name, '.git')))
			.map((entry) => resolve(absolute, entry.name));
	});
const forbiddenRepositories = nestedRepositoryRoots.filter((repositoryRoot) => {
	let remote = '';
	try { remote = execFileSync('git', ['remote', 'get-url', 'origin'], { cwd: repositoryRoot, encoding: 'utf8' }).trim(); } catch { /* reported by identity checks when materialized */ }
	const normalized = remote.toLowerCase().replace(/\.git$/u, '');
	return ['market', 'market-api'].includes(basename(repositoryRoot).toLowerCase())
		|| /(?:github\.com[/:])treeseed-ai\/(?:market|market-api)$/u.test(normalized);
});
if (forbiddenRepositories.length > 0) fail(`Platform contains forbidden Market custody: ${forbiddenRepositories.join(', ')}`);
const config = readFileSync(resolve(root, 'treeseed.site.yaml'), 'utf8');
const requiredConfig = [/^authority: \{ kind: customer-platform \}\s*$/mu, /^market: \{ profile: treeseed \}\s*$/mu, /^controlPlane: \{ mode: managed \}\s*$/mu, /^\s*marketConnectivity: disabled\s*$/mu, /^\s*inventory: \{ source: seed, path: seeds\/treeseed\.yaml \}\s*$/mu, /^processing: \{ mode: local, providerRef: codex-sub \}\s*$/mu, /^surfaces: \{ web: \{ enabled: false \}, admin: \{ enabled: false \}, api: \{ enabled: true \} \}\s*$/mu, /^\s*api: \{ enabled: true, provider: local \}\s*$/mu, /^\s*treedx: \{ enabled: true, provider: local \}\s*$/mu];
if (requiredConfig.some((pattern) => !pattern.test(config))) fail('Platform configuration does not match the canonical local-managed Codex template.');
const localTemplateIds = ['platform-local-managed-codex', 'platform-local-managed-ai'];
for (const templateId of localTemplateIds) {
	const templateRoot = resolve(root, 'templates', templateId);
	const manifest = JSON.parse(readFileSync(resolve(templateRoot, 'template.config.json'), 'utf8'));
	const templateConfig = readFileSync(resolve(templateRoot, 'template/treeseed.site.yaml'), 'utf8');
	const templateAgents = readFileSync(resolve(templateRoot, 'template/seeds/agents.yaml'), 'utf8');
	if (manifest.templateVersion !== '2.0.0') fail(`${templateId} must use the breaking local-bootstrap template version 2.0.0.`);
	if (manifest.minCliVersion !== '0.12.59') fail(`${templateId} must require the first CLI line that enforces Market-disabled seed inventory.`);
	if (manifest.platform?.admin?.enabled !== false) fail(`${templateId} metadata must disable the unavailable local Admin surface.`);
	for (const path of ['treeseed.site.yaml', 'seeds/agents.yaml']) {
		if (!manifest.managedSurface?.coreManaged?.includes(path) || !manifest.managedSurface?.validatedOnly?.includes(path)) fail(`${templateId} does not manage and validate ${path}.`);
	}
	if (!manifest.platform?.seeds?.includes('seeds/agents.yaml')) fail(`${templateId} does not instantiate its local agent seed.`);
	if (!/^\s*marketConnectivity: disabled\s*$/mu.test(templateConfig) || !/^\s*inventory: \{ source: seed, path: seeds\/treeseed\.yaml \}\s*$/mu.test(templateConfig)) fail(`${templateId} does not disable local Market connectivity with seed inventory.`);
	if (!/^surfaces: \{ web: \{ enabled: false \}, admin: \{ enabled: false \}, api: \{ enabled: true \} \}\s*$/mu.test(templateConfig)) fail(`${templateId} enables an unavailable local web or Admin surface.`);
	if (/project:treeseed\/market(?:-api)?(?:\s|$)/mu.test(templateAgents)) fail(`${templateId} local agent capacity includes a forbidden Market project.`);
}
if (config !== readFileSync(resolve(root, 'templates/platform-local-managed-codex/template/treeseed.site.yaml'), 'utf8')) fail('Root Platform configuration has drifted from the local-managed Codex template.');
const requiredVerificationFiles = ["packages/market-guarantee-catalog/guarantees/agent/system/guide-golden.guarantee.yaml","packages/market-guarantee-catalog/guarantees/agent/system/source-golden.guarantee.yaml","packages/market-guarantee-catalog/guarantees/capacity/research/verify-autonomous-cited-research-starter.guarantee.yaml","packages/market-guarantee-catalog/guarantees/verifiers/service-workflows.verifiers.yaml","scripts/guarantees/verify-agent-capability.ts","scripts/guarantees/agent-catalog/cli-runtime.ts","scripts/guarantees/agent-catalog/json-evidence.ts","scripts/guarantees/agent-catalog/proof-executor.ts","scripts/guarantees/agent-catalog/proof-input.ts"];
for (const path of requiredVerificationFiles) if (!existsSync(resolve(root, path))) fail(`Platform is missing agent proof catalog input: ${path}`);
for (const path of ['treeseed.agents-capacity-provider.yaml', 'treeseed.platform-capacity-provider.yaml']) if (!existsSync(resolve(root, path))) fail(`Platform is missing capacity-provider configuration: ${path}`);
if (!existsSync(resolve(root, 'scripts/verify-local-workset-inventory.mjs'))) fail('Platform is missing the authoritative local inventory/workset comparison verifier.');
if (/^\s*market-?api:/imu.test(config)) fail('Platform configuration declares a forbidden Market API service.');
const seed = readFileSync(resolve(root, 'seeds/treeseed.yaml'), 'utf8');
if (/^\s+slug: market(?:-api)?\s*$/mu.test(seed)) fail('Platform seed declares a Market project.');
if (/information-hub/iu.test(seed)) fail('Platform seed contains a retired repository identity.');
const agentGuaranteeDefinitions = readdirSync(resolve(root, 'packages/market-guarantee-catalog/guarantees'), { recursive: true })
	.filter((path) => typeof path === 'string' && path.endsWith('.guarantee.yaml')).length;
const agentSeed = readFileSync(resolve(root, 'seeds/agents.yaml'), 'utf8');
if (/project:treeseed\/market(?:-api)?(?:\s|$)/mu.test(agentSeed)) fail('Local agent capacity includes a forbidden Market project.');
if (agentSeed !== readFileSync(resolve(root, 'templates/platform-local-managed-codex/template/seeds/agents.yaml'), 'utf8')) fail('Root local agent seed has drifted from the local-managed Codex template.');
console.log(JSON.stringify({ ok: true, inventoryAuthority: 'local-seed-bootstrap', marketConnectivity: 'disabled', gitlinks: gitlinks.length, marketCheckouts: forbiddenRepositories.length,
	agentGuaranteeDefinitions, activeAgentGuarantees: null, activeAgentGuaranteesObservation: 'not_observed_by_package_verification',
	authority: 'customer-platform', template: 'platform-local-managed-codex', hostedDeployment: false }));
