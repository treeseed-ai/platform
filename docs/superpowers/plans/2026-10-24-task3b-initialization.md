# Task 3B owner initialization and review gate

> **For implementing agents:** Use the actual available workflow/testing tools, preserve the user's execution method, and deliver one bounded task at a time. Checkboxes record verified results, not intentions. Retain child-repository setup pauses.

**Goal:** Prepare the three new owners needed by Task 3B, then stop for maintainer setup review before implementation.

**Architecture:** API owns the native server root; Identity owns issuer/session/principal integration; Admin owns the minimal browser status/session facade. Existing CLI, SDK and Deployment keep their capabilities. Platform owns composition and assembled verification only.

**Tech Stack:** Setup uses same-history Git worktrees and exact Git blob/mode export. Later runtime work retains strict TypeScript classes and native Cordis 4.0.0-rc.12; no dependencies or runtime scaffold belong to this setup delivery.

**Spec:** Approved [Task 3B](2026-10-24-cordis-composition-providers.md#task-3b-first-installed-composition-and-durable-host-root) and [composition design](../specs/2026-10-24-cordis-composition-providers-design.md). Tracking: [Platform #713](https://github.com/treeseed-ai/platform/issues/713).

## Global constraints

- Parent setup is the verified Platform cordis commit `1af95f186dd98e366813b0bf6242e8d119f41550`, containing reviewed Task 3A integration. Never copy a feature working tree.
- Destinations are independent, Platform-ignored `packages/{project}` checkouts sharing each canonical repository's original Git history/common directory.
- Export AGENTS.md, .gitignore, LICENSE and every tracked skill/resource with original modes, excluding the entire initialize-project directory. Preserve differing original licenses/notices.
- Initial bootstrap is setup-only, local and unpublished. No changelog, package manifest, application source, dependency installation, copied helper execution, owner test/build or container action is allowed in these new owners before review.
- Preserve original checkouts/indexes/HEADs, staging/main and unrelated branches/services. Keep every issue, including #678, open until release.
- Agent MUST receive this same clean same-repository cordis initialization, exact setup inheritance and explicit review/publication gate when Task 3D selects it. It is not initialized during Task 3B. TreeDX stays its existing implementation; UI and AI are not selected here.

## Review focus

1. A destination/ref already exists or appears during preparation: preserve it and stop; never reset or reinitialize it.
2. A symlink redirects a destination or the Git common directory belongs to another owner: reject before clearing anything.
3. Parent or selected staging heads move after pinning: stop rather than silently selecting another baseline.
4. Clearing loses a differing license, notice, hidden resource or executable mode: exact committed blob/mode inventory must catch it.
5. API/Agent is treated as an exception to the initializer or implementation continues past setup review: explicit owner gates below remain mandatory.

## Selected owner baselines

| Owner / issue | Canonical repository | Verified staging source | Destination | License |
| --- | --- | --- | --- | --- |
| API [#616](https://github.com/treeseed-ai/api/issues/616) | treeseed-ai/api | `c8e18e22f322f33550726bfe65aa79c889307f2b` | `/home/adrian/Projects/treeseed-cordis/packages/api` | Exact original AGPL LICENSE |
| Identity [#43](https://github.com/treeseed-ai/identity/issues/43) | treeseed-ai/identity | `9d8794f93fdacd6593290e2c90e239cdbd6eb1a7` | `/home/adrian/Projects/treeseed-cordis/packages/identity` | Apache-2.0 |
| Admin [#134](https://github.com/treeseed-ai/admin/issues/134) | treeseed-ai/admin | `4e9307fed7226c4a33004ea5a159a70e993423fd` | `/home/adrian/Projects/treeseed-cordis/packages/admin` | Apache-2.0 |

Each source tree has one root LICENSE and no additional root notices. Export inventory is 26 files / 10 skills per child, with API's LICENSE replacing the parent blob.

## Setup steps

- [x] Review approved Task 3B: durable fixed-protocol worker, typed apply/status/application, format-1 preservation and explicit format migration, real configured identity, database/edge/server/HTTPS asset readiness and native roots.
- [x] Create owning initialization issues and a Platform issue branch from freshly verified origin/cordis.
- [x] Complete all three preflights before clearing: exact live heads, absent destinations/cordis refs, safe ignored paths, original working-file/index/legacy-ref and ignored/untracked/worktree inventory, exact license/setup blobs.
- [x] Create API, Identity and Admin worktrees sequentially at their pinned baselines; verify repository identity, clean state and registration immediately before tracked-file removal.
- [x] Export only the pinned allowlist, preserve licenses, and create one issue-linked local setup bootstrap per child with both exact source commits.
- [x] Compare complete committed file contents/modes with source blobs; verify history/common directories, clean children, unchanged originals and no remote cordis publication.
- [x] Record exact bootstrap commits and stop for maintainer review/adjustments. Explicit resumption and publication authority are required before owner issue branches or runtime work.

## Implementation after setup review

Task 3B implementation remains authorized in scope but gated by the requested new-owner review. After explicit resumption, reload owner instructions, publish only approved baselines, create owner issues/branches from fresh origin/cordis, map each legacy capability to its same-owner plugin/public export/test, and commit detailed owner docs and SDK protocol/format contracts before tests/code.

The implementation must revalidate exact artifacts at apply, preserve Task 2 format-1 plans, introduce an explicit installation-format migration, enforce one installation-scoped writer/idempotent durable application, and run a fixed worker that survives client/server exit. API consumes Deployment's public boundary; Identity uses a qualified maintained issuer/session integration; Admin keeps server token custody. Do not replace the actual configured identity/database/edge/server/browser scene with injected fakes or an HTTP-200 readiness claim.

Pin identity/edge/database artifacts, local authority and credential/bootstrap protocol, worker launch/acknowledgement/recovery rules, and bounded interruption acceptance before implementation. These details require the next owner documentation/test cycle; setup is not evidence of a working installed host. Task 3C package management, Task 3D Agent code, transport parity and full recovery remain separate slices.

## Verified local review handoff

| Owner | Local cordis bootstrap | Committed tree | Verification |
| --- | --- | --- | --- |
| api | `72e410ae2e4edb0be4fd6e1d7d5005bfc7b63866` | `dd33b519ff1ceb193bbaa5741b3aaa168de54e5b` | 26 files / 10 skills; clean and unpublished |
| identity | `a6490542de7bacbcae0ab7ee8d905362be5282ab` | `05941639bd80e40141a81d84550953a577c3f80a` | 26 files / 10 skills; clean and unpublished |
| admin | `511ae68c949913ec59b63b52041d8a708cb4c690` | `05941639bd80e40141a81d84550953a577c3f80a` | 26 files / 10 skills; clean and unpublished |

All committed blobs and executable modes match the exact parent Git tree, with API's original
AGPL LICENSE substituted. Original file bytes/modes, indexes, HEADs, local staging/main refs,
untracked/ignored inventory and preexisting worktree registrations match the saved preflight;
only the intended new child worktree registrations were added. Each bootstrap's parent is its
selected staging commit, and each Git common directory remains its original canonical owner.
Platform tracks no child source. Existing CLI/SDK/Deployment, Agent/UI and TreeDX were not changed.

API's baseline contains an uninitialized fixture gitlink. Git 2.53.0 recursive removal failed
after deleting inherited .gitmodules in the new worktree only. Its index still matched the exact
baseline; original snapshots were rechecked before finishing index-only removal and removing
confirmed empty fixture directories. Final setup verification passed. This bounded recovery
changed no original submodule storage and did not reinitialize a user-owned partial checkout.
[Git's documented cached removal](https://git-scm.com/docs/git-rm#Documentation/git-rm.txt---cached)
removes only index entries; the separate process proposal records the regression needed before
changing initializer instructions.

No copied helpers, owner tests/builds, dependencies, application scaffold, containers, baseline
publication or product implementation ran. Stop here for maintainer review, adjustments and
explicit resumption/publication direction. This is setup completion, not Task 3B runtime completion.
