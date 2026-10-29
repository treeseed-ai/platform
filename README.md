# TreeSeed Cordis Migration

This branch specifies a replacement TreeSeed platform built from the operator interface downward: standalone CLI → native Cordis composition in every runtime → integrated deployment and provider/plugin installation → shared REST/SDK/CLI/MCP/browser operations → feature plugins.

**Status: Tasks 1–2 and 3A–3C are integrated on owner `cordis` branches. Task 3D is resumed under the approved seed-driven Capacity Provider amendment.** Agent setup was reviewed/published; do not initialize it again. The SDK probe foundation and hosted Kata backend are integrated; the Agent service/runtime delivery remains in progress.

Read [Agent architecture](docs/agent-architecture.md), [seed architecture](docs/seed-architecture.md) and the [revised Task 3D delivery plan](docs/superpowers/plans/2026-10-27-agent-composition.md). They specify separate services, native Cordis roots, extensible profiles and dependency setup, and seeds as the platform integration mechanism. Real Work/model execution remains Task 10. Review handoff does not authorize merging, production release or cutover.

Build each independent owner using its README and pinned Bun 1.4.4 toolchain. The qualified
planning host is Ubuntu 26.04 x64 with a local Linux/amd64 Docker engine. Other hosts report
explicit blockers. Platform's exact composition and assembled Node tests bind source trees,
archives and the built CLI; see [Task 2 composition](composition/task2.json). Owner code is consumed through public packages.

Native Cordis composition and typed provider selection are required across the runtimes. Task 3C delivered extensible container services, package acquisition and reusable UI providers; the four-role limit is historical. Agent manager/worker container plugins belong to Agent, while Deployment supplies bounded host operations. See the durable references above for the approved current boundaries and implementation ledger.

The [architectural language draft](architecture/README.md) records current implementation and
architectural intent separately, with pinned source inventory and explicit conformance gaps.
[Architecture Studio](architecture/studio/README.md) provides a local React workspace for design,
validation, comparison and migration export. Run `npm --prefix architecture/studio ci`,
`npm --prefix architecture/studio run build`, then `npm --prefix architecture/studio start`.

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
alignment audit. Run reference/template regressions with `node --test tests/regression/authoring-policy.test.mts tests/regression/github-policy.test.mts`
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

The maintainer's PR #723 review selects pure reusable React TSX class components in UI, with native Cordis provider selection and UI-owned browser/SSR/terminal adapters. Astro consumes the React exports; renderer-neutral contracts support future desktop/native adapters without claiming DOM/native equivalence. Identity retains shared Keycloak authority and hosts retain session/token custody. UI setup and Task 3C implementation are integrated; preserve those qualified public interfaces during Task 3D.

## Development skill consistency

Project-local skill examples must preserve the migration and architecture rules above.
[Issue #678](https://github.com/treeseed-ai/platform/issues/678) tracks conflicting GitHub,
planning, writing and skill-installation instructions and their correction.

GitHub helpers use `cordis` PR targets, preserve integrated issues until release, prohibit PR
approval and production publication, and prefer connected tools with CLI fallback. The
unrelated ECC release checklist is removed. Planning/writing helpers use available skills,
class-based TypeScript examples, required research and the configured `.agents/skills/`
destination; spikes retain the project workflow and child setup gates.

Run policy regressions with `node --test tests/regression/authoring-policy.test.mts tests/regression/github-policy.test.mts` using Node.js 24 (verified
with 24.19.0). These checks inspect executable examples and local skill dependencies;
read-only scenario review complements them. Neither check proves universal agent compliance,
GitHub protections, CI or the proposed product runtime. Task 1 product checks are recorded separately in the exact composition and owner CI.

Run assembled verification with Node 24.19.0: `node --test --test-concurrency=1 tests/skills/*.test.mts tests/acceptance/package-composition.test.mts tests/acceptance/deployment-planning.test.mts tests/acceptance/native-composition.test.mts`. Snapshot tests run serially to avoid other tests’ temporary doctor port probes. CI runs Ubuntu 24.04 prerequisite rejection and a mandatory successful-plan gate on Ubuntu 26.04; no skipped positive gate counts as qualification.

Task 3A selects exact owner source trees and archives in [composition/task3a.json](composition/task3a.json).
The CLI mounts native command/configuration/output and Deployment providers; the SDK runtime
facade uses Cordis injection and effects for scoped service leases. External-provider acceptance
executes the exact CLI owner verification program against its built artifact, with genuine
prepared immutable ESM packages, ordinary dependencies, alternatives and failure cleanup.
Historical Task 1–2 records remain intact. [Delivery record](docs/superpowers/plans/2026-10-24-task3a-native-composition.md).


## Task 3B installed composition

[Exact owner sources, package archives and fixture image selections](composition/task3b.json)
compose the first installed profile. The standalone CLI plans and applies a local verified bundle;
a detached native Cordis worker owns the installation journal and Docker service lifecycle.
PostgreSQL and Caddy are Deployment plugins, Keycloak is an Identity plugin, and the API container
is an API plugin. The API root mounts Identity sessions/OIDC, Admin routes and browser status,
HTTP routing and the private worker adapter through native Cordis.

Run `bun install --frozen-lockfile --ignore-scripts` and `bun run test:installed` after checking out
and building the exact CLI candidate in the composition record. This is an activating acceptance
fixture requiring Ubuntu 26.04 x64, local Docker/Compose, certutil, Playwright Firefox and the pinned
prepared images. It removes its isolated containers, networks, volumes and private installation after verification; prepared image/cache bytes may remain.
TLS trust stays in its private browser profile. `platform apply`, `status` and `application` are
local CLI bindings; authenticated API status/application and the Admin browser use the same host
worker. API transport parity, plugin acquisition/activation, Agent and generalized recovery remain
in their separately gated tasks. Agent still requires clean same-repository initialization and a
maintainer setup review before its first implementation.

## Task 3C resumed: mobile-first UI

The maintainer accepted UI setup and authorized exact baseline publication and Task 3C implementation. Every visual component must be mobile-first from 320 CSS pixels to widescreen monitors; test 320/375/768/1024/1440/1920/2560 widths, long content, keyboard/touch and 200% text resizing. Keep authored controls at least 44×44 CSS pixels, required actions visible, logical/fluid dimensions and no page overflow (labeled local semantic-table overflow is permitted). UI owns components/styles/renderers; consumers retain domain behavior and Identity retains Keycloak authority. All issues, including #678, remain open.
