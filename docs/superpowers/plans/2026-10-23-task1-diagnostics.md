# Task 1 diagnostics Implementation Plan

> **For implementing agents:** Use the actual available workflow/testing tools, preserve the user's execution method, and deliver one bounded task at a time. Checkboxes record verified results, not intentions. Retain child-repository setup pauses.

**Goal:** Ship one standalone read-only diagnostic executable and portable SDK contracts.

**Architecture:** CLI consumes exact packaged SDK and Deployment candidates. Deployment owns
host diagnostics; SDK owns executable schemas and shared development source enforcement.
Platform owns exact composition metadata and assembled artifact verification.

**Tech Stack:** Bun1.4.4, TypeScript5.9.3, Zod4.6.7, Node24.19.0.

**Spec:** [Platform contract](../../platform-contract.md), Task1 of the existing platform plan,
and the CLI/SDK/Deployment owner READMEs (their public interfaces are authoritative).

## Global Constraints

All implementation/tests/tooling use strict TypeScript classes. Preserve independent canonical
repositories and legacy services/branches. No lifecycle mutation, transport, plugin runtime or
production publication. Ubuntu26.04x64 is the first target. Issues remain open at integration.
User reviewed setup and explicitly authorized publication and resumption on2026-10-23.
Published baselines: CLI612c2871, SDK395286a3, Deployment1b904ade. Parent setupb9b96dfe.

## Review Focus

- Remote Docker authority must be rejected before engine contact: Deployment fixture context.
- Foreign/symlink/permission-denied paths must remain unchanged: actual filesystem tests.
- Cwd .env/bunfig and no runtime PATH must not change binary behavior: CLI built-program tests.
- Unknown schema fields/forged trusted context must fail: SDK strict-schema tests for all IDs.
- Consumer archives may drift from declared candidates: Platform SHA256 read-back gate.

## Owner delivery order

1. SDK#450: commit outside-in contract/artifact tests; establish intended behavioral red;
   implement OperationDefinition, seven schemas and shared SourcePolicy; run check/build and
   unit/integration/smoke; commit and pack exact source candidate.
2. Deployment#900: commit public/default-construction/host regression tests; vendor exact SDK;
   implement ComposeDeploymentHost.diagnose; verify complete owner suites and no mutations;
   commit and pack exact source candidate. Preserve NOTICE.
3. CLI#309: commit CliProgramFixture.run acceptance tests first; vendor same SDK and exact
   Deployment; build minimal executable to observe behavioral red, implement parser/output;
   check/build/unit/integration/smoke on native host including default production construction.
4. Platform#681: pin owner commits/archive/artifact digests; verify assembled executable and
   candidate identity. Open linked cordis PRs with actual CI evidence and retain all issues.

Each owner README defines file-level public class signatures and diagnostic/schema policy.
Implementation files: SDK src/contracts.ts and src/source-policy.ts; Deployment src/diagnose.ts;
CLI src/main.ts. Each owns scripts/tooling.ts (CLI scripts/build-cli.ts), a focused class-based
test module and .github/workflows/verify.yml. Manifests/locks and vendored immutable package
archives stay in the consuming owner. No copied source or root runtime implementation.

Verification in every owner: bun run check, bun run build, bun run test:unit,
bun run test:integration, bun run test:smoke (or bun run verify). Source/build failures are
prerequisite failures, never reported as intended behavioral red. CI must run the same gates.
Native qualification records OS/CPU, Docker/Compose/tool identities and exact artifact hashes.

## Verified candidate evidence

The three reviewed cordis bootstraps were published unchanged. Owner docs/tests/implementation
are committed on their issue branches, with all later tasks deferred. Local verification:
SDK5tests, Deployment6tests, CLI6tests; Platform11checks (8existing skill regressions and
3assembled checks), zero failures/skips/todos. Root assembled verification also receives
strict TypeScript compilation and semantic class-source inspection. The compiled binary runs
with no Node/Bun PATH; native doctor reports ready true, exit0, without creating its destination.

Final owner candidate CI:
[SDK](https://github.com/treeseed-ai/sdk/actions/runs/40035129927),
[Deployment](https://github.com/treeseed-ai/deployment/actions/runs/40035162607),
[CLI](https://github.com/treeseed-ai/cli/actions/runs/40035221488).
[Platform assembled CI](https://github.com/treeseed-ai/platform/actions/runs/40035441474)
rebuilt the exact declared CLI source and matched the native artifact SHA256, then passed
all assembled/policy checks on Ubuntu24.04. Doctor reports that host as unsupported; this is
binary portability evidence, not managed-host qualification beyond native Ubuntu26.04x64.

Readiness tests were observed failing against a compiled NOT_IMPLEMENTED executable.
Strict-schema, remote-context-blocker and wrong-archive-pin mutations each produced their
intended assertion failure, then passed after restoration/correction. No missing prerequisite
was mislabeled as behavioral red. Shared source checking also rejects .mts/.cts function paths,
permissive operation definitions and contradictory success/problem envelopes.

Review PRs: [Platform#682](https://github.com/treeseed-ai/platform/pull/682),
[SDK#451](https://github.com/treeseed-ai/sdk/pull/451),
[Deployment#901](https://github.com/treeseed-ai/deployment/pull/901),
[CLI#310](https://github.com/treeseed-ai/cli/pull/310). Review/merge remains pending;
all task branches are retained and all issues remain open until release. Deployment NOTICE
matches its original blob4beb3b94c1448461e0c5630405628e9c132b9568. Canonical remotes and
published bootstrap heads were read back; all worktrees are clean and Platform tracks no
child source. Original repositories and their ongoing legacy development were preserved.
