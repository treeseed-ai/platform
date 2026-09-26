# Agent acceptance preflight

**Purpose:** make the first real SDK golden workday admissible without spending another full workday discovering a missing source, grant, guest image, or campaign authority. This is a temporary gate before returning to [`agent-acceptance.md`](./agent-acceptance.md), not a substitute acceptance campaign. Detailed defects and run evidence belong in Platform Issue #520 and owning-package tests/PRs.

## Rules

- Keep the six SDK work-item objectives, dependencies, review cycles, permissions, and acceptance criteria from `agent-acceptance.md` unchanged. Use one new canonical proposal ID because the specified ID is already superseded; record that one correction in the acceptance campaign freeze. Do not create another chain of diagnostic retry proposals.
- Use one published TreeDX source commit and explicit exact Book references; never infer an Architecture Book from a library root or a moving branch.
- Run focused tests and development-mode builds first. Do not cut an RC, run a full workday, or weaken a schema to pass preflight.
- Treat an intermediate pass as permission to *start* the SDK golden, not as evidence that any golden stage passed.

## Gates

### 1. Published content and immutable authority

- [x] Publish the SDK Core Book and Core Objective in current schemas without losing the objective text. Read-back: SDK library `65106c908bca127ea45d11b3f6b54905878d191c`.
- [x] Read the SDK Architecture Book at the same published library commit. Its exact `books/architecture.md` content is available.
- [x] Freeze one replacement SDK proposal ID and exact proposal bytes. The original `golden-sdk-decision-governed-workday-intent` is superseded; the replacement retains the six fixed work items and adds exact Core and Architecture Book context, without changing their objectives or topology. Local freeze: `.treeseed/acceptance/agent-golden-20260921/sdk-intermediate-freeze.json`.
- [x] Validate the replacement proposal against the current schema and compare its fixed work-item fields to `agent-acceptance.md`. All six objectives match exactly; the governed draft is version 1 with content hash `7a781d0093e4485346d1454420c38fdc659428d158a06c27cc29cf96ad082836`. The local freeze records the source, Book digests, policy revision 1, and provider offer revision 1.

### 2. Assignment and guest contract

- [x] An Architect assignment with an exact Architecture Book receives it as a read grant and gets a valid `knowledge/<book-id>/<page-slug>.md` write target. Admission rejects a missing Book. API assignment-builder tests: 18 passing.
- [x] The guest constrains Knowledge output to the granted ID/slug and exact Book reference. The repaired schema passed a live Luna/low Kata assignment: Architect produced the granted SDK Architecture Knowledge page with the exact Book reference; focused Agent tests and type-check also pass. This is a guest-contract check, not golden acceptance.
- [x] Exercise the proposal → generated graph → immutable assignment → guest-context transformation in one local integration fixture, asserting exact published Book bytes, write target, timing budget, and no external mutation. The fixture produced 14 nodes, a 180-second Architect allocation, one exact Architecture Book context item, and a constrained Knowledge output at `knowledge/sdk-architecture/knowledge-bb1ba00e45b117114756c0d6.md`.
- [x] Confirm Researcher, Architect, and generated Reviewer output/grant contracts against the frozen proposal before a live workday. The cross-package fixture uses the actual published SDK role profiles, checks requested permissions against their activity ceilings, builds each role's grant, and verifies the Architect Knowledge output schema. This is local contract evidence, not an agent-execution result.

### 3. Development runtime

- [x] Replace the CLI's caller-owned `docker image save` path with a manager-owned import/export operation authorized for `treeseed-operators`. The local operator imported `treeseed/sandbox-codex:local` without sudo, `sg`, or Docker membership; manager read-back reports `sha256:2535021bfc679301a36675dbae543376039c7ea6dbdef63593a28788e6e68dee`. Kata guest readiness remains part of the next gate.
- [x] Rebuild and activate the final API service, Agent provider, and Agent sandbox in development mode once the focused changes are batched. Selected generations: API 699, provider 435, sandbox 214, TreeDX 266; all development selections ready. Host reconciliation plans noop and Kata sandbox is ready. The released-component TreeDX view flags `wrong-image` under the live selection; exact TreeDX reads succeed.
- [x] Check provider capability/model remaining supply, Identity authentication, TreeDX exact reads, and writable campaign-local custody immediately before starting the golden. Provider offer revision 1 is healthy with Sol/research 7,200s and Terra/implementation 28,800s ordinary daily caps; CLI authentication, exact Book read, and writable local freeze passed. The latest workday page had no active workday.

### 4. Return to golden acceptance

- [x] Update `agent-acceptance.md` only for the one canonical replacement ID and current frozen exact refs; preserve its objectives, stages, and pass criteria.
- [x] Record a passing intermediate preflight receipt in Platform Issue #520 with focused test results, runtime digests, exact refs, and an unchanged external-state baseline. The local freeze SHA-256 is `d38055c31a2a690b0c90186875e1dc613a4d7adf7906ff590210bd891b572419`.
- [x] Hand the frozen SDK proposal and a schema-valid, read-only `trsd workdays plan --plan` request back to Stage 0 of `agent-acceptance.md`. Starting and judging the SDK → API → joint workdays belongs exclusively to that acceptance plan, after its full campaign freeze; no golden checkbox is marked from this handoff.

### 5. Mandatory executable regression gate

- [x] Restore a package-owned scene/guarantee runner that fails closed on missing implementations, skipped/empty evidence, absent prerequisites, and uncovered required cases; retain exact local receipts in Platform #520.
- [x] Execute coded component scenes for SDK, API, Agent, Deployment isolation, and CLI operator boundaries; these are preflight evidence only, not a golden workday pass.
- [x] Enforce the package-owned component scenes in SDK, API, Agent and CLI Actions using the exact tested Reviewer Action. Deployment's scene gate is in its checked integration PR; an unrelated Identity runtime gate still prevents that PR's merge. Component coverage never attests the full golden or broad live guarantees.
- [ ] Reconcile every remaining stale catalog binding against current ownership and semantics; do not map a broad guarantee to an unrelated passing test or revive retired runtime paths.
- [ ] Prove the unchanged full SDK golden through the real graph, then proceed to API/joint acceptance under `agent-acceptance.md`.

## Current frontier

The guest-contract prerequisite is proven, but the executable regression gate remains open. Full acceptance remains governed exclusively by `agent-acceptance.md`; no golden pass is claimed. Detailed defects, component receipts, and remaining catalog gaps belong in Platform Issue #520.
