import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const fail = (message) => { throw new Error(message); };
const modules = readFileSync(resolve(root, '.gitmodules'), 'utf8');
if (/treeseed-ai\/(market|market-api)(?:\.git)?/u.test(modules)) fail('Platform contains a Market checkout.');
const paths = [...modules.matchAll(/^\s*path = (.+)$/gmu)].map((match) => match[1]);
if (paths.length !== 13) fail(`Expected 13 bundled project/fixture repositories, found ${paths.length}.`);
const status = execFileSync('git', ['submodule', 'status', '--recursive'], { cwd: root, encoding: 'utf8' });
if (status.split('\n').filter(Boolean).some((line) => /^[-+U]/u.test(line))) fail('A bundled repository is missing or does not match its pinned commit.');
for (const path of paths) {
	const packagePath = resolve(root, path, 'package.json');
	if (!existsSync(packagePath)) continue;
	const metadata = JSON.parse(readFileSync(packagePath, 'utf8'));
	const expected = path === 'packages/api' ? 'AGPL-3.0-only' : 'Apache-2.0';
	if (metadata.license !== expected) fail(`${path} license is ${metadata.license}, expected ${expected}.`);
}
const seed = readFileSync(resolve(root, 'seeds/treeseed.yaml'), 'utf8');
if (/^\s+slug: market(?:-api)?\s*$/mu.test(seed)) fail('Platform seed declares a Market project.');
if (/information-hub|knowledge-coop/iu.test(seed)) fail('Platform seed contains a retired repository identity.');
console.log(JSON.stringify({ ok: true, repositories: paths.length, marketCheckouts: 0 }));
