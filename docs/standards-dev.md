# Standards-Based Independent Development

## Status and purpose

This document is the migration contract for replacing TreeSeed's transitional exact-commit dependency propagation with independently developed, tested, versioned, and released projects.

TreeSeed is one product composed from 31 repositories. It is not one source tree. Each project owns its implementation, public standards, guarantees, releases, and compatibility policy. Projects integrate through published contracts and semantic versions, not through sibling source checkouts, parent gitlinks, ambient lockfiles, or coordinated commit fan-out.

The target outcome is simple to state:

> A compatible patch to one project changes and releases that project only. Consumers continue to work within their declared version ranges. A consumer changes only when it deliberately adopts a new capability, resolves an incompatibility, or refreshes a dependency under its own governance.

This strategy supersedes the development and staging dependency-source policy in [Reconciliation Platform](./reconciliation-platform.md) where it requires `github:owner/repo#<commit-sha>` propagation. Exact commits remain valid evidence for repository custody, assignment checkpoints, source builds, and reproducibility. They cease to be the public compatibility contract between projects.

## Non-negotiable principles

1. **Every repository is independently operable.** A clean clone can install, build, test, verify its contracts, and produce its artifacts without an unpublished sibling checkout.
2. **Standards are the integration boundary.** A project consumes versioned protocols, schemas, packages, images, templates, or test kits. It does not consume another project's working tree.
3. **Guarantees prove outcomes.** A type declaration, mock, route count, or successful process is not proof that a consumer-visible promise works.
4. **Semantic versions describe compatibility.** Version choice is derived from a machine-readable contract comparison and reviewed behavior, not guessed from commit messages or dependency position.
5. **Implementations are private by default.** Only intentionally published surfaces are contracts. Refactoring an implementation behind an unchanged contract does not disturb consumers.
6. **Compatibility is directional.** A producer proves its new artifact satisfies its prior contract; important consumers also run published consumer-driven cases against the candidate.
7. **Staging composes releases, not source branches.** Integration environments resolve compatible prerelease artifacts into an explicit bill of materials.
8. **Production is immutable.** Production consumes exact package versions and image/content digests selected from an accepted staging composition.
9. **No global lockstep release.** A portfolio release is a composition record, not a new version of every member.
10. **Governance remains project-local.** Cross-project standards coordinate expectations but never grant one project authority to modify or release another.

## Vocabulary

- **Standard:** a stable, versioned description of an interaction shared by producers and consumers.
- **Contract:** the machine-verifiable portion of a standard owned and published by one project.
- **Guarantee:** a durable product promise with exact evidence and an owning verifier.
- **Artifact:** an immutable package, image, schema bundle, template, content publication, test kit, or executable produced by a release.
- **Compatibility attestation:** a signed or digest-bound result describing the contract delta, required semantic bump, verification, and evidence.
- **Consumer range:** the semantic versions of a dependency that a consumer claims to support.
- **Composition:** an exact set of resolved artifact versions and digests proven to operate together.
- **Generation:** the digest of the relevant source, definitions, contracts, configuration, verifiers, and artifacts used for a proof run.

## Canonical ownership model

Every project owns, in its own repository:

- its source and package-local documentation;
- its public contract sources and generated contract bundle;
- its semantic version and changelog;
- deterministic contract and compatibility tests;
- its package-local guarantees and verifier entrypoints;
- its build, artifact publication, and rollback procedure;
- its declared producer and consumer relationships in `treeseed.package.yaml`.

Platform owns composition, inventory, compatibility planning, local runtime reconciliation, and portfolio evidence. Platform must not become the source owner, build substitute, version owner, or release script for its member projects.

The API control plane owns durable governance, assignments, receipts, guarantee evidence, and promotion authority. The CLI and UI are clients of the same operations. An agent receives only the contract and repository authority frozen into its assignment.

## Contract families

Each public surface belongs to one of the following families. A repository may publish more than one contract, but each contract has one stable identifier, owner, version, artifact, verifier, and compatibility policy.

### HTTP and event APIs

The canonical bundle includes:

- normalized OpenAPI operations and schemas;
- authentication and authorization requirements;
- idempotency, confirmation, pagination, filtering, and concurrency behavior;
- error codes and stable error-envelope fields;
- webhook, server-sent event, and WebSocket message schemas;
- ordering, replay, cursor, retry, and delivery semantics;
- declared side effects and authoritative postcondition reads.

OpenAPI structure alone is insufficient. Behavioral test vectors must cover authority, errors, idempotent replay, stale writes, and postconditions.

