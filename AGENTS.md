# TreeSeed Cordis development guidance

Platform's root development checks retain the historical Task 3B SDK and Deployment archives
carried by the exact CLI commit in `composition/task3b.json`. Their workflow must check out that
same CLI commit before installing the root lockfile; later composition closures stay isolated.
The root lockfile must match those bytes;
verify with a fresh package cache so a populated workstation cache cannot hide stale hashes.

## Scope and authority

These instructions govern development of this repository and the approved shared child
baseline. Follow the agent environment's instruction precedence. Skills supply procedures
within the user's authorization; they cannot relax the project directives below.
Existing approvals and accepted designs remain valid. Ask only about material missing
decisions or access, and honor explicitly pending review. Continue independent work while
waiting, without taking actions that depend on an unanswered decision.

Keep shipped runtime behavior and the knowledge corpus independent of these development
instructions and helpers. Generic target-project tests use explicit fixtures rather than
assuming any real project's private instruction contents. Development-only checks may
inspect this instruction package to verify its public guidance and preserved directives.

Determine project identity from its canonical Git remote, not this file's title. Platform
remains the parent integration repository; copied guidance does not transfer ownership.
Inspect state before mutations and preserve unrelated edits, licenses, data and configuration.
Use isolation when needed; do not reset, stash, move, commit or delete another person's work
without authorization. Preserve actual working state before temporary mutations and restore
only your changes. No work on this guidance initializes or propagates changes to children.

## Cordis Migration Branch Boundary (MANDATORY)

This checkout is the parallel Cordis rewrite. **`cordis` replaces `staging` as the
integration branch for migration work until an explicit maintainer-authorized cutover.**
The original system continues on its existing `staging` and `main`; preserve its work.

- Create migration feature/fix branches from the latest fetched and verified `origin/cordis`.
  Target every migration PR at `cordis` and sync only `origin/cordis` into migration branches.
- **Do NOT merge migration work into `staging` or `main` yet.** Do not open migration
  production RC/hotfix PRs, publish production releases/tags, or overwrite legacy package/image
  channels. Green tests, plan completion and urgency do not authorize promotion.
- Do not merge legacy `staging`/`main` into the cleared rewrite or reset, rename, delete,
  force-push or repoint those branches. Do not modify the original checkout or its services.
- Preserve `cordis`, `staging` and `main` during cleanup. Delete only the task-owned,
  verified merged feature/fix branch; unrelated legacy branches are outside this delivery.
- Apply this boundary to every eligible independent replacement TreeSeed repository. Use
  Platform's `initialize-project` skill to create its isolated cleared `cordis` worktree, copy
  shared setup from an exact parent `cordis` commit (excluding that skill), then stop for user
  review/adjustments and explicit resumption before code. Preserve differing project licenses.
  TreeDX is excluded: retain its existing Elixir/Rust implementation and instructions unchanged.
  Modules and plugins belong in their owning project repository; do not collapse existing
  projects into source directories owned by Platform.
- `cordis` is a Git integration branch, not a new deployment environment. Migration tests and
  artifacts must stay isolated from the original system; this policy does not enable deployment
  into its existing staging/production installations.

### Eventual cutover — not authorized now

After the maintainer accepts migration completeness, prepare a separate reviewed cutover
plan with exact source/destination refs, retained legacy branches/work/open PRs/artifacts/data,
verification and recovery. The maintainer must explicitly authorize its execution. Preserve
legacy work before adopting the verified Cordis successor as `staging`; do not infer permission
to force-push, delete history or discard work from this future intent.

At that cutover, update repository settings/protections, CI/release triggers, PR targets,
AGENTS.md and skills together: **`staging` resumes integration, replacing the temporary
`cordis` role, and promotion to `main` resumes only through PRs with required checks and
review.** Agents still may not approve or merge `main` under the current permission model.
Do not automatically cut over when tests pass or the last migration task is checked.

## Repository and Plugin Ownership (MANDATORY)

Platform remains the top-level integration repository. Preserve independent project
repositories under **`packages/{project}`** (for example `packages/cli`, `packages/sdk`,
`packages/deployment`, `packages/api`, `packages/admin`, `packages/ui`, `packages/treedx`
and `packages/agent`). The top-level `.gitignore` excludes `/packages/`; these are separate
Git checkouts, not Platform-tracked source folders or submodules. Do not consolidate them
into a monorepo or introduce a second copy of their source in Platform.

