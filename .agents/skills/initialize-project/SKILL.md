---
name: initialize-project
description: Use when asked to initialize an existing TreeSeed project for the Cordis rewrite, creating a fresh same-repository worktree and inheriting Platform setup. Excludes TreeDX and application implementation.
---

# Initialize a TreeSeed Cordis project

Initialize only the project(s) the user selects. Adding/loading this skill does not
initialize the portfolio. Run it from the parent Platform workspace; children must not
inherit this skill. Keep each capability in its existing canonical repository.

## Exclusions and outcome

**TreeDX is excluded before any mutation**, by canonical repository identity as well as
project/path name. It remains the existing Elixir/Rust service, not a Cordis rewrite.
Do not branch, clear, copy setup into, or change TreeDX through this skill. Platform itself
and third-party dependencies are not child initialization targets. Existing scope exclusions
such as AI remain in effect unless the user explicitly changes them.

Success is a new local `cordis` bootstrap commit in `packages/{project}`, containing only:

| Content | Immutable source |
| --- | --- |
| `AGENTS.md`, `.gitignore`, `LICENSE` | One verified parent Platform `origin/cordis` commit. |
| `.agents/skills/` with all support files/modes | Same commit, **excluding the entire `initialize-project/` directory**. |
| Differing project license and required notices | Verified project's original baseline; replaces the parent license where different. |

API and Market API retain their existing AGPL license exceptions. Preserve any other differing
project license/notices too; initialization does not relicense a project. If provenance or
license selection is unclear, stop before clearing. No manifests, runtime source, generated
outputs, credentials or starter application are copied.

## Preflight — finish before clearing

1. Load the parent's actual `AGENTS.md` and `release-workflow`. Create/adopt the owning
   initialization issue; identify canonical HTTPS remote, original checkout and project slug.
   Inspect original dirty/untracked state and worktrees without changing them. Verify actual
   remote identity; a folder named `sdk` pointing to TreeDX or another repo is not SDK.
2. Fetch parent `cordis`, compare fetched SHA with the live remote ref, and pin it. Enumerate
   tracked setup paths at that commit with Git tree inspection. Require the three root files
   and skills; exclude this skill before export. Preserve all tracked skill resources, hidden
   files and executable modes. Reject symlink/submodule setup entries rather than following
   links. Never copy from the parent's current feature branch, dirty files or filesystem cache.
3. Fetch/verify the project's selected protected baseline (`staging` unless the user names a
   different existing protected ref). Pin its exact commit and license/notice blobs. Check
   both local and remote `cordis` existence and the worktree inventory. Never reset, reuse
   blindly or force-push an existing branch. An existing initialization is inspected/reported,
   not wiped again; dirty, retained, partial or unrelated work remains untouched.
4. Resolve the destination beneath the actual parent `packages/` directory and verify the
   parent's ignore rule covers it. Reject existing paths, symlinked/escaping parents, the
   original checkout, or an unexpected Git common directory. Create only missing owned parent
   directories. No initialization may target the parent's root or another project's checkout.

## Prepare and copy

5. If destination and both `cordis` refs are absent, create a **new worktree of that same
   project repository** on a new local `cordis`, starting at the pinned project baseline.
   Before deletion, read back its absolute top level, branch, HEAD, canonical remote, Git
   common directory and worktree registration: they must match the selected project and
   destination. Its common directory must match the original project's, not Platform's.
   Require a clean checkout with no unexpected untracked/ignored files. Recheck ownership
   immediately before clearing; on failure stop without deletion or automatic cleanup.
6. Remove inherited tracked files only in this verified new checkout using Git's tracked-file
   removal. Preserve `.git` and repository history. Do not use broad `rm -rf`, `git clean -fdx`,
   reset, or any command in the original checkout. Unexpected residual content stops the task.
7. Export the explicit allowlist from the pinned parent Git tree (for example, Git archive
   over the three root files and each included skill directory). Do not export all of Platform.
   Restore differing project license/notices from the pinned project baseline. Copy bytes and
   executable modes; do not install a package or execute inherited skill helpers. Verify the
   complete resulting file inventory against the declared copy set, including hidden files;
   verify contents/modes against source Git blobs. The initializer directory must be absent.

## Commit, verify and stop

8. Create one local bootstrap commit with the issue reference and exact parent/project source
   refs in its message. **This is the bounded exception to the ordinary issue-feature-branch
   gate:** the initial clear-and-copy commit establishes local `cordis` before normal development
   is possible. It contains setup only; no separate changelog, implementation or second empty
   baseline commit. Read back the committed tree/blobs and confirm the destination is clean,
   original checkout state is unchanged, and no legacy branch moved. Do not push/publish refs
   or change GitHub settings as part of this local initializer.
9. Report project/remote, destination, baseline and parent SHA, bootstrap commit, copied skill
   inventory, license exceptions, verification and any retained blocker. **Stop for user review,
   project-specific adjustments and explicit resumption before scaffolding, dependencies,
   tests/builds or implementation.** Copied setup replaces manual installation, not this pause.
   Reload the child's actual instructions after any user edits. Publication of a new `cordis`
   baseline requires user direction; afterward ordinary issue branches use verified
   `origin/cordis` and PRs target `cordis`. Never promote to legacy `staging`/`main` here.

## Common mistakes

- Parent working-tree copies mix uncommitted or moving sources: export the pinned Git tree.
- Copying only `SKILL.md` loses support resources: verify the full tracked tree minus this skill.
- Re-running initialization is not permission to wipe existing user work: preserve/report it.
- A successful copy is setup completion, not permission to start Task 1 or initialize another repo.
