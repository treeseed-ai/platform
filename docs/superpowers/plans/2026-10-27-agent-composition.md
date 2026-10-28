# Seed-driven Agent Capacity Provider implementation plan

> **For implementing agents:** Use the actual workflow/testing tools, preserve the maintainer's execution method and deliver bounded independently reviewable slices. Checkboxes record verified results, not intentions. Preserve child setup gates; the nine existing Cordis repositories are already initialized.

**Goal:** Deliver separate native Agent manager/worker services, real virgin warm Kata capacity, extensible activity profiles and setup providers, seed-driven host composition, and the critical readable-capability-layer rule across all nine Cordis owners.

**Architecture:** API owns headless seed coordination; SDK owns portable contracts. Agent owns manager/kernel, worker/pool/runner and activity/environment/handler capabilities. Deployment supplies common artifact management, infrastructure custody and bounded host operations; it never embeds the Agent root in its durable worker. CLI consumes exact public packages and UI owns presentation.

**Tech Stack:** Strict TypeScript classes, native Cordis, current qualified Node/Bun/Zod tooling, pinned prettier@3.6.2 for development-only canonical method measurement, Ubuntu 26.04 x64/KVM/containerd/Kata qualification and immutable public archives.

**Spec:** [Agent architecture](../../agent-architecture.md), [seed architecture](../../seed-architecture.md), and [Task 3D amendment](../specs/2026-10-27-agent-composition-design.md). Portfolio #773; existing SDK #482/PR #483, Agent #525, Deployment #1011 and UI #101. Policy issues: Platform #781, CLI #327, SDK #485, Deployment #1013, API #642, Identity #55, Admin #148, UI #102, Agent #526.

## Global constraints

- Real Work/model execution, productive handlers and accounting remain Task 10. Production team/project/repository creation and data migration remain domain work.
- Real existing-team connections use the existing control plane's public team/enrollment APIs and existing Keycloak approval plus signed provider-credential exchange. Do not migrate Team authority, create an alternative issuer or mutate legacy sources/services.
- Preserve all owner repositories, long-lived branches, licenses, API committer policy and current unmerged work. Do not reinitialize Agent or rewrite SDK #483 history.
- Native Cordis resolves providers/effects/lifetimes. The locator and metadata catalogues are not parallel resolvers, caches or schedulers. Contexts do not cross processes or provide isolation.
- New/changed methods, constructors and accessors: at most 20 canonically formatted body lines, excluding blank/comment-only lines and outer delimiters; exact reviewed exceptions only. Refactor affected behavior/context and explicitly directed cleanup scope. Declarative schemas/data are outside the behavioral count; do not compress statements or invent trivial wrapper classes.
- Offline setup by default; only declared destinations allowed by host policy and assignment grants. No ambient lifecycle script runs in the live install.
- Every issue including #678 stays open. PRs target cordis and are handed back for review; no merge, production publication or cutover authorization.
- Permanent tests use tests/acceptance, tests/regression, tests/integration and tests/unit with behavior names; support contains no registrations. Keep historical artifact bytes and provenance unchanged.
- Real Kata acceptance requires a qualified Ubuntu 26.04 x64 KVM venue. GitHub-hosted ubuntu-26.04 passed the initial KVM/real-Kata-guest/cleanup qualification through Platform #791/#792 (run 40594996161); general unsupported nested-VM status does not prove inability. Use hosted Ubuntu for full Agent qualification. If a required configuration later proves unsuitable, isolated self-hosted provisioning (labels self-hosted/linux/x64/cordis-kata) remains an explicit fallback prerequisite. Do not register the workstation implicitly. The full runtime gate cannot be replaced by schema-only checks.

## Review focus

- A seed needs a provider before its resource can be validated: resolve/verify its exact closure, then run accepted validators in a restricted disposable preparation environment before saving the executable-bound plan.
- An install succeeds and resource reconciliation fails: retain exact linked owner receipts in one private seed journal and resume verified steps; never claim global atomicity or destructive rollback.
- A provider/base/environment changes while warm sandboxes exist: discard affected unused bases, retain in-flight generations through verified destruction and require explicit restart unless a transition is qualified.
- A process restarts after a stored active acknowledgement: close readiness/admission until fresh runtime and authority read-back succeeds.
- Existing-team authority or required KVM venue is unavailable: fail visibly; fixture grants and ordinary containers cannot substitute for those boundaries.

## Slice 1: shared readability policy and checker

**Interfaces:** shared development-only release-workflow helper; immutable verified-origin/cordis method fingerprints; exact exception records; owner normal check/CI invocation. No shipped runtime reads AGENTS.md or private target instructions.