### TypeScript and shared libraries

The canonical bundle includes:

- exported entrypoints, symbols, types, classes, functions, and schemas;
- parameter and return types, thrown/returned error contracts, and async behavior;
- serialization formats and stable identifiers;
- documented side effects and supported runtimes;
- package export maps, peer requirements, and tree-shaking/runtime constraints.

Only public exports are compared. Internal files are not contracts and consumers must not import them. Portable contract packages must not pull provider adapters, application composition, persistence, or orchestration into consumers.

### Services and execution providers

The canonical bundle includes:

- connectivity and discovery protocol;
- request, response, streaming, health, readiness, cancellation, and shutdown contracts;
- configuration schema and secret names without secret values;
- capability, lane, concurrency, budget, and native-limit declarations;
- retry, idempotency, accounting, observability, and failure semantics;
- immutable image identity and source-closure attestation.

Service compatibility is verified against the packaged service or image, never against an ambient developer process.

### CLI surfaces

The canonical bundle includes:

- command and subcommand grammar;
- positional arguments, flags, defaults, mutual exclusions, and confirmation rules;
- role and simulated-human requirements;
- exit statuses and stdout/stderr separation;
- versioned JSON input/output schemas;
- prompt behavior, idempotency, and authoritative postcondition output.

Human prose may improve in a patch. Removing a command, changing a default with behavioral impact, renaming a field, changing an exit status, or changing machine JSON incompatibly requires a major version.

### UI applications and libraries

The canonical bundle includes:

- stable routes, route parameters, feature capabilities, and authorization states;
- exported component names, props, events, slots, and design-token contracts;
- accessibility roles, names, keyboard behavior, focus behavior, and forced-color expectations;
- client/server data contracts and supported browser/runtime policy;
- stable scene/test identifiers where they form a verification interface.

Pixel layout is not automatically a public contract. A documented journey, accessible interaction, component API, or consumed design token is.

### TreeDX and content

The canonical bundle includes:

- model identifiers and versioned frontmatter schemas;
- identity, path, relation, provenance, publication, and migration rules;
- query request/result schemas, bounds, permission semantics, and freshness rules;
- signal and artifact receipt contracts.

TreeDX queries remain dynamic. Test evidence may persist definition revision, observed source ref, assertions, result digest, and aggregate statistics; query result payloads are never committed as cached content.

### Templates, seeds, and scenes

The canonical bundle includes:

- template identity, version, input schema, managed files, bindings, and upgrade policy;
- seed resource schemas and idempotent desired-state semantics;
- scene configuration and stable action/assertion schemas;
- explicit exclusion of credentials, logs, runs, screenshots, videos, databases, journals, and generated evidence.

Template installations record exact template versions. Tenant-owned divergence is never overwritten silently.

### Agents and governed workflows

The canonical bundle includes:

- agent, group, query, query-set, instruction-template, permission, tool, signal, and proposal-type schemas;
- profile selection and immutable authority snapshots;
- estimate, assignment graph, timing window, workset, checkpoint, review, reporting, receipt, settlement, and cleanup contracts;
- semantic artifact assertions and forbidden outcomes;
- simulation and production upstream-mutation policy.

An agent guarantee passes only when the exact repository or content outcome is correct, reviewed, integrated, read back, settled, and residue-free.

## Contract bundles and fingerprints

Each published project version produces a normalized `treeseed.contract-bundle/v1` containing:

- project and repository identity;
- artifact name and proposed semantic version;
- one or more stable contract IDs and contract-family versions;
- normalized contract documents and a digest for each;
- supported runtimes and compatibility ranges;
- guarantee IDs and verifier versions that protect the surface;
- deprecations with first-deprecated and removal-not-before versions;
- source commit, build provenance, artifact digests, and generation digest.

Normalization must remove ordering and formatting noise without erasing meaning. The previous released bundle is the comparison baseline. If no prior release exists, the initial bundle is reviewed as a new contract rather than inferred from the current source tree.

The comparison produces `treeseed.compatibility-attestation/v1` with:

- every added, removed, narrowed, widened, or behaviorally changed element;
- classification and rationale per change;
- the minimum allowed semantic bump;
- producer verification and consumer-driven results;
- affected guarantees and invalidated evidence generations;
- reviewer identity and authoritative artifact read-back.

Publication fails if the proposed version is lower than the required bump or required assertions are absent, skipped, stale, mock-only, or refer to another artifact.

