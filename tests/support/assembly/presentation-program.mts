import { PresentationLifecycle } from './presentation-lifecycle.mjs';
import { readFileSync, writeFileSync, mkdirSync, mkdtempSync, copyFileSync, chmodSync, statSync, existsSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { firefox, type BrowserContext, type Page } from 'playwright';
import { InstalledApiFixture } from '@treeseed-cordis/api/testing';
import { ComposeDeploymentHost, ServiceWorkerOwnerClient, ServiceWorkerClient, ServicePlanStore, ServiceProjection, ServiceAuthorityExports, ServiceCredentials, PackageArchiveInspector } from '@treeseed-cordis/deployment';
import { CanonicalJson, ServiceSchemas, PluginManagementSchemas, PlatformOperations, PlanningBlockedError, type ServicePlan, type ServiceResourceReceipt, type ServiceInstance } from '@treeseed-cordis/sdk';
interface Selection {
    archives: Record<'api' | 'sdk' | 'deployment' | 'identity' | 'admin' | 'ui', string>;
    lockfile: string;
}
interface Input {
    base: Selection;
    variant: Selection;
    cli: string;
    variantCli: string;
}
class BrowserRead {
    static async status(): Promise<unknown> { const response = await fetch('/v1/platform/status', { credentials: 'same-origin', redirect: 'error' }); if (!response.ok)
        throw new Error('STATUS_REFUSED'); return response.json(); }
}
class PageErrors {
    readonly names: string[] = [];
    capture(error: Error): void { this.names.push(error.name); }
}
/** Assembled fixture only: domains/renderers/engine all come from their public owner packages. */
class UiAssembly {
    private base = new InstalledApiFixture();
    private variant = new InstalledApiFixture();
    private browser: BrowserContext | undefined;
    private profile: string | undefined;
    private stage = 'prepare';
    private plan: ServicePlan | undefined;
    private host!: ComposeDeploymentHost;
    private owner!: ServiceWorkerOwnerClient;
    private observer!: ServiceWorkerClient;
    private page!: Page;
    private authority!: Buffer;
    private store!: ServicePlanStore;
    private before = new Map<string, ServiceResourceReceipt>();
    private readonly files = new Map<string, string>();
    private next!: ServicePlan;
    private scopes: string[] = [];
    constructor(private readonly input: Input) { }
    private require(value: unknown): asserts value { if (!value)
        throw new Error('UI_ASSEMBLY_FAILED:' + this.stage); }
    private static pause(done: (value: void) => void): void { setTimeout(done, 100); }
    private sha(bytes: Uint8Array): string { return createHash('sha256').update(bytes).digest('hex'); }
    private async settled(owner: ServiceWorkerOwnerClient, id: string): Promise<void> {
        let record = await owner.application(id);
        const until = Date.now() + 240000;
        while (!['completed', 'failed', 'cancelled'].includes(record.phase) && Date.now() < until) {
            await new Promise(UiAssembly.pause);
            record = await owner.application(id);
        }
        if (record.phase !== 'completed' || record.result !== 'ready')
            throw new Error('UI_APPLICATION_FAILED:' + this.stage + ':' + record.phase + ':' + record.result);
    }
    private resources(store: ServicePlanStore): Map<string, ServiceResourceReceipt> { const result = new Map<string, ServiceResourceReceipt>(); for (const binding of store.current()!.resources)
        for (const receipt of store.resources())
            if (CanonicalJson.digest(receipt) === binding.receiptDigest)
                result.set(receipt.resourceId, receipt); return result; }
    private command(program: string, args: string[]): void { const result = spawnSync(program, args, { encoding: 'utf8', timeout: 30000 }); this.require(result.status === 0); }
    private async login(plan: ServicePlan, authority: Buffer): Promise<Page> { this.profile = mkdtempSync(join(tmpdir(), 'cordis-task3c-ui-browser-')); const profile = join(this.profile, 'firefox'), ca = join(this.profile, 'authority.pem'); mkdirSync(profile, { mode: 0o700 }); writeFileSync(ca, authority, { mode: 0o600 }); this.command('certutil', ['-N', '-d', 'sql:' + profile, '--empty-password']); this.command('certutil', ['-A', '-n', 'CordisTask3cUi', '-t', 'C,,', '-i', ca, '-d', 'sql:' + profile]); this.browser = await firefox.launchPersistentContext(profile, { headless: true, ignoreHTTPSErrors: false }); const page = await this.browser.newPage(), errors = new PageErrors(); page.on('pageerror', errors.capture.bind(errors)); const credential = JSON.parse(new ServiceCredentials(plan).read('issuer-main', 'secret://issuer-main/bootstrap').toString()) as {
        username: string;
        password: string;
    }; await page.goto(plan.configuration.origin + '/admin'); await page.locator('#username').fill(credential.username); await page.locator('#password').fill(credential.password); await page.getByRole('button', { name: 'Sign In', exact: true }).click(); await page.waitForURL(plan.configuration.origin + '/admin'); await page.getByRole('button', { name: 'Refresh status' }).click(); await page.getByRole('cell', { name: 'api-main', exact: true }).waitFor(); this.require(errors.names.length === 0 && !(await page.content()).includes(credential.password)); return page; }
    private async rebase(): Promise<void> { const base = this.plan!; this.variant.configuration = { ...this.variant.configuration, installationId: base.configuration.installationId, installationDirectory: base.configuration.installationDirectory, origin: base.configuration.origin, engineContext: base.configuration.engineContext }; const graph = this.variant.release.composition, descriptors = new Map<string, ReturnType<typeof PluginManagementSchemas.packageDescriptor.parse>>(); for (const artifact of this.variant.release.packages) {
        const archive = await PackageArchiveInspector.inspect(join(this.variant.bundle, artifact.path), artifact.sha256);
        if (archive.metadata.cordisPackage)
            descriptors.set(artifact.name, PluginManagementSchemas.packageDescriptor.parse(archive.metadata.cordisPackage));
    } for (const service of graph.services) {
        const descriptor = descriptors.get(service.provider.package.name)!;
        let definition;
        for (const item of descriptor.providers)
            if (item.declaration.id === service.provider.providerId)
                definition = item.container;
        this.require(definition);
        const projected = ServiceProjection.resolve(service, definition, graph, this.variant.configuration), prior = base.composition.services.find(UiAssembly.service.bind(null, service.serviceId))!;
        service.definition = projected.definition;
        service.resources = projected.resources;
        service.readiness.configuration = structuredClone(prior.readiness.configuration);
        for (const port of prior.definition.ports)
            if (port.publication)
                for (const next of service.definition.ports)
                    if (next.id === port.id)
                        next.publication = structuredClone(port.publication);
    } for (const [name, spec] of Object.entries(this.variant.recipe.services))
        if (spec.ports)
            spec.ports = structuredClone(base.recipe.services[name]!.ports); const worker = join(this.variant.bundle, 'host-worker'); chmodSync(worker, 0o700); copyFileSync(join(this.base.bundle, 'host-worker'), worker); chmodSync(worker, 0o500); graph.worker = structuredClone(base.composition.worker); this.variant.refreshService(); }
    private static service(id: string, service: ServiceInstance): boolean { return service.serviceId === id; }
    private terminal(): void { const root = mkdtempSync(join(tmpdir(), 'cordis-task3c-ui-terminal-')); try {
        const args = ['doctor', '--installation', join(root, 'missing')], before = spawnSync(this.input.cli, args, { encoding: 'utf8', env: { PATH: '' } }), after = spawnSync(this.input.variantCli, args, { encoding: 'utf8', env: { PATH: '' } });
        this.require(before.status === 3 && after.status === 3 && !before.stdout.includes('Cordis UI qualification fixture') && after.stdout.includes('Cordis UI qualification fixture'));
        const machine = ['plugin', 'install', '--json'], a = spawnSync(this.input.cli, machine, { encoding: 'utf8', env: { PATH: '' } }), b = spawnSync(this.input.variantCli, machine, { encoding: 'utf8', env: { PATH: '' } });
        this.require(a.status === 2 && b.status === 2 && a.stdout === b.stdout && a.stderr === '' && b.stderr === '' && JSON.parse(a.stdout).result === null);
    }
    finally {
        rmSync(root, { recursive: true, force: true });
    } }
    private async stop(): Promise<void> {
        if (!this.plan) return;
        const directory = this.plan.configuration.installationDirectory;
        const child = join(directory, '.cordis/launch/child.json');
        if (!existsSync(child)) return;
        const data = JSON.parse(readFileSync(child, 'utf8')) as { pid: number };
        this.require(Number.isSafeInteger(data.pid) && data.pid > 0);
        const file = statSync(join(directory, '.cordis/worker'));
        const running = this.workerExecutable(data.pid);
        if (!running) return;
        this.require(file.uid === process.getuid!() && file.dev === running.dev && file.ino === running.ino);
        process.kill(data.pid, 'SIGTERM');
        const until = Date.now() + 15000;
        while (existsSync(join(directory, '.cordis/writer.lock')) && Date.now() < until)
            await new Promise(UiAssembly.pause);
        this.require(!existsSync(join(directory, '.cordis/writer.lock')));
    }
    private workerExecutable(pid: number): ReturnType<typeof statSync> | undefined {
        try { return statSync('/proc/' + pid + '/exe'); }
        catch (error) {
            if ((error as NodeJS.ErrnoException).code === 'ENOENT') return;
            throw error;
        }
    }
    async run(): Promise<void> {
        await new PresentationLifecycle().run(this.scenario.bind(this), [
            this.closeBrowser.bind(this), this.stop.bind(this), this.closeBase.bind(this),
            this.closeVariant.bind(this), this.closeProfile.bind(this),
        ]);
    }
    private async scenario(): Promise<void> {
        try {
            await this.prepareBase();
            await this.baseBrowser();
            this.recordResources();
            await this.prepareVariant();
            await this.refuseImplicitRestart();
            await this.applyVariant();
            this.retainedResources();
            await this.retainedIdentity();
            await this.variantBrowser();
            await this.finishScenario();
        } catch (error) { throw this.failure(error); }
    }
    private failure(error: unknown): Error {
        if (!(error instanceof PlanningBlockedError))
            return new Error('UI_ASSEMBLY_OPERATION_FAILED:' + this.stage, { cause: error });
        const codes: string[] = [];
        for (const blocker of error.blockers) codes.push(blocker.code);
        return new Error('UI_ASSEMBLY_BLOCKED:' + this.stage + ':' + codes.join(','), { cause: error });
    }
    private async prepareBase(): Promise<void> {
        await this.base.prepared(this.input.base);
        this.host = new ComposeDeploymentHost();
        const planned = await this.host.plan(this.base.configuration);
        this.require(planned.formatVersion === 3);
        this.plan = planned;
        const options = { installationDirectory: planned.configuration.installationDirectory };
        this.owner = new ServiceWorkerOwnerClient(options);
        this.observer = new ServiceWorkerClient(options);
        this.stage = 'base-submit';
        const application = await this.host.apply(planned.id, planned.digest,
            { ...options, idempotencyKey: 'ui-base' });
        this.stage = 'base-application-readback';
        await this.settled(this.owner, application.id);
    }
    private async baseBrowser(): Promise<void> {
        this.stage = 'base-browser';
        const plan = this.plan!;
        const signal = new AbortController().signal;
        this.authority = Buffer.from(await new ServiceAuthorityExports(plan).read(
            'public-main', 'secret://public-main/public-ca', { deadline: Date.now() + 10000, signal }));
        this.page = await this.login(plan, this.authority);
        this.require((await this.page.getByText('Cordis UI qualification fixture', { exact: true }).count()) === 0);
        const status = PlatformOperations.status.parseOutput(await this.page.evaluate(BrowserRead.status));
        this.require(status.ready && status.activeComposition === plan.compositionGeneration);
    }
    private recordResources(): void {
        this.store = new ServicePlanStore(this.plan!.configuration.installationDirectory);
        this.before = this.resources(this.store);
        for (const receipt of this.before.values()) {
            if (receipt.path && existsSync(join(this.store.path, receipt.path)))
                this.files.set(receipt.path, this.sha(readFileSync(join(this.store.path, receipt.path))));
        }
    }
    private async prepareVariant(): Promise<void> {
        this.stage = 'variant-prepare';
        await this.variant.prepared(this.input.variant);
        await this.rebase();
        this.stage = 'variant-plan';
        const next = await this.host.plan(this.variant.configuration);
        this.require(next.formatVersion === 3 && next.composition.assetDigest !== this.plan!.composition.assetDigest);
        this.next = next;
        for (const change of next.changes)
            if (change.requiredActions.includes('restart')) this.scopes.push(change.serviceId);
        this.require(this.scopes.includes('api-main') && !this.scopes.includes('issuer-main') && !this.scopes.includes('store-main'));
    }
    private async refuseImplicitRestart(): Promise<void> {
        this.stage = 'explicit-admission';
        const count = this.store.records().length;
        let refused = false;
        try {
            await this.host.apply(this.next.id, this.next.digest,
                { installationDirectory: this.store.path, idempotencyKey: 'ui-no-implicit-restart' });
        } catch (error) {
            this.require(error instanceof PlanningBlockedError);
            refused = error.blockers.some(UiAssembly.actionRequired);
        }
        this.require(refused && this.store.records().length === count);
    }
    private async applyVariant(): Promise<void> {
        this.stage = 'variant-submit';
        const changed = await this.host.apply(this.next.id, this.next.digest, {
            installationDirectory: this.store.path, idempotencyKey: 'ui-reviewed-restart',
            restartServices: this.scopes,
        });
        this.stage = 'variant-application-readback';
        await this.settled(this.owner, changed.id);
    }
    private retainedResources(): void {
        this.stage = 'retained-identity';
        const after = this.resources(this.store);
        for (const [id, receipt] of this.before) {
            if (receipt.serviceId === 'api-main' && (receipt.kind === 'container' || receipt.kind === 'configuration')) continue;
            this.sameResource(after.get(id), receipt);
        }
        for (const [path, hash] of this.files)
            this.require(this.sha(readFileSync(join(this.store.path, path))) === hash);
    }
    private sameResource(current: ServiceResourceReceipt | undefined, receipt: ServiceResourceReceipt): void {
        this.require(current && current.actualId === receipt.actualId && current.path === receipt.path
            && current.contentDigest === receipt.contentDigest && current.creatingGeneration === receipt.creatingGeneration);
    }
    private async retainedIdentity(): Promise<void> {
        const signal = new AbortController().signal;
        const afterAuthority = Buffer.from(await new ServiceAuthorityExports(this.next).read(
            'public-main', 'secret://public-main/public-ca', { deadline: Date.now() + 10000, signal }));
        this.require(afterAuthority.equals(this.authority));
    }
    private async variantBrowser(): Promise<void> {
        this.stage = 'variant-browser';
        await this.page.reload();
        await this.page.getByText('Cordis UI qualification fixture', { exact: true }).first().waitFor();
        await this.page.getByRole('button', { name: 'Refresh status' }).click();
        await this.page.getByRole('cell', { name: 'api-main', exact: true }).waitFor();
        const latest = PlatformOperations.status.parseOutput(await this.page.evaluate(BrowserRead.status));
        this.require(latest.ready && latest.activeComposition === this.next.compositionGeneration);
        for (const width of [320, 375, 768, 1024, 1440, 1920, 2560]) {
            await this.page.setViewportSize({ width, height: 900 });
            const button = await this.page.getByRole('button', { name: 'Sign out' }).boundingBox();
            this.require(button && button.width >= 44 && button.height >= 44);
        }
    }
    private async finishScenario(): Promise<void> {
        this.stage = 'terminal';
        this.terminal();
        this.stage = 'source-free';
        rmSync(this.base.bundle, { recursive: true, force: true });
        rmSync(this.variant.bundle, { recursive: true, force: true });
        this.require((await this.observer.status()).ready);
        process.stdout.write(JSON.stringify({ fixtureOnly: true, genuineKeycloak: true,
            browserProviderChanged: true, terminalProviderChanged: true, explicitRestart: true,
            retainedIdentity: true, retainedTls: true, machineBytesUnchanged: true, sourceFree: true }) + '\n');
    }
    private async closeBrowser(): Promise<void> { await this.browser?.close(); }
    private async closeBase(): Promise<void> { this.base.close(); }
    private async closeVariant(): Promise<void> { this.variant.close(); }
    private async closeProfile(): Promise<void> {
        if (this.profile) rmSync(this.profile, { recursive: true, force: true });
    }
    private static actionRequired(blocker: {
        code: string;
    }): boolean { return blocker.code === 'TRANSITION_ACTION_REQUIRED'; }
}
await new UiAssembly(JSON.parse(readFileSync(process.argv[2]!, 'utf8'))).run();
