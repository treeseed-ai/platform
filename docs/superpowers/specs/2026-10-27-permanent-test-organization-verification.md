# Test organization verification evidence

Scope is the nine initialized Cordis repositories and shared future setup. Task 3D runtime
implementation stays held. Original legacy projects and production services remain outside this change.

## Skill baseline and recheck

The pre-change release-workflow SHA-256 was
`a2a88fe369f5e96523d64cd404a7c1edacaf6f87c105b39cf1aa69a2719cfbda`.
A fresh-context builder/skill check found no material design questions. Asked under delivery
pressure whether `tests/task3d-feature.test.ts` violates the old skill, it correctly observed
that the skill specified testing order but no directory or filename rule. Direct retrieval
likewise found none of the four exact directory paths. This is a reference gap, not a claim
that the old skill was disobeyed.

The same fresh-context check against the updated skill rejected the flat phase-named path,
required the four tier directories and capability names, rejected registrations under support,
and required case/assertion/input/timeout/discovery parity plus checks/build/CI/assembled smoke.
It correctly kept Agent setup-only and recorded empty tiers without invented tests.

Executable red/green checks observed missing enforcement, rejection of the original flat layout,
and a separate failing case for an undiscoverable `.ts` suite before its enforcement fix.
The discovery-filter case also failed before the complete-tier command check was added.
The regression suite now covers valid tiers, misplaced/aliased/namespace registrations,
undiscoverable files, phase names, allowed fixture classes and stale filtered discovery commands.

## Preserved coverage and provenance

The old/new registration inventories live in each owner's `tests/layout-migration.json`.
All 374 pre-existing registrations retain their bound arguments, explicit timeouts and assertion
counts. AST token comparison of changed test-method bodies accepts only reviewed fixture/import
path updates and the Task3cTests -> ServiceCompositionTests class rename. Reusable registered
NPM/Git/build acceptance contract behavior remains shared in its acceptance tier. Layout
regressions are additions, never replacements for existing cases.

Historical `composition/` selections and `vendor/` archives remain byte-identical. These pins
still select their original owner commits; owner verification separately builds current owner
source. Capability-based Platform test/fixture paths do not rewrite the historical releases.
API's approved-committer policy retains blob `b1a687db754ee2fac141919e6c63052d12bf2812`.

## Coverage inventory and gates

The final discovery inventory is 414 registrations: all 374 predecessors and five new layout
regressions in each of the eight implemented test repositories. These counts describe registered
cases, rather than the many assertions inside assembled programs.

| Owner | Acceptance | Regression | Integration | Unit | Issue |
| --- | ---: | ---: | ---: | ---: | --- |
| Platform | 11 | 16 | 2 | 1 | platform#768 |
| SDK | 16 | 6 | 28 | 36 | sdk#480 |
| Deployment | 87 | 11 | 72 | 16 | deployment#1008 |
| CLI | 22 | 5 | 2 | 0 | cli#325 |
| API | 5 | 8 | 4 | 5 | api#638 |
| Identity | 3 | 5 | 2 | 3 | identity#53 |
| Admin | 3 | 6 | 2 | 3 | admin#146 |
| UI | 7 | 9 | 12 | 6 | ui#99 |
| Agent | 0 | 0 | 0 | 0 | agent#523 |

CLI's parser constructs real Cordis collaborators and belongs in integration. Its isolated unit
tier is explicitly empty; the unit command reports that fact. Agent remains setup-only, with no
manifest, runtime, application scaffold or test dependencies. The copied checker will be wired
with Agent's first implementation.

Each implemented child runs its complete tier directories through `bun run verify`: layout and
semantic class/type checks, build, acceptance, regression, integration and unit. CLI and Deployment
also retain their required disjoint CI program partitions and all-success aggregate gates.
Platform's historical exact assembled closures run separately in CI; current child checkouts do
not replace accepted archive pins. Required Platform gates cover both historical Ubuntu runners,
layout/policy, installed composition, migration, React presentation and all extensible provider
acquisition/activation scenes. Final PR check links carry the exact reviewed-head CI results.

