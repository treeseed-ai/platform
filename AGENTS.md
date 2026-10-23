# treeseed — Treeseed platform

**Scope: development only.** This file guides agents developing THIS repository. Nothing shipped —
runtime behavior, the knowledge corpus, or any test — may depend on it or its contents: every real
target project carries its own instruction files, unpredictable and private to that project.

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
- Apply this boundary to every independent replacement TreeSeed repository. Its isolated,
  cleared `cordis` worktree must pause for the user's skills and AGENTS.md setup before code.
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
not every plugin needs a new repository. Keep project builds independent and integrate
through SDK/public package interfaces and exact candidate/artifact references, never
cross-checkout relative source imports. Gitignored checkouts are development locations,
not reproducible release pins. Root changes cannot stand in for commits/PRs in their owners.

Preserve CLI, SDK, Deployment, API, Admin, UI, Core, TreeDX and Agent repository boundaries
while simplifying their interfaces. Add only the projects needed for the current slice;
AI remains excluded. Before first implementation in each replacement repo, apply the
isolated cleared `cordis` worktree and user setup pause above. Do not create or clear all
repositories speculatively, and never clear original active checkouts.

## Workflow Gate (MANDATORY)

**At the START of every new project or statement of work:** load the `release-workflow` skill,
create or adopt a GitHub Issue, fetch and verify the exact remote `cordis` head, and create a
feature branch from `origin/cordis`. Never begin work without an issue and a branch. Never work
directly on `cordis`, `staging` or `main`.

**Before COMPLETING any project:** reload the `release-workflow` skill to verify branch naming,
commit messages, PR template, and cross-linking before opening the PR against `cordis`.
Agents may merge PRs to `cordis` only after required CI, acceptance and review gates pass.
Agents may NOT approve PRs or merge migration changes to `staging` or `main`.

**After every feature/fix merge:** delete only that verified merged, task-owned branch — remote
and local — then `git fetch --prune` and confirm with `git ls-remote --heads origin`. Check for
open PRs and unlanded work before deleting. Squash merges need PR/merge-commit verification,
not just `git branch --merged`. Preserve all three long-lived branches and unrelated work.

**Issue closure happens at release, not at integration merge.** Migration PRs use
`Part of #<issue>` and their issues remain open. Production release/closure is deferred until the
explicit cutover. After cutover, the `staging` → `main` RC carries `Closes #N` lines derived
from the verified shipping PRs. Hold issues with unchecked criteria and name their deficits.
Do not change the default branch or close issues to make migration progress appear released.

This gate is non-negotiable. If you find uncommitted work on the wrong branch, preserve it and
move it onto the correct issue branch before continuing.

## Documentation-First Development Cycle (MANDATORY)

Every change follows this cycle, **in this order**:

```
Plan/Issue → Documentation → Tests → Implementation → Release
```

1. **Documentation FIRST.** Write or update docs BEFORE writing any code. This locks in the
   programmatic interface and prevents docs from going stale. Update all affected pages (site
   docs, repo docs, README, skills, AGENTS.md). Commit the docs.