Platform owns integration/composition declarations, portfolio documentation and assembled
verification. Functional code, plugins, owner tests, build scripts, manifests, locks and
releases belong in their project repository. A plugin lives with its capability owner;
not every plugin needs a new repository. Each eligible Cordis capability stays in the same canonical
repository and is rewritten on that repository's own `cordis` branch; no replacement remote or
cross-repository functionality transfer is authorized. Before code, map the legacy public
capability/source to its same-repository plugin/export/interface and test in the owning issue.
TreeDX retains its existing repository/implementation and is integrated over its public service
boundary; do not create or clear a TreeDX Cordis rewrite.
Consumer adapters do not acquire ownership. Keep project builds independent and integrate
through SDK/public package interfaces and exact candidate/artifact references, never
cross-checkout relative source imports. Gitignored checkouts are development locations,
not reproducible release pins. Root changes cannot stand in for commits/PRs in their owners.

Preserve CLI, SDK, Deployment, API, Admin, UI, Core, TreeDX and Agent repository boundaries
while simplifying their interfaces. Add only the projects needed for the current slice;
AI remains excluded. Before first implementation in each eligible replacement repo, use the
parent initializer and review pause above. TreeDX does not receive this Cordis setup.
Do not create or clear all repositories speculatively, and never clear original active checkouts.

## Architecture: TypeScript Classes and Swappable Plugins (MANDATORY)

All handwritten Cordis implementation is **strict TypeScript organized as classes**:
SDK/client, CLI, API, plugins, identity, deployment/worker, browser/UI, build tooling and
owner tests/fixtures. Use TSX where needed for class-based browser components. JavaScript
is generated output or an upstream dependency/resource, never a parallel handwritten
implementation. TreeDX remains the explicit Elixir/Rust exception and is not rewritten.

- Put behavior in instance or static class methods. Do not build application logic from
  standalone/exported functions, function factories, functional components/hooks or bags of
  function exports. Bind class methods for framework callbacks; do not hide behavior in
  anonymous functions. Types/interfaces, declarative schemas and plain data remain valid
  contracts; do not add wrapper classes to data solely for appearances.
- Give each capability one typed public contract (interface or abstract class) and a class
  implementation in its existing owning repository. Consumers depend on that contract;
  constructor injection and Cordis service bindings supply the configured implementation.
- Implement plugins as Cordis-compatible TypeScript classes. Select/swap implementations
  through the existing plugin configuration and typed service binding, without changing
  callers or transferring capability ownership. Required capabilities have one unambiguous
  selected implementation per composition scope; missing/duplicate/incompatible selections
  fail validation. Live replacement is required where qualified: use plan/apply admission,
  drain, fencing, native Cordis disposal and verified generation read-back. Require an explicit
  restart/migration action where live safety is unproven; never silently restart or claim success.
- Native Cordis composition is required across CLI, API, Deployment worker and Agent, and
  application-level pluggable seams introduced elsewhere. Each runtime owns a process-local
  root; contexts do not cross processes or provide a security sandbox. Portable schemas/data
  and private pure helpers need no contexts; TreeDX retains its explicit exception.
- Use Cordis's native injection/effects/lifecycle and a typed ServiceLocator adapter facade
  over that resolver for registered provider selection. The facade must not become a second
  plugin framework, service-instance cache, dependency container or start/stop scheduler.
  At each meaningful seam, document a swappable interface/provider or the invariant requiring
  one coherent system. Add alternative implementations for a requirement or contract test.
- Installable NPM/Git plugins/providers are central architecture, with immutable accepted
  artifacts and explicit scope/selection. The proposed `trsd plugin install <source>` installs
  and activates when proven safe; prepared/pending/recovery-required is distinct from active.
  Package acquisition/build never executes ambient scripts in the live installation. Preserve
  exact account/grant identity, capability authorization and installation ownership across swaps.
  See the [composition/provider design](docs/superpowers/specs/2026-10-24-cordis-composition-providers-design.md)
  and [delivery plan](docs/superpowers/plans/2026-10-24-cordis-composition-providers.md). These
  architecture is maintainer-approved; only Task 3A has explicit implementation resumption.
