# TreeSeed Cordis Migration

This branch specifies a replacement TreeSeed platform built from the operator interface downward: standalone CLI → integrated deployment → SDK and Cordis plugin lifecycle → shared REST/SDK/CLI/MCP/browser operations → feature plugins.

**Status: design and development instructions only.** There is no new CLI, SDK, application, container deployment, test suite, or release here yet. Commands and file layouts in the documentation are proposed implementation contracts, not runnable installation instructions. Implementation requires a subsequent instruction from the maintainer.

Start with these documents in order:

1. [Platform contract](docs/platform-contract.md): initial journeys, deployment/support boundaries, plugin interfaces, public operations, ownership and failure semantics.
2. [Top-down development plan](docs/superpowers/plans/2026-10-23-cordis-platform.md): ordered tasks, proposed files and signatures, outside-in tests, artifact verification and completion gates.
3. [Migration and legacy references](docs/migration-reference.md): exact source snapshots, lessons to preserve, repository setup pauses and safe coexistence with the original system.
4. [Implementation kickoff prompt](docs/implementation-kickstart.md): future session handoff, required documentation integration and per-repository setup pauses before code.

Read [AGENTS.md](AGENTS.md) and the configured skills before starting a statement of work. [Issue #672](https://github.com/treeseed-ai/platform/issues/672) tracks this documentation delivery. [CHANGELOG.md](CHANGELOG.md) records developer-visible changes.

Development skills follow the project's issue/documentation/test workflow, strict TypeScript
class architecture, required research and child-repository review pauses. Already authorized
edits and execution methods retain their authority; missing skill packages are not mandatory
installation dependencies. Project skill installation uses `.agents/skills/` through the
configured installer. [#678](https://github.com/treeseed-ai/platform/issues/678) records the
alignment audit. Run reference/template regressions with `node --test tests/skills/*.test.mts`
on Node.js 24; read-only scenario review checks decisions beyond those static guards.

The migration integration branch is `cordis`: issue branches start from verified `origin/cordis` and PRs target `cordis`. Migration work must not merge into legacy `staging` or `main`. A separate reviewed, explicitly authorized cutover will preserve legacy work, adopt the verified successor as `staging`, update workflow/settings/CI, then restore PR-only promotion to `main`. The instruction/skill policy is tracked in [#674 / #675](https://github.com/treeseed-ai/platform/pull/675); completing the plan does not authorize cutover.

Initial target environments are Linux, macOS and Windows through WSL2. Linux is the initial managed-host qualification target; desktop hosts use an explicitly selected Docker Desktop environment. Native Windows, the AI project, commerce, fleets and advanced autonomous portfolio execution are outside the initial release.

The original `/home/adrian/Projects/platform` and its repositories continue to develop until deliberately replaced. They are reference sources, not writable implementation directories for this migration. Do not clone, clear, activate or change a dependent TreeSeed repository without following the [repository setup gate](docs/migration-reference.md#dependent-repository-setup-gate).

Platform remains the top-level integration repository. Existing projects remain **independent
repositories under `packages/{project}`**, excluded by Platform's `/packages/` gitignore rule.
Functional code/plugins, owner tests, manifests, locks, builds and releases stay in their owner
repository; Platform owns integration declarations/docs and assembled verification. There is no
`packages/platform` runtime or new combined monorepo. See the [ownership map](docs/platform-contract.md#repository-and-plugin-ownership).

For an explicitly selected child project, use the [initialize-project skill](.agents/skills/initialize-project/SKILL.md)
to prepare its own local Cordis worktree and copy Platform's pinned shared setup, excluding
that skill and preserving project license exceptions. Stop for user review before code.
TreeDX is excluded and remains its existing Elixir/Rust service.

All handwritten Cordis implementation uses strict **TypeScript classes**, typed capability
contracts and replaceable class plugins through Cordis injection/configuration. This lifetime
architecture rule is mandatory in AGENTS.md; TreeDX remains the Elixir/Rust exception.
