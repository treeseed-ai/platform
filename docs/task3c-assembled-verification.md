# Task 3C assembled verification

Platform assembles exact public owner archives and built executables. It owns no container,
identity, transport, renderer or lifecycle implementation. Task 3B evidence and original
repositories remain retained. Agent setup and Task 3D are outside this delivery.

`composition/task3c.json` records the exact SDK, Deployment, UI, Identity, Admin, API and CLI
sources, archive/binary digests and qualification fixture recipe. An isolated
`verification/task3c` consumer locks these public archives independently of the historical
Task 3B harness. Owner builds and fixture producers remain in their owning repositories.

`bun run test:extensible` must invoke the built CLI against genuine Deployment public fixtures:
NPM, packaged HTTPS Git, approved source-only Git, two separately bound instances, registered
source-free selection/retry, qualified native live readiness replacement and unsafe reverse
selection. Observe direct private protocols, unchanged existing receipts/private bytes/CA,
independent worker identity and safe JSON exit/state distinctions. No nominal import-only
qualification substitutes for these programme observations.

`bun run test:ui` must consume API's public exact-archive fixture producer with matching
SDK/Deployment/Identity/Admin/UI archives and runtime lock. It builds the actual API image,
starts genuine Postgres/Keycloak/Caddy/API fixture services through accepted plans, verifies
private-CA HTTPS, authenticated browser status/refresh/logout and measured immutable assets.
Replace only the UI archive and rebuild the matching Admin assets, API image/runtime closure
and CLI executable using the same owner source. Assert the visible UI fixture marker in both
browser and human terminal output while machine JSON/exit behavior and Keycloak authority
remain unchanged. A changed API image requires explicit reviewed restart scope.

Migration verification separately creates a genuine format-2 fixture, requires explicit
non-serving authorization, preserves old saved bytes/artifacts/private paths/TLS/resources,
and verifies format-3 custody and interruption fencing. No implicit migration or restart is
permitted. Incomplete qualification keeps Task 3C open and the review candidates draft.

Required CI runs on Ubuntu 26.04 with actual Docker, managed source helpers and Firefox/private
CA prerequisites. Missing prerequisites fail. All cleanup is limited to verified fixture-owned
resources/processes. Keep every issue, including #678, open; hand back PRs for review without
merging, publishing production artifacts or beginning Task 3D.

## Reproduction

Install exact dependencies in `packages/cli` and build its pinned source, then install the
independent `verification/task3c` consumer with `bun install --frozen-lockfile --ignore-scripts`.
Run `bun run check:task3c`. `bun run test:extensible` executes all four owner-built CLI scenes;
CI partitions them onto separate fresh runners. `bun run prepare:ui` rebuilds the matching
Admin/API/CLI fixture closure once into the ignored verification output, then `bun run test:ui`
executes the real same-installation replacement. The input and output directories are explicit;
existing output is refused rather than silently reused. Exact archive hashes and canonical
owner source heads are checked before builds. Only the UI fixture changes, with all required
consumer assets/image/binary rebuilt through their own source.

`bun run test:migration` creates a separate detached historical CLI worktree beneath ignored
verification output, installs the original Task3B archives/lock and runs the original real
programme with the explicit current Deployment custody check. Successful fixture execution
removes only that clean temporary worktree. Failure preserves its evidence for diagnosis.
The original historical composition record and owner working checkouts are unchanged.

`verification/task3c/prerequisites.mts` explicitly prepares digest-pinned test images before
any accepted application; apply does not pull. CI requires actual Docker/Compose and
Firefox/NSS tooling on Ubuntu26.04, plus all four source scenes, UI and migration jobs in the
final aggregate. No prerequisite skip counts as acceptance.

The checkout action initially supplies HTTPS remotes without the canonical `.git` suffix.
CI must explicitly normalize each fixture owner's origin to its declared canonical HTTPS URL
before source identity checks. The strict checks remain intact; the first hosted UI job caught
this setup mismatch before any fixture activation.

Hosted qualification also exposed the acquisition-plus-two-selections Git build case reaching
its existing 420-second owner deadline. Acquisition and source-free registered selection are
separate required owner/Platform jobs, keeping the deadline and all assertions. The selection
case starts from one genuine installed archive and verifies two further activations with the
source stopped; acquisition independently keeps two named installs and exact offline replay.

UI qualification also binds the generated Admin archive, API archive, CLI binary and variant
runtime lock to recorded hashes. Both preparation and the programme wrapper verify the exact
selected base/variant paths and bytes before activation; stale prepared input cannot replace
the composition's accepted selection. The runtime lock itself is an explicitly hashed input.

The hosted UI jobs at c55035c timed out before programme execution: the runner's Azure APT
mirror transferred roughly 55MB of signed browser dependencies at tens of kilobytes per second.
The logs name each package and show no UI execution. This is a measured runner configuration,
not a Playwright capability limit. Disposable CI setup selects Ubuntu's official archive mirror
in the runner mirror list before installing dependencies, preserving suites, signatures and
existing job budgets. See the [runner-image incident](https://github.com/actions/runner-images/issues/12949)
and [Ubuntu archive documentation](https://ubuntu.com/project/docs/how-ubuntu-is-made/concepts/package-archive/).
Actual rerun evidence, not this hypothesis, must clear acceptance.

A controlled second build under umask0022 reproduced the hosted digest refusal: Admin's
archive differed by file modes (0644 versus0640), cascading into the API archive; the CLI
binary stayed identical. The fixture build programme therefore sets/restores a canonical
private umask0027 across source extraction, owner builds and packing. Qualification must
produce the same pinned bytes even when its caller uses a different umask. Existing frozen
owner archives are preserved; no live installation permission rule changes.