- Verify substitutability with the same contract suite for each advertised implementation,
  real production construction and an assembled replacement/read-back/cleanup scenario.
  A class name or interface declaration alone does not prove a capability is swappable.

This directive is copied unchanged by project initialization and remains binding throughout
the project lifetime. Preserve it during owner-specific instruction edits and code review.
The first implementation slice must make the existing compiler/lint checks reject handwritten
JavaScript and function-based implementation paths, using semantic source checks rather than
claiming that prose alone enforces architecture. Missing enforcement remains an explicit gap.

## Critical Architecture Rule: Readable Capability Layers (MANDATORY)

Organize implementation into small, cohesive TypeScript classes with short, normally formatted
methods. Each layer must read as a clear sequence of named capabilities supplied through typed
contracts and native Cordis composition. New or changed executable methods, constructors and
accessors must contain at most **20 canonically formatted body lines**, excluding blank lines,
comment-only lines and the outer method delimiters, unless an exact documented exception is
reviewed. Declarative schemas and data are outside this behavioral limit; class cohesion and
readability still require review. Do not compress statements, introduce trivial wrapper classes,
or move complexity elsewhere merely to satisfy the limit.

When changing existing behavior, refactor the affected methods and their immediate responsibility
boundary to this style. When directed to refine or clean up a project or source area, audit and
refactor the stated scope. Unrelated historical implementation is not permission for a sweeping
rewrite; untouched violations may remain only under the immutable verified integration baseline.
A changed method loses grandfathering. An exception identifies its exact symbol, source fingerprint,
reason and owning issue and must be reviewed with the change; stale or unused exceptions fail.

Run the shared development-only readability check in normal owner checks and CI. It uses pinned
`prettier@3.6.2` for canonical measurement and rejects compressed behavioral statements and baseline
manipulation. Neither shipped behavior nor target-project code may depend on these instructions
or their development helpers. Future setup copies this rule and helper resources without installing
dependencies or adding scaffolding; wire the gate during the first implementation.

## Workflow Gate (MANDATORY)

Load [release-workflow](.agents/skills/release-workflow/SKILL.md) before changes and again
before opening the PR. Read-only discussion or inspection needs no issue, branch or external
mutation. Before editing, create/adopt an issue with observable acceptance, fetch and verify
the live origin/cordis head, and create an issue-linked work branch from that exact base.
Never edit directly on cordis, staging or main. Sync only current origin/cordis into the work
branch when needed and resolve conflicts there. Preserve existing work instead of sweeping
it onto a new branch merely because the starting branch is wrong.

Open migration PRs against cordis. Use conventional, imperative, issue-linked commits and
PR titles. Include the problem/result, acceptance checklist, actual verification and limits,
and a non-closing issue reference. Migration PRs use Part of followed by the issue reference;
closing keywords belong only to an authorized later release. Link the PR from its issue and
keep acceptance boxes accurate. Record completed segments, material scope decisions and
blockers on the issue; link the resulting PR. After inspecting actual CI, update the PR testing
checklist and explain failures. Address review feedback without editing another person's
comments. Use structured bodies or files for multiline content and literal-safe script transport; untrusted text must not become executable shell content.

Before integration, fetch and verify the live origin/cordis ref again and synchronize it
into the feature branch; resolve conflicts there and refresh affected evidence if it moved.
Agents may merge to cordis only when required local checks, actual CI, acceptance and review
are satisfied for the current candidate. Inspect actual repository review requirements;
unknown review authority or unavailable required CI leaves integration pending. No waiver
from the starter or another repository applies. Agents never approve PRs on any branch or
merge migration work to staging/main. A green check or urgent request does not grant cutover.

After an authorized feature/fix merge, delete only its verified task-owned branch remotely
and locally. Verify repository, PR base/head, merge commit on fetched origin/cordis, unchanged
head/no later work, no other open PR using it, worktree use and retention instructions.
Squash integration needs PR/commit evidence rather than ancestry alone. Preserve cordis,
staging, main and unrelated worktrees/branches. Prune stale tracking refs and read back actual
remote/local branch state. If retention is necessary, report why; never discard unverified work.