## Semantic version policy

TreeSeed follows SemVer for every public artifact.

### Patch

A patch release preserves all supported public behavior. Examples:

- internal refactoring or performance work behind unchanged contracts;
- a compatible bug or security fix that makes behavior conform to the existing standard;
- documentation clarification that does not change a normative requirement;
- additional tests or verifier diagnostics;
- optional metadata that tolerant consumers already permit and ignore.

A patch may not require edits to a compatible consumer. Publishing an SDK patch therefore does not rewrite API, Agent, CLI, Core, Admin, UI, or other project manifests.

### Minor

A minor release adds backward-compatible capability. Examples:

- a new optional API operation or response field under declared extensibility rules;
- a new optional exported function or component prop;
- a new CLI command or opt-in flag;
- a new optional service capability, content model revision, or template input;
- a new guarantee that does not redefine an existing promise.

Consumers adopt a minor release only when their declared range permits it. A consumer must change when it uses the new capability, not merely because the producer published it.

### Major

A major release is required for a removed, renamed, narrowed, newly required, or behaviorally incompatible public contract. Examples:

- removing or renaming an endpoint, field, export, command, route, component prop, model, signal, or tool;
- changing accepted input, output meaning, authentication, authority, side effects, ordering, error identity, exit status, or default behavior incompatibly;
- making an optional field required;
- changing a stable identifier or serialization format;
- ending support for a runtime or consumer range;
- tightening an existing guarantee in a way that invalidates previously conforming consumers.

Deprecation does not eliminate the eventual major bump. It creates a supported migration window before removal.

### Pre-1.0 artifacts

SemVer treats `0.y.z` as unstable. TreeSeed will not use that as permission for invisible breakage. Until a public artifact reaches `1.0.0`:

- a compatible fix uses a patch bump;
- a breaking contract change uses a minor bump and is labeled `breaking` in the attestation;
- consumers must use explicit supported ranges rather than `*`;
- contracts required for the internal-development cutover must graduate to `1.0.0` once their baseline is accepted.

After `1.0.0`, normal patch/minor/major rules are mandatory.

## Compatibility policy

Compatibility is evaluated in four layers:

1. **Structural:** schemas, signatures, exports, command grammar, routes, and manifests.
2. **Behavioral:** normative examples, error cases, permissions, idempotency, side effects, and postconditions.
3. **Consumer-driven:** published cases from declared consumers run against the candidate producer artifact.
4. **Integrated:** the smallest Platform composition and live guarantees required by the changed contract run against exact candidate artifacts.

Structural compatibility cannot overrule a behavioral break. A behavioral verifier may raise the required semantic bump above the structural comparison.

Each standard declares an extension policy. Open enums, additive object fields, unknown event types, and optional capabilities are compatible only when consumers are required and tested to tolerate them. Otherwise an apparent addition may be breaking.

Deprecations must name the replacement, first deprecated version, supported migration path, and removal-not-before version. The default support window is one major line and at least 90 days unless a security issue requires an explicitly governed exception.

## Published artifacts and dependency resolution

Development may use local source within the one project being edited. Cross-project tests consume published artifacts or an explicitly built candidate artifact with an immutable digest.

- npm libraries publish semantic versions and prerelease versions such as `2.4.0-rc.3`.
- services publish semantic image tags plus immutable OCI digests.
- APIs publish versioned OpenAPI/event bundles and compatibility test kits.
- templates publish immutable template bundles.
- content publishes immutable manifests and object digests.
- CLI and UI packages publish their contract bundles beside distributable artifacts.

Staging resolves prerelease or released artifacts into `treeseed.composition/v1`. The composition records exact versions, digests, contract bundles, compatibility attestations, and verification evidence. Production locks exactly that accepted composition. Semantic ranges express compatibility in source manifests; resolved locks and composition receipts provide reproducibility.

A package manager may select a newer compatible patch or minor version inside a consumer's declared range. Dependency reconciliation is an explicit consumer operation that updates its lock, runs its verification, and records why the resolved artifact changed. A producer release does not automatically commit that update to consumers.

Urgent security upgrades may trigger portfolio reconciliation, but each affected consumer still verifies and publishes its own result. There is no central force-update that bypasses project ownership.

## `treeseed.package.yaml` federation metadata

The package manifest becomes the portfolio discovery record. It should declare, in a versioned `standards` section:

