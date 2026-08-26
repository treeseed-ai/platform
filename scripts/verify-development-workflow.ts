import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { DevelopmentSessionStore, affectedDevelopmentClosure } from '../packages/deployment/src/manager/development-sessions.ts';
import { runCommandLine } from '../packages/cli/src/cli/runtime.ts';

const workspace = resolve(import.meta.dirname, '..');
const temporary = mkdtempSync(resolve(tmpdir(), 'treeseed-development-workflow-'));
const sessions = new DevelopmentSessionStore(resolve(temporary, 'manager'), { routedHealth: async () => true });
let activeSessionId: string | null = null;

async function hostInvoke(input: { handlerId: string; options: Record<string, unknown> }) {
	const payload = JSON.parse(String(input.options.payload ?? '{}')) as Record<string, any>;
	switch (input.handlerId) {
		case 'local.dev.session.start': {
			const record = sessions.start(payload.session, payload.runtimes); activeSessionId = record.session.sessionId; return record;
		}
		case 'local.dev.status': return payload.sessionId ? sessions.load(payload.sessionId) : { sessions: sessions.list(Boolean(payload.all)) };
		case 'local.dev.plan': {
			const record = sessions.load(payload.sessionId); return { affected: affectedDevelopmentClosure(record.runtimes, payload.selected.length ? payload.selected : record.session.targets.map((target) => `${target.projectId}.${target.targetId}`)) };
		}
		case 'local.dev.environment': return { environment: { TREESEED_API_BASE_URL: 'https://api.treeseed.localhost', NODE_EXTRA_CA_CERTS: '/etc/treeseed/cli/localhost-ca.crt' } };
		case 'local.dev.candidate.register': return sessions.registerCandidate(payload.sessionId, payload.candidate);
		case 'local.dev.use': {
			sessions.setMode(payload.sessionId, payload.projectId, payload.targetId, payload.mode);
			if (payload.mode !== 'released' && payload.port) await sessions.attach(payload.sessionId, payload.projectId, payload.targetId, payload.port);
			if (payload.mode !== 'released' && !payload.port) sessions.markReady(payload.sessionId, payload.projectId, payload.targetId);
			if (payload.mode !== 'released' && payload.port && !await sessions.verifyRouted(payload.sessionId, payload.projectId, payload.targetId)) throw new Error('Routed health failed.');
			return sessions.load(payload.sessionId);
		}
		case 'local.dev.session.stop': return sessions.stop(payload.sessionId);
		default: throw new Error(`Unsupported workflow harness command ${input.handlerId}.`);
	}
}

const output: string[] = [];
const context = { cwd: workspace, env: { ...process.env, XDG_STATE_HOME: resolve(temporary, 'state'), TREESEED_API_BASE_URL: process.env.TREESEED_API_BASE_URL ?? 'https://api.treeseed.localhost', NODE_EXTRA_CA_CERTS: process.env.NODE_EXTRA_CA_CERTS ?? '/etc/treeseed/cli/localhost-ca.crt' }, interactiveUi: false, hostInvoke, write: (value: string) => output.push(value) };

try {
	let exit = await runCommandLine(['dev', 'session', 'start', 'development.session.yaml', '--actor', 'development-workflow-verifier', '--lease-seconds', '900', '--json'], context);
	if (exit !== 0 || !activeSessionId) throw new Error('Unable to start the development workflow session.');
	exit = await runCommandLine(['dev', 'use', 'sdk.package=live', '--target', 'ui.package=live', '--target', 'core.package=live', '--json'], context);
	if (exit !== 0) throw new Error('Unable to activate the live package overlay closure.');
	exit = await runCommandLine(['dev', 'use', 'admin.web=live', '--json'], context);
	if (exit !== 0) throw new Error('Unable to activate the Admin live-web target.');
	const health = await fetch('http://127.0.0.1:4322/healthz');
	if (health.status !== 200) throw new Error(`Admin live health returned ${health.status}.`);
	const record = sessions.load(activeSessionId);
	const live = record.session.targets.filter((target) => target.mode === 'live').map((target) => `${target.projectId}.${target.targetId}`).sort();
	process.stdout.write(`${JSON.stringify({ ok: true, sessionId: activeSessionId, live, adminHealth: health.status, packageGenerations: record.session.targets.filter((target) => target.targetId === 'package').map((target) => ({ target: `${target.projectId}.${target.targetId}`, generation: target.generation })) }, null, 2)}\n`);
} finally {
	if (activeSessionId) await runCommandLine(['dev', 'session', 'stop', '--session', activeSessionId, '--restore', '--json'], context).catch(() => 1);
	rmSync(temporary, { recursive: true, force: true });
}
