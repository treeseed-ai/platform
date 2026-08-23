import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const skillRoot = resolve(root, 'skills/treeseed');
const skill = readFileSync(resolve(skillRoot, 'SKILL.md'), 'utf8');
const receipt = JSON.parse(readFileSync(resolve(skillRoot, 'catalog-receipt.json'), 'utf8'));
const composition = JSON.parse(readFileSync(resolve(root, 'docs/evidence/treedx-control-plane-proxy-composition.json'), 'utf8'));
const fail = (message) => { throw new Error(message); };
const categories = ['knowledge', 'governance', 'projects', 'execution', 'mcp'];

if (!/^name: treeseed$/mu.test(skill)) fail('TreeSeed Skill name is not canonical.');
if (!/^  protocol: "2026-07-28"$/mu.test(skill)) fail('TreeSeed Skill does not declare the accepted MCP protocol.');
if (receipt.schemaVersion !== 'treeseed.skill-catalog-receipt/v1' || receipt.protocolVersion !== '2026-07-28') fail('TreeSeed Skill receipt version is unsupported.');
if (JSON.stringify(receipt.categories) !== JSON.stringify(categories)) fail('TreeSeed Skill categories drifted from the accepted set.');
if (!/^sha256:[0-9a-f]{64}$/u.test(receipt.sdk.operationCatalogDigest) || !/^sha256:[0-9a-f]{64}$/u.test(receipt.sdk.mcpInputDigest) || !/^sha256:[0-9a-f]{64}$/u.test(receipt.api.mcpCatalogDigest)) fail('TreeSeed Skill receipt contains an invalid catalog digest.');
if (composition.schemaVersion !== 'treeseed.platform-composition-evidence/v1' || composition.status !== 'staging_accepted') fail('TreeSeed proxy composition evidence is not accepted.');
const sdk = composition.members?.sdk;
const api = composition.members?.api;
if (receipt.sdk.version !== sdk?.version || receipt.sdk.stagingCommit !== sdk?.sourceCommit
	|| receipt.sdk.operationCatalogDigest !== `sha256:${sdk?.operationCatalogSha256}`
	|| receipt.sdk.mcpInputDigest !== `sha256:${sdk?.mcpInputSha256}`) fail('TreeSeed Skill SDK receipt drifted from the accepted composition.');
if (receipt.api.stagingCommit !== api?.sourceCommit || receipt.api.openApiDigest !== `sha256:${api?.openApiSha256}`
	|| receipt.api.mcpCatalogDigest !== `sha256:${api?.mcpCatalogSha256}`) fail('TreeSeed Skill API receipt drifted from the accepted composition.');
for (const field of ['tools', 'resources', 'resourceTemplates', 'prompts']) {
	if (receipt.mcpSurface[field] !== api?.mcp?.[field]) fail(`TreeSeed Skill MCP ${field} receipt drifted from the accepted composition.`);
}

for (const category of categories) {
	const reference = `references/${category}.md`;
	if (!skill.includes(`](${reference})`) || !existsSync(resolve(skillRoot, reference))) fail(`TreeSeed Skill is missing its ${category} reference.`);
}

for (const forbidden of ['/v1/', 'tools/call', 'MarketClient', '--market']) if (skill.includes(forbidden)) fail(`TreeSeed Skill hard-codes forbidden transport detail: ${forbidden}`);
if (!/Discover its current MCP tools, resources, templates, prompts, schemas, and capability annotations/u.test(skill)) fail('TreeSeed Skill does not require runtime capability discovery.');

console.log(JSON.stringify({ ok: true, skill: 'treeseed', protocolVersion: receipt.protocolVersion, categories, sdkVersion: receipt.sdk.version, apiStaging: receipt.api.stagingCommit, mcpCatalogDigest: receipt.api.mcpCatalogDigest }));