- contracts produced: ID, family, source, generated artifact, compatibility policy, verifier, and current version;
- contracts consumed: ID, semantic range, required capabilities, and consumer test-kit entrypoint;
- distributable artifacts and registries;
- package-local verify, contract-build, compatibility, release, and rollback operations;
- supported runtime/platform ranges;
- guarantees protecting each produced or consumed contract;
- deprecations and migration guides.

The SDK compiles these declarations from all 31 live project records into a portfolio compatibility registry and directed dependency graph. The registry is derived evidence, not another hand-maintained source of truth.

Cycles in build-time dependencies are forbidden. Protocol-level collaboration may be bidirectional only through independently versioned contracts. A cycle discovered in the package graph must be broken by extracting a stable protocol/contract artifact or reversing ownership, not hidden in Platform.

## SDK decomposition

The current SDK is both a contract owner and a broad runtime substrate. That makes an unrelated implementation change appear relevant to every consumer. The migration will separate concerns without creating duplicate authority systems:

1. Identify stable portable contract domains and give each a bounded public entrypoint and contract bundle.
2. Keep schemas, identifiers, pure policy, and client interfaces free of reconciliation engines, provider adapters, filesystem mutation, and application composition.
3. Move heavy implementations behind separately versioned runtime entrypoints or artifacts.
4. Require consumers to depend only on the narrow public contracts they use.
5. Extract a separate contract package only when bounded entrypoints cannot prevent installation, runtime, or release coupling. Extraction is not mandatory merely to rearrange files.

No compatibility alias is retained solely to avoid deciding ownership before the first stable release. Once stable, deprecations follow the normal window.

## Guarantees and release gates

Contracts describe allowed interaction; guarantees prove important outcomes. Each guarantee retains a stable capability ID, exact dependencies, required and forbidden assertions, evidence generation, and owning verifier.

A release gate must distinguish:

- deterministic contract verification, which every candidate runs;
- package acceptance, which proves the packaged artifact;
- live/integrated guarantees, which run only where real infrastructure or providers are material;
- portfolio compositions, which prove selected versions together.

A mock, fixture, GET-only check, string assertion, generic artifact count, or process exit cannot satisfy a live guarantee. Relevant contract or verifier changes invalidate only affected evidence generations, then transitively invalidate guarantees that depend on them. They do not reset unrelated projects.

Agent-system activation remains stricter: baseline, clean-repeat, and interruption/resume must pass against one immutable generation. Correct repository outcomes, integration, settlement, and zero residue remain mandatory.

## Independent change and release workflow

For a normal project change:

1. Materialize only the owning repository and published dependencies required by its assignment.
2. Freeze the accepted contract baselines and consumer test kits.
3. Change implementation and, only when intentional, contract sources.
4. Build the candidate artifact and normalized contract bundle.
5. Compare it with the previous release and compute the minimum semantic bump.
6. Run package verification, compatibility checks, affected guarantees, and independent review.
7. Save and stage only the owning repository.
8. Publish the immutable prerelease/release artifact and compatibility attestation.
9. Let Platform test the candidate in a composition.
10. Notify affected consumers. Update them only when their range excludes the version, they elect to use a new capability, or verification reveals a real incompatibility.

Example: an SDK `2.3.4` implementation fix with an unchanged contract becomes `2.3.5`. API's declared `^2.3.0` remains valid and API receives no source commit. A later API lock refresh may resolve `2.3.5` and verify it without changing API's public version if its own artifact is unchanged.

Example: API removes a response field. Compatibility comparison requires the next major. The candidate cannot publish as a patch. Declared consumers receive exact failed test cases and can migrate on their own branches while the prior API major remains supported.

## Platform's role

Platform is the central development workbench and composition laboratory. It:

- discovers project and contract metadata from live inventory;
- resolves compatible artifact sets;
- creates assignment-scoped exact-ref worksets;
- reconciles local services from immutable artifacts;
- runs cross-project and live guarantee campaigns;
- records bills of materials, evidence, and promotion receipts;
- exposes incompatibilities and upgrade plans.

Platform does not permanently clone all writable repositories, rewrite every consumer after a producer change, own member versions, or use its lockfile as portfolio identity. Market and Market API remain ordinary team projects accessed through governed assignment custody; content remains TreeDX-owned.

## Migration plan for the 31 projects

### Phase 1: inventory and baseline

- Enumerate every primary and content repository from live team inventory.
- Inventory all imports, Git dependencies, route descriptors, images, CLI surfaces, templates, schemas, guarantees, and implicit runtime assumptions.
- Select one canonical owner for each shared contract and remove or plan migration of duplicates.
- Generate an initial contract bundle for every distributable project without claiming compatibility not yet tested.

