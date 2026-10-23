# CLI-first Cordis Platform Implementation Plan

> **For implementing agents:** Load the actual configured workflow/testing skills and deliver one bounded task at a time. Each eligible Cordis repository uses the parent initializer and pauses for user review before code. TreeDX remains its existing Elixir/Rust service. Checkboxes below record future work, not passing evidence.

**Goal:** Deliver a standalone CLI that installs and recovers one integrated Cordis platform, then expose its bounded plugin lifecycle through REST, SDK, CLI, MCP and browser actions before adding feature domains.

**Architecture:** An API-owned Cordis host composes trusted plugins from independent owner repositories behind SDK-defined operation/service contracts. One deployment lifecycle serves both the CLI's local bootstrap adapter and the running platform; a host-side worker preserves installation/recovery authority across server replacement. Ship one tested composition with separate explicit source substitutions for development.

**Tech Stack:** Strict TypeScript classes and typed capability contracts; Bun-built CLI; pinned Node.js server container; Cordis pinned after qualification; one maintained schema-to-type/OpenAPI pipeline; Linux containers and Compose; PostgreSQL; existing maintained Identity primitives; a small browser application. No AI project or native Windows executable.

**Spec:** [Platform contract](../../platform-contract.md). Context: [migration reference](../../migration-reference.md), [AGENTS.md](../../../AGENTS.md), [#672](https://github.com/treeseed-ai/platform/issues/672).

**Execution status:** Planning only. Every checkbox below is unexecuted future work. The user's current instruction is **do not implement anything yet**. Use the installed skills when implementation is explicitly requested; saving this plan authorizes no execution, delegation or skill installation. The later kickoff prompt may authorize a bounded task, but cannot bypass a participating repository's setup pause.

## Global constraints

- Build from public journeys downward; preserve the seven initial remote operations specified in the contract. Every catalog addition needs a concrete user journey, owner, exact schema and outside-in test before implementation.
- CLI targets are Linux/macOS x64/ARM64; WSL2 uses the matching Linux executable. Actual support is qualified separately for each host/architecture. Linux is the first managed-host target.
- AI, commerce, general workflow/CRUD/UI designers, fleets, multi-cloud orchestration and arbitrary hot replacement are excluded initially.
- Each eligible existing capability stays in its existing canonical repository and is rewritten on that repository's own `cordis` branch. TreeDX is not rewritten: retain its Elixir/Rust service and integrate its public boundary. Record legacy interface/source → Cordis plugin/export/test mapping in the owning issue before code; no new replacement remote or cross-repository capability transfer is authorized.
- Preserve Platform at the top and independent project repositories under gitignored `packages/{project}`. Functional code/plugins/tests/builds/releases belong in each owner; no combined monorepo or `packages/platform` runtime. Introduce only participating projects. Every eligible replacement repo uses the parent initialize-project skill for a cleared `cordis` worktree and exact shared setup, then pauses for user review/adjustments and explicit resumption before implementation. TreeDX is excluded.
- Preserve original repositories/services, user instructions, skills, credentials, retained work and failed history. Do not execute original environment/deployment commands as migration setup.
- Mandatory architecture: all handwritten Cordis SDK/CLI/services/plugins/deployment/browser/tooling/tests use strict TypeScript classes, with behavior in instance/static methods. No standalone functional implementations, function factories, function-based UI or handwritten JavaScript. Contracts may use interfaces/abstract classes and declarative schemas; callbacks bind methods. TreeDX remains Elixir/Rust.
- Consumers depend on typed capability contracts; constructor injection and Cordis service bindings select class implementations through existing plugin configuration. Missing/duplicate/incompatible required implementations block planning. Reuse native Cordis lifecycle; no second container or speculative provider hierarchy.
- Documentation → tests outside-in → implementation → verified delivery. Browser source may use TSX for class components. Generated output/upstream dependencies/resources are not handwritten parallel implementation.
- One executable schema is authority for types and transport projections. One owner per durable fact. No second plugin loader, package manager, reconciliation engine, job model or status database.
- Controlled candidate activation/restart first. Persistent development selections have no time-based expiry/fallback. Deletion of plugin code does not delete user data.
- Run complete participating-owner unit/integration suites before each real scene/guarantee invocation on the exact candidate. Do not run a live campaign to discover prerequisite failures.
- Unit/integration, build, CI and smoke execution of actual assembled artifacts are separate gates. A cross-compiled file is not native target proof. Never claim missing gates passed.
- Branch/sync/PR migration work through verified `origin/cordis` only. No migration merge into `staging`/`main`, production RC/hotfix/tag/release or automatic cutover. A separately reviewed, explicitly authorized cutover preserves legacy work, adopts the successor as `staging` and restores PR-only promotion to `main`. Keep artifacts/channels isolated; `cordis` is not a deployment environment. Agents never approve or merge `main`.

## Review focus

1. Wrong Docker context, foreign install directory or another platform already using ports/volumes: fail before mutation. Covered in Tasks 1–3.
2. CLI/server dies after a side effect but before acknowledgement: recover the same application and preserve actual active state. Covered in Tasks 3 and 6.
3. Plugin operation/schema/browser output comes from a different candidate or is half-written: reject or retain the prior complete output. Covered in Tasks 4, 5 and 8.
4. Identity, browser origin, local permissions or token scope changes between plan and apply: reauthorize, reject stale authority, never silently fall back. Covered in Tasks 3 and 5.
5. Update/uninstall encounters a persistent development selection or incompatible data migration: retain explicit selection/data and report a blocked/recovery outcome. Covered in Tasks 6–8.

## Proposed file ownership

All paths below are **future files**, not present implementation. `packages/{project}` is an
independent Git repository, excluded by Platform's `/packages/` rule. Before writing anything
inside an eligible new owner, use the parent initializer to prepare its cleared `cordis`
worktree and copied setup, then stop for user review/resumption. TreeDX is excluded.
Create only current-task files after resumption. Plugins remain modules/exports in their owner.

| Owning path | Responsibility |
| --- | --- |
| Platform root declarations/docs | Exact integrated source/artifact selection and public cross-project contracts; no owner runtime duplication. |
| `packages/sdk/src/contracts/{platform,operations,plugins}.ts` | Portable executable schemas, typed bindings and plugin declarations. |
| `packages/sdk/src/client/platform-client.ts` | Portable typed remote caller and problem handling. |
| `packages/sdk/src/runtime/operation-service.ts` | Server-only validation/authorization/dispatch registration helpers. |
| `packages/cli/src/{main,commands,output}.ts` | Built executable, SDK/local routing, human/machine output. |
| `packages/cli/scripts/build-cli.ts` | Standalone binary build, qualified native targets. |
| `packages/deployment/src/{diagnose,host,plan,apply,journal,worker,compose}.ts` | Shared read-only diagnostics, one installation lifecycle and fixed host/engine boundary. |
| `packages/deployment/src/development/{selection,freeze}.ts` | Persistent selection and immutable candidate production. |
| `packages/deployment/scripts/package-platform.ts` | Package exact accepted owner artifacts into the integrated composition. |
| `packages/api/src/{platform-application,main}.ts` and transport/loader modules | Cordis production composition root, executable server, REST/MCP integration and default loader. |
| `packages/identity/src/` | Required identity/principal/session plugin. |
| `packages/admin/src/` | Browser shell, status/application pages, server actions and browser contribution integration. |
| `packages/ui/src/` | Shared browser components, no duplicated auth/domain policy. |
| `packages/api/fixtures/plugins/diagnostic/` | Test-only server/page contribution; built through public SDK/UI dependencies, not sibling source imports. |
| `packages/{project}/tests/{smoke,integration,unit}/` | That owner's program, public/default-construction boundary and contract/logic tests. |
| Platform `tests/acceptance/`, `tests/integration/`, `tests/support/installation.ts` | Assembled artifact/Compose/browser qualification and disposable installation fixtures, not another runtime. Use existing Reviewer format if introduced through its setup gate. |
| Platform `.github/workflows/verify.yml` and owner workflows | Independent owner gates plus exact-composition verification. Production release remains disabled during migration. |

Core, Agent, Reviewer and remaining projects keep separate `packages/{project}` repos
when their slice needs them. TreeDX remains its separate existing Elixir/Rust service and is
not cleared/initialized for Cordis. Core is the optional reader, not the new host. AI is excluded.
Each owner has its own manifest/lock/tests/build/commits/PR/releases; Platform pins the exact
accepted closure. Never import a sibling's TypeScript source through relative paths or make
a root workspace source link the production dependency. The shared Deployment implementation
is consumed by CLI and API as the same resolved package/artifact, not copied adapters.

## Verification vocabulary to establish

Task 1 must define meaningful owner script names where needed, not a root monorepo toolchain. Run owner commands in `packages/{project}` and retain exact candidate results. Platform orchestration consumes those results/artifacts and runs assembled checks. These command names describe the proposed verification vocabulary, not existing evidence:

| Command | Required meaning |
| --- | --- |
| `bun run check` | Strict type/static/source-boundary and class-architecture checks, plus generated-contract drift validation. |
| `bun run build` | Build that repository's distributable artifacts with pinned tools; composition packaging consumes the exact SDK/CLI/server/browser/Deployment closure. |
| `bun run test:unit` | Complete that owner's current unit/contract suites, with zero failures/skips/todos/empty results. |
| `bun run test:integration` | Complete that owner's real current boundary suites, including default production construction. |
| `bun run test:smoke` | Spawn actual built CLI/server artifacts, assert stdout/stderr, exit status and effects; no exported-function substitute. |
| `bun run test:acceptance` | Existing owner-based prerequisite gate followed by real assembled-composition scenes on an exact candidate. |
| `bun run verify` | Checked orchestration of applicable checks/build/unit/integration/smoke; explicit missing prerequisites/targets. |

Do not create empty passing suites or placeholder acceptance commands. Add a script only when it has meaningful owned tests. CLI owns the `CliProgramFixture.run(args)` built-program fixture. Platform assembled fixtures expose `InstallationFixture.read()`, `.probe()`, `.terminateWorker()` and `.cleanup()` in its `tests/support/installation.ts`; these use built programs and the real chosen engine, never fake readiness. Expected unavailable environments are reported as blocked gates, not skipped green acceptance.

The outside-in order concerns **test authoring**. First write the user-observable scenario, then focused regression/integration/unit cases. Demonstrate intended red with the built-program smoke/contract harness. Do not launch a real acceptance campaign until its current candidate's complete prerequisites pass. A missing binary, syntax error or broken fixture must be classified separately from the intended behavioral failure.

## Task 1: Lock the public vocabulary and standalone diagnostic binary

**Files:** Platform contract/composition instructions; SDK `src/contracts/{platform,operations}.ts` and owner tests; CLI `src/{main,commands,output}.ts`, `scripts/build-cli.ts`, `tests/smoke/cli-program.test.ts`, `tests/integration/default-cli.test.ts`; Deployment `src/diagnose.ts` and real diagnostic tests. Each owner gets its own tool pins, manifest/lock and strict configuration after setup. Update owner docs with actual commands before code.

**Interfaces:** consumes the contract's command/exit-code catalog. Class composition produces `OperationDefinition.define(definition)`, portable seven-operation bindings, `CliProgramFixture.run(args)` test fixture and a compiled `trsd` with version/help/doctor only. Deployment owns `DeploymentHost.diagnose(configuration?)`; CLI invokes that same packaged implementation. No successful install/apply path exists yet and unsupported commands must say so.

- [ ] Invoke Platform's initialize-project skill only for `packages/cli`, `packages/sdk` and `packages/deployment`: independent cleared `cordis` worktrees with exact shared setup excluding the initializer. Report paths/refs/license exceptions and STOP for each user review/adjustments and explicit resumption. Do not scaffold code or dependencies while waiting.
- [ ] Make owner compiler/lint checks enforce the TypeScript/class source policy, with positive class/method cases and rejected handwritten JS, standalone functions/factories and functional UI. Use semantic AST checks in the actual installed toolchain; do not introduce an empty/regex-only architecture gate.
- [ ] Specify typed class contracts and owner classes before code: CLI `CliApplication`/`CliOutput`, SDK `OperationDefinition` static binding methods, Deployment `DeploymentHost` contract/`ComposeDeploymentHost` diagnostics. Tests/fixtures/build tooling are classes too; no function-based scaffold.
- [ ] Document one exact toolchain and first native Linux target, after checking official sources and the current host. Preserve dependency pins/lock and record Cordis candidate revision; no speculative broad platform support claim.
- [ ] Write `cli_reports_identity_and_checks_without_mutation`: spawn the compiled binary from another working directory and a path containing spaces; assert exit 0 for help/version, documented JSON envelope for doctor, zero created configuration/credentials/containers and stderr free of secrets. Test a symlinked executable and closed stdin.
- [ ] Add `doctor_rejects_wrong_engine_and_foreign_installation`: actual configuration points to an unexpected remote engine/foreign directory; assert blocker and exit 3 before changes. Test missing engine/Compose, unsupported architecture, occupied port and permission denial. Test unknown command/flag → exit 2 and actionable help.
- [ ] Add strict schema/unit cases for all seven IDs, exact fields, invalid/missing/unknown values and effect/exposure policy. Add a real default CLI construction test with no collaborator injection.
- [ ] Build the binary, run smoke to classify intended red, implement only CLI parser/output, Deployment read-only diagnostics and SDK contracts, then run complete current unit/integration, check/build and smoke. Record actual commands/hashes; no Docker/application lifecycle claim.
- [ ] Commit docs → tests → implementation separately with the task issue reference. Verify/push/PR under the current workflow; do not merge main. This gate proves a distributable front door, not an installed platform.

## Task 2: Resolve exact composition and produce non-activating plans

**Files:** Deployment `src/{host,plan,journal}.ts`, owner plan validation/integration tests; SDK platform contracts; CLI command binding and built plan smoke; Platform exact-composition declarations. Paths are relative to each independent owner repository.

**Interfaces:** consumes Task 1 bindings/diagnostics. Produces `DeploymentHost.plan(configuration) → Plan`, where Plan binds ID/digest, installation/expected active composition, resolved immutable artifacts, effects and blockers. Returns no active/healthy state. `platform.plan` local binding calls this implementation.

- [ ] Specify the smallest deployment configuration: installation identity, selected local engine, owned storage, loopback origin, required plugins and artifact sources. Generate types/reference from executable schemas. Use standard locks/metadata; no parallel dependency solver.
- [ ] Write `plan_changes_no_runtime`: run the compiled CLI against a real owned fixture and immutable prepared release inputs; assert plan contents/read-back, exact image/package/configuration identities and no containers/ports/credential activation. Persisting private plan state is the only declared write.
- [ ] Test mutable/digest-mismatched artifacts, malformed/foreign journals, duplicate/missing/cyclic plugin services, unsupported image architecture and invalid secret references. Reject secret plaintext in the plan output/logs. No arbitrary package lifecycle scripts execute during inspection.
- [ ] Test default resolver/host wiring using actual package/artifact/configuration files. Unit tests pin deterministic normalization/digests; same logical inputs give the same resolved content; non-equivalent inputs cannot share a plan digest.
- [ ] Demonstrate red, implement exact resolution/private plan persistence, then run complete participating owner suites/checks/build plus assembled built plan smoke. Commit layers in their owning repositories and publish linked bounded PRs; Platform records the exact integrated closure.

## Task 3: Install and start the first integrated composition

**Files:** API `src/{platform-application,main}.ts` and real-wiring tests; Deployment apply/worker/Compose modules, resources and lifecycle tests; Identity plugin and owner tests; Admin minimal browser/status integration and server actions; UI components if needed. Platform owns assembled installation fixtures/scene and exact candidate selection. Each eligible new owner uses the initializer and pauses for user review first; TreeDX is excluded.

**Interfaces:** consumes Plan and the local CLI adapter. Produces `DeploymentHost.apply(planId, digest, options) → ApplicationRef`, `status()`, `application(id)` and the first production Cordis host/status endpoint. The fixed host worker owns lifecycle through app restart. Initial readiness requires the actual identity integration, database, server, edge and browser assets.

- [ ] Write the installed-user scenario first: compiled CLI plan/apply; poll the same application through the compiled CLI; authenticate through the actual configured issuer; open the installed HTTPS browser status; assert required service readiness and exact active composition. No injected auth/provider/Compose fake may satisfy this scene.
- [ ] Add default production construction tests for `PlatformApplication` and `DeploymentHost` with real collaborators. Test host lifecycle worker as a program, including invalid protocol input and denied local ownership.
- [ ] Pin and test one supported identity integration using current maintained primitives. Reject wrong issuer/audience/client/scopes; initial setup is bounded by local authority and never creates a fallback remote password/token issuer. Test callback/CSRF/cookie/server-token custody.
- [ ] Apply under installation-scoped cross-process exclusion; assert simultaneous CLI/server apply cannot both own activation. Same idempotency key+same request returns one application; changed payload conflicts. Changed active composition rejects the stale plan before writes.
- [ ] Implement only what this complete journey needs. Direct/routed probes and browser asset identity must observe real installed outputs. Connection/download/credential/migration/health failures preserve actual state and a safe diagnostic.
- [ ] Run complete current prerequisites before real scenes. Check/build/native program smoke, then the installed scene; record owned-resource inventory before/after cleanup and exact release/engine/tool identities. A created container or HTTP 200 alone cannot satisfy readiness.
- [ ] Commit/review the complete slice. Do not claim macOS/WSL2, update or recovery yet. Decompose the PR if its source scope or CI time prevents independent review; keep one meaningful installed outcome as the milestone.

## Task 4: Install a real diagnostic plugin through Cordis

**Files:** SDK plugin contracts/runtime operation helper; API production loader and diagnostic plugin fixture/default-loader integration; Deployment plan/packaging closure; Admin browser-contribution integration; Platform installed-plugin smoke/scene. Each implementation/test remains in its owning repo.

**Interfaces:** consumes the running composition and SDK operation bindings. Produces `OperationService.register(binding, handler) → disposer`, `invoke(binding, input, request)`, plugin metadata/configuration contract and bundled browser contributions. Use Cordis injection/effects, not a second runtime.

- [ ] Write `installed_plugin_contributes_one_operation_and_page`: plan/apply an exact diagnostic package; observe it ready in describe/status; invoke its typed read operation; open its installed page; verify server/browser assets refer to the same candidate.
- [ ] Prove class substitution with two diagnostic fixture implementations of the same typed capability: same contract suite and consumer, reviewed config selection through plan/apply, real Cordis activation/restart, result read-back and prior-instance disposal/drain. No new provider registry or caller changes.
- [ ] Test missing/incompatible dependency, invalid/unknown config, duplicate ID/route/tool name, constructor/registration failure and disposal error. Reject removal of mandatory plugins or required dependencies. No half-registered public contributions remain after a failed mount.
- [ ] Execute default loader with actual installed package exports; test configuration validation, startup dependency availability, teardown and restart. Injected unit graphs are additional tests only. Verify browser bundle contains no server/credential imports.
- [ ] Demonstrate red, implement the minimal loader/registry/build contribution, then run complete current suites/build/smoke and fresh scene prerequisites. Record actual disposal and owned-resource closure, not only a disposer call count.
- [ ] Commit/review without advertising general dynamic hot loading, marketplace installation or governed agent execution. The plugin is a composition fixture only.

## Task 5: Prove REST, SDK, CLI, MCP and browser parity

**Files:** SDK typed client/generated projections; API REST/MCP adapter modules; Admin server actions; CLI remote binding; each owner's real boundary/contract tests; Platform assembled five-interface parity scene.

**Interfaces:** consumes Task 4's registered operation source. Produces `PlatformClient.invoke(binding, input, options?) → typed output`, published REST/OpenAPI/MCP bindings, operation-filtered discovery, browser server actions and remote CLI invocation. Preserve the exact seven remote platform operations.

- [ ] Write a parameterized installed scenario invoking the same diagnostic operation with equivalent principal/scope/input through all five surfaces; assert equal semantic result/schema identity. Compare structured validation, denial, stale-state and unavailable-dependency errors too.
- [ ] Read actual generated OpenAPI/MCP declarations, execute real MCP initialize/list/call/auth-denial and SDK calls against the installed service. A catalog string assertion alone cannot pass.
- [ ] For lifecycle mutations, compare local bootstrap and remote invocation of the same implementation with identical idempotency/conflict behavior. Test request disconnect/lost response followed by application read-back, with no duplicate side effect.
- [ ] Exercise browser CSRF/same-origin checks, hostile forwarded auth/service headers, expired/refreshed sessions, principal/token scope changes and permission-filtered navigation/discovery. Keep tokens outside HTML/storage/browser JSON/logs.
- [ ] Bind transport/browser/CLI class methods to the same typed operation classes; functional handlers or UI components must not become a second implementation.
- [ ] Implement/check projections from one schema authority; fail generation/CI on drift. No handwritten second path or permissive fallback output. Run full prerequisites, actual client/program/browser flows, complete suites and packaging checks.
- [ ] Commit/review the tested parity slice. Report negotiated protocol/tool versions and original failed observations; do not generalize one failed adapter configuration into a library limitation.

## Task 6: Interruption, cancellation and host recovery

**Files:** Deployment apply/journal/worker/host and owner failure/recovery tests; CLI recovery/events commands and built smoke; Platform assembled interruption/cancellation/recovery scenes.

**Interfaces:** consumes durable ApplicationRef/journal and same deployment lifecycle. Produces `events(id, cursor)`, `cancel(id)` and protected local `recover(id)`. Recovery is not a new anonymous remote operation and cannot bypass installation ownership.

- [ ] Write `recover_same_application_after_acknowledgement_loss`: kill only the fixture-owned CLI/server/worker in turn after staging, after activation and before success recording; rerun the same request/local recovery; assert one application/effect, preserved history and truthful current composition.
- [ ] Cover crash boundaries before/after every external lifecycle phase; double recovery contenders; engine disappearance/restart; corrupted/incomplete state; stale ownership; lost credentials; disk-full/journal write failure. No elapsed-time lock stealing or blind command replay.
- [ ] Test cancel before staging, while draining, during activation and after terminal completion. Assert safe actual runtime/data state and deterministic duplicate requests. Cancellation must not falsely attest rollback or teardown.
- [ ] Test migration compatibility failure and recovery refusal: the old writer never starts on an unproven schema. Retain retained inputs and diagnostics; an uncertain state is blocked, never healthy.
- [ ] Test ordered cursor replay across worker/server restart, duplicates, foreign application, invalid cursor and history retention resync. Browser and NDJSON consumers preserve request/application identity.
- [ ] Implement only missing transitions, run complete relevant suites/build/program smoke and fresh prerequisite-gated failure scenes. Independently inspect exact fixture-owned resources before cleanup; preserve failure events/artifacts.

## Task 7: Controlled plugin upgrade, removal and data retention

**Files:** Deployment plan/apply/packaging and data-retention tests; API dependency/loader compatibility tests; Admin change-review view; CLI built update commands; Platform installed upgrade/removal scenes.

**Interfaces:** consumes Tasks 2–6. Produces reviewed plugin changes through existing plan/apply; no separate upgrade/uninstall reconciler. Disable/removal changes selection/code availability while retaining owned data by default.

- [ ] Prepare two immutable diagnostic package/browser versions with a small persisted record. Write `upgrade_and_remove_preserve_data`: installed v1 → reviewed v2 plan/apply → status/operation/page v2 read-back → disable/remove → retained record → reinstall retrieves the same authorized record.
- [ ] Test conflicting/incompatible dependency/migration, bad integrity, unsupported architecture, broken browser build, failed readiness and missing prior recovery artifact. Refuse or recover under the same declared safety policy.
- [ ] Assert affected drain, restart and routes; unrelated fixtures/services/volumes remain unchanged. Required bootstrap/recovery plugins cannot be removed. Never call global Docker prune or filesystem cleanup.
- [ ] Run complete default-construction/integration/unit/build/smoke and installed update/removal scenes. Verify actual images/assets, active selection and preserved data, then independently clean only owned fixtures.
- [ ] Commit/review; do not describe missing-data deletion or arbitrary live replacement as implemented.

## Task 8: Persistent development selection and exact promotion

**Files:** Deployment development selection/freeze and host binding; CLI development command module/program tests; each affected owner's rebuild/freeze tests; Platform exact candidate promotion/consumer scene.

**Interfaces:** consumes one lifecycle authority and plugin/package identities. Produces explicit `released/candidate/live` selection and frozen candidates preserving exact source/recipe/dependency generations. No timed session expiry and no second CLI state authority.

- [ ] First document the bounded CLI command additions and desired-selection fields, linked to this concrete journey; add their typed contracts/help before implementation. Do not bolt on the complete legacy workset API.
- [ ] Write `selected_source_survives_restart_and_unrelated_update`: select the diagnostic plugin source, change it, rebuild complete output, observe affected consumer update, restart host/app and update an unrelated plugin; assert the explicit source selection persists and old released code never replaces it.
- [ ] Add intended-red regression for checkout change without compiled-output change; assert status distinguishes source/build/consumer identities and cannot report the source commit as executed output.
- [ ] Test partial/failed build, overlapping builds, changed source during freeze, dirty/untracked bytes, moved/symlinked output, missing dependency generation and changed artifact after verification. Preserve prior complete outputs or block readiness.
- [ ] Freeze, run complete prerequisite-gated candidate verification, promote identical package/image/browser bytes and read back the actual installed closure. Do not rebuild at promotion or discard persistent selection implicitly.
- [ ] Commit/review with exact artifacts/source identity and preservation/cleanup evidence.

## Task 9: Qualify distribution and supported host matrix

**Files:** CLI `scripts/build-cli.ts` and native program smoke; Deployment `scripts/package-platform.ts`, architecture/image closure checks; owner CI/artifact workflows; Platform assembled native qualification/support matrix and composition CI. No production publication is enabled.

**Interfaces:** consumes the proven Linux composition. Produces four target CLI binaries where native qualification exists, exact matching service images/browser payloads, release integrity metadata and a compatibility-checked CLI/server contract. WSL consumes Linux binaries; no native Windows build.

- [ ] Write installed-artifact tests before porting host details. For each target, download/use the exact prepared binary, run help/doctor and complete install/update/recovery with the default production wiring; record native host/CPU/engine context/version and filesystem.
- [ ] On desktop hosts test paths with spaces/non-ASCII, executable permissions/signature/trust, source watches, localhost/callback/TLS behavior, resource limits and engine/sleep/restart interruptions. WSL uses Linux-hosted sources and verifies Windows browser access. No silent engine/emulation fallback.
- [ ] Run the actual Bun compile invocation with pinned version/options and required optional/native dependencies. If it fails, preserve the configuration, search primary sources and diagnose; no unsupported generalization or abandoned type checking.
- [ ] Add native built-artifact smoke jobs to CI. Missing runners/credentials/signing/Compose access remain unproven targets; do not create passing skipped jobs. Release actions promote exact accepted bytes with independent read-back, not rebuild.
- [ ] Establish isolated migration package/image/tag names and current license notices before publication. No overwrite of existing latest channels or public production promotion. Production main approval/merge/tag authority remains disabled for migration until the explicit cutover; completing this task does not authorize promotion.

## Task 10: Introduce the first useful domain plugins

**Files:** Bounded feature contracts before code; project/work authority in API-owned capability plugins, knowledge integration at the trusted API/TreeDX boundary, and scoped execution in Agent. Keep Core/Reviewer/templates and other existing projects in their own repositories when needed. Each eligible new owner checkout uses the initializer and pauses for review before implementation; TreeDX retains its service and own workflow.

**Interfaces:** Projects supplies canonical project/source/library identity. Knowledge supplies exact-ref read/search/context/edit/review/publication and artifact retrieval through one trusted TreeDX adapter. Work supplies accepted authority/results/usage; Agent provider supplies scoped physical execution. Git delivery retrieves and independently verifies the actual approved product before integration.

- [ ] Create the smallest project/library journey issue and bounded feature spec; split implementation tasks at independently verifiable outcomes. Confirm no field/operation is copied from legacy without a current journey.
- [ ] When Agent/Core/Reviewer/etc. is introduced, initialize only that existing owner with the parent skill, then stop for user review/resumption. Do not apply it to TreeDX: consume the existing Elixir/Rust service through SDK/API public adapters and use TreeDX's own instructions for changes.
- [ ] Author exact-ref knowledge tests before implementation, then a real task → independent review → retrieved artifact → integration → measured usage/one settlement/physical cleanup scenario. Preserve failed/unfinished attempts; no fake timing/usage/products.
- [ ] Keep engine/provider execution separate from durable project authority; agent identities/prompts/permissions are governed YAML and arbitrary renamed agents must work through the same handler binding.
- [ ] Run each feature's complete owning suites plus integrated scenes on exact candidates before replacement. Opt in and read back data/identity migration before retiring original services. Preserve licensing and all retained evidence.

## Delivery handoff and current verification limits

This documentation delivery creates no files from the proposed implementation tree, test harness, workflow or release bundle. Its validation concerns documentation links/anchors, cross-document naming, required coverage, whitespace and preservation of user setup. There are no new unit/integration/build/smoke/acceptance results to report.

Future tasks load the configured release-workflow at start and before completion, create/adopt an issue, use a feature branch off the authorized integration baseline, update docs/changelog first, commit outside-in test and implementation layers, verify actual artifacts, and retain CI evidence. Do not run example commands copied from a generic skill when this project has no corresponding toolchain/script. PR testing boxes describe actual observed results; unrun gates stay unproven. Keep issues open until the applicable release policy closes them.

The current maintainer asked for instructions only. Deliver the reviewed plan and stop; do not begin Task 1, install execution skills or ask for immediate implementation approval as part of this documentation task.
