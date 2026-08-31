import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parse, stringify } from 'yaml';
import {
	CORE_CAPABILITY_DEFINITIONS,
	CORE_CAPABILITY_ONTOLOGY_GENERATION,
	capabilityContractDigest,
	capabilityOfferDigest,
	capabilityOfferSchema,
} from '@treeseed/sdk/capacity-provider';

const root = resolve(import.meta.dirname, '..');
const checkOnly = process.argv.includes('--check');
const providerPath = resolve(root, 'treeseed.capacity-provider.yaml');
const hostPaths = [
	resolve(root, 'deployment/host-configs/development-workstation.json'),
	resolve(root, 'deployment/host-configs/capacity-provider-development.json'),
];
const templateIds = ['platform-local-managed-codex', 'platform-local-managed-ai', 'platform-market-codex', 'platform-external-codex'];
const definitions = new Map(CORE_CAPABILITY_DEFINITIONS.map((definition) => [definition.id, definition]));
const reference = (id) => {
	const definition = definitions.get(id);
	if (!definition) throw new Error(`Provider offer references unknown core capability ${id}.`);
	return { id: definition.id, version: definition.version, digest: definition.digest };
};
const emit = (path, content) => {
	if (checkOnly) {
		if (readFileSync(path, 'utf8') !== content) throw new Error(`${path.slice(root.length + 1)} is not synchronized with the active SDK capability ontology.`);
		return;
	}
	writeFileSync(path, content);
};

function synchronizeOffer(offer) {
	const capabilities = offer.capabilities.map(({ id }) => reference(id));
	const conformance = offer.conformance.map((entry) => {
		const capability = reference(entry.capability.id);
		return { ...entry, capability, evidenceDigest: capabilityContractDigest({ capability, tier: entry.tier, suite: entry.suite }) };
	});
	const { offerDigest: _oldDigest, ...rest } = offer;
	const material = { ...rest, capabilities, conformance };
	return capabilityOfferSchema.parse({ ...material, offerDigest: capabilityOfferDigest(material) });
}

const provider = parse(readFileSync(providerPath, 'utf8'));
provider.schemaVersion = 5;
provider.configuration.generation = 'local-battery-v5';
provider.ontology = {
	generation: CORE_CAPABILITY_ONTOLOGY_GENERATION,
	digest: capabilityContractDigest({ generation: CORE_CAPABILITY_ONTOLOGY_GENERATION, definitions: CORE_CAPABILITY_DEFINITIONS }),
};
for (const adapter of provider.adapters) adapter.offers = adapter.offers.map((binding) => ({ ...binding, offer: synchronizeOffer(binding.offer) }));
const canonicalProvider = stringify(provider, { lineWidth: 0 });
emit(providerPath, canonicalProvider);
for (const templateId of templateIds) emit(resolve(root, 'templates', templateId, 'template/treeseed.capacity-provider.yaml'), canonicalProvider);

for (const hostPath of hostPaths) {
	const host = JSON.parse(readFileSync(hostPath, 'utf8'));
	const embedded = structuredClone(provider);
	const dedicated = host.host.role === 'capacity-provider';
	embedded.configuration.generation = dedicated ? 'managed-provider-development-v5' : 'managed-development-v5';
	embedded.identity.displayName = dedicated ? 'TreeSeed managed capacity provider' : 'TreeSeed managed development provider';
	embedded.metadata.custody = 'manager-owned';
	host.components.agent.configuration.files['treeseed.capacity-provider.yaml'] = stringify(embedded, { lineWidth: 0 });
	const enrollment = host.components.agent.configuration.providerEnrollment;
	if (enrollment?.offer) enrollment.offer.capabilities = [...new Set(embedded.adapters.flatMap((adapter) => adapter.offers.flatMap((binding) => binding.offer.capabilities.map(({ id }) => id))))];
	emit(hostPath, `${JSON.stringify(host, null, 2)}\n`);
}