### Phase 2: contract tooling

- Add SDK-owned portable schemas for contract bundles, compatibility attestations, compositions, and portfolio registry entries.
- Add family-specific normalizers and comparison engines.
- Add package-local contract build/check commands and registry-backed CLI discovery.
- Publish reusable consumer test kits without source-checkout dependencies.

### Phase 3: stable foundations

- Establish stable 1.0 contract baselines for the narrow surfaces required by API, Agent, CLI, Core, Admin, UI, provider runtimes, TreeDX integration, and templates.
- Decompose broad SDK entrypoints so a consumer installs only needed contracts/runtime capabilities.
- Publish immutable artifacts and prerelease channels.

### Phase 4: consumer migration

- Migrate one dependency edge at a time from Git commit refs to semantic ranges and immutable artifacts.
- Prove each consumer from a clean independent clone.
- Preserve mixed-version support during the declared window.
- Remove transitional submodule/gitlink and commit-propagation behavior only after the replacement edge passes.

### Phase 5: composition and cutover

- Compile the full 31-project compatibility registry.
- Resolve and verify a Platform staging composition.
- Run the governed source canary using independently versioned artifacts.
- Run the fifteen canonical agent guarantees and Guide golden campaign against one pinned composition generation.
- Update [Project Architecture Migration](./project-architecture-migration.md), [Reconciliation Platform](./reconciliation-platform.md), and [Production Readiness Migration Ledger](./production-readiness-migration-ledger.md) with exact evidence.

## Rollback and mixed-version operation

Every release retains its prior immutable artifact and contract bundle. Rollback selects the last accepted composition; it never rebuilds a mutable tag. Database, content, or durable-event changes require forward/backward compatibility across the support window or a separately verified migration/rollback contract.

Services must tolerate the declared range during rolling upgrades. Producers must not assume all consumers update simultaneously. Consumers must not assume a compatible producer is at the newest version. Capability negotiation uses explicit advertised capabilities, not version-string branching when a protocol field is available.

## Anti-patterns

The following fail the target architecture:

- changing consumer manifests because an upstream implementation commit changed;
- importing sibling source or generated files from another checkout;
- using a Platform/root lockfile as evidence that each package is independently releasable;
- labeling an unreviewed contract change patch because TypeScript compiles;
- relying only on OpenAPI or type diffs for behavioral compatibility;
- broad wildcard dependency ranges;
- mutable image tags or staging branches as production identity;
- automatic cross-repository commits after publication;
- duplicate schemas maintained independently by producer and consumer;
- declaring success from a package build while exact consumer or repository outcomes fail.

## Initial implementation backlog

The first governed standards initiative should deliver a thin end-to-end slice, not migrate all contracts at once:

1. Add the four portable metadata contracts: contract bundle, compatibility attestation, composition, and registry entry.
2. Extend `treeseed.package.yaml` validation with produced/consumed standards.
3. Implement TypeScript public-API and OpenAPI normalization/comparison first.
4. Publish a narrow SDK contract candidate and prove an unchanged patch does not alter API, Agent, CLI, Core, Admin, or UI repositories.
5. Add one consumer-driven API/SDK case and one insufficient-version-bump rejection.
6. Resolve a Platform composition from published candidate artifacts.
7. Convert the remaining contract families incrementally and migrate dependency edges one at a time.

## Acceptance criteria

The standards migration is complete only when:

- all 31 projects appear in the live compatibility registry with owned contracts, artifacts, guarantees, and supported ranges;
- every software project passes install/build/test/contract verification from a clean independent clone;
- no project requires an unpublished sibling checkout or parent gitlink;
- a compatible producer patch can be saved, staged, and published without changing any consumer repository;
- compatible additions and breaking changes are correctly forced to minor and major versions;
- insufficient semantic bumps are rejected with exact contract diagnostics;
- consumer-driven tests run against packaged candidate artifacts;
- Platform resolves, verifies, records, and can roll back an immutable staging composition;
- only projects with deliberate source or contract changes receive commits;
- the governed source canary completes using the standards-based composition;
- all fifteen canonical agent guarantees become active against one pinned generation;
- the Guide editorial campaign produces the intended canonical repository outcome;
- the migration ledger truthfully records the retirement of exact-commit dependency propagation and the Market submodule compatibility workspace.

Until these criteria pass, the current Platform clone is the migration workbench, not proof that internal agent development is ready.