- [x] Inventory current branches/worktrees/dirty state and verify all nine HTTPS origin/cordis heads. Existing drafts retained.
- [x] Create nine independent policy issues and feature worktrees; commit identical critical AGENTS rule and release-workflow guidance before implementation.
- [x] Observe control: the previous guidance has no method-size, contextual refactoring, compressed-code, baseline or exception gate.
- [x] Write acceptance/program checks for changed long methods, compressed statements, unchanged debt, baseline tampering and stale/unused exceptions; verify failures before implementation.
- [x] Implement canonical formatter/AST checker, pinned baseline provenance and owner wiring. Include tooling/tests/fixtures; exclude frozen artifacts, generated outputs and upstream resources. Preserve owner-specific instructions.
- [x] Run normal owner checks/build/applicable tiers and copied helper programs, then open bounded policy candidates against cordis. Future setup copies helper resources without dependencies/scaffolding; first implementation wires the gate.

## Slice 2: durable architecture and migration documentation

**Interfaces:** stable Agent/seed references linked by owner docs and portfolio plans; implemented/fixture-only/deferred ledger; legacy-to-same-owner capability map.

- [x] Commit approved references, replace obsolete embedded-Agent hosting text, and correct current migration/kickoff/README status before new runtime tests/code.
- [x] Document exact process/IPC/trust boundaries, package/provider map, profile concepts, warm-pool generations, setup/network policy, enrollment compatibility and seed partial recovery.
- [ ] Verify links and eliminate conflicting current Task 3D requirements while retaining historical evidence.

## Slice 3: SDK portable contracts

**Interfaces:** versioned SeedBundle/SeedPlan/SeedReceipt, capacity configuration/status/control, Agent definition/profile/environment, worker leases and target acknowledgements; inferred types, generated projections and safe errors. Preserve compatible probe contracts and seven global operation IDs.

- [x] Document fields, identity bindings, strict validation and compatibility/version boundaries.
- [ ] Write portable built-archive acceptance before contract implementation; cover unknown/credential/Work/model fields, forged authority, invalid state and generation mismatches.
- [ ] Add separately versioned contracts and projections; resource/profile identifiers stay extensible rather than fixed core enums. Readiness binds actual manager/worker generations.
- [ ] Run bun run verify, public Node consumer smoke and exact packed-artifact checks; preserve/extend SDK #483 as a bounded candidate and split additional public boundaries.

## Slice 4: seed coordination and real team connection boundaries

**Interfaces:** API headless seed coordinator validate/plan/apply/inspect/verify; one API-owned journal abstraction under installation-private .cordis/seeds via Deployment custody; Agent-owned public team-connection adapter with existing Keycloak-governed enrollment references and signed provider credentials.

- [ ] Create/adopt API/Identity/Agent owner issues and commit interface documentation.
- [ ] Write outside-in seed repeat/partial-resume and isolated Keycloak/existing-control-plane contract acceptance; no production or legacy enrollment during tests.
- [ ] Implement trusted bootstrap, artifact-bound resource provider preparation, dependency validation and exact plans. Planning may run disposable validator containers but activates no managed services/resources.
- [ ] Implement policy-qualified missing-capability installation and owner reconciliation, linked receipts/single-writer publication, truthful partial/pending/recovery/readiness and idempotent resume.
- [ ] Prove approved enrollment, heartbeat expiry, revocation and cross-team denial using exact issuer/subject/team/provider/grant identity. Team CRUD and Work stay deferred.
- [ ] Run owner verify/build/program gates and exact archive consumer proof.

## Slice 5: Deployment sandbox and installed Agent targets

**Interfaces:** separate service-scoped private sandbox-control grant/socket; named host-capability service projection; typed bounded qualify/create/attach/execute/inspect/destroy operations; exact target plans and fresh runtime acknowledgements.

- [ ] Document grant/projection/protocol/custody changes before tests.
- [ ] Write real isolated host construction and denial tests for observer misuse, missing privileges, foreign resources, generation mismatch and malformed/interrupted journals.
- [ ] Extend existing host process through a native sandbox adapter; worker receives neither raw engine sockets nor arbitrary host mounts/privileged options. Keep scopes and runtime authority explicit.
- [ ] Reuse exact acquisition/staging/private filesystem primitives. Qualify runtime/image artifacts and owned namespace; never overwrite global daemon configuration or reuse legacy broker state.
- [ ] Verify current prerequisites and real Kata operations on the qualified venue, owner gates and actual installed target read-back. Missing KVM is a blocker, never ordinary-container fallback.

## Slice 6: Agent manager, worker and guest providers

