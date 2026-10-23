# Cordis implementation kickoff prompt

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
CLI, SDK, Deployment, API, Admin, UI, Core, TreeDX and Agent remain independent
repositories under packages/{project}. Platform must gitignore /packages/; do
not commit nested source/Git metadata or introduce submodules. Functionality,
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
Before coding, prepare only the required replacement repos, each as its own
cleared cordis worktree, then STOP for my skills/AGENTS.md setup and resumption.
The existing Platform setup does not satisfy any owner project's gate. Do not
implement plan/apply, start containers, scaffold the entire plan, add
feature plugins or introduce the AI project in this slice.

Use strict TypeScript and one executable schema authority. Pin tools after
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
needs a new repo. Introduce only projects needed for the current slice. Every
first-party replacement repo needs its own isolated cleared cordis worktree
at packages/{project} and a STOP before scaffolding, dependency installation,
tests or code so I can configure its skills and AGENTS.md. Do not wipe the
original checkout or treat its old instructions as satisfying that setup pause.
Report the path, branch and baseline. Never pull legacy implementation into
the new repository as a shortcut. Standard third-party dependencies are not
first-party replacement repositories and must not have their sources wiped.

Commit reviewable docs/test/implementation layers, push the feature and open a
PR against cordis with truthful verification and remaining limits. Do not
approve PRs or merge main. Clean up only a verified merged task-owned branch;
protect cordis, staging, main and unrelated retained work. Deliver Task 1 and
report its result before starting Task 2.
```