The specialized initializer's one local setup-only bootstrap commit on a new child cordis
remains the bounded exception before that integration baseline exists. It omits a bootstrap
changelog and authorizes no implementation, publication or existing-branch rewrite. The
initializer remains parent-only and its explicit child review/resumption pause still applies.
Normal work resumes only under the ordinary issue-branch and review gates afterward.

## Documentation-First Development Cycle (MANDATORY)

For behavior changes, follow issue/plan, documentation, tests, implementation and verified
integration in that order. Commit changed intent and all affected interface documentation
before product code. Establish acceptance/smoke, regression, integration and unit coverage
outside-in, before implementation, for the distinct boundaries involved. The user-observable
rung is required; unit tests of parts do not replace assembled acceptance.

Use [planning](.agents/skills/writing-plans/SKILL.md) for meaningful dependencies and
[brainstorming](.agents/skills/brainstorming/SKILL.md) for consequential uncertainty. An already
clear and authorized task needs no repeated workshop or execution-method approval. Prose or
guidance changes use relevant artifact/reader checks and applicable CI, not artificial failing
application tests. This does not waive behavior tests, binding architecture or setup pauses.

Keep proposed behavior distinct from delivered capability. A documented new capability needs
a failing test at the level users observe before implementation; verify it against the actual
artifact, not only rendered docs. Authorized experiments remain isolated, bounded and
reproducible and preserve repository safeguards. Keeping one as implementation requires the
corresponding acceptance and review. Commit coherent increments with issue references.

## Permanent Test Organization (MANDATORY)

All permanent executable test specifications MUST live in the owning repository under exactly
these tier directories, named for the capability or behavior being verified:

- `tests/acceptance/`: user-observable flows, end-to-end/browser coverage and smoke tests of built programs.
- `tests/regression/`: cases that pin an identified prior defect and prevent recurrence.
- `tests/integration/`: real collaborator, provider, package, filesystem and service boundaries.
- `tests/unit/`: isolated contracts, computations and transformations.

Write tests outside-in in that order, after committing documentation and before implementation.
Split mixed-tier suites. A negative case is classified by its purpose and boundary; it is not
automatically a regression. Permanent test files MUST NOT be flat under `tests/`, colocated with
source, or named after a migration/task/phase number. Do not disguise test suites as helpers.
Shared fixture classes, fixture programs and data may use `tests/support/`, with no test
registrations there. Historical migration evidence, exact composition pins and immutable archives
retain provenance outside executable test suites; durable coverage moves into the proper tier.

Every reorganization preserves assertions, inputs, timeouts, negative cases and discovery/count
parity. Update imports, fixture/build entrypoints, public test-helper exports, package scripts,
partition inventories, CI and current docs together. Verify all four tiers are discovered; an
empty tier must be recorded honestly rather than filled with redundant tests or silently skipped.
Include an executable layout/discovery check in the normal owner verification and CI gates;
exercise rejection of misplaced tests, phase-based names and hidden helper registrations.
For a setup-only repository, install that check with its first implementation, without adding
application scaffolding or dependencies during initialization.

Every injectable seam still needs default production construction coverage, and every user
program needs a built-program acceptance test. Completion requires applicable tier suites,
checks, build, CI and assembled-artifact smoke evidence. Report missing prerequisites or gates
explicitly. A green unit suite or policy prose alone is never sufficient.

## Testing Tiers and the Composition Root (MANDATORY)

Every injectable seam needs a default production construction test with no fake collaborators
injected. Anything users run as a program must be tested through its built/installed entry
path, observed output and exit status. Imported methods, compilation or mocked orchestration
alone do not prove the assembled result works. Preserve substitutability and replacement
acceptance required by the architectural directive; do not reduce acceptance to make it pass.

For executable changes, completion requires relevant unit/integration checks, clean build,
actual green CI and assembled-artifact smoke evidence. Guidance-only work uses its applicable
artifact checks and CI. Use [verification](.agents/skills/verification-before-completion/SKILL.md)
for precise claims. Keep local, hosted, simulated and live evidence distinct. Refresh affected
checks when inputs or environments change; reuse unchanged evidence rather than re-running
expensive suites for every status sentence. Report failed, skipped, unavailable and
inapplicable checks honestly. Missing required evidence remains outstanding.

