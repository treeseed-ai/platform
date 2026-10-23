# TreeSeed Cordis Migration

This branch specifies a replacement TreeSeed platform built from the operator interface downward: standalone CLI → integrated deployment → SDK and Cordis plugin lifecycle → shared REST/SDK/CLI/MCP/browser operations → feature plugins.

**Status: design and development instructions only.** There is no new CLI, SDK, application, container deployment, test suite, or release here yet. Commands and file layouts in the documentation are proposed implementation contracts, not runnable installation instructions. Implementation requires a subsequent instruction from the maintainer.

Start with these documents in order:

1. [Platform contract](docs/platform-contract.md): initial journeys, deployment/support boundaries, plugin interfaces, public operations, ownership and failure semantics.
2. [Top-down development plan](docs/superpowers/plans/2026-10-23-cordis-platform.md): ordered tasks, proposed files and signatures, outside-in tests, artifact verification and completion gates.
3. [Migration and legacy references](docs/migration-reference.md): exact source snapshots, lessons to preserve, repository setup pauses and safe coexistence with the original system.

Read [AGENTS.md](AGENTS.md) and the configured skills before starting a statement of work. [Issue #672](https://github.com/treeseed-ai/platform/issues/672) tracks this documentation delivery. [CHANGELOG.md](CHANGELOG.md) records developer-visible changes.

The user-established `cordis` branch is the isolated migration baseline. This documentation uses an issue feature branch targeting `cordis`, preserving the original repository's `staging` and `main`. This is a scoped exception arising from the explicit clean-rewrite instruction, not a change to production branch or environment policy. Ordinary development/release workflow remains governed by AGENTS.md; agree the final integration path before promoting migration work into the existing release branches.

Initial target environments are Linux, macOS and Windows through WSL2. Linux is the initial managed-host qualification target; desktop hosts use an explicitly selected Docker Desktop environment. Native Windows, the AI project, commerce, fleets and advanced autonomous portfolio execution are outside the initial release.

The original `/home/adrian/Projects/platform` and its repositories continue to develop until deliberately replaced. They are reference sources, not writable implementation directories for this migration. Do not clone, clear, activate or change a dependent TreeSeed repository without following the [repository setup gate](docs/migration-reference.md#dependent-repository-setup-gate).
