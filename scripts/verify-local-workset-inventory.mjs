import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const baseUrl = process.env.TREESEED_API_BASE_URL?.trim() || 'http://127.0.0.1:3000';
const token = process.env.TREESEED_LOCAL_OPERATOR_TOKEN?.trim();
if (!/^http:\/\/(?:127\.0\.0\.1|localhost)(?::\d+)?$/u.test(baseUrl)) throw new Error('Local inventory verification requires a loopback API URL.');
if (!token) throw new Error('TREESEED_LOCAL_OPERATOR_TOKEN is required; never pass it as a command argument or print it.');

const request = async (path) => {
	const response = await fetch(`${baseUrl}${path}`, { headers: { authorization: `Bearer ${token}` } });
	const body = await response.json();
	if (!response.ok || body.ok === false) throw new Error(`Local inventory request failed at ${path} with status ${response.status}.`);
	return body.payload;
};
const text = (value) => typeof value === 'string' && value.trim() ? value.trim() : null;
const record = (value) => value && typeof value === 'object' && !Array.isArray(value) ? value : {};
const repositoryIdentity = (value) => String(value).replace(/^https:\/\/github\.com\//u, '').replace(/\.git$/u, '');
const expectedRepositories = [
	'treeseed-ai/admin', 'treeseed-ai/agent', 'treeseed-ai/ai', 'treeseed-ai/api', 'treeseed-ai/cli', 'treeseed-ai/core',
	'treeseed-ai/fixtures', 'treeseed-ai/reviewer', 'treeseed-ai/sdk', 'treeseed-ai/template-engineering',
	'treeseed-ai/template-research', 'treeseed-ai/treedx', 'treeseed-ai/ui',
].sort();
const profile = await request('/v1/teams/by-name/treeseed/profile');
const teamId = text(record(profile.team).id);
if (!teamId) throw new Error('Local TreeSeed team profile has no id.');
const payload = await request(`/v1/teams/${encodeURIComponent(teamId)}/project-inventory`);
const inventory = [];
const excludedExternalProjects = new Set();
for (const project of Array.isArray(payload.projects) ? payload.projects : []) {
	const metadata = record(project.metadata);
	const configured = record(metadata.repository);
	for (const repository of Array.isArray(project.repositories) ? project.repositories : []) {
		const role = text(repository.role);
		const owner = text(repository.owner);
		const name = text(repository.name);
		if (!['primary', 'fixture'].includes(role) || !owner || !name) continue;
		if (['market', 'market-api'].includes(name)) {
			excludedExternalProjects.add(`${owner}/${name}`);
			continue;
		}
		if (name === 'platform' || name.endsWith('-content')) continue;
		const policy = record(configured.repositoryPolicy);
		const path = text(repository.submodulePath) || text(configured.checkoutPath);
		if (!path || name === 'platform') continue;
		const branch = role === 'primary'
			? text(repository.currentBranch) || text(policy.stagingBranch) || text(repository.defaultBranch)
			: text(repository.currentBranch) || text(repository.defaultBranch);
		if (!branch) throw new Error(`API inventory entry ${owner}/${name} is missing its observable branch.`);
		inventory.push({ repository: `${owner}/${name}`, role, path, branch });
	}
}
inventory.sort((left, right) => JSON.stringify(left).localeCompare(JSON.stringify(right)));
const repositoryIdentities = inventory.map((entry) => repositoryIdentity(entry.repository)).sort();
if (inventory.length !== 13 || JSON.stringify(repositoryIdentities) !== JSON.stringify(expectedRepositories)) {
	throw new Error(`Local API inventory is not the canonical 13-repository Platform workset: ${repositoryIdentities.join(', ')}.`);
}
const receipt = JSON.parse(readFileSync(resolve(root, '.treeseed/worksets/platform/latest.json'), 'utf8'));
if (receipt.status !== 'verified') throw new Error('Platform workset receipt is not verified.');
const observed = receipt.completed.map((action) => ({ repository: repositoryIdentity(action.repository), role: action.role, path: action.path, branch: action.sourceBranch }))
	.sort((left, right) => JSON.stringify(left).localeCompare(JSON.stringify(right)));
const forbiddenObserved = observed.filter((entry) => ['treeseed-ai/market', 'treeseed-ai/market-api'].includes(entry.repository));
if (forbiddenObserved.length > 0) throw new Error(`Platform workset contains forbidden custody: ${forbiddenObserved.map((entry) => entry.repository).join(', ')}.`);
if (JSON.stringify(inventory) !== JSON.stringify(observed)) throw new Error('Local API inventory does not equal the materialized workset receipt.');
const digest = createHash('sha256').update(JSON.stringify(inventory)).digest('hex');
console.log(JSON.stringify({
	ok: true,
	teamId,
	count: inventory.length,
	inventoryDigest: `sha256:${digest}`,
	receiptStatus: receipt.status,
	excludedExternalProjects: [...excludedExternalProjects].sort(),
}));
