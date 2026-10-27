# Task 3C extensible plugins and reusable UI implementation plan

> **For implementing agents:** Use the actual available workflow/testing tools, preserve the user's execution method, and deliver one bounded task at a time. Checkboxes record verified results, not intentions. Retain child-repository setup pauses.

**Goal:** Install exact NPM/Git plugins and safely activate typed, extensible container services and reusable human interfaces without a fixed role catalog.

**Architecture:** SDK defines versioned service/binding/transition contracts over native Cordis. Deployment owns the durable registry and generic container lifecycle; capability owners supply typed service/probe classes. The independent UI repository owns reusable browser/server/terminal presentation, consumed by Admin and CLI through exact public archives.

**Tech Stack:** Strict TypeScript classes, native Cordis, existing qualified Bun/Node toolchains, local Linux/amd64 Docker on Ubuntu 26.04, existing archive/OCI verification, Web Crypto for browser-safe generation hashing. Reusable visual components are pure React TSX classes, with UI-owned React DOM host adapters and native Cordis provider selection. Exact compatible React/React DOM peers are qualified and pinned after setup approval; no packages are installed during initialization.

**Spec:** [Extensible deployment and required UI amendment](../specs/2026-10-24-extensible-deployment-ui-design.md), extending the [provider design](../specs/2026-10-24-cordis-composition-providers-design.md). Tracking: [Platform #722](https://github.com/treeseed-ai/platform/issues/722).

## Global Constraints

- **Current maintainer authority: UI setup accepted; publish its exact reviewed baseline and implement Task 3C.** Preserve repository/identity/release boundaries and hand back reviewed candidates before Task 3D.
- Keep independent canonical owners, public exports, exact archives, licenses, original checkouts/services and legacy branches. Platform owns no runtime implementation. TreeDX remains Elixir/Rust; AI remains excluded.
- Use native Cordis classes, injection, isolation and lifecycle; no parallel resolver, instance map, provider scheduler or functional UI implementation.
- Installed release/plan/journal format 3; provider manifest format 2; operation projection `0.5.0-cordis.1`; provider contract `0.4.0-cordis.1`. Preserve all seven operation IDs and historical formats 1/2.
- Nonempty service collection; service ID `[a-z][a-z0-9-]{0,47}`; initial defensive ceiling 256. Four services are a default profile, never a global role enum/count.
- Installation-wide composition generation differs from per-service generation/resource identity. Retain verified unaffected containers, volumes, credentials and TLS authority.
- Plan never activates or creates credentials. Apply accepts only the verified plan. Acquisition/build completes before planning; no pull/build or ambient package scripts during apply.
- Every visual component is mobile-first across 320/375/768/1024/1440/1920/2560 CSS-pixel widths, long content and 200% text resizing; authored controls have at least 44×44 CSS-pixel targets. No page overflow/hidden required actions; labeled local table overflow is allowed.
- Human browser/server/terminal presentation uses UI providers. Domain authority/view models stay with their owners; machine JSON and process exit codes stay with CLI/SDK.
- Branch from freshly fetched/live-verified `origin/cordis`, map legacy capability → same-owner export → observable test in each owning issue, commit docs before outside-in tests and implementation. Split at owner PR-size gates.
- PRs target `cordis`, use `Part of #N`, and keep every issue including #678 open. No production publication, cutover, Task 3D or general recovery/removal implementation.

## Review Focus

1. A fifth service changes the composition digest but must not restart the original four or regenerate credentials/TLS; 3C.3 and 3C.7 verify retained live identities/bytes.
2. Two instances of one provider can cross-wire dependencies/secrets; 3C.1/3C.3 prove exact binding identity and deny cross-instance access.
3. A lost response before source resolution can make a retry install moved bytes; 3C.6 persists intent first and tests both response-loss windows.
4. An active format-2 installation can be silently upgraded/replayed by a new installer; 3C.3 tests `MIGRATION_REQUIRED`, explicit non-serving migration and old-reader rejection.
5. Reusable UI can be nominal while consumer rendering or server dependencies remain in actual browser bytes; 3C.2/3C.5/3C.7 test source enforcement, real default roots and UI-only replacement on both surfaces.

## Owner files and delivery boundaries

Paths are relative to their named independent repository. New filenames below are proposed; current public entrypoints remain compatible. Each numbered task is an independently reviewed deliverable; narrow SDK, registry, engine and consumer PRs further where owner size gates require it. No root commit substitutes for an owner commit.

| Owner | Existing files to extend | Focused new files / responsibility |
| --- | --- | --- |
| SDK | `src/contracts.ts`, `src/runtime.ts`, `src/source-policy.ts`, generated projections, package exports | `src/composition.ts`: browser-safe native composition/leases; `src/service-contracts.ts`: format-3 binding/profile/transition schemas |
| Deployment | `src/artifacts.ts`, `src/installed.ts`, `src/composition.ts`, `src/diagnose.ts` | `src/service-resolver.ts`, `src/service-transitions.ts`, `src/plugins/{manager,sources,build,registry}.ts`; owner fixtures and program tests |
| UI | New setup-approved implementation in existing `treeseed-ai/ui` | `src/{contracts,browser,server,terminal}.ts`, `src/react.ts`, `src/components/*.tsx` class components/provider modules, build/source-policy and browser/terminal suites |
| Identity | `src/identity.ts`, metadata/build and tests | Typed endpoint/configuration/readiness projections for the existing identity provider |
| API | `src/container.ts`, `src/server.ts`, image-context/build metadata | Generic binding consumption, exact UI/domain asset closure and target-generation read-back |
| Admin | `src/admin.ts`, `src/browser.ts`, browser build and tests | Feature view models, authorized action/data adapters and UI contribution declarations |
| CLI | `src/main.ts`, build/program tests | `src/plugin-commands.ts`, `src/presentation.ts`: command and UI view-model adapters |
| Platform | Docs, exact composition declarations, assembled tests and CI | `composition/task3c.json`, `tests/task3c-{plugins,ui}.test.mts`: public artifact-only assembly |

### 3C.0: UI same-repository initialization and review pause

**Interfaces:** Produces only a local setup baseline in `packages/ui`, sharing the canonical UI history. No public UI package exports exist at this stage.

- [x] After explicit resumption, create/adopt UI initialization issue; re-fetch live Platform/UI heads over HTTPS. Record original UI HEAD/index/files/ignored inventory/worktrees, license and repository-specific policy. Use the parent initializer's verified allowlist and reject conflicts rather than silently discarding policy files.
- [x] Initialize the fresh same-repository `cordis` worktree at `packages/ui` using an exact accepted Platform parent commit. Exclude the initializer itself, preserve the applicable license, and verify setup blobs/modes, original checkout preservation and Platform ignore boundaries.
- [x] Report exact parent/baseline/bootstrap commit, issue and inventory. **Stop for user setup review before scaffolding, dependencies, tests/builds or code.** Publish the baseline only when explicitly instructed. Agent remains absent and separately gated at 3D.

### 3C.1: SDK executable contracts and portable native composition

**Interfaces:** `ServiceInstance`, `ProviderRef`, `ServiceBinding`, `DependencyBinding`, `ReadinessBinding`, `CompositionProfile`, `ServiceIdentity`, `ServiceReadiness`, `ServiceChange` have the amendment's fields. `ServiceChange` discriminates `add | retain | replace | reconfigure | retire`. `ContainerEngine.start(serviceId, definition): Promise<void>`, `.ready(serviceId): Promise<ServiceReadiness>`, `.identity(serviceId): ServiceIdentity` remain bounded to an accepted plan. `ContainerService` exposes `identity` and `ready`. `CordisComposition.start(descriptor, trustedContext): Promise<CompositionHandle>` and leases remain the common native API; `./composition` is portable, `./runtime` retains Node loading.

- [x] Commit owner docs and generated-schema version strategy before tests. Preserve historical readers/projections and the seven operation IDs; describe explicit browser target and exact provider entry/class identity in manifest format 2.
- [x] Add class-bound `service_graph_accepts_fifth_and_duplicate_provider_instances`: validate five services and two same-provider instances with different IDs/bindings; reject 0/257 services, invalid IDs, duplicate/ambiguous bindings, wrong contracts, missing dependencies and cycles. These are executable schema/graph tests; verify intended red against the current four-role schema.
- [x] Add `browser_root_shares_native_selection_and_leases`: bundle/import the real portable entry in a browser, start two provider implementations sequentially, test injection/isolation/drain/stale leases and awaited cleanup. Reject Node/server imports in its dependency closure. Preserve existing Node/compiled CLI native identity tests.
- [x] Implement schemas, generated binding projections via native isolation/class bridges, and portable composition split. Use async Web Crypto hashing in the browser path; don't import Node loaders through portable exports. Preserve existing Node runtime entry compatibility.
- [x] Run `bun run verify` in SDK, including meaningful browser/default construction qualification added by this slice. Record intended red/green commands and exact candidate archive/hash. Commit and open the bounded SDK PR(s); consumers use that archive, never sibling source.

### 3C.2: UI reusable presentation foundation

**Interfaces:** Proposed private candidate package `@treeseed-cordis/ui` exports `./contracts`, `./react`, `./browser`, `./server`, `./terminal`. `./react` exports pure reusable React class components and typed props, independent of Astro/Electron/server APIs; Cordis owns provider selection and React owns rendering. Models/actions/design tokens are renderer-neutral; native mobile gets a future UI-owned renderer, not a promise that DOM elements become native views. `UiContribution` carries contribution/component binding/schema/action/asset identities; `UiViewModel` carries validated presentation data. `UiServerRenderer.render(view): RenderedPage`, `UiTerminalRenderer.render(view): RenderedTerminal`, `UiBrowserRenderer.mount(target, view): Promise<UiMount>`, `UiMount.dispose(): Promise<void>`, `UiActionDispatcher.invoke(actionId, input): Promise<UiActionResult>`. `UiBrowserApplication.start(configuration): Promise<UiMount>` is the standalone production native root. `UiBrowserApplication.attach(bootstrap: UiHydrationData, host: UiHostAdapters): Promise<UiScopeHandle>` attaches only provider scope to an externally owned React root; `UiScopeHandle.dispose(): Promise<void>` reports completed cleanup. `UiHydrationData` is validated model/action-ID/contribution/provider/asset-generation data, never executable adapters or tokens. UI's React island bridge calls attach using adapters supplied by the build-selected consumer host entry; Astro owns the single island's React root. Server request and browser provider scopes are distinct. `RenderedPage` holds escaped HTML/exact asset references; `RenderedTerminal` holds text output, never exit-code authority. `UiComponent` is an extensible typed provider contract, not a fixed component enum.

- [x] After setup approval/resumption, create a UI feature issue/branch. Map legacy `src/lib/foundation/contracts.ts`, `src/astro/app/controls/data/PlainTable.astro`, `src/astro/surface/EmptyState.astro` and form/navigation concepts to UI-owned class contracts/providers; migrate visual components to React TSX classes; retain concepts, not functional/Astro implementation. Shared Keycloak identity remains behind Identity and authorized host adapters, never inside reusable components. Commit export/rendering/accessibility docs and owner changelog.
- [x] Write `ui_default_roots_render_status_table_form` through the built browser program and actual server/terminal exports. At all seven required widths, assert each component reflows, long labels remain usable, authored controls meet 44×44 targets, 200% text resizing preserves actions/data, keyboard/focus/form semantics work and only labeled table regions overflow. Also assert script-like text escaping, deterministic plain/non-TTY output and listener/subscription disposal. Run to intended failure before renderer implementation.
- [x] Add `react_archive_works_in_astro_and_standalone`: consume the genuine UI archive in a standalone React browser root and a minimal Astro SSR/interactive hydration fixture generated by an owner TypeScript test class. Assert shared component behavior, no `.astro` library exports/Astro runtime dependency, one qualified React peer instance, one island per page, no nested React root, no hydration mismatch and awaited disposal. Generate only serializable model/action/generation props; construct action adapters locally in the browser host entry. Test simultaneous principals, denied actions before bootstrap validation, malformed or executable bootstrap data, navigation/disposal and no server principal/session leakage. Multiple islands need later qualification. Keep Electron/native applications outside this milestone; verify portable contracts import without DOM/Node.
- [x] Add same-contract two-provider selection tests for a component/theme and renderers. Add wrong-model/duplicate-contribution, unauthorized action-adapter and generation mismatch tests. Include unauthorized principal/action and host-session separation tests; a reused UI library grants no Keycloak session/token authority. A declared action ID grants no domain authority.
- [x] Implement minimum status/text/table/form/navigation/feedback React TSX class components and native Cordis class providers, UI-owned React DOM browser/SSR adapters, terminal renderer and native browser root. No consumer-side duplicate component implementations. Use SDK portable composition; keep browser exports free of server/Node dependencies and all exports free of credentials/domain authority.
- [x] Make owner semantic source checks reject handwritten JS/function-based UI and target-crossing imports. Export a reusable consumer-presentation source-policy check so Admin/CLI/API/Agent gates reject copied HTML/DOM/CSS rendering while allowing domain view-model construction.
- [x] Establish and run meaningful `bun run check`, `build`, `test:unit`, `test:integration`, `test:smoke` and aggregate `verify` scripts in UI. Pack exact archive; record browser/terminal replacement and accessibility evidence. Open owner review candidate before consumer adoption.

### 3C.3: Deployment generic graph, retained resources and explicit format migration

**Interfaces:** `ServiceResolver.resolve(bundle, configuration): Promise<ResolvedServiceGraph>` verifies all selected package/image/probe identities and explicit references. `ServiceTransitions.plan(previous, desired): ServiceChange[]` derives accepted changes. Existing `DeploymentHost.plan/apply/status/application` remain public lifecycle authority. `InstallationStore.migrate` gains an explicit format-2-to-3 path; no automatic installer migration. Resource receipts bind installation/service/resource/creating-generation plus referencing composition generations. No role dispatch is permitted in generic resolver, worker or engine.

- [x] Commit owner format-3/profile/resource/secret/endpoint docs and migration contract; keep format-1/2 artifacts/readers immutable. Define `MIGRATION_REQUIRED` for an active old installation and explicit repair for incomplete migrations. Migration needs separate caller authorization and non-serving API/worker boundary; Task 3C install cannot provide it implicitly.
- [x] Write `add_service_retains_existing_resources` at built-worker/program level with genuine archived fixture classes: add a fifth private, explicitly bound service; compare original container/volume IDs, credential bytes and CA fingerprint. Observe its real direct protocol and unchanged existing routed status/assets. A new public route is edge reconfiguration: test prepared/action-required with no mutation, unless a separately qualified route-update provider supplies its own safety suite. Add `same_provider_instances_use_distinct_bindings` with a real consumer calling both endpoints and cross-instance secret/resource denials. Run to intended red.
- [x] Add explicit new probe-provider protocol verification, image sharing across services, endpoint-reference/configuration rendering, name collision resistance, false-ready, contract mismatch, 256-service bound and dependency/probe-cycle tests. Positive tests must require no new engine role/probe switch.
- [x] Add `format2_install_requires_explicit_migration`, old-reader refusal and separately invoked non-serving migration tests. Snapshot saved bytes/private slot paths/TLS/resources; verify migrated receipts preserve them. Interruption must preserve evidence/fence uncertain state; no silent overwrite or old plan replay.
- [x] Implement verified graph and bounded engine, stable resource IDs/service generations, service-scoped secret/config receipt reuse and explicit migration. Keep default Postgres/Caddy class providers in Deployment, accept Identity/API declarations through public metadata, and restrict privileged API-worker mount to profile grants.
- [x] Test positive bounded definitions and reject shells, privileged/host mounts, mutable images, unaccepted definitions, ungranted secret/probe/network access. Exercise default construction and fresh planning no-credential/no-runtime-change tests.
- [x] Run Deployment `bun run verify`; include real local Docker/program tests on Ubuntu 26.04. Split resolver, persistence/migration and engine/provider PRs if size gates require. Pin exact archives; no manually activating a user installation.

### 3C.4: Identity/API typed service and asset declarations

**Interfaces:** Existing Identity/API container classes implement SDK `ContainerService` using explicit dependency ports and endpoint references. Identity's protocol-specific readiness/configuration remains Identity-owned. API's build metadata binds exact UI/Admin/runtime archives and browser asset generation; worker/API read-back acknowledges actual accepted target generation.

- [x] Commit owner docs mapping existing service capabilities, endpoint/credential bindings and source files to the new public declarations. API retains auth/HTTP/worker authority; Identity retains issuer/session/OIDC custody.
- [x] Write owner built-service/default-root tests using renamed service IDs and two compatible fixture bindings; configuration must use selected references rather than literal `database`/`identity` hostnames. Add wrong issuer/grant, denied worker mount and exact image/asset-closure mismatch tests; establish intended red.
- [x] Replace fixed-role/endpoint assumptions in `src/identity.ts`, API `src/container.ts` and image-context generation with validated metadata/projections. Include exact UI assets/dependencies in the image identity; no arbitrary browser URL or plugin-supplied mount path.
- [x] Run `bun run verify` in each owner, direct and routed protocol/readiness and API generation read-back. Publish exact review candidates separately; don't transfer container declarations into Deployment or Platform.

### 3C.5: Admin and CLI consume UI, preserving domain/machine boundaries

**Interfaces:** Admin exports authorized status/login/logout/action contributions and domain view models; `AdminRoutes` retains session/HTTP decisions and calls `UiServerRenderer`. Browser data/action adapters mount `UiBrowserApplication`; CLI presentation adapter maps existing command results to `UiViewModel` and calls `UiTerminalRenderer`. Machine envelopes bypass human renderers.

- [x] Commit Admin/CLI docs describing reusable UI exports, asset generation and preserved auth/machine behavior. New human features cannot extend the old consumer-owned inline HTML/DOM/text-rendering paths.
- [x] Write actual browser login/status/logout and built CLI help/doctor/plan/apply tests consuming a genuine UI archive. Assert unchanged JSON schemas/exit codes, non-TTY output, escaped untrusted names, secret redaction and authorized actions. Establish intended red before replacing inline presentation.
- [x] Implement Admin contributions/data/action adapters and CLI view-model adapters through exact UI public exports. Delete duplicated renderer paths; retain parsing, sessions, command/domain authority and stream ownership in their current owners. Consume the UI semantic presentation gate in owner checks.
- [x] Verify old-open-page generation remains truthful, immutable asset routing/CSP works, mismatched assets fail and all listeners/effects dispose. Run Admin/CLI `bun run verify` and real default/browser programs. Commit/open separate owner candidates; no Platform component source.

### 3C.6: Exact package acquisition, durable registration and safe activation

**Interfaces:** `PluginManager.install(request, authority): Promise<PluginInstallResult>` and `.select(request, authority): Promise<PluginInstallResult>` remain Deployment public contracts. Existing design defines source grammar, install/list/inspect/select, explicit target/provider selection and idempotency key. Result states distinguish registered/prepared/pending/active/already-active/recovery-required. Exit 0 only active/already-active; 2 invalid, 3 action-required/pending, 1 unexpected runtime/I/O failure. CLI adds no invented remote installer endpoint.

- [x] Commit source/build/registry/transition docs before tests; persist canonical request intent/idempotency before acquisition. `--idempotency-key` recovers an exact request; omission creates a new key reported to the caller, never guessed from a mutable locator.
- [x] Write real NPM/disposable-registry and HTTPS-Git install scenes with genuine package archives/commits. A Docker-only PATH without Node/Bun/NPM/Git must use privately managed release-pinned helpers; unavailable/tampered helpers fail, never globally install tools. Test approved source-only Git through a pinned disposable build policy and packaged Git without lifecycle execution.
- [x] Test mutable-source movement, dependency/metadata/export tampering, duplicate command/binding, multi-target ambiguity, missing trust/build policy, script and credential canaries, offline exact-byte/helper reuse. Lose responses before the first source receipt and after activation: same key recovers identical bytes/application, different intent conflicts; a new bare request can resolve moved source.
- [x] Write safe-addition and qualified live-provider transition program tests with real held leases, affected admission/drain/cleanup and target read-back. Existing container restart/stateful/issuer/TLS migration remains prepared/action-required until explicit scope authorization; pending/partial target change is never active. Concurrent requests and stale generations cannot create two writers. Crash/uncertain effects fence affected scope and require repair; full automatic recovery remains Task 6.
- [x] Implement native source/build/registry provider classes and one durable transition path into plan/apply. Register alternatives without overriding explicit selection. Grant checks are invariant, not replaceable policy plugins. Qualified additive services retain all unaffected resources; container replacement has no implicit live claim.
- [x] Run Deployment/SDK/CLI/API applicable `bun run verify` plus default target, clean-host acquisition and durable retry programs. Commit bounded registry/acquisition/transition/integration candidates with exact archive pins. Disable/remove remains explicitly unsupported until Task 7.

### 3C.7: Platform exact assembly and review handoff

**Interfaces:** `composition/task3c.json` binds reviewed owner source/archive/image/asset/helper identities and contract formats. New assembled commands `bun run test:extensible` and `bun run test:ui` are implemented as exact public-artifact programme gates; preserve existing Task 1–3B composition records.

- [x] Commit assembly docs then add `tests/acceptance/plugin-activation.test.mts` and `tests/acceptance/reusable-presentation.test.mts`, using TypeScript test classes bound to the runner. Fixtures are genuine owner-built archives; Platform only assembles public interfaces. Establish intended behavioral red against current pinned artifacts.
- [x] Execute built `trsd plugin install` to add the fifth service and two instances; verify exact selected provider/probe/binding identities, new private service direct protocol, unchanged existing routed status/assets and durable plan/application/status read-back. New public route intent must return edge-reconfiguration action-required until separately qualified. Assert original resource IDs/credential bytes/TLS unchanged, unrelated listeners unchanged and fixture-only cleanup.
- [x] Replace only the exact UI archive candidate, rebuild its matching owner asset/image closure, explicitly authorize the affected API image restart through reviewed plan/apply (no automatic live-image claim), and verify observable browser AND terminal component changes through production roots. Machine JSON/exit behavior remains unchanged. Test keyboard/focus/form, escaping, source-policy negative fixtures, Node/server/secret/script canaries, generation mismatch and awaited cleanup. Source tokens alone are insufficient proof of UI reuse.
- [x] Exercise NPM/Git retry, safe live provider swap, unsafe stateful prepared result, active format-2 refusal/explicit migration, stale/concurrent/uncertain transitions and old reader rejection. No activation success without exact target/resource observations.
- [x] Run all owner gates/builds/program smoke and new assembled commands in mandatory Ubuntu 26.04 CI with actual prerequisites; missing prerequisites fail visibly. Record exact artifacts and failures rather than skipping positive gates. Update all owner changelogs/docs and Platform composition evidence.
- [x] Open reviewed owner/Platform candidates targeting `cordis`, report CI and acceptance evidence and outstanding unsupported cases. Keep every issue open. **Stop for maintainer PR review; do not start Task 3D.** Agent initialization needs its own future review gate and human presentation must use UI.

## Review handoff

Task 3C implementation and functional acceptance are qualified in the independent owner
candidates and exact Platform assembly. See [the review map](../../task3c-review.md) and
[execution evidence](../../task3c-execution-status.md). This is a review handoff, with no merge,
release or Task3D authority. Latest-head CI is recorded on the linked PRs.

Boxes record verified owner delivery, not intent. UI setup is accepted and baseline publication/Task 3C implementation are explicitly resumed. This revision intentionally requires a real generic host, retained-state transition model and reusable UI foundation before claiming extensible installation. Full multi-runtime hot replacement remains Task 4, transport parity Task 5, crash recovery Task 6 and removal/data-retention proof Task 7; Task 3C must report unsupported/action-required boundaries truthfully.
