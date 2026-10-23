# Migration boundaries and legacy source reference

Date: 2026-10-23. Read with the [platform contract](platform-contract.md), [development plan](superpowers/plans/2026-10-23-cordis-platform.md) and [AGENTS.md](../AGENTS.md). This document is reference and migration procedure, not an instruction to execute a migration now.

## Working copies and authority

- New project: `/home/adrian/Projects/treeseed-cordis`, named **TreeSeed Cordis Migration** in the Codex application.
- Source repository: `https://github.com/treeseed-ai/platform.git`; HTTPS transport is mandatory.
- User-established rewrite baseline: `cordis`, cleared at `8285e114ea23f9dd5a9d32bfd2ff6a138d583b2a`, then configured by the user at `94add126387a1314b2985b1831e6bc4cbfa44401`.
- Original working product/reference: `/home/adrian/Projects/platform` and its independent `packages/<project>` repositories. They remain under active development until replaced.
- Documentation statement of work: [Platform #672](https://github.com/treeseed-ai/platform/issues/672). Its feature branch is `feature/672-cordis-development-instructions`, based on verified `origin/cordis`; PR base is `cordis`. This preserves the explicit cleared migration baseline instead of restoring legacy files from `staging`.

`cordis` replaces `staging` as migration integration under the separately reviewed [policy change #674 / #675](https://github.com/treeseed-ai/platform/pull/675). This creates no deployment environment or authority to promote migration work into legacy `staging`/`main`. A future reviewed, explicitly authorized cutover must preserve legacy work, adopt the verified successor as `staging`, and update instructions/settings/CI before PR-only promotion to `main` resumes. Do not infer cutover permission from completion or green tests.

The original analysis lives at `/home/adrian/Projects/platform/docs/platform-seams.md`, SHA-256 `16aefa8a165213263b2dad3d1bb9e4b824467d10a6d76fdba6de8c9d7aa17f6f` when this statement began. It was an untracked local document, not a published Git revision. This hash records the consulted bytes. Do not pretend a GitHub permalink exists for them. The self-contained contract in this migration is the maintained specification; the original audit remains historical explanation.

## Dependent-repository setup gate

**Do not initialize a dependent project merely by reading this plan.** When the user selects
an eligible existing project, use Platform's [initialize-project skill](../.agents/skills/initialize-project/SKILL.md).
The skill is the procedure authority: same canonical repository and history, new isolated
`cordis` worktree at gitignored `packages/{project}`, inherited source cleared there only,
then exact shared setup from one fetched/verified parent Platform `cordis` commit.

Copy `AGENTS.md`, `.gitignore`, `LICENSE` and the complete tracked skills tree with all support
resources **except `initialize-project` itself**. Preserve differing project license files
and required notices from its verified original baseline; API and Market API keep AGPL.
The parent working tree, untracked files and moving branches are not copy sources. Existing
branches/directories or partial/dirty setups are preserved, not automatically wiped again.

This replaces the earlier manual skill/AGENTS installation step. After the single setup-only
local bootstrap commit, report refs/paths, copy verification and license exceptions, then
**stop for user review, project-specific adjustments and explicit resumption before any
scaffolding, dependency installation, tests/builds or implementation**. Do not publish the
local baseline without user direction. After approved publication, ordinary issue branches
and PRs use the child's verified `origin/cordis`. Platform setup does not waive each child's
review pause. Task 1 needs CLI, SDK and Deployment only, each initialized separately.

**TreeDX is excluded from initialization.** It remains the existing Elixir/Rust platform:
no Cordis branch creation, wipe, shared setup copy or TypeScript rewrite through this workflow.
Integrate its existing public service from the owning SDK/API adapters; adapters do not acquire
TreeDX's persistence capability. Any later TreeDX development uses its own instructions and
normal language/toolchain workflow. Third-party packages are not first-party rewrite targets.

## Verified local source snapshots

These refs were read from local repositories during this documentation task. They identify source to study, not running services, accepted artifacts or the newest remote releases. Re-check for a subsequent task; fetch protected heads before branching/merging/releasing. Use `git show <exact-ref>:<path>` or equivalent exact-ref reads when reproducing a finding. Reach for CodeGraph first in an indexed repository; an absent index is not permission to build one automatically.

| Repository | Local HEAD | Reference purpose |
| --- | --- | --- |
| Platform | `2f371f0b9589ac405afda764d3da5ba5e51983a8` | Source worksets, integration selections, policies and historical evidence. This checkout differs from fetched remote staging. |
| CLI | `1f252481fdbb4ee14c9baf1da257eaaf3f4d9c63` | Process/output/custody contracts and operator experience. |
| Deployment | `68b6600f3a4885be8d2c4b5e80ae9f6b9e41aa14` | Lifecycle, trusted host operations, credentials, edge and recovery. |
| SDK | `121d959bfe06ecf5a5c1178754a413c5e254533f` | Operation/client/schema and compatibility mechanisms. |
| API | `8452cb2d60d1f0b0cd10eafb8722d31065176f06` | Domain/transport separation, authentication and durable authority. |
| Identity | `9d8794f93fdacd6593290e2c90e239cdbd6eb1a7` | Maintained identity/session/workload protocol primitives. |
| UI | `034b8811e42d7bededb8e2444ca4c099d79de4a3` | Reusable forms, feedback, timestamps and bounded browser surfaces. |
| Admin | `4e9307fed7226c4a33004ea5a159a70e993423fd` | Server-side session/facade and same-origin mutation boundary. |
| Core | `c476ce515eae46d7eb560e374bae6c277077237d` | Optional public reader/site mechanisms; avoid importing the complete layering framework. |
| TreeDX | `13d9f9047025d709ccbb7f8ffff9d2f67e2ec15a` | Generic repository/workspace/query/artifact service boundary. |
| Agent | `9eaf47baec710a1b85ad79621599ab72494f69f1` | Handler/runtime boundary, measured execution, custody, settlement and cleanup. |
| Reviewer | `a37879ff4960f5f06e152016f44300847def1a3c` | Package-owned scenes, complete prerequisites and exact assembled-asset evidence. |
| Engineering template | `ecf70cae708ca0fdff81b7cf9c8d2d86decdda4e` | Template-owned files and user-file preservation. |
| Research template | `42df7269a41c46529204ae42be24bc11cd34c6f1` | Content-only project/scaffold distinctions. |
| Skill | `f462f5135b2004848ee0b27832aa81ec289916f1` | Versioned operator instructions checked against actual operations. |
| Market | `91de0c2ff7ba43ffd0c1057bffc9c6add18a781f` | Historical coupling to avoid; no initial migration implementation. |
| Market API | `382af463060f4aef1a75ff8ba47ac798e9bf423e` | Gateway versus implemented-product distinction; deferred. |

AI is excluded; do not add its checkout, schemas, images or GPU dependencies to this migration.

### Read the smallest relevant source

Paths below are relative to the named original repository under `/home/adrian/Projects/platform/packages/`. They are reference locations, not new file ownership.

| Question | Owning original files | Lesson to preserve |
| --- | --- | --- |
| How does a typed client reach a registered operation? | SDK `src/operator-contracts/control-plane-operations.ts`, `src/entrypoints/clients/control-plane-client.ts`; API `src/api/control-plane/catalog/index.ts`, `src/api/control-plane/http/resource-routes.ts`. | One operation/schema authority; no transport-specific workflow copy; tighten generic payloads rather than expanding the catalog. |
| How is the live CLI entered and rendered? | CLI `src/cli/main.ts`, `src/cli/runtime.ts`, `src/cli/commands/operator.ts`. | Test the built executable, actual parsing, output streams and exit codes. |
| What owns a development selection? | CLI `src/cli/commands/development-support/lifecycle.ts`, `candidate.ts`; Deployment `src/manager/development-sessions.ts`, `development-handoff.ts`. | Persistent selection, exact source/output generation, cross-process exclusion; no silently restored old writer. |
| How does a host update without arbitrary root commands? | Deployment `src/manager/reconcile.ts`, `src/supervisor/server.ts`, `src/supervisor/execute.ts`, `docs/architecture.md`. | Fixed typed host boundary, serialized activation, scoped backup/recovery; Linux details are not a macOS implementation. |
| How are browser credentials protected? | Identity `src/application-session.ts`; Admin `src/pages/v1/[...all].ts`; API `src/api/support/server.ts`. | Server-held credentials, CSRF/same-origin checks, configured issuer/resource and explicit startup failure. |
| How are authorized service defaults pinned? | API `src/api/control-plane/repositories/services/service-binding-selection.ts`. | Reauthorize exact owner/grant; do not fall back across credentials after denial. |
| What should stay outside generic storage? | SDK `src/treedx/client.ts`; TreeDX `apps/api/lib/treedx_web/router.ex`. | Product authority belongs in the application; TreeDX remains generic and behind trusted delegation. |
| What is the minimal handler interface? | Agent `src/kernel/contracts.ts`, `handler-registry.ts`, `provider-kernel-executor.ts`. | Configured handler IDs, real model/tool usage, scoped runtime and durable actual product; no hardcoded named agents. |
| Why is a component pass insufficient? | Reviewer `README.md`, `src/verifiers/guarantees/prerequisites.ts`; original Platform `docs/agent-acceptance.md`. | Complete owning suites before scenes; exact built/installed assets, independent product review and physical cleanup. |

Do not import source across repository directories, symlink live service volumes into the rewrite, copy legacy environment files, or run original deployment commands to test the replacement. Current build output and installed packages can differ from these source refs. Investigate actual custody instead of treating a clean source checkout as runtime proof.

## Known historical failure classes to carry into tests

The original audit recorded schema drift between Platform declarations and the installed SDK validator, developer metadata rejected by root policy, and AI project discovery failure. Delivery histories record clocks/closeout failures, unresolved usage, products approved but not retrieved/integrated, stale source/profile selection and checked-out UI changes that did not rebuild consumers. These are regression requirements, not independently replayed failures in this new branch.

Preserve links to [SDK #424](https://github.com/treeseed-ai/sdk/issues/424), [#428](https://github.com/treeseed-ai/sdk/issues/428) and [#429](https://github.com/treeseed-ai/sdk/issues/429). Keep issue bodies and Actions artifacts as delivery/status authority; this reference is not a new task database. Do not resume the legacy paused portfolio or count synthetic migration diagnostics as governed agent success.

## Coexistence, migration and licensing

Keep the replacement's ports, Compose names, volumes, install directories, databases, credentials, artifact names and release identities separate from the original installation. Diagnostics must identify collisions and refuse takeover. No default reset, global Docker prune, shared writable source checkout or stolen provider registration.

Migrate capability by capability after independently verified replacement. First add an opt-in endpoint/client selection; then verify exact data/identity mapping and recovery; only then deliberately replace the old capability. Preserve Git/TreeDX history, identity mappings, membership, accepted decisions, reviews/results, unresolved usage/reservations, artifacts and failed evidence. Do not label lossy reset as migration.

Existing first-party code carries its existing license: Apache-2.0 except API and Market API, which are AGPLv3. Preserve exact notices for copied/adapted code and dependencies. Combining source folders does not relicense code. Before incorporating API-owned implementation into a distributed combined host, resolve the resulting license boundary with the maintainer; do not silently mark the entire executable Apache. A cleared worktree is not a relicensing event. This document does not choose or publish a new license.

The migration policy permits qualified PR integration to `cordis`, prohibits migration promotion to `staging`/`main`, and retains the ban on agent PR approval/main merges. Legacy temporary prelaunch approval rules are historical and do not override this worktree's instructions. No production merge, tag, deployment or branch-protection change is part of this documentation delivery.

## External primary sources and evidence limits

- [Cordis repository](https://github.com/cordiverse/cordis): runtime composition dependency. Observed upstream head `35fdc969e4b6c48c48ed44717c7a018324e4dd88`; pin a qualified revision before implementation. Do not assume an unstable upstream API remains unchanged.
- [Bun standalone executable reference](https://bun.sh/docs/bundler/executables): compilation/cross-compilation feasibility; each actual TreeSeed target still needs native artifact execution, code-signing/trust checks where applicable and full dependency qualification.
- [Docker Desktop VM boundary](https://docs.docker.com/desktop/features/vmm/): Linux runtime underlying desktop containers; no promise that Linux/KVM privileged execution transfers unchanged.
- [Docker WSL filesystem guidance](https://docs.docker.com/desktop/features/wsl/best-practices/): sources/file watches on Linux-hosted files; verify actual selected engine and host configuration.

Research does not substitute for a target spike. Record exact tool versions, flags, architecture, optional/native dependencies, artifact hashes and command with every negative result. A failed bundling experiment is not a general claim that Bun or Cordis cannot support a feature.

## Task 1 reviewed initialization and publication

The maintainer reviewed CLI, SDK and Deployment setup and explicitly authorized publishing
all three local baselines, then bounded diagnostic/contracts implementation. The published
cordis bootstraps are CLI612c2871b43e7b0868532f1705c4e4dd5c9b6f75,
SDK395286a3268a1d9990046011d1145702df052ddf and
Deployment1b904ade5fd5f3ec0945db7bef59274185d92dde, copied from Platform
b9b96dfeaaa8e3e38643beb71562f9d833a8ce5e. Initialization issues are CLI#307,
SDK#448 and Deployment#899; implementation issues are CLI#309, SDK#450 and Deployment#900,
coordinated by Platform#681. Issues stay open until release. No other project was initialized.
Legacy development continued independently; its moving refs/configuration were preserved.
