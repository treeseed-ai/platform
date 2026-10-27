# Agent composition implementation plan

> **For implementing agents:** Use the actual available workflow/testing tools, preserve the user's execution method, and deliver one bounded task at a time. Checkboxes record verified results, not intentions. Retain child-repository setup pauses.

**Goal:** Qualify native Agent root/child composition and installed harmless providers before Task 10 domains.

**Architecture:** SDK owns portable binding contracts; Agent owns native Cordis execution lifetimes; Deployment extends its common accepted-package manager with an Agent target adapter; UI owns rendering and Platform owns exact assembled evidence.

**Tech Stack:** Strict TypeScript classes, existing qualified native Cordis/Node/Bun/Zod toolchains, owner-private immutable manifests and exact public archives.

**Spec:** [Agent composition design](../specs/2026-10-27-agent-composition-design.md). Platform #773, SDK #482, Agent #525.

## Global Constraints

- Real Work/model execution remains Task 10. No account/grant migration, sandbox or model-usage claims.
- Preserve independent owner repositories, Keycloak identity, legacy checkouts/services and all long-lived branches.
- Agent setup is approved/published. Every feature starts from freshly verified origin/cordis; all PRs target cordis and issues including #678 stay open.
- Native Cordis owns services/effects; no second registration container, provider cache or disposal scheduler.
- Permanent tests use the four required tiers. Use exact public package archives, never sibling source imports.

## Review Focus

- A request copies another execution's principal/resource/grant or revision: reject before a provider runs.
- Cancellation or revocation during an await: recheck before a side effect or successful result.
- Replacement arrives while work is in flight: close admission, retain old leases through cleanup, then commit only the qualified candidate generation.
- Child cleanup logs a failure: return recovery-required and fence admission rather than claiming completion.
- Manager stored active state survives a target restart without handshake: project prepared/recovery until fresh target read-back succeeds.

### Slice 1: SDK portable contracts

**Files:** `src/agent.ts`, public `src/contracts.ts` and `src/portable.ts`, `tests/acceptance/agent-contract.test.ts`, `tests/unit/agent-contract.test.ts`, owner docs/changelog/manifest/lock. Keep the PR bounded to ten files.

**Interfaces:** `AgentSchemas.authority/request/result`, `AgentContractBinding.assert(request, authority, generation): AgentExecutionRequest`, safe `AgentContractError`; inferred authority/request/result types. These data contracts add no global operation ID.

- [ ] Commit docs for fields, bounds, strict errors and owner boundaries.
- [ ] Write a built public-package program proving accepted matching scope plus denial of forged principal/grant/stale generation. Run against the pre-implementation artifact and observe missing public contract.
- [ ] Add unit cases for unknown/credential/model fields, payload bounds, grant revocation/revision and result state/cleanup consistency.
- [ ] Implement portable strict schemas and pure binding check with fixed safe errors; include schemas in generated projection without changing existing provider formats or operations.
- [ ] Run `bun run build`, `bun run verify`, public artifact program and diff review. Record exact archive/source identity and open cordis candidate with actual CI evidence.

### Slice 2: Agent root and child scopes

**Files:** owner `src/application.ts`, `src/contracts.ts`, `src/plugins/host.ts`, focused typed provider modules, `src/main.ts`, class-based tooling, four-tier tests and docs. Split tooling/root/provider and program presentation candidates if the owner gate requires it.

**Interfaces:** `AgentApplication.start(configuration)`, `execute(request, signal)`, `replace(selection, expectedGeneration)`, `dispose()`; handler/execution/tool/context/reporting/authority tokens and native class plugins. All calls consume SDK bindings and return validated results. UI adapter consumes `UiTerminalRenderer.create/render/dispose` through its public package.

- [ ] Map legacy HandlerRegistry/provider-kernel sources to same-owner plugins; commit lifetimes, identity, execution admission and cancellation docs.
- [ ] Write `agent_program_uses_selected_registered_provider` and `execution_scope_pins_generation` at the built default program boundary. Add same-contract two-handler suite and no-fakes default construction test.
- [ ] Pin missing/duplicate selections, revoked grants, leaked cross-execution state, cancelled await, stale lease, in-flight drain and failed native disposal in integration/unit tiers.
- [ ] Implement root/child plugins using SDK CordisScope/ServiceLocator leases; recheck authorization at execution seams and await all effects before result publication. No real Work/model execution.
- [ ] Run all applicable owner gates and built program, package exact SDK/UI peer closure and open bounded review candidates.

### Slice 3: Deployment common Agent target

**Files:** typed target adapter/stager/receipt modules; existing `src/plugin-manager.ts` branch/read-back extension; public exports and focused owner tests. Create owning issue/verified branch before edits.

**Host choice:** the existing durable Deployment worker hosts the Agent-owned native root. Its installation-authority adapter reads/rechecks the owner-private probe grant record; no request-derived authority or new daemon. The standalone program constructs the same root for owner proof.

**Interfaces:** accepted closure + selected Agent provider + exact trusted installation binding → private target plan → target admission/application → matching Agent-target acknowledgement. Target generation is distinct from service graph generation; active requires current handshake.

- [ ] Document target plan/ack/journal schema and restart projection; commit docs before tests.
- [ ] Write accepted install/select against actual Agent root and registered exact archive; reject fabricated target/generation acknowledgement and revoked authority, preserve source/build canaries.
- [ ] Reuse owner-private filesystem/closure validation and immutable manifest materialization; extend common manager dispatch through typed Cordis target provider, with prepared/pending/recovery distinctions and no separate registry.
- [ ] Verify clean/malformed/interrupted publication, concurrent target selection, lost reply and restart read-back; run owner gates/programs. Open bounded candidates with exact Agent/SDK archives.

### Slice 4: Platform assembled qualification

**Files:** exact composition pin record, `tests/acceptance/agent-composition.test.mts`, fixture-only support and CI assignment; architecture/status docs/changelog.

- [ ] Write assembled default-program/common-manager fixture before integration changes.
- [ ] Qualify installed A/held execution/B drain/cancel/read-back/cleanup, exact principal/grant identity and no cross-scope leakage with genuine package archives.
- [ ] Verify permanent tier/discovery, exact artifact identities, owner CI, Platform assembled CI and preserved existing acceptance. Report any missing gate; do not call Task 3D complete until all slices qualify.
- [ ] Hand back PRs for review. Keep all issues open; Task 4 and Task 10 require their own explicit execution scope.