All seven implemented owners passed checks/builds and applicable local tier suites. UI's full
local verification passed 34 cases, including genuine Firefox and Astro build/hydration acceptance.
Platform's assembled implementation run passed every required job. Owner CI also passed SDK,
CLI, API, Identity, Admin and UI; subsequent shared-contract placement and final metadata edits
require their own fresh head checks before handoff. Deployment's full final partition run remains
a required gate rather than being inferred from its successful individual scenes.

Review moved CLI's shared acceptance assertions into an acceptance contract and Deployment's
retained-plan program assertions into its acceptance specification. Platform's source-custody
assertions live in an integration contract, reused by the commit-rewrite regression. Fixture
setup and executable fixture programs remain in support. Direct body read-back additionally
preserved all 38 CLI, three retained-plan and six source-custody helper method bodies unchanged.

Every tracked AGENTS.md in the nine owners contains the rule. All nine release-workflow skills
have SHA-256 `b26b899de100d93c8dff0721c50c513c22a0fb50716454b1c48f3bc6d42e279a`;
all copied layout checkers have SHA-256
`a89f5ba3e8cc05a2d79e9977c271e5733c57f800ebfd5bbd93614377f62528ad`.
Future initialization inherits these tracked resources while excluding the initializer itself.

## Failures retained and resolved

The Astro acceptance rerun exposed a missed fixture-directory reference, which was corrected
without changing assertions. A subsequent run hit `/tmp` inode exhaustion; using a private
main-filesystem temporary directory passed the same genuine Astro build/hydration case.
No unrelated temporary directories, legacy worktrees or running services were removed.

Cold CI found missed built-fixture imports and lockfile archive locators after directory moves.
The affected program paths and the assembly fixture workspace's frozen lock locators were fixed;
fresh empty-cache installation of the exact assembly closure passed. UI's Azure mirror download
stalled before browser tests; the job now uses the same official Ubuntu archive mirror step as
Platform and retains the existing deadline and mandatory Firefox prerequisites.

Deployment's paused-publication acceptance initially failed SDK validation. It also failed in a
pristine baseline sharing the installed dependencies. Vendor SDK archive SHA-256 remained
`4084aa8dbe9767984fac9fef7f5cea30a0bec93ed416138d32c804e6389fdba5`, but installed
`dist/src/management.js` was `fbefe910a99fb6ea5e8b36612d388d7dd5677bd76aa01159ca7a1f1f65704b42`
instead of the archive member's
`939a751d1f6db0a5dcee0809b25fb46f4da16e2473db0d275a3285f68bdf97b8`.
With Bun `1.4.4 (38afee6c8)`, a fresh private cache and
`bun install --frozen-lockfile --ignore-scripts --force --cache-dir <private-empty-cache>`
restored exact installed bytes. No lock, vendor or runtime source changed. Rebuild and the
original paused-publication test passed (one case, zero failures, 17.66 seconds). The diagnostic
baseline worktree and its own dependency symlink were removed after recording the evidence.

This repeats the installed-byte qualification gap already proposed in
[platform#698](https://github.com/treeseed-ai/platform/issues/698). That issue records the new
evidence and cheapest proposed check; dependency-tooling implementation is outside this change.

## Delivery decision and preservation

The maintainer explicitly approved one atomic test-reorganization PR per repository as a scoped
exception to the release-workflow skill's ten-file limit. This keeps moved/split suites, helper
exports, discovery and policy enforcement reviewable together without transitional layouts.
It does not change the general size rule or authorize merging these review candidates.

Runtime `src/`, frozen `vendor/` bytes and Platform `composition/` selections remain unchanged.
Public helper export names remain stable while their emitted paths move under `tests/support/`.
Keycloak identity and API's approved committer policy are preserved. Each repository has its own
issue branch and review candidate targeting `cordis`; all issues, including #678, remain open.
Task 3D runtime work stays held pending review of this higher-priority cleanup.