**Interfaces:** separate manager/worker programs and native roots; versioned assignment/lease/cancel/result protocol; definition/profile/kernel/authority/connection/worker/pool/sandbox/runner/environment/execution/handler/tool/context/reporting contracts and class plugins; Agent-owned container/readiness plugins.

- [ ] Refactor affected draft implementation into readable capability layers with no line compression; preserve valid probe contracts and fixtures.
- [ ] Write default-construction/built-program acceptance for manager → worker → virgin warm sandbox → setup → verify → harmless handler → verified teardown, with background replenishment.
- [ ] Add dependency/profile validation and permission intersection; six core profile types plus external fixture profile/handler without core edits. Productive core handlers remain unavailable until Task 10.
- [ ] Implement pool compatibility keys/exclusive removal/one-use leases/quarantine/drain. Discard affected unused bases on generation change; pin in-flight scope/grants through cleanup. Restart required unless exact live transition qualifies.
- [ ] Implement immutable environment entrypoints, bounded setup/verification, offline default and policy-granted declared destinations; failure/cancellation prevents handler admission.
- [ ] Run owner verify and built manager/worker/guest artifact smoke, same-contract alternative provider suites and exact package metadata checks.

## Slice 7: CLI and reusable presentation

**Interfaces:** trsd seeds validate|plan|apply|show|verify, capacity diagnostics/status/probe, --project/--profile; SDK machine envelopes and UI-owned terminal rendering. Seed installation uses the common manager/Deployment lifecycle.

- [ ] Document arguments, exit/result states, saved plan/idempotency binding and default selection precedence before built-program tests.
- [ ] Implement explicit project → configured default; explicit profile → project active → project default. Missing/invalid selections fail without account/installation fallback.
- [ ] Consume public exact owner archives; split parsing/orchestration/presentation into cohesive class providers. Preserve prior commands, seven global operation IDs, Keycloak identity and mobile-first UI behavior. No new browser app.
- [ ] Run owner verify/build/compiled CLI acceptance and exact public dependency closure.

## Slice 8: assembled acceptance and review handoff

**Interfaces:** exact source/archive/runtime/image selections and Platform capability-named acceptance suites. No owner runtime or sibling-source imports.

- [ ] Before composition changes, write installed seed/manager/worker/Kata/Keycloak scene and genuine NPM/HTTPS Git provider fixtures.
- [ ] Qualify install A, held execution, B selection/drain/fencing, original generation cleanup, fresh B acknowledgement and all owned resource cleanup.
- [ ] Cover tampering, missing/duplicate/cyclic providers, incompatible profiles, stale grants, concurrent claims/publication, restart/lost replies, setup network/secret/script canaries and failed destruction.
- [ ] Qualify hosted Ubuntu KVM/Kata first; add full Agent Kata acceptance on the qualified venue, normal compatibility checks and an aggregate gate that cannot silently skip missing prerequisites. Use explicit isolated self-hosted provisioning only if hosted qualification is unsuitable. Preserve historical tests/pins.
- [ ] Run owner checks/build/all applicable tiers and actual consumer artifacts; run exact assembled CI. Report every unavailable prerequisite rather than claiming completion.
- [ ] Reload release-workflow, self-review actual diffs/CI and open bounded owner cordis PRs with Part of references and per-owner changelogs. Keep all issues open and hand back dependency order; no merges.

## Current checkpoint

The original 21 ready candidates and verification repairs Platform #805/#806 have integrated on
Cordis after owner/assembled gates. Their verified merged task branches are cleaned. The new
implementation candidates below remain unmerged for review. Keep every issue, including #678,
open. Real Work/model execution remains Task 10; no legacy/production/cutover changes.

