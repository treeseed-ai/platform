# Task 2: Non-activating deployment plans implementation plan

> **For implementing agents:** Deliver the approved bounded Task 2 through issue branches and outside-in verification. Checkboxes record evidence, not intentions.

**Goal:** Verify exact local release inputs and persist private plans without activation.

**Architecture:** SDK owns contracts. Deployment owns resolution/host/store. CLI calls its public package. Platform pins exact artifacts and tests the assembled executable.

**Tech Stack:** strict TypeScript classes; Bun 1.4.4, TypeScript 5.9.3, Zod 4.6.7; jsonc-parser 3.3.1, tar 7.5.22, semver 7.8.5; native Ubuntu 26.04 x64 Docker boundary.

**Spec:** ../../platform-contract.md, Task 2 in 2026-10-23-cordis-platform.md and the owner READMEs.

## Global constraints

- Local prepared bundles only; no resolver downloads or script/plugin execution.
- No apply, container starts, credential creation or legacy service mutation.
- Persist only unblocked plans in the installation's private .cordis journal.
- Preserve owner repositories and exact archive interfaces; no relative source imports.
- PRs target cordis, use Part of issue references, and remain for review. All issues including #678 stay open until release.

## Review focus

- Individually valid artifacts that describe different compositions must fail binding checks.
- Recipe fields may not smuggle host paths, commands or plaintext credentials.
- Directory replacement and archive mutation must fail closed without escaping owned paths.
- Repeated planning revalidates changed sources; saved read-back remains independent of source availability.
- An empty installation directory does not prove ownership of existing Docker resources.

## Delivery sequence

1. SDK #453: commit docs; write schema/projection/plugin/error tests; run intended red; implement executable contracts; run bun run verify and package exact candidate.
2. Deployment #904 resolver slice: commit docs; actual-file resolver tests; red; strict lock/tar/OCI/recipe/plugin verification; owner checks/tests/build. Then persistence/host slice: outside-in default host plan tests; red; private store and read-only host inspection; complete owner verification. Split PRs at ten changed files.
3. CLI #311: docs then built plan_changes_no_runtime test; red against existing executable; consume exact SDK/Deployment candidates; implement parsing/output; bun run verify.
4. Platform #697: docs then assembled tests; pin exact source trees and artifact digests; build/execute assembled verification and ubuntu-26.04 CI. Read all diffs, publish review candidates, retain CI evidence and keep issues open.

## Verification commands

Each owner: `bun run check`, `bun run build`, `bun run test:unit`, `bun run test:integration`, `bun run test:smoke` (or `bun run verify`). Platform uses its documented assembled Node tests and exact CLI toolchain. No speculative root package manager or runtime is introduced.


## Task 2: non-activating plans

`trsd platform plan --file CONFIG [--json]` validates an explicitly prepared local release bundle. It never downloads, installs packages, imports plugin code, runs scripts, binds ports, loads images, creates credentials or starts containers. Apply remains unsupported. Successful plans describe future effects, not an active or healthy installation.

Configuration retains installationId, engineContext, installationDirectory (absolute), origin (loopback), runtimeState, plugins (exact id/package/version/archive SHA-256) and credentialReferences (unique `secret://<slot>` values). Add `release: {directory: ABSOLUTE_PATH, manifestDigest: SHA256}`. The installation and bundle must be disjoint. JSON object keys and semantic sets normalize deterministically; artifact byte identities remain exact.

The SDK release inventory version 1 binds `packageJson`, `lockfile`, and `recipe` descriptors `{path,sha256}`, requiredPluginIds/requiredServices, package entries `{name,version,path,sha256}` and image entries `{id,reference,layout,indexSha256,manifestDigest}`. All paths inside the inventory are relative and contained without symlinks. Image references are digest-only and match the selected OCI manifest. Package archives exactly cover the flat locked runtime closure; Bun v2 registry and local tarball records are accepted, without resolving versions or contacting a registry. Unsupported lock forms fail closed. Selected plugin package metadata is produced from the SDK PluginDefinition declaration also used for class static provide/inject fields.

The recipe is a restricted Compose JSON object with services/volumes/secrets. Service fields: image, depends_on (names), ports (long-form target/published/host_ip/protocol tcp), volumes (type volume/source/target/read_only) and secrets (names). Exactly one published port matches origin; localhost maps to 127.0.0.1, IPv6 literals to ::1. Volume declarations are empty local objects; secret declarations are `{file: '.cordis/credentials/<slot>'}` and match configuration references bijectively. No command/entrypoint/environment/build/include/interpolation/host mount/custom network/privileged/external/hook fields. Named resources derive from `cordis-` plus the first 16 hex SHA-256 characters of canonical `{installationId,installationDirectory}`.

Deployment validates native Ubuntu 26.04 x64, local Docker Linux amd64 context/endpoint/daemon identity, capacity, ownership and ports. Port checks read Linux TCP tables without binding. Existing project containers/networks/volumes block; planning adopts no runtime. Only fresh/empty owned installation directories or valid owner-private plan-only state are accepted.

Plans bind normalized configuration, configuration/release/lock/recipe digests, expected engine, expectedComposition null, exact package/image artifacts and typed future effects. No timestamps or volatile capacity samples enter the digest. ID is `plan-<digest>`. Only unblocked plans are persisted under installation/.cordis (0700 directories, 0600 records), with no-overwrite atomic publication and verified read-back. Descriptor-anchored access rejects symlinks and unsafe ownership/permissions. Repetition revalidates inputs before byte-identical reuse. Interrupted/foreign/malformed state blocks; no automatic adoption or repair. Stored read-back does not require the source bundle, and grants no permission to apply.

CLI exits: 0 verified saved plan; 1 sanitized runtime/I/O failure; 2 invalid arguments/JSON/schema; 3 prerequisites/artifact/authority/state blockers. Blocked responses have result null, structured blockers and no saved reference. Never echo invalid input, archive content, credentials or engine stderr. SDK PlanningBlockedError carries only validated safe blockers. Seven remote operation IDs remain unchanged; platform.plan stays a write operation because saving a plan needs local ownership.

Verification: documentation first; outside-in built-program failure before implementation; exact read-back/modes/determinism; immutable/architecture/graph/recipe/secret/path/journal negative cases; no-runtime snapshots; actual default construction; all owner check/build/unit/integration/smoke gates plus assembled acceptance. Test fixtures are not a production application composition. CI must run a positive plan on ubuntu-26.04 and fail visibly if prerequisites are absent. No container starts, even in tests.