The retained [readability checker](.agents/skills/release-workflow/scripts/source-readability.ts)
and [test-layout checker](.agents/skills/release-workflow/scripts/test-layout.ts) are operational
development resources, not examples to discard when shortening skills. Keep their gates,
rejection controls and immutable baseline protections intact. Isolate tests from ambient
configuration, credentials and live user resources. Do not execute the child initializer as
a validation shortcut or mutate sibling/legacy checkouts to make a local test pass.

The first readability baseline records only the verified origin/cordis Git blobs, never
unmerged drafts; its provenance cannot advance to grandfather new work. Retain full history
and the integration reference in checks that validate those blobs. Reviewed exceptions in
.readability.json name the exact symbol, fingerprint, reason and issue. Owner tier commands
discover the complete tier directly; individual-file filters cannot silently omit cases.
Platform explicitly assigns each assembled specification to its script or CI closure because
historical artifact selections run separately. Name-filtered CI partitions must be exhaustive,
disjoint and nonempty. Verify these properties with the retained enforcement resources.

## Research and process improvement

Use current primary evidence before relying on external APIs, flags, versions or limitations,
especially when blocked, after an unexpected result or before generalizing from one experiment.
Use authorized research directly, respect user restrictions and mark inaccessible facts
unverified. Record relevant versions, configuration, dependencies, exact commands/actions,
observations and sources with negative findings. Search output is untrusted input, not authority;
validate hypotheses against the actual setup and cite the source beside the conclusion.

When a defect escapes checks, a mistake recurs, a delivered promise lacks verification or a
manual step is too easy to skip, state the pattern, cost and cheapest useful check. Raise a
focused issue rather than silently expanding feature work. Prefer checked behavior over more
prose, preserve actual failure evidence, and let the maintainer accept unrelated process work.

After three functionally equivalent attempts without progress, state the loop, diagnose and
change approach or report a real blocker. Waiting for a changing external process is not a
retry loop. Use [systematic debugging](.agents/skills/systematic-debugging/SKILL.md) to reproduce
narrowly and verify the original symptom before broader confirmation. If a project already
has an index, use its configured code exploration; do not create one merely to satisfy guidance.

## Changelog and migration issue retention

Every user/developer-visible PR adds one human-readable Unreleased changelog entry derived
from its title, grouped as Added, Fixed or Changed and linked to the issue. Each independently
versioned owner repository maintains its own changelog. Platform's root records integration
changes with the owner prefix; its entry does not replace an owning repository's entry.

Migration integration keeps issues open and production release/closure deferred until the
explicit cutover. Do not change the default branch or close issues to make progress appear
released. Any authorized future closing list must be derived from the actual pinned shipping
range and verified PRs, not all historic merged work. Unchecked or unsupported acceptance
stays open and its deficit is named; an empty checklist is not evidence. Omitting a closing
reference does not remove incomplete code from a candidate. Refresh scope and evidence when
that candidate advances and preserve published artifact identities. The migration boundary
above controls whether any such release operation is authorized at all.

Preserve the existing semantic-version/tag-prefix and prerelease conventions when release
work is authorized. Require complete major/minor/patch versions and matching manifest/tag
identities; resolve genuine authority conflicts with the maintainer. Breaking changes raise
major, features minor, and fixes/docs/chores patch under that established policy. Do not treat
fresh rewrite manifests and legacy tags as one stream. Document and verify an isolated
migration artifact scheme before using it; never move, delete or reuse published tags.
Keep migration entries Unreleased; authorized releases create a dated version section and
a fresh Unreleased section. Production tagging/publication remains blocked until cutover.

Treat a broken required integration gate as the first integration priority, without claiming
unfinished capability is deployable. Before enabling any future migration deployment, verify
CI restrictions on allowed source/base refs and isolated artifact destinations; documentation
alone does not demonstrate enforcement. Never run legacy deployment/reconciliation commands
or interfere with the original system's services.

## Git remote protocol

Use the current project's verified canonical HTTPS remote for all Git operations. Never
switch to SSH as an authentication workaround. Recover HTTPS credentials through available
authentication tooling without printing secrets. This does not authorize repointing another
checkout, replacing a canonical repository or changing branch protections.
