# ArcNexus steward qualification

This catalog bootstrap (#866) prepares a real integration target for ArcNexus's
single-steward qualification. It does not authorize a Cordis cutover, deployment,
repository initialization, or functional changes in independent package owners.

Platform owns the integration catalog, artifact selection and diagnostic program.
SDK, Deployment, CLI, API, Identity, Admin and UI remain independent repository
owners. An assignment has one writable primary owner. Declared dependency worktrees
are pinned and read-only during inference; ignored `packages/` is a mount location,
not a generated directory to discard recursively.

The initial assignment improves artifact-inventory diagnostics: deterministic file
ordering and explicit added/removed/modified kinds. Its implementation, acceptance
and review are a subsequent steward assignment. No historical composition selection
or archive identity is changed by this catalog work.

Preparation requires existing Node 24.19.0 and Bun 1.4.4. Local bindings name installed
tools and existing repository checkouts. ArcNexus creates dedicated worktrees and
installs declared dependencies from committed locks; it does not install runtimes,
fetch/clone source, initialize repositories or activate services. Use a fresh package
cache to verify archive hashes rather than inheriting workstation resolution state.

The dedicated qualification composition selects the Task 3B CLI commit supplying
root lockfile archives and the Task 3C SDK commit as read-only architectural context.
It documents why these distinct selections coexist; historical manifests remain
unchanged. Assembly support uses its own committed Task 3C archive dependencies.

Acceptance is non-activating: catalog validation, ownership/scope checks, existing
policy/layout checks and artifact inspection through public package APIs. Normal
repository CI remains an integration gate; focused checks are not a substitute for
full platform CI. Runtime/provider changes belong to their package owners.

ArcNexus definitions describe real repository ownership, purpose, constraints and
bounded execution permissions. They do not depend on the retired Architecture Studio,
its architectural language, or separate intent/implementation blueprints. Maintained
platform contracts and owner public interfaces supply related engineering context.

The diagnostics steward can edit the assembly helper directory, but its installed
`tests/support/assembly/node_modules` subtree is explicitly read-only. Dependency
implementations and installed verification tools do not acquire write authority.

Dependency caches belong under the primary workspace's `node_modules/.cache/arcnexus`,
which test discovery excludes, never beneath `tests/` or a scanned cache directory. Bun resolves `--cache-dir` relative to its selected `--cwd`;
the assembly installation therefore uses `../../../node_modules/.cache/arcnexus/assembly`.
The qualification CI job runs `tests/support/assembly/prepare-qualification.mts`,
which executes the same declared prerequisite/setup commands from the repository
root, then runs the diagnostics component's complete baseline verification.

Preparation also removes group/other write permission from the candidate root and
its committed Task 3C archive path. Public archive inspection rejects writable
ancestor directories and archives even when Git reports clean content; a fresh
checkout under a permissive host umask otherwise fails this existing safety check.
This declared setup changes no file content or Git executable bits and rejects
symlinks in the archive path. Owner source checkouts are never changed.
