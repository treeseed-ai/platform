# Cordis composition and provider migration implementation plan

> **For implementing agents:** Use the actual available workflow/testing tools, preserve the user's execution method, and deliver one bounded task at a time. Checkboxes record verified results, not intentions. Retain child-repository setup pauses. **Tasks 3A/3B are integrated. The Task 3C extensible-container/UI revision is reviewed under #722. UI setup was accepted and published; Task 3C implementation is authorized and final candidate verification is in progress. Task 3D remains unstarted.**

**Goal:** Make native Cordis composition, typed selectable providers, package registration and safe live replacement executable requirements across CLI, API, Deployment and Agent before domain migration.

**Architecture:** Each application process owns a native Cordis context with owner-defined class plugins. SDK supplies portable declarations and an explicit runtime export containing a typed locator facade over native Cordis services. Deployment owns exact package acquisition and durable transitions; every runtime mounts accepted bytes through the same registration/selection contracts.

**Tech Stack:** Strict TypeScript classes; native Cordis from a qualified pinned revision; existing Bun-built CLI and pinned Node server boundary; standard package-manager and HTTPS Git source adapters; existing Compose and private journal boundaries. Tool/runtime changes need owner evidence, not incidental upgrades.

**Spec:** [Required composition and provider design](../specs/2026-10-24-cordis-composition-providers-design.md). Tracking: [Platform #704](https://github.com/treeseed-ai/platform/issues/704). This refines [Tasks 3–10](2026-10-23-cordis-platform.md); Tasks 1–2 remain completed historical evidence.

The [Task 3C amendment](../specs/2026-10-24-extensible-deployment-ui-design.md) and [detailed owner plan](2026-10-24-task3c-extensible-plugins-ui.md) propose required reusable UI and generic service instances. They supersede optional UI wording and any interpretation of the Task 3B four-service profile as a permanent limit. The maintainer accepted UI setup, authorized publication and resumed Task 3C implementation, followed by PR review.

The maintainer's PR #723 review selects pure reusable React TSX class components in UI, with native Cordis provider selection and UI-owned browser/SSR/terminal adapters. Astro consumes the React exports; renderer-neutral contracts support future desktop/native adapters without claiming DOM/native equivalence. Identity retains shared Keycloak authority and hosts retain session/token custody. UI setup review/publication is complete and Task 3C is explicitly resumed; see the detailed Task 3C amendment/plan and [execution evidence](../../task3c-execution-status.md).

## Global constraints

- Every human-facing browser/server/terminal surface consumes UI-owned class providers. Admin/CLI keep domain view models and authority; SDK machine contracts remain separate. UI initialization/review and baseline publication are complete; Task 3C candidates retain the separate Agent initialization/review gate.
- Cordis roots are required in CLI, API, Deployment worker and Agent. A manually assembled class graph cannot satisfy this gate.
- ServiceLocator is a typed native-Cordis facade; no parallel DI graph, service instance cache, provider lifecycle or static provider-switch catalog.
- Provider adapters at each meaningful seam; invariant exceptions require a reason in the owning issue and the spec's seam ledger.
- `trsd plugin install <NPM package|Git repo>` installs and activates when safe. Prepared, pending or recovery-required is not successful activation.
- Explicit target and exact provider selection; no ambient account/grant/provider fallback. Installed, selected, active and ready are distinct.
- Acquisition/build precedes exact local planning; package scripts cannot run in the live installation. Preserve supported Task 2 lock/OCI constraints until a reviewed schema change.
- Preserve independent canonical repositories, public exports, licenses, TreeDX's existing service, original checkouts/services and all long-lived branches.
- Each owner issue maps exact legacy capability/source → same-owner plugin/export → outside-in test before code. New eligible owner setup still stops for review.
- Feature branches start from freshly fetched/live-verified origin/cordis; PRs target cordis and use Part of references. All issues including #678 stay open. No automatic integration, release or cutover is authorized by this design.
- For each slice: documentation/contract commit → outside-in red → integration/unit tests → minimal implementation → complete owner checks/build/program smoke → exact assembled acceptance and CI → review handoff.

## Review focus

1. Compiled CLI loads a separately installed provider without an external JS runtime, duplicate Cordis singleton or cwd dependency; Task 3A owns this proof.
2. Two contexts/providers accidentally cross tenant, installation, credential or generation boundaries; Tasks 3A, 3D and 5 own denial tests.
3. NPM/Git source movement or lifecycle scripts change accepted bytes or execute in the live installation; Task 3C owns source/build canaries and immutable retry tests.
4. A call/job retains a retiring provider, or cleanup logs an error but activation claims success; Tasks 3D and 4 own lease/drain/disposal tests, Task 6 crash recovery.
5. API/worker/browser generations only partly change, or old Task 2 private state is silently adopted; Tasks 3B–3C, 4 and 6 own version/multi-target read-back tests.

## Proposed file and export ownership

All paths below are inside the named independent repository, except Platform docs/composition/tests. Names are planned files and methods, not existing exports to import now. Retain existing `src/contracts.ts`, `src/main.ts` and `src/diagnose.ts` public compatibility where possible; split only along these responsibilities.

| Owner | Files / responsibilities |
| --- | --- |
| SDK | `src/providers/contracts.ts`: strict plugin/target/provider/selection/install result schemas, inferred types and `CapabilityToken<T>`; `src/runtime/cordis-composition.ts`: `CordisComposition`; `src/runtime/service-locator.ts`: `CordisServiceLocator`; explicit `./runtime` export; generated projections and semantic source policy |
| CLI | `src/main.ts`: real `CliApplication` root; `src/plugins/{core,commands,output,configuration}.ts`: core typed capabilities; `src/commands/plugins.ts`: `PluginCommands`; `scripts/build-cli.ts`: standalone external-plugin qualification |
| Deployment | `src/plugins/deployment.ts`: native class provider; `src/application.ts`: `DeploymentApplication`; `src/plugins/manager.ts`: `PluginManager`; `src/plugins/sources/{npm,git}.ts`: source adapters; `src/plugins/build.ts`: controlled builder; `src/plugins/registry.ts`: private accepted descriptors; `src/plugins/transitions.ts`: durable admission/generation coordination; apply/worker/journal modules retain host ownership |
| API | `src/platform-application.ts`, `src/main.ts`, loader and operation/transport plugins; consume SDK runtime and public Deployment package |
| Identity | `src/` owner-defined identity class plugin, protocol adapter and authority checks |
| Admin | Authorized feature view models, data/session/action adapters and UI contribution declarations; no copied presentation |
| UI | Required browser/server/terminal contracts, reusable components/renderers and browser root; exact asset generation and no server imports into browser |
| Agent | `src/application.ts`, `src/plugins/{handlers,execution,tools,context,reporting}.ts`: real root/execution child and typed provider contracts; owner program/contract suites |
| Platform | `composition/` exact reviewed owner artifacts and schema versions; `tests/` assembled built-program/installed scenes; architecture/docs only, no runtime helpers |

## Execution and verification protocol for every slice

Existing SDK/CLI/Deployment owners currently expose `bun run verify` (check, build, unit, integration and smoke). Preserve those meaningful gates and existing Task 1–2 program checks. New owners must document and implement nonempty equivalent scripts in their own setup-approved issue before execution; do not claim an uncreated command ran.

Current Platform regression command is `node --test --test-concurrency=1 tests/skills/*.test.mts tests/task1-composition.test.mts tests/task2-planning.test.mts` under the existing qualified Node toolchain. New assembled scenes are added in their owner's slice and recorded in composition/CI; complete owner prerequisites run before those scenes. Native positive gates must not skip when dependencies are missing. No new runtime proof is executed in this documentation delivery.

## Task 3A: Prove native composition in CLI and local Deployment

**Files:** SDK provider contracts/runtime export and tests; CLI composition/core plugins/build/program tests; Deployment plugin/default-construction tests; Platform exact composition and assembled program tests.

**Interfaces:** consumes current `DeploymentHost.diagnose/plan` and seven SDK bindings. Produces the spec's `CapabilityToken<T>`, `ProviderRegistration<T>`, `ProviderSelection`, `ServiceLocator.acquire/describe`, `ProviderLease<T>` and `CordisComposition.start` contracts. `CliApplication` remains the public CLI construction class and mounts a real Deployment provider through Cordis.

- [x] Create/adopt owner issues, pin a new contract version in SDK, define exact export/descriptor shapes and map legacy capability sources. Update/commit owner docs and inherited architecture guidance before tests. Do not rewrite Task 2 historical pins.
- [x] Write `compiled_cli_uses_cordis_and_selected_deployment_provider`: invoke the actual built binary with an approved fixture provider whose diagnostic result identifies its exact implementation/generation; verify unchanged CLI envelope and no API dependency. Missing Cordis activation rather than a broken fixture is the expected initial failure.
- [x] Write `installed_cli_provider_works_without_node_bun_or_cwd_modules`: import a separately installed generated ESM archive and dependencies from immutable paths; prove the CLI and plugin share the qualified Cordis service identity. Verify help/version remain engine-free, foreign cwd/config isolation, spaces/Unicode, dependency removal and awaited cleanup.
- [x] Add same-contract two-provider tests, explicit scope selection, missing/duplicate/incompatible blockers, stale lease/post-release calls and consumer source checks prohibiting concrete-default instantiation at public seams. Use native isolation and dependent fibers; no provider instance map.
- [x] Run the new built-program test to establish intended red; record the exact Bun/Cordis/runtime versions and command. Qualify actual external-module loading before choosing its build flags; a failed configuration is not permission to drop dynamic providers.
- [x] Implement minimal native roots/facade/class plugins in each owner, preserving help/doctor/plan behavior and non-activation. No installer, containers or domain catalog expansion in this slice.
- [x] Run all participating owner `bun run verify`, default construction and exact assembled old/new program scenes. Publish reviewed package artifacts and update composition only from verified bytes; obtain native CI evidence.
- [x] Commit review layers with owner issue refs and open bounded PRs targeting cordis. Report actual composition/cleanup evidence and hand back before Task 3B.

**Deliverable:** CLI and packaged local Deployment really use Cordis; installed provider bytes can be loaded by the standalone executable. No fake-injected graph is the only evidence.

Local Task 3A verification is recorded in its [delivery](2026-10-24-task3a-native-composition.md) and Platform #708. Task 3B delivery is recorded below; Task 3C candidates are implemented and undergoing final acceptance; Task 3D remains unstarted.

## Task 3B: First installed composition and durable host root

**Files:** Deployment application/apply/worker/journal/Compose plugins; API production root/loader; Identity plugin; Admin minimal status/session (historical inline UI, replaced by required UI adoption in 3C); CLI apply/status/application bindings; SDK typed lifecycle/format changes; Platform installed scene.

**Interfaces:** produces `DeploymentHost.apply(planId, digest, options)`, status/application read-back and the fixed worker protocol. Every runtime mounts required services through Task 3A contracts. No owner implementation moves into API.

- [x] Initialize API, Identity and Admin in their own canonical repositories through the parent initializer, using pinned setup; API must receive a fresh cleared cordis worktree just like CLI/SDK/Deployment. See the [Task 3B setup gate](2026-10-24-task3b-initialization.md). Stop for review before scaffolding or dependency installation. After explicit resumption, create owner issues/branches, record legacy mappings and commit owner docs and protocol/format schemas.
- [x] Write `installed_composition_has_real_contexts`: compiled CLI plan/apply → durable application → actual worker/API Cordis roots → actual configured identity flow → HTTPS browser status with required database/identity/edge/server readiness. The worker survives client/server exit. No injected engine/auth/provider satisfies the scene.
- [x] Add intended-red tests for duplicate/missing core provider, wrong scope/engine, concurrent ownership and idempotency conflict. Define/verify installation format migration before writing new registry/active state; preserve Task 2 format-1 plans and reject incompatible old readers truthfully.
- [x] Implement the bounded real composition and fixed worker boundary. The worker mounts approved capabilities; it never accepts arbitrary package-specified privileged commands. Test the worker as a program and the default API constructor with real collaborators.
- [x] Run complete owner gates plus the installed scene, direct/routed resource and asset read-back, and bounded interruption after submission. Revalidate exact artifacts and clean only fixture-owned resources.
- [x] Commit/open owner PRs and Platform pins with explicit review gates. Preserve future transport parity and full recovery work for their own slices.

**Deliverable:** one working installed composition with real Cordis roots and durable host authority. This milestone does not prove all hot replacements or all remote surfaces.

## Task 3C: Extensible container plugins, reusable UI and safe installation

**Detailed execution authority:** the [Task 3C owner plan](2026-10-24-task3c-extensible-plugins-ui.md) implements the [proposed amendment](../specs/2026-10-24-extensible-deployment-ui-design.md). It replaces this milestone's earlier acquisition-only task list; UI setup was accepted and product implementation explicitly resumed. Final candidate verification is recorded in [the execution ledger](../../task3c-execution-status.md).

**Files/interfaces:** SDK format-3 service/binding/profile/transition contracts and portable native composition; Deployment generic graph/engine, resource receipts and `PluginManager.install/select`; UI reusable `./contracts`, `./browser`, `./server`, `./terminal`; Identity/API typed declarations; Admin/CLI UI consumers; Platform exact assembly. Existing seven operations remain unchanged.

- [x] After approval and explicit resumption, initialize only UI in its canonical repository, then **stop for setup review before dependencies/scaffolding/code**. Publish only with explicit instruction. Agent retains its separate Task 3D gate.
- [x] Deliver executable typed service/probe/endpoint bindings with named repeated provider instances. Remove fixed role/count, package-name, image and routing assumptions from generic host code; retain four services as the default profile.
- [x] Deliver required reusable UI providers before extending human surfaces; replace existing Admin HTML/DOM and CLI human rendering with UI public exports. Enforce source/import boundaries and qualify browser/terminal default construction and accessibility.
- [x] Qualify additive activation with stable per-service resource/credential/TLS retention, explicit old-format migration, bounded probes, native leases and truthful pending/recovery results. Unsafe restart/state/issuer/TLS migration requires explicit scope authorization.
- [x] Deliver NPM/HTTPS-Git source/build adapters, managed pinned clean-host helpers, pre-acquisition idempotency receipts, immutable registration and common plan/apply. Preserve source/build trust, scripts-disabled custody and lost-reply guarantees from the provider design.
- [ ] Prove a fifth service, two same-provider instances, a new probe provider without engine edits, unchanged original resources, and UI-only replacement on real browser AND terminal surfaces. Run owner and exact Ubuntu 26.04 assembled/CI gates; open review candidates and stop.

**Deliverable:** exact plugin installation activates qualified safe services/contributions through a generic host, with reusable UI and truthful action-required boundaries. Removal remains Task 7; full recovery Task 6. Documentation approval alone initializes nothing.

## Task 3D: Agent composition baseline without domain execution migration

**Files:** Agent root and provider/handler/tool/context/reporting interfaces/plugins plus real program tests; human view-model adapters consuming UI terminal/browser providers; SDK declarations; Deployment target installer; Platform assembled Agent-context fixture.

**Interfaces:** produces `AgentApplication` and execution child contexts consuming `ServiceLocator`/leases; a harmless capability fixture supplies two interchangeable providers. This is composition infrastructure, not an implemented Work/Agent product or model provider.

- [ ] Select/initialize Agent through the parent initializer in its same canonical repository: a fresh cleared cordis worktree with pinned shared setup, preserved legacy history/license and its own explicit review pause. Do not reuse/clear its legacy checkout, skip this gate because other projects were initialized, or initialize it speculatively in Task 3B. After resumption, map the legacy HandlerRegistry/provider-kernel boundary and commit owner docs for root/child lifetimes, provider pins, isolation and authority.
- [ ] Write `agent_program_uses_selected_registered_provider` and `execution_scope_pins_generation`: start the actual default Agent program; install/select a harmless approved provider through the common manager; execute a bounded fixture task; assert generation identity and child-scope cleanup.
- [ ] Test missing/duplicate handler, revoked resource grant, cross-execution scope leakage, in-flight switch drain, cancellation boundary, stale leases and failing cleanup. A pending execution must never jump to a new provider or credential.
- [ ] Implement the minimum real Cordis Agent root/provider contracts. Keep durable Work authority and all real model/task product capabilities deferred to Task 10.
- [ ] Run owner check/build/nonempty suites/program and assembled target installation. Commit/review exact Agent package pins without claiming model usage, sandbox teardown or domain migration from a harmless fixture.

**Deliverable:** Agent is no longer a future composition exception; its default infrastructure uses the same real provider model before useful domain execution is introduced.

## Task 4: Prove hot replacement and a multi-surface plugin

**Files:** SDK runtime and owner capability suites; CLI command registration; Deployment durable transitions/read-back; API loader/operation registry; Admin browser contributions; Agent harness; Platform installed swap scenarios.

**Interfaces:** existing provider selection and plugin manager; operation registration/invocation contracts from the master plan. No second hot-reload scheduler; native Cordis owns the affected graph/effects.

- [ ] Commit docs for one exact live-safe diagnostic capability with two implementations, bounded admission/drain policy and explicit restart/migration examples. Define a target export map for operation, CLI command and browser contribution.
- [ ] Write `installed_provider_swap_drains_and_reads_back` in CLI, API, Deployment and Agent targets: install A, invoke, hold a lease, install/select B, observe drain, release, observe dependent reload, invoke unchanged caller, verify B's exact generation and A's listener/timer/registration cleanup.
- [ ] Write constructor/disposer/readiness failure, leaked resource, concurrent switch, rejected new admission and crash-before/after-generation-commit tests. Require owner cleanup probes because Cordis can log a disposer error rather than throw it to the caller. Prove no two active writers and no half-advertised catalog.
- [ ] Write `installed_plugin_contributes_operation_command_and_page` using approved exact server/CLI/browser exports and default loaders. Browser assets may require a separate build/restart mode; report it accurately rather than calling every target live.
- [ ] Implement missing transition and contribution behavior, run shared contract suites and every target's built-program/default construction tests, then assembled replacement/resource read-back and CI.
- [ ] Commit/review split PRs by owner/gate size; no arbitrary hot memory patching or claim of distributed atomicity.

**Deliverable:** provider switching is demonstrated in all four runtimes with real cleanup and failure evidence, not only metadata or class substitution tests.

## Tasks 5–10 and cutover

Retain master milestone numbers; their requirements now include this design:

| Task | Additional required composition/provider evidence |
| --- | --- |
| 5: interface parity | Same registered typed operation through REST/SDK/CLI/MCP/browser; local/remote adapters are selected providers; equivalent authority/generation semantics and filtered discovery |
| 6: recovery | Interrupted install/hot swap/worker, lost reply, failed disposal and partial multi-target generation recover one durable application; distinguish pending/recovery-required from active |
| 7: upgrade/removal | Switch NPM/Git provider versions, disable/remove, retain data and referenced artifacts; reject removal of required providers and roll back only proven-compatible state |
| 8: development | Persistent released/candidate/live provider selection and configuration; freeze source/build/closure identities; do not replace live selections silently |
| 9: native distribution | Installed external provider loading, safe replacement and recovery qualify on each native host; no cross-compile-only support claims |
| 10: domains | Projects → Knowledge/TreeDX → Work/Agent; every capability seam decision and real adapter/provider suite precedes migration; migrate exact resource/grant identity and actual artifacts/usage/cleanup |
| Separate cutover | Maintainer-reviewed exact refs/data/recovery/settings plan and explicit execution authority; no automatic legacy replacement, production release or issue closure |

Task 10 must be split into separately reviewed domain plans; Task 3D infrastructure does not imply authorization to introduce those domains early. New capability contracts/providers stay in their canonical owners. An installable package does not itself constitute data or identity migration.

## Review handoff

This plan makes Cordis composition and provider hot replacement required. Task 3A native composition and Task 3B installed composition now have verified owner implementations. Task 3C owner candidates are implemented, with final exact acceptance pending; Task 3D remains unimplemented. The documentation delivery must check local references, Mermaid source structure and contradictions against the spec/master plan; completed Task 3A/3B checkboxes above record observed owner, program and assembled verification. The earlier architecture and Tasks 3A/3B have been accepted and delivered. The maintainer accepted UI setup/publication and explicitly resumed Task 3C. Stop after its final candidate verification for PR review, without merging or starting Task 3D. Agent remains separately gated at Task 3D.