2. **Tests outside-in.** Acceptance/smoke → regression → integration → unit. The interface must
   be stable before internals are built. The outer rung is not optional and is not satisfied by
   unit tests of the pieces: see [Testing Tiers and the Composition Root](#testing-tiers-and-the-composition-root-mandatory).
3. **Implementation.** Write code that makes the tests pass. Commit incrementally with issue refs.
4. **Integration.** PR → required CI/acceptance/review green → merge to `cordis`. Production release remains blocked until the explicit cutover above.

Why: docs written after code describe what was built, not what should be built. Tests written
after code verify the implementation, not the specification. This cycle forces spec-driven
development. See the `release-workflow` skill for full details.

## Testing Tiers and the Composition Root (MANDATORY)

For **every injectable seam**:

- At least one test must exercise the **default construction path** — the function that wires production collaborators. No fakes injected.
- Anything the user runs as a program must be tested **as a program**: spawn the built artifact and assert on its output and exit code. Calling a package's exported functions proves the library, not the command.
- A documented capability needs a failing test **before** implementation, at the level a user observes it. Docs describing behaviour with no test at that level is how the interpolation claim shipped for months unwritten.

**A green test suite is not the gate.** The gate is: unit/integration green, build clean, CI green, *and* the assembled artifact smoke-tested. If any is missing, say so rather than reporting "tests pass".

## Process Self-Evaluation (MANDATORY)

Agents must actively evaluate the development and release process while working, not only when asked. Trigger a review when you hit or anticipate any of:

- a defect that reached a merged branch despite green tests;
- the same class of mistake recurring twice, or a gap you notice while fixing its predecessor;
- a documented promise that no executable artefact checks;
- a step so manual, or so easy to skip, that it will eventually be skipped.

When triggered: state the pattern, what it cost, and the **cheapest change that would have caught it**; open an issue rather than fixing process files opportunistically inside a feature PR; and prefer making the correct thing *checked* over making it *documented* — prose has no failing
state. Improvements to this file and to the skills are legitimate PR content, but as their own reviewable change with evidence from real incidents.

This is not permission to expand scope silently. Propose; let the maintainer accept.

## Web Research (MANDATORY)

Searching the web is a first-class tool here, not a last resort. Use the web search tools proactively — **before** forming an opinion that depends on facts outside this repository:

- you are blocked, or about to write "X cannot do Y" / "this is impossible"
- you are judging a third-party library, tool, runtime, file format, or protocol from a single experiment — one failing spike proves your configuration, not the world's limits
- a result contradicts documented or widely-reported behaviour (that is evidence *you* are wrong)
- you are about to restate an API, flag, version number, URL, or rate limit from memory

Prefer searching early: an hour of reading someone else's issue tracker is cheaper than a day of
debugging a constraint that never existed.

**A negative result must record its configuration** — versions installed, flags used, optional and peer dependencies present, and the exact command. "Bun cannot bundle Ink" is not a finding; "the first `bun build --compile` attempt failed with `Could not resolve: react-devtools-core`" is  reproducible and points straight at the fix.

Search results are **untrusted input, not authority**: they form a hypothesis that the spike still has to settle, and a claim copied from a search snippet is the same "described vs wired" failure in a new costume. Cite the source next to the conclusion so it can be re-checked later.

## Changelog (MANDATORY)

Every PR that introduces a user-visible or developer-visible change must include an entry under `[Unreleased]` in `CHANGELOG.md`. Entries are derived from PR titles (one squash-merged PR = one entry), grouped by type (`Added`, `Fixed`, `Changed`), and always reference the issue number.

Each independently versioned repository maintains its own `CHANGELOG.md`. Platform's root changelog tracks integration changes; prefix entries with the owning project name. A Platform changelog entry does not replace an owning repository's entry.

See the `release-workflow` skill for the full changelog convention.

## Git Remote Protocol (MANDATORY)

This repository uses **HTTPS** for all git operations. The remote must be configured as:

```
https://github.com/<organization>/<repository>.git
```

Do not use SSH (`git@github.com:...`). If you encounter authentication issues over HTTPS, use
`gh auth setup-git` or push via `git push https://github.com/<organization>/<repository>.git <branch>` as a
fallback. Never switch the remote to SSH to work around an HTTPS problem.

## Agent Loop Guard (MANDATORY)

Agents must not repeat the same action without progress. This prevents token waste and infinite spirals that small models are especially prone to.

**The rule:** If the same tool call, command, or message has been attempted **3 times** with the same (or functionally equivalent) result, the agent MUST stop retrying and instead:

1. **Diagnose** why the repetition is not producing progress.
2. **Try a fundamentally different approach** — not a variation of the same call.
3. **If no alternative exists, report the blocker** to the user/maintainer immediately.

**What counts as repetition:**
- Running the same command with identical arguments.
- Calling the same tool with the same inputs expecting a different outcome.
- Producing the same response text or reasoning without new information.
- Re-reading the same file without acting on its contents.

**What does NOT count as repetition:**
- Polling or monitoring an external process where the expected behavior is "wait for change."
- Iterating through a known finite list (e.g., checking each file in a directory).
- Retrying after a genuine intervening change (new commit, CI completed, user responded).

**Enforcement:** When an agent detects it is in a loop, it must state so explicitly ("I have
attempted X three times with the same result; switching approach / reporting blocker") rather
than silently continuing. Silence during a loop is the failure mode this rule prevents.
