# Permanent test organization and development strategy

The maintainer authorized this cleanup before further Task 3D implementation. Scope is the
nine initialized Cordis repositories and shared future initialization setup. Original legacy
checkouts, TreeDX and uninitialized projects remain untouched. Every issue stays open.

## Required structure and classification

Permanent executable test specifications live under `tests/acceptance/`, `tests/regression/`,
`tests/integration/` or `tests/unit/`. Filenames describe capability and behavior, never migration
phase numbers. Acceptance includes built-program smoke and browser/end-to-end behavior;
regression pins a previously observed defect or an explicitly identified security failure;
integration exercises real collaborator/package/provider boundaries; unit isolates a contract
or computation. A negative case alone is not necessarily regression. Classify by observation
boundary and purpose rather than the old test-name prefix. Mixed files must be split.

Reusable fixtures, executable fixture programs and test data may live under `tests/support/`;
this directory contains no test registrations or hidden test suites. Shared fixture behavior
must not replace test methods in their proper tier. Keep public test-helper package exports
stable; internal generated paths may change with explicit package metadata updates.

## Development and delivery

Follow Issue/Plan -> Documentation -> Tests -> Implementation -> Release. Commit documentation
first; write tests outside-in: acceptance, regression, integration, unit. Test each injectable
seam through default production construction, and test every user program as a built program.
Green unit tests alone do not clear the gate: owner checks, build, all applicable tiers, CI and
assembled artifact smoke evidence are required. Empty tiers are documented honestly; do not
invent redundant tests or silently skip missing prerequisites.

## Preservation and enforcement

Inventory test registrations and assertion-bearing method bodies before moving them. Record
old/new path and tier correspondence, preserve exact test bodies, inputs, timeouts and negative
cases, then verify coverage parity and discovery. Update imports, fixtures, build entrypoints,
public helper exports, CLI partition inventories, owner scripts, docs and CI. A default check
must reject misplaced/phase-named specifications, helper-hidden test registrations and stale
tier discovery. Verify that rejected fixtures actually fail; prose alone cannot enforce layout.
Each owner maintains its own checks and tests through public interfaces; Platform owns assembled
verification and shared initialization policy. Strict TypeScript classes remain required.

Durable assembled tests and preparation programs receive capability-based paths. Historical
composition selection records and immutable package/image archives retain their exact names,
bytes and provenance. They are release evidence, not runtime modules. Tests can consume those
pins without retaining a task name. Do not rebuild or overwrite frozen archives just to rename
source tests, and do not update pins to unrelated candidates. Owner acceptance runs exercise the
new owner source; frozen assembled scenarios still exercise their recorded exact candidates.

All AGENTS.md and release-workflow copies gain the same policy. The parent initializer already
copies those files from an exact parent tree, so future reviewed setup inherits the rule. Agent
currently has no implementation or tests; update its setup instructions without scaffolding an
application, dependencies or fake tests. Keep the API committer policy unchanged.

Changes use one issue branch per owning repository from freshly verified origin/cordis. Hand
back reviewed PRs targeting cordis; do not resume Task 3D while cleanup remains incomplete.
