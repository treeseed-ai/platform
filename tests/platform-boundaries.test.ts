import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { parse } from 'yaml';

const root = resolve(import.meta.dirname, '..');

describe('platform workspace boundaries', () => {
	it('contains no Market checkout or provisionable Market project', () => {
		const modules = readFileSync(resolve(root, '.gitmodules'), 'utf8');
		expect(modules).not.toMatch(/treeseed-ai\/(market|market-api)(?:\.git)?/u);
		const seed = parse(readFileSync(resolve(root, 'seeds/treeseed.yaml'), 'utf8')) as { resources: { projects: Array<{ slug: string }> } };
		expect(seed.resources.projects.map((project) => project.slug)).not.toContain('market');
		expect(seed.resources.projects.map((project) => project.slug)).not.toContain('market-api');
	});
});