| Review boundary | Current evidence | Next obligation |
| --- | --- | --- |
| Shared policy | All nine critical instruction/checker candidates integrated; new methods have no added debt/exemptions | Continue contextual refactoring and unchanged baseline verification |
| SDK activity data | [#493](https://github.com/treeseed-ai/sdk/pull/493), 121 owner cases and genuine archive/declaration consumers | Native profile/handler orchestration and live authority |
| SDK environments | [#494](https://github.com/treeseed-ai/sdk/pull/494), 123 owner cases, exact archive and offline-policy intersection | Qualified guest execution, artifact custody and enforced egress |
| SDK capacity leases | [#495](https://github.com/treeseed-ai/sdk/pull/495), 129 owner cases, generation/readiness/cleanup binding | Bounded pool/protocol follow-up and authenticated service transports |
| Agent independent build | [#530](https://github.com/treeseed-ai/agent/pull/530), 12 acceptance plus four unit cases and exact SDK custody | Reconcile with runtime slices without losing any controls |
| Agent native probe authority | [#531](https://github.com/treeseed-ai/agent/pull/531), 11 acceptance plus six filesystem integration cases; actual default root and packed Node/declaration consumers | Live existing-team authority remains distinct and required |
| Agent guest preparation | [#532](https://github.com/treeseed-ai/agent/pull/532), draft public component: 11 acceptance plus nine native boundary cases; late-timer control fails before monotonic deadline correction | Real default execution/authority, actual Kata setup/egress and complete runtime composition |
| SDK combined integration | Source 39d337c79528a3b815973a684844781211c4669a; 144 local owner cases plus five genuine packed portable programs and declarations | Deliver pool/protocol as bounded owner PRs after predecessor review; integration branch is not a substitute |
| UI compatibility | [#105](https://github.com/treeseed-ai/ui/pull/105), draft exact successor; 46 owner cases, actual public server/terminal rendering and declarations | Upstream combined SDK review and final single-version owner closure |
| Preserved Agent integration | Source 2d9afaba06ab6a827ea6eb8df8d7b456eec4be16; 57 owner cases, including existing external profile/handler archives | Separate manager/worker/guest programs, actual pool/control transport and live enrollment |
| API seed sequencing | [#645](https://github.com/treeseed-ai/api/pull/645) stays draft; 20 focused sequencing cases | Default real authority/artifact/custody providers and full installed gate |
| Kata backend/venue | Deployment #1022 and Platform #792 integrated after real hosted guest and verified cleanup; final Platform head f82ef1b506f518d0d48c521e25b41a3326ee8633 passed all 28 checks | Full Agent pool/assignment/setup/replacement gate, using hosted Ubuntu |

### Exact private artifacts

| Owner artifact | Exact source | SHA-256 |
| --- | --- | --- |
| SDK .27 activity | 7eb60a4a68ca770f896e07d0e3d8d2324154e6e9 | ee30dbacf0e95d3fd9f88d097b15332c3dbf8020c3313c90e0a0578937a5d1df |
| SDK .28 environment | eabe9b892ad1d2f73ef4ea75405965c3c9cc3cee | b06c943463c3aa87d8e4101088e355af487aefbac67aa99c4947b3040872a321 |
| SDK .29 capacity | a868b25fdbad76cb28efafc02c136f94acb7ef32 | 822f6cdb4d3ed6dfe7dd313777f71e334a195166159a8f33077e5ebe1b5b6dd3 |
| SDK .30 combined integration | 39d337c79528a3b815973a684844781211c4669a | ce65aa96b9366a6c6aab3fad9d673d659f410f68eccb47325e1c5943b5ae0723 |
| Agent .2 native probe authority | 65db5ef89d9022e75a6119620d799de3eefdee19 | 69fc8e4a78e120e8468c437d7d44eed861020ee17f788b7ce00dfe33dd057e48 |
| Agent .4 environment component | f7db6d1a17c3e459193369c5eaca0e97af63d35f | 1a94d5fd694ba759ef042e1e44bd994a2b753da883f2f42037e65fabad52a5c4 |
| UI .21 SDK compatibility | 45684e6b0b91374df87774513a0fbe4d6872d2fb | 6ec80d79da213e6e04a791850d2f200da36ae74e124f7786f467513f7b7f3c56 |

Earlier artifacts, including Agent .3 before the deadline refinement, retain their original
bytes. Each row is one private candidate, not a production publication or a claim that different
SDK versions may coexist. Before merging overlapping SDK/Agent candidates, reconcile all accepted
exports/projections, package metadata, locks and tests into one exact dependency closure and run
fresh resulting-head gates. Preserve every independent suite; never select one side wholesale.

A populated Bun cache retained an earlier same-path SDK during the UI successor update. The
owner identity gate caught it; a fresh-cache update and independent empty-cache frozen install
verified both SDK .30/UI and SDK .28/Agent selection. Shared prevention is proposed separately in
[Platform #809](https://github.com/treeseed-ai/platform/issues/809), not added to runtime PRs.

### Remaining Task 3D delivery

Deliver actual separate manager/worker/guest programs and native roots; named service-scoped
private sandbox grants/transport; exclusive real virgin claims/refill/generation disposal;
immutable guest setup/verification and egress; live existing-team signing/enrollment/heartbeat/
revocation; API default seed planning, isolated preparation, authority, custody, journal and
recovery; CLI project/profile/seed/capacity commands; complete exact-artifact assembly and
replacement/fencing. Real Work/model execution stays Task 10. All issues remain open.
