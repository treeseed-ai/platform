import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { basename, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const fail = (message) => { throw new Error(message); };
const read = (path) => readFileSync(resolve(root, path), 'utf8');
const requireFile = (path) => { if (!existsSync(resolve(root, path))) fail(`Platform is missing ${path}.`); };

execFileSync(process.execPath, [resolve(root, 'scripts/verify-treeseed-skill.mjs')], { cwd: root, stdio: 'inherit' });
if (existsSync(resolve(root, '.gitmodules'))) fail('Platform must not encode team inventory as gitlinks.');
if (existsSync(resolve(root, 'treeseed.portfolio.json'))) fail('Platform must read live team inventory from its portable seed bundle.');
const index = execFileSync('git', ['ls-files', '--stage'], { cwd: root, encoding: 'utf8' });
const gitlinks = index.split('\n').filter((line) => line.startsWith('160000 '));
if (gitlinks.length) fail(`Platform contains forbidden gitlinks: ${gitlinks.join(', ')}`);

for (const path of ['seeds/treeseed.yaml', 'treeseed.capacity-provider.yaml']) requireFile(path);
for (const path of ['seeds/agents.yaml', 'seeds/platform.yaml', 'treeseed.agents-capacity-provider.yaml', 'treeseed.platform-capacity-provider.yaml']) {
	if (existsSync(resolve(root, path))) fail(`Platform retains obsolete split-provider input ${path}.`);
}

const seed = read('seeds/treeseed.yaml');
for (const required of ['schemaVersion: treeseed.seed-bundle/v2', 'adrian.webb@knowledge.coop', 'service-principal:treeseed/automation', 'interactiveLogin: false', 'capacity-provider:treeseed/local', 'requiredLanePurposes: [communication, platform, workday]']) {
	if (!seed.includes(required)) fail(`Canonical seed is missing required contract text: ${required}`);
}
for (const forbidden of ['agentLabServicePrincipals', 'providerClass:', 'adrian.webb@treeseed.dev', 'registrationKey', 'privateKey']) {
	if (seed.includes(forbidden)) fail(`Canonical seed retains forbidden legacy or secret field: ${forbidden}`);
}
const projects = [...seed.matchAll(/key: ['"]?(project:treeseed\/[a-z0-9-]+)/gu)].map((match) => match[1]);
if (new Set(projects).size !== 15) fail(`Canonical seed must contain 15 unique primary projects; found ${new Set(projects).size}.`);
for (const project of ['project:treeseed/market', 'project:treeseed/market-api']) if (!projects.includes(project)) fail(`Canonical seed is missing ${project}.`);
const repositories = [...seed.matchAll(/key: ['"]?(repository:treeseed\/[a-z0-9-]+)/gu)].map((match) => match[1]);
if (new Set(repositories).size !== 31) fail(`Canonical seed must contain 31 unique repository bindings; found ${new Set(repositories).size}.`);
if (!/digest: sha256:[a-f0-9]{64}/u.test(seed)) fail('Canonical seed is not digest-bound.');

const provider = read('treeseed.capacity-provider.yaml');
for (const required of ['schemaVersion: 3', 'purpose: communication', 'purpose: platform', 'purpose: workday', 'reclaimPolicy: admission', 'isolation: process']) {
	if (!provider.includes(required)) fail(`Unified provider manifest is missing ${required}.`);
}
for (const forbidden of ['providerClass:', 'registrationKeyRef:', 'membershipCredentialRef:']) if (provider.includes(forbidden)) fail(`Unified provider manifest retains ${forbidden}.`);

const config = read('treeseed.site.yaml');
const requiredConfig = [/^authority: \{ kind: customer-platform \}\s*$/mu, /^controlPlane: \{ mode: managed \}\s*$/mu, /^\s*inventory: \{ source: seed, path: seeds\/treeseed\.yaml \}\s*$/mu, /^processing: \{ mode: local, providerRef: codex-sub \}\s*$/mu];
if (requiredConfig.some((pattern) => !pattern.test(config))) fail('Platform configuration does not use the canonical managed local inventory.');

const templateIds = ['platform-local-managed-codex', 'platform-local-managed-ai', 'platform-market-codex', 'platform-external-codex'];
for (const templateId of templateIds) {
	const templateRoot = resolve(root, 'templates', templateId);
	const manifest = JSON.parse(readFileSync(resolve(templateRoot, 'template.config.json'), 'utf8'));
	if (manifest.templateVersion !== '3.0.0') fail(`${templateId} must use unified seed template version 3.0.0.`);
	for (const path of ['seeds/treeseed.yaml', 'treeseed.capacity-provider.yaml']) {
		if (!manifest.managedSurface?.coreManaged?.includes(path) || !manifest.managedSurface?.validatedOnly?.includes(path)) fail(`${templateId} does not manage and validate ${path}.`);
	}
	if (JSON.stringify(manifest.platform?.seeds) !== JSON.stringify(['seeds/treeseed.yaml'])) fail(`${templateId} must instantiate only the canonical seed.`);
	if (readFileSync(resolve(templateRoot, 'template/seeds/treeseed.yaml'), 'utf8') !== seed) fail(`${templateId} seed has drifted from the canonical bundle.`);
	if (readFileSync(resolve(templateRoot, 'template/treeseed.capacity-provider.yaml'), 'utf8') !== provider) fail(`${templateId} provider manifest has drifted from the unified battery.`);
	for (const legacy of ['template/seeds/agents.yaml', 'template/seeds/platform.yaml']) if (existsSync(resolve(templateRoot, legacy))) fail(`${templateId} retains ${legacy}.`);
}

const repositoryRoots = ['packages', 'templates', '.fixtures', 'starters', 'products', 'services'].flatMap((directory) => {
	const absolute = resolve(root, directory);
	if (!existsSync(absolute) || !statSync(absolute).isDirectory()) return [];
	return readdirSync(absolute, { withFileTypes: true }).filter((entry) => entry.isDirectory() && existsSync(resolve(absolute, entry.name, '.git'))).map((entry) => resolve(absolute, entry.name));
});
const marketRoots = repositoryRoots.filter((path) => ['market', 'market-api'].includes(basename(path)));
if (marketRoots.length > 2) fail(`Platform contains duplicate Market worksets: ${marketRoots.join(', ')}`);

for (const path of ['packages/market-guarantee-catalog/guarantees/agent/system/guide-golden.guarantee.yaml', 'packages/market-guarantee-catalog/guarantees/agent/system/source-golden.guarantee.yaml', 'scripts/guarantees/verify-agent-capability.ts']) requireFile(path);
const agentGuaranteeDefinitions = readdirSync(resolve(root, 'packages/market-guarantee-catalog/guarantees'), { recursive: true }).filter((path) => typeof path === 'string' && path.endsWith('.guarantee.yaml')).length;

console.log(JSON.stringify({ ok: true, inventoryAuthority: 'portable-seed-bundle', projects: 15, repositories: 31, owners: 2, providerModel: 'unified-battery-v3', lanes: ['communication', 'platform', 'workday'], gitlinks: 0, marketCheckouts: marketRoots.length, agentGuaranteeDefinitions, hostedDeployment: false }));
