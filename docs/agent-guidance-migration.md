# Cordis agent guidance migration

Issue: #876. This is a parent Platform guidance change authorized by the user. It
does not initialize or update children, resume application work, or authorize cutover.

## Source and branch boundary

Base: verified origin/cordis at 20cb9a0034d3c813f78e8d824ea813c7537c3538.
Starter: [Scaffold](https://github.com/fractalsynapse/scaffold) at
92cf2d08fa28a7f4383bd34f4500193bcdfdb31a.
All work and the integration PR remain on the Cordis path. Never merge or synchronize
legacy staging/main into this branch. No source, state or configuration in unrelated
worktrees is changed. The initializer's narrowly bounded bootstrap exception is separate
from ordinary migration work and does not permit reinitializing existing checkouts.

## Intended package

Refresh ten shared skill entry points, add the debugging procedure, and retain the
specialized initializer: twelve skills under the existing .agents/skills directory.
Keep the initializer and UI metadata, source-readability helper and test-layout helper
byte-identical. These programs enforce project policy; they are not illustrative code
to remove. Retire the obsolete browser companion and copied authoring examples/resources.

The generic procedures defer to the project root. They cannot choose staging as the
migration base, remove architectural requirements, relax review/CI, or bypass child setup
review. Scope the no-example restriction to reusable skill instructions; product docs
can still show verified examples of the project's selected technologies.

## Directive preservation matrix

The named binding blocks below remain verbatim, including their existing exclusions
and implementation-resumption limits. This update does not silently resolve historical
milestone authorization; that is separately tracked in #724.

| Existing directive | Treatment |
| --- | --- |
| Task 3B CLI/archive identity, root lock correspondence and fresh-cache verification. | Retain the opening artifact contract; do not change composition pins, archives or locks. |
| Development-only scope and private target-project instructions. | Preserve runtime independence and explicit fixtures; clarify that development-only instruction checks may inspect this package. |
| Cordis Migration Branch Boundary, including eventual cutover. | Preserve the entire block verbatim. No legacy synchronization, promotion, release channels or implicit cutover. |
| Repository and Plugin Ownership. | Preserve the entire block verbatim, including independent repositories, owner contracts, exclusions and exact artifact integration. |
| Architecture: TypeScript Classes and Swappable Plugins. | Preserve the entire block verbatim, including native composition, class methods, lifecycle, provider selection, identity and substitutability. |
| Critical Architecture Rule: Readable Capability Layers. | Preserve the entire block verbatim, including 20 canonical body lines, pinned formatter, baseline/exception protections and enforcement. |
| Issue branches, docs-first work, acceptance, current CI/review and agent permission limits. | Keep binding in root workflow policy; use concise generic skill procedures subordinate to that policy. Read-only work is explicitly non-mutating. |
| Specialized child bootstrap exception and review/resumption pause. | Preserve both root exception and initializer. One setup-only local commit, no implementation/publication, preserve differing licenses and exclude the initializer from children. |
| Permanent Test Organization. | Preserve the entire block verbatim, including four tiers, fixtures, discovery/count parity, CI partition coverage and no hidden registrations. |
| Production construction, built-program tests and failing observable tests for capabilities. | Retain root requirements. Prose/guidance-only work uses applicable artifact checks rather than manufactured application failures. |
| Issue closure deferred to release/cutover. | Retain non-closing migration references and open issues. No production release procedure is made active by importing generic release guidance. |
| Task-owned merged-branch cleanup, remote/local verification and long-lived refs. | Retain safe cleanup; no pruning/deletion of unrelated worktrees or branches. |
| Changelog per visible PR and independently versioned owner. | Retain root integration entry and owner boundaries; no version bump or owner-repo changes here. |
| Primary-source research, configuration-specific negative findings and untrusted content. | Retain, without host-specific research tool names or redundant approval loops. |
| Process self-evaluation and loop guard. | Retain pattern/cost/cheapest check, separate process scope and diagnosis after equivalent failed attempts. |
| HTTPS-only Git operations. | Retain; no transport/configuration mutation in the original checkout is needed. |

## Plan and executable contract

1. Commit this intent before changing tests or guidance; record baseline policy checks.
2. Establish an installed-package acceptance check before migration. Preserve metadata,
   local resources, explicit root authority and code-free skill bodies with negative controls.
3. Refresh shared entry points and root procedures while retaining the blocks/resources
   listed above. No application/runtime code or dependency changes.
4. Replace regression requirements for embedded examples with rejection controls and
   root-authority/resource checks. Preserve prohibition of approvals, secret output,
   production mutation and premature migration issue closure. Keep class-based test code
   and permanent tier locations. Wire checks through existing test commands and workflows.
5. Run relevant acceptance/regression, strict type checking, test-layout/readability and
   static metadata/link checks; compare preserved blocks/resources against the base.
   Exercise independent reader scenarios without live child setup or service mutations.
6. Open an issue-linked PR to cordis with source identity, mapping, actual evidence and
   limits. Required CI/review remain gates; no waiver is inherited from another repository.

## Review scenarios

Walk through a bounded documentation correction, a class/provider addition, an urgent
legacy-promotion request, new eligible child setup with a differing license, excluded
TreeDX setup, existing dirty child setup, one-PR inspection, and unchanged-evidence reuse.
Inspect concrete next actions and stopping points. Reader walkthroughs and package
checks do not prove downstream runtime behavior or execute the initializer.

## Recorded validation

The installed-package acceptance failed before migration on embedded examples and the
missing twelfth skill; preservation checks already passed. The old authoring/GitHub
regressions passed on the original package, then failed on the expected requirements for
removed examples/resources. Their replacements preserve rejection controls rather than
requiring sample implementations or foreign installer flags.

Local validation used the repository CI versions, Bun 1.4.4 and Node 24.19.0, from a
temporary tool cache. No project dependency, archive, composition pin or lockfile changed.
The workstation's Node 22 could not directly load these .mts tests; that prerequisite
failure was not treated as a failing guidance acceptance test.

- Installed guidance acceptance: three passing checks, including exact hashes for the
  five retained root sections, initializer/UI metadata and both enforcement helpers.
- Complete existing regression command: 28 passing tests across Node and Bun suites,
  including authoring/GitHub rejection controls, fixture locks, assembly selection,
  test discovery, built presentation cleanup and transient read-back.
- Readability acceptance: ten passing checks, including changed-method, compression,
  provenance, baseline-tampering and exact-exception rejection.
- ArcNexus catalog acceptance: four passing checks; existing ownership remains intact.
- Normal test-layout/readability checks and strict type checking of the new/changed
  guidance test files: exit zero. All twelve skill packages pass metadata validation;
  local Markdown target paths resolve and the diff passes whitespace checks.
- Independent read-only comparison and eight reader walkthroughs found no actionable
  regression. A targeted preservation follow-up restored explicit live integration-ref
  verification/synchronization and evidence refresh before merging. These were instruction/decision reviews, not live agent or initializer
  execution. The retained historical Task 3A resumption constraint remains explicit;
  this update does not resolve the separately tracked milestone issue #724.

These 45 distinct local tests do not prove the full installed/runtime product. Live
Docker/browser/Kata acceptance and other owner runtime suites were not run for this
instruction change. Hosted checks and required review remain separately observable
integration gates; no documentation-only CI waiver is inherited from Scaffold or SAIP.
