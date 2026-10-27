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

## Verification in progress

All seven implemented owners have passed checks/builds and their prior unit, regression and
integration runs. Classification review subsequently moved real filesystem/native composition
coverage into integration. CLI has zero isolated unit specifications and reports that explicitly.
Agent has zero specifications and no application/dependency scaffold. Final rechecks, full
program acceptance, frozen assembled scenarios and CI remain outstanding until recorded below.

The Astro acceptance rerun exposed a missed fixture-directory reference, which was corrected
without changing assertions. A subsequent run hit `/tmp` inode exhaustion; using a private
main-filesystem temporary directory passed the same genuine Astro build/hydration case.
No unrelated temporary directories, legacy worktrees or running services were removed.
