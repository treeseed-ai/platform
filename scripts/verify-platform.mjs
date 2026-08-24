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

for (const path of ['seeds/treeseed.yaml', 'treeseed.capacity-provider.yaml', 'deployment/host-configs/workstation-canary.json', 'docs/managed-host-canary-cutover.md']) requireFile(path);
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
if (new Set(projects).size !== 16) fail(`Canonical seed must contain 16 unique primary projects; found ${new Set(projects).size}.`);
for (const project of ['project:treeseed/market', 'project:treeseed/market-api']) if (!projects.includes(project)) fail(`Canonical seed is missing ${project}.`);
if (!projects.includes('project:treeseed/deployment')) fail('Canonical seed is missing the shared Deployment project.');
const repositories = [...seed.matchAll(/key: ['"]?(repository:treeseed\/[a-z0-9-]+)/gu)].map((match) => match[1]);
if (new Set(repositories).size !== 17) fail(`Canonical seed must contain 17 unique source repository bindings; found ${new Set(repositories).size}.`);
if (!/repository:treeseed\/deployment[^\n]+checkoutPath: packages\/deployment[^\n]+repositoryPolicy:/u.test(seed)) fail('Deployment must be a first-party checkout without a gitlink.');
if (/repository:treeseed\/deployment[^\n]+submodulePath:/u.test(seed)) fail('Deployment must not be declared as a submodule.');
if (/role: content(?:[,}\s]|$)/u.test(seed)) fail('TreeDX content repositories must not be encoded as Git provider repositories.');
if (!/digest: sha256:[a-f0-9]{64}/u.test(seed)) fail('Canonical seed is not digest-bound.');

const provider = read('treeseed.capacity-provider.yaml');
for (const required of ['schemaVersion: 3', 'purpose: communication', 'purpose: platform', 'purpose: workday', 'reclaimPolicy: admission', 'isolation: process']) {
	if (!provider.includes(required)) fail(`Unified provider manifest is missing ${required}.`);
}
for (const forbidden of ['providerClass:', 'registrationKeyRef:', 'membershipCredentialRef:']) if (provider.includes(forbidden)) fail(`Unified provider manifest retains ${forbidden}.`);

const host = JSON.parse(read('deployment/host-configs/workstation-canary.json'));
if (host.schemaVersion !== 'treeseed.host/v1' || host.runtime?.management !== 'managed') fail('Canary host fixture must use the managed host v1 contract.');
if (host.updates?.defaultTrack !== 'stable' || host.updates?.stable?.maintenanceWindow?.weekday !== 'sunday' || host.updates?.stable?.maintenanceWindow?.localTime !== '03:00') fail('Canary host fixture must retain the weekly stable activation policy.');
for (const componentId of ['api', 'agent', 'treedx', 'lab']) if (!host.components?.[componentId]?.enabled || host.components[componentId].track !== 'development') fail(`Canary host fixture must select the development ${componentId} overlay.`);
const aliases = [host.network?.manager?.aliases ?? [], ...Object.values(host.components ?? {}).flatMap((component) => Object.values(component.aliases ?? {}))].flat();
if (aliases.length !== new Set(aliases).size || aliases.some((alias) => !/^[a-z0-9.-]+\.localhost$/u.test(alias))) fail('Canary aliases must be unique and remain in the .localhost namespace.');
const overrideKeys = Object.values(host.components ?? {}).flatMap((component) => Object.keys(component.aliases ?? {}));
if (overrideKeys.some((key) => !/^[a-z][a-z0-9.-]+\.[a-z][a-z0-9.-]+\.[a-z][a-z0-9.-]+$/u.test(key))) fail('Canary alias overrides must use full component.service.endpoint identities.');
if (!host.secrets?.['agent-codex-auth'] || JSON.stringify(host).includes('auth.json')) fail('Canary Codex custody must use the named manager secret rather than an embedded login cache.');
if (host.generation !== 6) fail('Canary host fixture must retain the reviewed generation 6 TreeDX broker configuration.');
const brokerSecret = 'treedx-credential-broker-assertion';
if (host.components?.api?.configuration?.secretEnvironment?.TREESEED_TREEDX_CREDENTIAL_BROKER_ASSERTION !== brokerSecret
	|| host.components?.treedx?.configuration?.secretEnvironment?.TREEDX_REMOTE_CREDENTIAL_BROKER_ASSERTION !== brokerSecret
	|| !host.secrets?.[brokerSecret]) fail('API and TreeDX must share one manager-custodied credential-broker assertion.');
if (host.components?.treedx?.configuration?.environment?.TREEDX_REMOTE_CREDENTIAL_BROKER_SERVICE_ID !== 'node_local'
	|| host.components?.treedx?.configuration?.environment?.TREEDX_GIT_ALLOWED_HOSTS !== 'github.com') fail('TreeDX must declare its broker node identity and bounded Git host allowlist.');

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

console.log(JSON.stringify({ ok: true, inventoryAuthority: 'portable-seed-bundle', projects: 16, sourceRepositories: 17, treeDxVirtualKnowledgeRepositories: 16, owners: 2, providerModel: 'unified-battery-v3', lanes: ['communication', 'platform', 'workday'], gitlinks: 0, marketCheckouts: marketRoots.length, agentGuaranteeDefinitions, hostedDeployment: false }));
