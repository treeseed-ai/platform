import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { basename, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const fail = (message) => { throw new Error(message); };
const read = (path) => readFileSync(resolve(root, path), 'utf8');
const requireFile = (path) => { if (!existsSync(resolve(root, path))) fail(`Platform is missing ${path}.`); };

const rootPackage = JSON.parse(read('package.json'));
if ('workspaces' in rootPackage) fail('Platform must not treat independent project repositories as npm workspaces.');
if (existsSync(resolve(root, 'package-lock.json'))) fail('Platform must not create a root package lock; each project repository owns its lock independently.');
execFileSync(process.execPath, [resolve(root, 'scripts/verify-treeseed-skill.mjs')], { cwd: root, stdio: 'inherit' });
execFileSync(process.execPath, [resolve(root, 'scripts/test-composition-guarantee-plan.mjs')], { cwd: root, stdio: 'inherit' });
execFileSync(process.execPath, [resolve(root, 'scripts/test-composition-guarantee-run.mjs')], { cwd: root, stdio: 'inherit' });
if (existsSync(resolve(root, '.gitmodules'))) fail('Platform must not encode team inventory as gitlinks.');
if (existsSync(resolve(root, 'treeseed.portfolio.json'))) fail('Platform must read live team inventory from its portable seed bundle.');
const index = execFileSync('git', ['ls-files', '--stage'], { cwd: root, encoding: 'utf8' });
const gitlinks = index.split('\n').filter((line) => line.startsWith('160000 '));
if (gitlinks.length) fail(`Platform contains forbidden gitlinks: ${gitlinks.join(', ')}`);

for (const path of ['seeds/treeseed.yaml', 'treeseed.capacity-provider.yaml', 'deployment/host-configs/development-workstation.json', 'deployment/host-configs/capacity-provider-development.json', 'deployment/integration-releases/stable.json', 'deployment/integration-releases/development.json', 'deployment/treeai-component-inputs.json', 'docs/multi-host-deployment.md']) requireFile(path);
for (const path of ['seeds/agents.yaml', 'seeds/platform.yaml', 'treeseed.agents-capacity-provider.yaml', 'treeseed.platform-capacity-provider.yaml']) {
	if (existsSync(resolve(root, path))) fail(`Platform retains obsolete split-provider input ${path}.`);
}

const seed = read('seeds/treeseed.yaml');
for (const required of ['schemaVersion: treeseed.seed-bundle/v3', 'adrian.webb@knowledge.coop', 'service-principal:treeseed/automation', 'interactiveLogin: false', 'capacity-provider:treeseed/local', 'requiredLanePurposes: [communication, platform, workday]']) {
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
if (new Set(repositories).size !== 33) fail(`Canonical seed must contain 16 primary repositories, 16 libraries, and one fixture repository; found ${new Set(repositories).size}.`);
if (!/repository:treeseed\/deployment[^\n]+checkoutPath: packages\/deployment[^\n]+repositoryPolicy:/u.test(seed)) fail('Deployment must be a first-party checkout without a gitlink.');
if (/repository:treeseed\/deployment[^\n]+submodulePath:/u.test(seed)) fail('Deployment must not be declared as a submodule.');
if (/role: content(?:[,}\s]|$)/u.test(seed)) fail('Legacy content repository roles must not remain in the v3 seed.');
if ((seed.match(/role: library/gmu) ?? []).length !== 16 || (seed.match(/libraryRepository:/gmu) ?? []).length !== 16) fail('Every seeded project must declare exactly one repository-backed library.');
if (!/digest: sha256:[a-f0-9]{64}/u.test(seed)) fail('Canonical seed is not digest-bound.');

const provider = read('treeseed.capacity-provider.yaml');
for (const required of ['schemaVersion: 3', 'purpose: communication', 'purpose: platform', 'purpose: workday', 'reclaimPolicy: admission', 'isolation: process']) {
	if (!provider.includes(required)) fail(`Unified provider manifest is missing ${required}.`);
}
for (const forbidden of ['providerClass:', 'registrationKeyRef:', 'membershipCredentialRef:']) if (provider.includes(forbidden)) fail(`Unified provider manifest retains ${forbidden}.`);

const host = JSON.parse(read('deployment/host-configs/development-workstation.json'));
if (host.schemaVersion !== 'treeseed.host/v1' || host.configurationId !== 'development-workstation' || host.host?.role !== 'integrated' || host.runtime?.management !== 'managed' || host.runtime?.environment !== 'development' || !host.runtime?.dataRoot?.endsWith('/platform/.treeseed/data')) fail('Development workstation must use the current integrated managed-host contract and workspace-visible data root.');
if (host.updates?.defaultTrack !== 'development' || host.updates?.stable?.maintenanceWindow?.weekday !== 'sunday' || host.updates?.stable?.maintenanceWindow?.localTime !== '03:00') fail('Development workstation must poll development while preserving the stable weekly activation policy.');
for (const componentId of ['api', 'admin', 'agent', 'treedx', 'lab']) if (!host.components?.[componentId]?.enabled || host.components[componentId].track !== 'development') fail(`Development workstation must select the development ${componentId} release.`);
for (const componentId of ['ai-inference', 'ai-training', 'ai-lab']) if (host.components?.[componentId]?.enabled !== false) fail(`Default workstation must leave ${componentId} disabled.`);
const aliases = [host.network?.manager?.aliases ?? [], ...Object.values(host.components ?? {}).flatMap((component) => Object.values(component.aliases ?? {}))].flat();
if (aliases.length !== new Set(aliases).size || aliases.some((alias) => !/^[a-z0-9.-]+\.localhost$/u.test(alias))) fail('Local aliases must be unique and remain in the .localhost namespace.');
const overrideKeys = Object.values(host.components ?? {}).flatMap((component) => Object.keys(component.aliases ?? {}));
if (overrideKeys.some((key) => !/^[a-z][a-z0-9.-]+\.[a-z][a-z0-9.-]+\.[a-z][a-z0-9.-]+$/u.test(key))) fail('Alias overrides must use full component.service.endpoint identities.');
if (!host.secrets?.['agent-codex-auth'] || JSON.stringify(host).includes('auth.json')) fail('Codex custody must use the named manager secret rather than an embedded login cache.');
if (host.generation !== 11) fail('Development workstation must use configuration generation 11.');
if (host.components?.api?.configuration?.environment?.TREESEED_API_BASE_URL !== 'https://api.treeseed.localhost') fail('The API and managed providers must use the canonical API audience.');
if (host.components?.api?.configuration?.environment?.TREESEED_TREEDX_URL !== 'http://treedx:4000') fail('The integrated API must use the manager-owned TreeDX service over the private platform network.');
if (host.components?.api?.configuration?.environment?.TREESEED_API_BOOTSTRAP_ADMIN_ALLOWLIST !== 'adrian.webb@knowledge.coop') fail('A fresh workstation must assign its configured initial account through the API bootstrap-admin allowlist.');
if (host.components?.api?.configuration?.environment?.TREESEED_SITE_URL !== 'https://admin.treeseed.localhost'
	|| host.components?.api?.configuration?.environment?.TREESEED_API_AUTH_APPROVAL_BASE_URL !== 'https://admin.treeseed.localhost'
	|| host.components?.api?.configuration?.environment?.TREESEED_MAILPIT_SMTP_HOST !== 'mailpit'
	|| host.components?.api?.configuration?.environment?.TREESEED_MAILPIT_SMTP_PORT !== '1025') fail('A fresh workstation must route account confirmation through the managed Lab Mailpit service.');
const brokerSecret = 'treedx-credential-broker-assertion';
if (host.components?.api?.configuration?.secretEnvironment?.TREESEED_TREEDX_CREDENTIAL_BROKER_ASSERTION !== brokerSecret
	|| host.components?.treedx?.configuration?.secretEnvironment?.TREEDX_REMOTE_CREDENTIAL_BROKER_ASSERTION !== brokerSecret
	|| !host.secrets?.[brokerSecret]) fail('API and TreeDX must share one manager-custodied credential-broker assertion.');
if (host.components?.api?.configuration?.secretEnvironment?.TREESEED_GITHUB_TOKEN !== 'github-repository-token'
	|| host.secrets?.['github-repository-token']?.reference !== '/etc/treeseed/credentials/github-repository-token') fail('Library reconciliation requires a manager-custodied GitHub repository token outside the development data root.');
if (host.components?.treedx?.configuration?.environment?.TREEDX_REMOTE_CREDENTIAL_BROKER_SERVICE_ID !== 'node_local'
	|| host.components?.treedx?.configuration?.environment?.TREEDX_GIT_EXTERNAL_TRANSPORT_ENABLED !== 'true'
	|| host.components?.treedx?.configuration?.environment?.TREEDX_GIT_ALLOWED_HOSTS !== 'github.com'
	|| host.components?.treedx?.configuration?.environment?.TREEDX_BOOTSTRAP_TRUST_ACTOR_ID !== 'treeseed-api'
	|| host.components?.treedx?.configuration?.environment?.TREEDX_BOOTSTRAP_TRUST_TENANT_ID !== 'treeseed-control-plane') fail('TreeDX must declare its broker identity, bounded Git hosts, and API delegation trust identity.');
const treeDxIssuer = 'https://api.treeseed.localhost/treedx';
const treeDxAudience = 'treedx';
if (host.components?.api?.configuration?.environment?.TREESEED_TREEDX_JWT_ISSUER !== treeDxIssuer
	|| host.components?.api?.configuration?.environment?.TREESEED_TREEDX_JWT_AUDIENCE !== treeDxAudience
	|| host.components?.treedx?.configuration?.environment?.TREEDX_JWT_ISSUER !== treeDxIssuer
	|| host.components?.treedx?.configuration?.environment?.TREEDX_JWT_AUDIENCE !== treeDxAudience
	|| host.components?.treedx?.configuration?.environment?.TREEDX_JWT_ALLOWED_ALGS !== 'RS256') fail('API and TreeDX must share the generation 7 RS256 issuer, audience, and private JWKS discovery contract.');
if (host.components?.agent?.connections?.['control-plane']?.kind !== 'local' || host.components?.treedx?.connections?.['control-plane']?.kind !== 'local') fail('Integrated Agent and TreeDX components require explicit local control-plane connections.');
if (host.components?.admin?.connections?.api?.kind !== 'local') fail('Managed Admin requires an explicit local or remote API connection.');
if (Object.keys(host.components?.admin?.aliases ?? {}).length) fail('Managed Admin must use its component-owned canonical alias rather than a forbidden host override.');
if (JSON.stringify(aliases.sort()) !== JSON.stringify(['api.treeseed.localhost', 'lab.treeseed.localhost', 'mail.treeseed.localhost', 'manager.treeseed.localhost', 'treedx.treeseed.localhost'])) fail('Development workstation must use only the permitted local alias overrides.');
const providerHost = JSON.parse(read('deployment/host-configs/capacity-provider-development.json'));
if (providerHost.host?.role !== 'capacity-provider' || Object.keys(providerHost.components ?? {}).join(',') !== 'agent' || providerHost.components.agent?.connections?.['control-plane']?.kind !== 'remote') fail('Capacity-provider fixture must select only Agent with an explicit remote control plane.');
if ((providerHost.network?.manager?.aliases ?? []).length || Object.values(providerHost.components.agent?.aliases ?? {}).length) fail('Private capacity-provider fixture must remain edge-free.');

const treeAiInputs = JSON.parse(read('deployment/treeai-component-inputs.json'));
if (treeAiInputs.schemaVersion !== 'treeseed.platform-component-inputs/v1' || treeAiInputs.release !== '0.11.0-rc4' || treeAiInputs.sourceCommit !== 'd5ea430d4f297a44f002f12e6b6daa53b21ad66a') fail('TreeAI component inputs must identify the exact independent RC source.');
if (treeAiInputs.contracts?.genericSdk?.sha256 !== '90d695d499088f2788da36863128efe57079915d3999cc876888ceb091cb95f2') fail('TreeAI generic SDK must bind the published rc4 artifact.');
if (treeAiInputs.contracts?.operationInventorySha256 !== 'dc60eb514e11a4b867b3353830d886205df6254c7c4ecfab9a06b1b4dcb4e1fc') fail('TreeAI operation inventory digest is not the adopted release.');
if (treeAiInputs.contracts?.treeSeedSdk?.version !== '0.13.0-rc.51' || treeAiInputs.contracts.treeSeedSdk.sha256 !== 'b3fc58a42bac9f3c635b933423066d580e87ddb79ea97c8aa9181f7000765e89') fail('TreeSeed SDK must bind the published TreeAI adoption RC.');
if (treeAiInputs.contracts?.api?.version !== '0.8.0-rc.49' || treeAiInputs.contracts.api.sha256 !== '1fa497f2c0cf2f0e05d148f6fd903765f6b8d2558dbfd6f4514aa6cf13423037') fail('TreeSeed API must bind the SDK-driven TreeAI proxy RC.');
if (treeAiInputs.contracts?.cli?.version !== '0.13.0-rc.29' || treeAiInputs.contracts.cli.sha256 !== '20e041d25d827807b7609354f5a60471fd1f903b23705135e525bd9fbaf27325') fail('TreeSeed CLI must bind the SDK-driven TreeAI command RC.');
if (JSON.stringify(treeAiInputs.components?.map(({ componentId }) => componentId)) !== JSON.stringify(['ai-inference', 'ai-training', 'ai-lab'])) fail('TreeAI component inputs must preserve inference, training, and lab ownership order.');
for (const component of treeAiInputs.components) {
	if (!/^https:\/\/github\.com\/treeseed-ai\/ai\/releases\/download\//u.test(component.manifest?.url)
		|| !/^[a-f0-9]{64}$/u.test(component.manifest?.sha256 ?? '') || !/^[a-f0-9]{64}$/u.test(component.compose?.sha256 ?? '')) fail(`TreeAI ${component.componentId} is not independently digest locked.`);
}
for (const profileId of ['ai-inference', 'ai-training', 'ai-factory', 'ai-connected']) {
	const profile = JSON.parse(read(`deployment/profiles/${profileId}.json`));
	if (profile.schemaVersion !== 'treeseed.platform-profile/v1' || profile.id !== profileId || profile.default !== false) fail(`TreeAI profile ${profileId} must remain explicit and opt-in.`);
}
const inferenceProfile = JSON.parse(read('deployment/profiles/ai-inference.json'));
const trainingProfile = JSON.parse(read('deployment/profiles/ai-training.json'));
const factoryProfile = JSON.parse(read('deployment/profiles/ai-factory.json'));
if (inferenceProfile.components?.['ai-inference']?.aliases?.['ai-inference.inference-api.control'] !== 'inference.ai.treeseed.localhost') fail('Inference alias must use the SDK endpoint identity.');
if (trainingProfile.components?.['ai-training']?.aliases?.['ai-training.training-api.control'] !== 'training.ai.treeseed.localhost') fail('Training alias must use the SDK endpoint identity.');
if (factoryProfile.components?.['ai-lab']?.aliases?.['ai-lab.open-webui.web'] !== 'chat.ai.treeseed.localhost' || factoryProfile.components?.['ai-lab']?.aliases?.['ai-lab.hermes-dashboard.web'] !== 'hermes.ai.treeseed.localhost') fail('Lab aliases must use SDK endpoint identities.');
const labConnections = factoryProfile.components?.['ai-lab']?.connections;
if (JSON.stringify(labConnections?.inference) !== JSON.stringify({ kind: 'local', componentId: 'ai-inference', serviceId: 'inference-api', endpointId: 'inference' }) || JSON.stringify(labConnections?.training) !== JSON.stringify({ kind: 'local', componentId: 'ai-training', serviceId: 'training-api', endpointId: 'control' })) fail('AI lab must declare its required local inference and training connections.');
const requiredInputCustody = {
	'ai-inference': {
		environment: { INFERENCE_DATABASE_URL: 'ai-inference-database-url', INFERENCE_POSTGRES_PASSWORD: 'ai-inference-postgres-password', AI_API_KEYS: 'ai-inference-api-keys' },
		secrets: { 'ai-inference-database-url': '/etc/treeseed/credentials/ai-inference-database-url', 'ai-inference-postgres-password': '/etc/treeseed/credentials/ai-inference-postgres-password', 'ai-inference-api-keys': '/etc/treeseed/credentials/ai-inference-api-keys' },
	},
	'ai-training': {
		environment: { TRAINING_DATABASE_URL: 'ai-training-database-url', TRAINING_POSTGRES_PASSWORD: 'ai-training-postgres-password', AI_API_KEYS: 'ai-training-api-keys' },
		secrets: { 'ai-training-database-url': '/etc/treeseed/credentials/ai-training-database-url', 'ai-training-postgres-password': '/etc/treeseed/credentials/ai-training-postgres-password', 'ai-training-api-keys': '/etc/treeseed/credentials/ai-training-api-keys', 'artifact-signing-key': '/etc/treeseed/credentials/ai-artifact-signing-key' },
	},
};
function verifyInputCustody(profile, componentId) {
	const expected = requiredInputCustody[componentId];
	if (JSON.stringify(profile.components?.[componentId]?.configuration?.secretEnvironment) !== JSON.stringify(expected.environment)) fail(`${profile.id} does not bind the complete ${componentId} secret environment.`);
	for (const [id, reference] of Object.entries(expected.secrets)) if (profile.secrets?.[id]?.provider !== 'file' || profile.secrets[id].reference !== reference) fail(`${profile.id} does not bind ${id} to its declared custody path.`);
}
verifyInputCustody(inferenceProfile, 'ai-inference');
verifyInputCustody(trainingProfile, 'ai-training');
verifyInputCustody(factoryProfile, 'ai-inference');
verifyInputCustody(factoryProfile, 'ai-training');
if (JSON.stringify(factoryProfile.components?.['ai-lab']?.configuration?.secretEnvironment) !== JSON.stringify({ AI_LAB_API_KEYS: 'ai-lab-api-keys' })) fail('AI factory does not bind the lab API credential environment.');
const labSecretPaths = {
	'ai-lab-api-keys': '/etc/treeseed/credentials/ai-lab-api-keys', 'training-source': '/etc/treeseed/credentials/ai-lab-training-source', 'factory-control-key': '/etc/treeseed/credentials/ai-lab-factory-control-key',
	'factory-inference-key': '/etc/treeseed/credentials/ai-lab-factory-inference-key', 'factory-training-key': '/etc/treeseed/credentials/ai-lab-factory-training-key', 'hermes-api-key': '/etc/treeseed/credentials/ai-lab-hermes-api-key',
	'hermes-password-hash': '/etc/treeseed/credentials/ai-lab-hermes-password-hash', 'hermes-session-secret': '/etc/treeseed/credentials/ai-lab-hermes-session-secret', 'training-ingest-key': '/etc/treeseed/credentials/ai-lab-training-ingest-key',
	'lab-library-action-key': '/etc/treeseed/credentials/ai-lab-lab-library-action-key',
};
for (const [id, reference] of Object.entries(labSecretPaths)) if (factoryProfile.secrets?.[id]?.provider !== 'file' || factoryProfile.secrets[id].reference !== reference) fail(`AI factory does not bind ${id} to the released lab custody path.`);
if (factoryProfile.components?.['ai-lab']?.configuration?.environment?.RUNTIME_GID !== undefined) fail('Platform must leave RUNTIME_GID under manager-derived custody.');
const connectedProfile = JSON.parse(read('deployment/profiles/ai-connected.json'));
const treeAiNodes = JSON.parse(connectedProfile.components?.api?.configuration?.environment?.TREESEED_TREEAI_NODES ?? '{}');
const treeAiEndpoints = treeAiNodes['local-ai']?.endpoints;
if (treeAiEndpoints?.lab !== 'http://controller:8081') fail('Connected AI must address the released lab controller service and port.');
if ('qualification' in (treeAiEndpoints ?? {})) fail('Connected AI must not advertise the retired TreeAI host manager as a qualification endpoint.');

const stableIntegration = JSON.parse(read('deployment/integration-releases/stable.json'));
const developmentIntegration = JSON.parse(read('deployment/integration-releases/development.json'));
if (stableIntegration.schemaVersion !== 'treeseed.integration-release/v1' || stableIntegration.track !== 'stable' || stableIntegration.components?.length !== 0) fail('Preproduction stable integration must remain an explicit empty base.');
if (developmentIntegration.schemaVersion !== 'treeseed.integration-release/v1' || developmentIntegration.track !== 'development') fail('Development integration lock must use the current SDK-owned contract.');
if (developmentIntegration.platform?.commit !== stableIntegration.platform?.commit || developmentIntegration.deployment?.commit !== stableIntegration.deployment?.commit) fail('Stable and development locks must identify the same reviewed Platform and Deployment sources.');
if (JSON.stringify(developmentIntegration.hostPayloads?.map(({ id }) => id).sort()) !== JSON.stringify(['admin', 'api', 'cli', 'core', 'playwright-core', 'reviewer', 'sdk', 'treedx', 'ui', 'yaml', 'zod'])) fail('Development integration must select the exact managed host payload and verifier set.');
if (JSON.stringify(developmentIntegration.components?.map(({ componentId }) => componentId).sort()) !== JSON.stringify(['admin', 'agent', 'ai-inference', 'ai-lab', 'ai-training', 'api', 'lab', 'treedx'])) fail('Development integration must select the exact Admin, API, Agent, TreeDX, Lab, and TreeAI component set.');
for (const integration of [stableIntegration, developmentIntegration]) for (const payload of integration.hostPayloads ?? []) if (!/^https:\/\//u.test(payload.artifact?.url) || !/^[a-f0-9]{64}$/u.test(payload.artifact?.sha256 ?? '')) fail(`Integration payload ${payload.id} lacks an immutable artifact identity.`);
for (const component of developmentIntegration.components ?? []) {
	if (!/^[a-f0-9]{64}$/u.test(component.manifest?.sha256 ?? '') || component.files?.some(({ artifact }) => !/^[a-f0-9]{64}$/u.test(artifact?.sha256 ?? ''))) fail(`Component ${component.componentId} is not fully digest locked.`);
}

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

console.log(JSON.stringify({ ok: true, inventoryAuthority: 'portable-seed-bundle', projects: 16, primaryRepositories: 16, projectLibraries: 16, fixtureRepositories: 1, owners: 2, providerModel: 'unified-battery-v3', lanes: ['communication', 'platform', 'workday'], gitlinks: 0, marketCheckouts: marketRoots.length, agentGuaranteeDefinitions, hostedDeployment: false }));
