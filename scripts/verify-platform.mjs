import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const fail = (message) => { throw new Error(message); };
if (existsSync(resolve(root, '.gitmodules'))) fail('Platform must not encode team inventory as gitlinks.');
if (existsSync(resolve(root, 'treeseed.portfolio.json'))) fail('Platform must read live team inventory instead of a repository portfolio file.');
const config = readFileSync(resolve(root, 'treeseed.site.yaml'), 'utf8');
const requiredConfig = [/^authority: \{ kind: customer-platform \}\s*$/mu, /^market: \{ profile: treeseed \}\s*$/mu, /^controlPlane: \{ mode: managed \}\s*$/mu, /^processing: \{ mode: local, providerRef: codex-sub \}\s*$/mu, /^\s*api: \{ enabled: true, provider: local \}\s*$/mu, /^\s*treedx: \{ enabled: true, provider: local \}\s*$/mu];
if (requiredConfig.some((pattern) => !pattern.test(config))) fail('Platform configuration does not match the canonical local-managed Codex template.');
const requiredVerificationFiles = ["guarantees/agent/system/guide-golden.guarantee.yaml","guarantees/agent/system/source-golden.guarantee.yaml","guarantees/capacity/research/verify-autonomous-cited-research-starter.guarantee.yaml","guarantees/verifiers/service-workflows.verifiers.yaml","scripts/guarantees/verify-agent-capability.ts","scripts/guarantees/agent-catalog/cli-runtime.ts","scripts/guarantees/agent-catalog/json-evidence.ts","scripts/guarantees/agent-catalog/proof-executor.ts","scripts/guarantees/agent-catalog/proof-input.ts"];
for (const path of requiredVerificationFiles) if (!existsSync(resolve(root, path))) fail(`Platform is missing agent proof catalog input: ${path}`);
if (/^\s*market-?api:/imu.test(config)) fail('Platform configuration declares a forbidden Market API service.');
const seed = readFileSync(resolve(root, 'seeds/treeseed.yaml'), 'utf8');
if (/^\s+slug: market(?:-api)?\s*$/mu.test(seed)) fail('Platform seed declares a Market project.');
if (/information-hub/iu.test(seed)) fail('Platform seed contains a retired repository identity.');
console.log(JSON.stringify({ ok: true, inventoryAuthority: 'api', gitlinks: 0, marketCheckouts: 0, agentGuarantees: 15, authority: 'customer-platform', template: 'platform-local-managed-codex', hostedDeployment: false }));
