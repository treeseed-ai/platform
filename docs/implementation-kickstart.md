# Cordis implementation kickoff prompt

## Current checkpoint: revised Task 3D

Tasks 1–2 and 3A–3C are integrated. Agent setup was accepted/published; the maintainer explicitly resumed the seed-driven Task 3D plan. Read [Agent architecture](agent-architecture.md), [seed architecture](seed-architecture.md) and the [delivery plan](superpowers/plans/2026-10-27-agent-composition.md).

Implement the critical readability rule/checker first across the nine Cordis owners, then separate manager/worker/Kata infrastructure, extensible profiles/setup, seed host composition and public existing-team connection adapters. Preserve native Cordis and independent package ownership. Real Work/model execution remains Task 10. Dedicated KVM-runner provisioning is outstanding. Keep all issues including #678 open; hand back PRs without merging. The earlier UI-only initialization and embedded-Agent hosting instructions below are historical, not current execution authority.

## Historical Task 1 prompt

Historical kickoff: Task 1 setup review and explicit implementation resumption have now occurred.
Continue the [Task 1 delivery record](superpowers/plans/2026-10-23-task1-diagnostics.md) and
[Platform#681](https://github.com/treeseed-ai/platform/issues/681); do not reinitialize or clear
existing CLI/SDK/Deployment worktrees. The prompt below remains the original handoff context.

Paste the following into a new chat in the **TreeSeed Cordis Migration** project, using
`/home/adrian/Projects/treeseed-cordis` as its workspace. This prompt authorizes the first
implementation slice in that future chat; saving it here does not start implementation.

```text
Start the TreeSeed Cordis rewrite in /home/adrian/Projects/treeseed-cordis.

Read this checkout's AGENTS.md and .agents/skills/release-workflow/SKILL.md first,
then use the relevant configured planning, testing and verification skills.
This is the parallel migration workspace. cordis is its integration branch.
The original system remains active in /home/adrian/Projects/platform and its
included repositories. Preserve their files, services, branches and credentials.

First check the documentation handoff: plan PR #673 (issue #672) and the
workflow-policy PR #675 (issue #674) must be integrated into cordis through
the required PR/check/review workflow before coding. Do not confuse their feature
branches with origin/cordis or assume missing CI passed. If a required integration
gate is unavailable, report the exact blocker; do not bypass it or start code.
The plan's original exact source is commit
ffb9e15a9856cfe5600b75974751381fdcadc73d, available for read-only comparison.
Keep both PRs' changelog entries when integrating them. Use the latest reviewed
plan revision incorporating the separate-repository layout; the original commit
is historical reference, not authority to restore a single-repository layout.

Once those prerequisites are present, read:
- docs/platform-contract.md
- docs/migration-reference.md
- docs/superpowers/plans/2026-10-23-cordis-platform.md
Treat their historical "instructions only" status as the status of that earlier
documentation delivery. This prompt authorizes Task 1 now. Missing execution
skills are not a reason to install tools or invent a second workflow; use an
available compliant method. If a real required instruction cannot be satisfied,
report it rather than pretending the skill was loaded.

Create/adopt a separate implementation issue for Task 1, with observable
acceptance criteria. Fetch and verify the exact origin/cordis head, then create
an issue-linked feature branch from it. Use HTTPS Git. PRs target cordis only.
Do not merge migration changes into staging/main, open production RC/hotfix PRs,
publish production tags/releases, or sync legacy staging/main into the rewrite.
Passing all tests or finishing the plan never authorizes cutover. The eventual
replacement of staging and PR-only promotion to main requires a separate
reviewed cutover plan and explicit maintainer authorization.

Preserve the repository topology: Platform is the top-level integration repo;
CLI, SDK, Deployment, API, Admin, UI, Core and Agent remain independent
repositories under packages/{project}, using each existing canonical remote and
its own cordis branch/history. TreeDX remains its existing independent Elixir/Rust
service and is excluded from Cordis branch creation, clearing and shared setup.
Do not create replacement repositories or move
capabilities between owners. Map each legacy capability/source to its same-repo
Cordis plugin/export/interface and outside-in test in the owning issue before
code; consumer adapters do not acquire implementation ownership.
Platform must gitignore /packages/; do not commit nested source/Git metadata
or introduce submodules. Functionality,
plugins, owner tests, build scripts and releases belong in their owner repo.
Platform owns composition declarations, integration docs and assembled checks.
Use SDK/public package interfaces and exact artifact/source references; never
relative source imports between checkouts. Do not move owner code into Platform.

Implement only Task 1: lock the public vocabulary and produce the standalone
Bun-built trsd diagnostic executable. Begin at the user interface: help,
version, doctor, machine-readable output, documented exit codes and actionable
errors. Keep installation diagnostics non-mutating. Define the bounded SDK
contracts for the seven initial remote platform operations from the contract;
unsupported installation/execution commands must report unsupported behavior.
The CLI implementation belongs in packages/cli, contracts in packages/sdk, and
read-only host diagnostics in packages/deployment, shared through its public
package interface rather than reimplemented in CLI.
Before coding, use Platform's initialize-project skill only for CLI, SDK and
Deployment, each in its own cleared cordis worktree with copied shared setup
excluding that skill. STOP for my review/adjustments and explicit resumption.
Keep this bootstrap local; do not publish its new branch without my direction.
The existing Platform setup does not satisfy any owner project's gate. Do not
implement plan/apply, start containers, scaffold the entire plan, add
feature plugins or introduce the AI project in this slice.

Use strict TypeScript classes and one executable schema authority. This is a
pluggable OOP implementation, not function-based TypeScript or handwritten
JavaScript: logic belongs in class methods, callbacks bind those methods, and
browser components, tooling and test fixtures are classes too. Give each
capability one typed interface/abstract-class contract, constructor injection and
a selected class implementation through Cordis service bindings/configuration.
Consumers must remain unchanged when a compatible implementation is swapped.
Reuse Cordis lifecycle, no second container/framework or speculative hierarchy.
Use OperationDefinition.define as a static class method and CliApplication as
the CLI composition class; later PlatformApplication owns API composition.
TreeDX remains its existing Elixir/Rust exception. Pin tools after
checking official sources and the actual host; qualify native Linux first.
macOS and WSL2/Linux support remain unproven until tested on the actual targets.
The eventual design has one integrated Compose deployment lifecycle, a Cordis
host and one SDK-defined interface projected through REST, SDK, CLI, MCP and
browser actions. Keep this first slice small; do not recreate legacy breadth
or build a second loader, installer, package manager or policy engine.

Follow documentation -> outside-in tests -> implementation. Update docs and
Unreleased changelog before code. Write user-observable built-program tests
first, prove intended behavioral red, add real default-construction integration
and contract/unit tests, then implement the minimum. Spawn the compiled binary
from a different directory, paths with spaces and a symlink; test closed stdin,
unknown commands/flags, JSON output, engine/ownership blockers, and absence of
writes or secrets. No fakes may be the only proof of default wiring. Do not run
legacy deployment commands to prepare fixtures.

Run meaningful complete current unit/integration suites, strict checks, build
and actual compiled-artifact smoke, then required CI. Do not create empty
passing suites, weaken assertions or describe unavailable gates as green.
Before any later real scene/guarantee, run all participating owners' complete
unit/integration prerequisites on that exact candidate for that invocation.
Record exact commands, candidate/artifact identities and actual results.

Keep each plugin/module in its existing owning repository; not every plugin
needs a new repo. Introduce only projects needed for the current slice. For each
eligible first-party replacement repo, invoke Platform's initialize-project skill: its
own cleared cordis worktree at packages/{project}, with setup from one exact
parent cordis commit: copy AGENTS.md, .gitignore and LICENSE, plus the complete
tracked skills tree excluding only initialize-project. Preserve differing
project licenses and required notices.
Then STOP for my review/adjustments and explicit resumption before scaffolding,
dependency installation, tests/builds or code. TreeDX is excluded: no branch,
wipe or setup-copy there; integrate its existing Elixir/Rust public service.
Do not wipe the original checkout or treat its old instructions as satisfying that setup pause.
Report the path, branch and baseline. Never pull legacy implementation into
the new repository as a shortcut. Standard third-party dependencies are not
first-party replacement repositories and must not have their sources wiped.

Commit reviewable docs/test/implementation layers, push the feature and open a
PR against cordis with truthful verification and remaining limits. Do not
approve PRs or merge main. Clean up only a verified merged task-owned branch;
protect cordis, staging, main and unrelated retained work. Deliver Task 1 and
report its result before starting Task 2.
```

## Task 3C resumed: mobile-first UI

The maintainer accepted UI setup and authorized exact baseline publication and Task 3C implementation. Every visual component must be mobile-first from 320 CSS pixels to widescreen monitors; test 320/375/768/1024/1440/1920/2560 widths, long content, keyboard/touch and 200% text resizing. Keep authored controls at least 44×44 CSS pixels, required actions visible, logical/fluid dimensions and no page overflow (labeled local semantic-table overflow is permitted). UI owns components/styles/renderers; consumers retain domain behavior and Identity retains Keycloak authority. All issues, including #678, remain open.
