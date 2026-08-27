# Development and Platform Release Architecture

## Status and purpose

This document defines the target architecture for fast local development, candidate verification, independent project release, Platform composition, and managed-host activation across TreeSeed projects.

It complements [Standards-Based Independent Development](./standards-dev.md), [Reconciliation Platform](./reconciliation-platform.md), [Package Ownership](./package-ownership.md), and Deployment's [host architecture](../packages/deployment/docs/architecture.md). Where an older document requires Git-source staging, sibling source propagation, or a full published release before interactive testing, this document and `standards-dev.md` supersede that requirement.

TreeSeed must support two needs without weakening either one:

1. developers need a fast, real-time loop for API, UI, library, agent, and background-process work; and
2. operators need immutable, digest-bound releases that the Platform manager can verify, activate, repeat, roll back, and promote.

The development system is therefore an input to the release system, not an alternative release system. A live development session may prove that an idea works. Only frozen candidate artifacts and an accepted Platform composition may prove that a release works.

## Goals

- Preserve independently owned repositories, contracts, versions, builds, tests, and releases.
- Allow UI changes to reach a browser in seconds without publishing npm packages or container images.
- Allow an API and its UI consumer to be developed together against real authentication, account, team, and application state.
- Allow agents and background processes to be compiled locally and exercised through safe drain, restart, and health boundaries.
- Keep stable hostnames, API connections, OAuth callbacks, cookies, Mailpit links, and managed service dependencies while selected components run from local source.
- Let SDK, UI, Core, and similar libraries update live consumers without treating incomplete build output as valid.
- Convert a successful development closure into immutable candidate packages and images without changing its source.
- Retain standards contract comparison, package acceptance, integrated guarantees, exact artifact selection, rollback, and promotion as release gates.
- Restore the last known-good managed composition automatically when a development session ends or fails.

## Non-goals

- Development mode is not production deployment or staging promotion.
- A source mount, workspace link, dirty worktree, hot reload, fixture, or successful process is not release evidence.
- The manager does not become the build or version owner for member projects.
- Platform does not fetch writable project source on behalf of a development session.
- Development Compose files do not replace packaged production Compose bundles.
- The development system does not bypass API authority, OAuth policy, database migration review, assignment leases, provider capacity, or branch protection.
- Not every project needs a development container. Libraries normally publish watched package output rather than run a service.
- Hot reload is not required or permitted for runtimes whose correctness depends on process initialization, leases, durable cursors, or native state.

## Architectural principles

1. **One manager, two evidence classes.** The manager may coordinate both development and release runtimes, but it records them as different kinds of state.
2. **Project-owned recipes.** Each repository declares how it builds, watches, reloads, restarts, verifies, freezes, and cleans its development targets.
3. **Stable integration boundaries.** Hostnames, service identities, ports, connection IDs, authentication behavior, and API authority remain stable while an implementation changes underneath them.
4. **Smallest affected closure.** A change reloads or rebuilds only declared consumers and dependencies.
5. **Explicit reaction semantics.** Dependency edges declare `reload`, `restart`, `rebuild`, `stale`, or `manual`; the manager never assumes all dependents must restart.
6. **State is protected separately from code.** Live code replacement never implies an automatic database migration, assignment cancellation, or durable-state reset.
7. **Source is exploratory; artifacts are admissible.** Linked output can accelerate development, but cross-project verification uses packed packages, built images, or other immutable candidate artifacts.
8. **Same-origin development by default.** The manager preserves canonical local hostnames so OAuth, cookies, redirects, CORS, and browser security behavior remain representative.
9. **Fail closed and restore.** An invalid recipe, incomplete output, failed health gate, expired session, or unsafe replacement restores or retains the known-good release.
10. **Promotion never rebuilds.** The artifacts accepted from the frozen candidate closure are the artifacts published and selected by Platform.

## The two planes

### Development plane

The development plane operates on a named, time-bounded session associated with explicit local repository worktrees. It may use:

- file watching and incremental compilation;
- local package output;
- development-only Compose `build` directives;
- source mounts or synchronized source;
- hot module replacement;
- bounded process restart;
- locally built container images;
- disposable or cloned development state;
- focused tests and browser scenes.

Every development runtime is visibly marked non-promotable until it is frozen. The manager records the worktree identity, source commit, dirty-state digest, recipe digest, dependency closure, active modes, endpoints, and health observations.

### Release plane

The release plane consumes only immutable artifacts:

- npm tarballs with exact versions, integrity, and SHA-256;
- OCI images with immutable multi-platform digests;
- local-tool archives with SHA-256;
- normalized contract bundles and compatibility attestations;
- component manifests and production Compose files by exact URL and digest;
- Platform integration releases with exact artifact and component selections;
- signed Deployment catalogs and Debian packages.

Production Compose bundles continue to reject source mounts, `build` directives, mutable image references, undeclared ports, and missing health gates. A development feature must never relax those checks in the release path.

## Runtime modes

Each selected development target has exactly one active mode:

| Mode | Source | Typical use | Promotion status |
| --- | --- | --- | --- |
| `released` | Platform-selected immutable artifact | Normal managed operation and comparison baseline | Admissible |
| `candidate` | Locally built immutable package, image, archive, or executable with digest | Integrated testing before publication | Admissible after verification |
| `live` | Watched local source or generated output | Interactive development and exploratory design | Never admissible directly |

A host may mix modes. For example:

```text
SDK       live package build
UI        live package build
Core      live package build
Admin     live Astro service
API       live Node service
Agent     candidate manager/runner images
TreeDX    released service image
Postgres  released managed state service
```

Mode selection is per target, not per host. Unaffected components remain on the exact known-good release.

## Development runtime federation contract

Projects opt in through a versioned `development` section in `treeseed.package.yaml`. The SDK owns the portable schema. The project owns the declared commands, Compose file, build outputs, health behavior, and verification entrypoints. Deployment and the manager consume the schema without embedding project-specific rules.

An illustrative manifest is:

```yaml
development:
  schemaVersion: treeseed.development-runtime/v1
  targets:
    - id: package
      kind: package-watch
      command: npm run build:watch
      ready:
        kind: marker
        path: dist/.treeseed-build-complete.json
      outputs:
        - path: dist
          mediaType: application/vnd.treeseed.node-package
      freeze:
        command: npm pack --json
        artifact: "*.tgz"
      consumers:
        admin: reload
        api: rebuild
        agent: rebuild

    - id: service
      kind: compose-service
      composeFile: deploy/compose.development.yml
      composeService: admin
      buildTarget: development
      endpoint:
        id: http
        port: 4322
        canonicalAlias: admin.treeseed.localhost
        healthPath: /healthz
      reaction: hot-reload
      dependencies:
        - id: api
          capability: control-plane-api
          locality: either
      statePolicy: stateless
      freeze:
        kind: oci-image
        dockerfile: Dockerfile
        target: production
```

The final schema must support:

- stable target ID and kind;
- supported platforms and runtime requirements;
- source roots and ignored paths;
- setup, watch, build, start, stop, freeze, verify, and cleanup operations;
- development Compose identity when applicable;
- atomic build-completion markers;
- endpoints, aliases, health gates, and connection requirements;
- dependency reactions;
- state and migration policy;
- secret and file bindings by reference, never value;
- shutdown, drain, cancellation, and replacement behavior;
- artifact outputs and digest algorithms;
- timeout and resource bounds;
- log and diagnostic locations;
- forbidden operations and promotion constraints.

Unknown target kinds, undeclared commands, ambiguous outputs, unsafe paths, missing health gates, or unsupported manager capabilities fail before runtime mutation.

## Development target kinds

### Package watch

`package-watch` is intended for SDK, UI, Core, and other libraries. It runs an atomic incremental build and publishes completed output into a session-owned package overlay.

The manager must not expose a half-written `dist` tree. A package watcher writes into a temporary generation, verifies required exports and its completion marker, and atomically selects that generation. Consumers observe only completed generations.

There are two consumption levels:

1. **exploratory link:** a consumer resolves the session package overlay for rapid reload; this is non-admissible preview state; and
2. **packed candidate:** the project freezes an npm tarball, records integrity and SHA-256, and the consumer installs that immutable candidate for verification.

The existing Core build-aware watcher is the reference behavior: dependency output completion invalidates the transformed client and SSR module graph only after the build is stable.

### Live web service

`live-web` runs an application server with browser-oriented hot reload. Admin and other Astro applications use this target.

The manager:

- stops or disconnects the released service instance for the selected component;
- preserves the component's canonical local hostname;
- routes edge traffic to the development service;
- injects manager-resolved service connections and public runtime configuration;
- verifies the same readiness path used by the released component;
- watches dependency output and reloads only after completed builds;
- records that responses come from a live source closure;
- restores the released service when the development lease ends.

Keeping `admin.treeseed.localhost` stable preserves the exact `treeseed-admin` OAuth callback, secure cookies, same-origin return paths, device verification URLs, email-confirmation links, and browser security policy. Development does not introduce a generic OAuth redirect exception.

### Live API service

`live-api` runs an API from watched source with bounded restart semantics. API processes may use Node watch, an application-owned supervisor, or a development container, but the manager retains the canonical API hostname and health contract.

An API change may regenerate OpenAPI and catalog output automatically. Admin and CLI can then exercise the new endpoint without publishing an API image. A restart is accepted only after readiness succeeds. If readiness fails, the manager retains logs, reports the candidate as degraded, and restores the released API unless the session explicitly requests a debugging hold.

Database schema changes follow the state policies below and never apply merely because a migration file changed.

### Rebuild-and-restart service

`rebuild-restart` is intended for Agent, operations runners, TreeDX, AI runtimes, and other processes whose initialization or durable protocol state makes hot reload unsafe.

On source change or explicit rebuild, the manager:

1. builds a local image or executable in the owning repository;
2. records the exact source closure and artifact digest;
3. checks replacement preconditions;
4. drains or stops the old runtime through its declared protocol;
5. activates the candidate;
6. verifies health, registration, provider availability, and other declared postconditions;
7. retains the prior immutable runtime for restoration.

Agent replacement blocks while assignments or leases are active unless they complete, are safely transferred by a declared protocol, or an authorized user explicitly cancels them. A process kill is not a substitute for API-owned lease and settlement behavior.

### Local companion

`local-companion` covers Reviewer and similar loopback-only applications. It binds only to loopback, receives no managed public route, and may consume released or candidate CLI/SDK/UI packages. The manager may supervise lifecycle and logs without turning the companion into a hosted component.

## Development Compose contract

A service project may own `deploy/compose.development.yml` or another path declared in its manifest. Unlike production Compose, the development file may contain:

- `build` with a development target;
- source mounts or synchronized source;
- development commands;
- debug ports explicitly marked loopback-only;
- development-only caches and disposable volumes;
- file-watch rules that map to reload or rebuild behavior.

It must not contain:

- reusable credentials or secret values;
- an undeclared host-wide port;
- access to the manager or root-supervisor control socket;
- the host Docker socket inside a project container;
- broad home-directory, workspace-root, credential-directory, or unrelated repository mounts;
- mutable production state volumes without an explicit shared-state policy;
- production aliases not granted by the manager session;
- commands outside the owning project's declared development operations.

The manager materializes a session-specific Compose overlay with resolved networks, dependency endpoints, secrets, source paths, labels, and resource limits. Project Compose does not choose global networks or canonical aliases directly.

Libraries normally do not have a development Compose file. A container is added only when it supplies a real runtime boundary, not to make every package look uniform.

## Dependency graph and reactions

The manager compiles development dependencies from produced and consumed standards, package dependencies, runtime component dependencies, and the active session selection. Every edge declares one reaction:

| Reaction | Meaning |
| --- | --- |
| `reload` | Consumer can reload completed dependency output without process replacement. |
| `restart` | Consumer process must restart against the new dependency generation. |
| `rebuild` | Consumer artifact must be rebuilt before it can use the dependency. |
| `stale` | Consumer may keep running, but verification is invalid until refreshed. |
| `manual` | Change may be incompatible or operationally costly; report it and await selection. |
| `none` | Dependency change does not affect the selected runtime target. |

The reaction is directional. A UI build may reload Admin without affecting API. An SDK TypeScript-only change may rebuild CLI while leaving a running API untouched. An SDK wire-contract change may mark API, Admin, CLI, and Agent stale without automatically restarting all of them.

Cycles in build-time development dependencies remain forbidden. A detected cycle is a contract-ownership defect, not permission for recursive rebuilding.

## Development sessions and leases

A development session is the unit of ownership and cleanup. It contains:

- session ID, actor, host, and creation/expiry time;
- repository identities, worktree paths, commits, and dirty-state digests;
- selected targets and modes;
- resolved dependency graph and reactions;
- endpoint and route leases;
- state policies and migration decisions;
- secret references and connection bindings;
- current build generations and candidate digests;
- health, logs, warnings, blockers, and restoration state.

Only one session may own a canonical hostname or managed component target at a time. Additional sessions use explicit session aliases such as `admin.<session>.treeseed.localhost`, or remain loopback-only. Canonical alias ownership is acquired atomically before a released route changes.

Leases are time-bounded and renewable. Expiry initiates safe detach and restoration. An active debugging hold may delay automatic restoration of a failed live process but may not keep an expired route, secret, or state lease.

The manager continuously reconciles released components that are not leased. For a leased target it verifies the development session contract instead of fighting the local process. A development lease never pauses host security updates, unrelated components, or the manager itself.

## Command model

The CLI should expose project-neutral commands backed by the SDK development-session contract. Illustrative commands are:

```bash
trsd dev session start
trsd dev use sdk=live ui=live core=live admin=live api=live
trsd dev use agent=candidate
trsd dev rebuild agent
trsd dev status --all --json
trsd dev logs --target admin --follow
trsd dev plan --affected --json
trsd dev freeze
trsd dev verify
trsd dev session stop --restore
```

Existing `trsd dev start --web-runtime local` behavior should converge on this session model rather than remain a separate supervisor. Target filters must compile the smallest dependency closure. Known behavior where an app-only restart selects unrelated TreeDX or provider resources must be corrected and regression-tested before it is used as the general development control plane.

Every mutation follows the normal lifecycle:

```text
refresh -> plan -> validate -> apply -> refresh -> verify -> persist
```

Human-readable output is derived from the same versioned JSON result returned to automation.

## Routing, connectivity, and service identity

The manager-owned edge remains the only owner of canonical local ingress. Development services register endpoints; they do not edit Caddy directly.

When a released service is replaced by a live or candidate target:

1. validate the development target and health contract;
2. start it on a session-scoped internal or loopback endpoint;
3. verify readiness directly;
4. atomically switch the canonical edge route;
5. verify readiness through the canonical hostname;
6. retain the released service and route data for restoration.

Connections continue to resolve through component capability and endpoint IDs. For example, Admin's `api` dependency still becomes `TREESEED_API_BASE_URL`, whether API is released, candidate, live, local, or remote. Consumers must not branch on implementation mode.

Databases, workers, runners, raw inference services, and control sockets remain private unless their contract explicitly declares a host endpoint. Development mode is not permission to publish them.

## State and migration policies

Code mode and state mode are independent selections. Stateful development targets declare one of:

| Policy | Behavior |
| --- | --- |
| `stateless` | Target owns no durable state. |
| `ephemeral` | Create disposable state and destroy it on cleanup. |
| `clone` | Create a bounded development copy from an approved source. |
| `shared-compatible` | Use managed development state only while schema and mutation policies remain compatible. |
| `isolated-persistent` | Retain a session-owned state volume for repeated development. |

`ephemeral` is the default for incompatible API schema work. `clone` is preferred when realistic account/team data is needed without risking the managed development database. `shared-compatible` is opt-in and requires:

- no destructive or backward-incompatible migration;
- a declared schema compatibility range;
- migration plan and postcondition checks;
- backup/restore policy where material;
- proof that the released runtime can resume against the resulting state.

A changed migration file marks the target blocked or migration-pending. It does not auto-apply to shared state. Migration apply remains a distinct, reviewed manager operation.

API remains the durable owner of identity, teams, permissions, sessions, tokens, audit, capacity, assignments, and workdays in every mode. UI or Agent development never substitutes local browser or worker state for API records.

## Secrets, authority, and isolation

- Manifests name secret references but never contain secret values.
- The manager injects only secrets required by the selected target and removes bindings on detach.
- Browser JavaScript never receives API access tokens, refresh tokens, provider credentials, or manager credentials.
- Development Admin retains the production-shaped HttpOnly cookie and CSRF boundary.
- Development API and Agent runtimes receive no broader authorization than their released counterparts.
- Agent tools remain assignment-scoped; a locally built runner receives the same frozen authority and cancellation boundary as a released runner.
- Source mounts are read-only unless the target explicitly owns generated output beneath that repository.
- A development runtime cannot mount another repository merely because it consumes that project's contract.
- Root operations remain behind the fixed Deployment supervisor protocol. Project development commands run unprivileged and cannot introduce arbitrary root commands.
- Logs, status, receipts, and errors redact declared secret and credential paths.

## Source closure and build generations

A live source closure records:

- canonical repository identity;
- current commit and branch;
- dirty path list and content digest without recording secret content;
- development manifest and recipe digest;
- dependency source or artifact generations;
- toolchain and runtime versions;
- generated output marker and digest;
- selected configuration digest.

Dirty worktrees are allowed in `live` mode and forbidden as release evidence. A file event does not become a generation until the owning build completes and its output passes structural checks. Failed or interrupted builds retain the prior completed generation.

The manager does not infer semantic compatibility from timestamps. It reports which consumers are reloaded, rebuilt, stale, or blocked for each new generation.

## Package-specific development profiles

### SDK

- Kind: `package-watch`.
- Produces compiled public entrypoints, schemas, catalog output, and contract tooling.
- Pure implementation changes reload compatible consumers only where supported.
- Public contract changes mark declared consumers stale until compatibility comparison runs.
- Freeze produces an npm tarball and normalized contract bundle.

### UI

- Kind: `package-watch` plus its package-owned sandbox.
- The sandbox is the fastest loop for components, tokens, responsive states, accessibility, forced colors, and interaction.
- Completed UI output reloads Admin and other web consumers.
- Fixtures are presentation evidence only; integrated journeys still require a real consumer.
- Freeze produces an npm tarball, public-export contract, and presentation catalog.

### Core

- Kind: `package-watch` and reusable web runtime development support.
- Owns stable build-aware reload coordination for web consumers.
- May run fixture applications, but does not take ownership of Admin behavior.
- Freeze produces an npm tarball and site/plugin/runtime contract bundle.

### Admin

- Kind: `live-web`, using the managed Node runtime target.
- Retains `admin.treeseed.localhost`, port `4322`, `/healthz`, and the configured API connection.
- Consumes live or candidate SDK/UI/Core packages through the session overlay.
- May use the real managed API, an API candidate, or a live API target without changing browser route contracts.
- Freeze builds the standalone application, npm artifact, production image, SBOM, and component release assets.

### API

- Kind: `live-api` and `rebuild-restart` for production-shaped image testing.
- Retains API hostname, OAuth issuer, PostgreSQL authority, operations-runner relationship, and readiness path.
- Supports ephemeral, cloned, or explicitly compatible shared database state.
- Freeze builds exact API and operations-runner images, OpenAPI/event bundles, SBOMs, and component release assets.

### CLI

- Kind: `package-watch` or direct executable rebuild.
- A session-scoped shim may select the locally built CLI while normal host commands remain on the released CLI.
- Machine JSON schemas, exit statuses, confirmation behavior, and stdout/stderr boundaries remain contract-tested.
- Freeze produces the npm tarball and later the Deployment-qualified Debian payload.

### Agent and background providers

- Kind: `rebuild-restart`.
- Produces local manager and runner images by digest.
- Replacement requires drain and lease checks; no runtime hot patching.
- Verification includes provider registration, availability, assignment execution, terminal state, usage, settlement, and cleanup.
- Freeze produces multi-platform images, service contracts, SBOMs, and component release assets.

### TreeDX

- Kind: normally `rebuild-restart`; released mode remains suitable for unrelated development.
- A local candidate must retain product-neutral OpenAPI, storage, Git, graph, search, and health contracts.
- State policy is explicit because index and repository stores may outlive a process.
- Freeze produces image and client artifacts plus normalized OpenAPI/service contracts.

### Reviewer

- Kind: `local-companion` with optional UI watch.
- Remains loopback-only and never receives a public managed route.
- Consumes released or candidate CLI/SDK/UI packages.
- Freeze produces an immutable local-tool archive and checksum.

## The three primary workflows

### API and UI co-development

1. Start a session with Admin and API in `live` mode.
2. Keep PostgreSQL, TreeDX, Agent, Mailpit, and edge on released managed components unless affected.
3. Select an explicit API state policy.
4. Edit the API operation and regenerate its local catalog/OpenAPI output.
5. Edit the Admin consumer and UI presentation.
6. Exercise registration, confirmation, OAuth, account, team, and application behavior through canonical hostnames.
7. Run focused API contract and Admin browser tests.
8. Freeze API and Admin independently when the interaction stabilizes.

The flow allows a new endpoint to be tested before either project publishes. It does not permit Admin to import API implementation or invent an uncatalogued authority path.

### Exploratory UI development

1. Develop reusable presentation in the UI sandbox with fixtures.
2. Run UI in `live` package mode and Admin in `live-web` mode.
3. Let completed UI/Core builds reload Admin through the dependency watcher.
4. Use real API-backed pages when interaction, authorization, or state matters.
5. Run responsive, accessibility, console-error, and route smoke checks locally.
6. Freeze UI/Core packages and rebuild Admin against their exact tarballs.
7. Run packed-install and integrated browser verification before RC publication.

Spacing, typography, layout, color, iconography, and exploratory unavailable/error states do not require releases. Public component/API changes do require contract comparison before freezing.

### Agent and background-process development

1. Keep API and durable state managed.
2. Build a local Agent or worker candidate.
3. Verify no unsafe active lease or assignment blocks replacement.
4. Drain and activate the candidate through the manager.
5. Run focused provider, assignment, workday, communication, terminal-state, usage, and settlement scenarios.
6. Inspect evidence through Admin and Reviewer where applicable.
7. Restore the released runtime or freeze the candidate for release verification.

The manager never treats a successful container start as proof of assignment correctness.

## Freeze: from live source to immutable candidate

`trsd dev freeze` creates a candidate closure without changing source:

1. acquire a session freeze lock;
2. wait for all selected builds to reach completed generations;
3. reject missing, unstable, secret-bearing, or undeclared output;
4. record exact repository commits and require an explicit dirty-worktree policy;
5. pack libraries and local tools;
6. build service and worker images;
7. calculate integrity and SHA-256/OCI digests;
8. generate normalized contract bundles;
9. compare accepted baselines and calculate minimum semantic bumps;
10. rebuild consumers against packed candidates where required;
11. emit `treeseed.development-candidate/v1` binding source, contracts, artifacts, configuration, and dependency generations.

A candidate created from a dirty worktree may be tested, but publication requires the identical source tree to be committed, reviewed, and read back from the owning repository. The candidate receipt must prove that the committed tree reproduces the candidate artifacts before release.

## Verification ladder

Verification escalates in cost and authority:

1. **static feedback:** formatter, typecheck, lint, schema generation;
2. **package tests:** unit, contract, accessibility, and focused behavior;
3. **live development checks:** health, local routes, browser interaction, focused real service calls;
4. **candidate acceptance:** clean install, packed artifact or exact image, public exports, SBOM, source closure;
5. **compatibility:** normalized comparison, semantic bump sufficiency, consumer-driven cases;
6. **integrated candidate composition:** smallest affected exact candidate/released artifact set;
7. **active guarantees:** live required outcomes against one immutable generation;
8. **published readback:** registry, release assets, image digests, component manifests;
9. **managed staging activation:** install, readiness, edge routing, no-op reconciliation, rollback;
10. **promotion:** accepted composition selected without rebuild.

Failure at one level does not erase useful diagnostics from cheaper levels, but cheaper evidence cannot satisfy a more authoritative gate.

Platform plans active guarantees from the guarantee catalog contained in the exact selected Admin tarball. It merges verifier registries in catalog order so a reviewed composition registry can supersede historical source-test references. Every selected verifier must name an artifact or catalog operation, its owning package, case, and safe entrypoint; artifact owners must also be exact host payloads in that composition. Planning fails when any owner or immutable binding is absent.

`npm run guarantees:run` materializes every selected payload by URL and SHA-256 into an isolated package graph, executes each unique verifier artifact once, and maps its case results back to the selected guarantee closure. Runtime verifiers may execute inside their declared managed component container while static package verifiers execute locally from the packed graph. The runner writes an atomic `.treeseed/guarantees/runs/<run-id>` bundle containing `plan.json`, `report.json`, `report.md`, and redacted verifier evidence. Reviewer consumes that bundle; it does not reconstruct source tests or claim evidence from branch state.

## Independent RC release workflow

TreeSeed uses independently versioned release candidates cut from each project's protected staging branch.

For each changed project:

1. adopt the frozen source and candidate evidence on a reviewed branch;
2. merge through the project release gate into staging;
3. compute the version from contract comparison rather than dependency position;
4. tag the RC from the exact staging commit;
5. publish the already-verified artifact under a prerelease channel;
6. verify registry/release/image readback and source binding;
7. publish component manifests and production Compose assets where applicable;
8. notify Platform of exact artifact metadata.

Unchanged projects do not receive releases. A compatible upstream patch does not require a consumer commit when its declared range and tests admit the new version.

The normal dependency order is:

```text
SDK contracts
  -> UI
  -> Core and API
  -> Admin, CLI, Agent, and Reviewer as affected
  -> component releases
  -> Deployment
  -> pinned Platform composition
```

This is an adoption order, not a global version train.

## Platform composition and managed activation

Platform creates a `treeseed.integration-release/v1` from exact published artifacts. It records:

- artifact name and exact version;
- immutable download URL and SHA-256;
- image repository and OCI digest;
- contract bundle and compatibility evidence;
- component release manifest and Compose asset digests;
- exact Platform and Deployment commits/tags;
- generation and compatibility ID.

Deployment consumes an immutable Platform commit URL, verifies every selected payload, and publishes its catalog and Debian packages. The manager then:

1. refreshes signed stable and compatible development catalogs;
2. plans the exact package/component transition;
3. validates storage, secrets, dependencies, migration, and rollback prerequisites;
4. archives material state when required;
5. installs exact Debian payloads;
6. activates exact production Compose bundles;
7. verifies component and edge readiness;
8. records a known-good receipt;
9. proves repeated reconciliation is `noop`.

Manager self-updates use a two-phase handoff. A running manager may refresh and install the exact core package set, but once any core package changes it must stop that reconciliation before loading the new catalog or composing components. It schedules a bounded restart and the upgraded process performs planning and activation from the beginning. The stale process must never interpret a newer catalog, schema, component type, or rollback set.

Component packages remain installable across that handoff. Their package installation creates the manager-owned component configuration directory and a non-overwriting environment file before Compose can run; the upgraded manager then renders the authoritative connection environment. Production Compose joins only declared manager-owned external networks, publishes no application host ports, and relies on the edge network for public aliases and the private platform network for local component dependencies. The supervisor creates those networks before activation. Remote dependencies replace the injected connection URL without changing the component bundle.

Development sessions are detached or explicitly excluded before a host composition is accepted. A host with a live overlay cannot claim that its released composition is fully active.

## Promotion and production

Production promotion selects an accepted immutable composition. It does not rebuild packages or images, publish mutable tags as identity, or infer compatibility from staging branch heads.

Production remains unaffected by development-mode support:

- no source mounts;
- no development Compose;
- no live package overlay;
- no session aliases;
- no dirty source closures;
- no automatic incompatible migration;
- no development credentials;
- no npm `latest` or production tag changes during RC development.

## Failure, rollback, and cleanup

Development failures are scoped to the leased targets.

- An incomplete package build retains the prior completed generation.
- A failed live service health gate keeps or restores the released route.
- A failed candidate activation restores the prior image and runtime configuration.
- A migration failure restores from the policy's approved recovery point and blocks released-runtime reactivation when compatibility cannot be proven.
- A failed Agent candidate is drained and replaced without abandoning assignments or settlement.
- Session expiry removes routes, processes, networks, temporary volumes, generated secrets, package overlays, and candidate tags owned only by that session.

Cleanup emits a receipt listing retained and removed resources. Durable evidence explicitly selected for review may remain; caches and incomplete artifacts are not silently treated as evidence. The manager reports any residue as a blocker rather than declaring the session stopped cleanly.

Release rollback remains composition-based. It selects the prior immutable known-good composition and never rebuilds an old tag.

## Observability and user experience

`trsd dev status` and Admin's development diagnostics should show:

- session and lease state;
- canonical and session aliases;
- released, candidate, or live mode per target;
- repository commit and dirty-state indicator;
- current completed build generation;
- dependency reactions and stale consumers;
- health and last restart/reload;
- state policy and pending migrations;
- exact candidate artifact digests;
- blockers, degraded capabilities, and restoration status.

The browser must display a clear development-source indicator when a canonical application route is served by a live overlay. It must not expose secrets, internal filesystem paths, or tokens.

Logs use stable target IDs, structured event envelopes, redaction rules, and bounded retention. A developer can follow one target without reading unrelated manager or provider logs.

## Governance and evidence

Development sessions may be created by an authorized human, Codex task, or governed agent assignment. The session does not broaden repository or runtime authority. It records the authority used to select source worktrees, targets, state, secrets, and mutations.

An agent may operate only on assignment-scoped repositories and targets. Freezing, publishing, staging, promotion, destructive state changes, assignment cancellation, and production mutation retain their existing review and confirmation boundaries.

GitHub issues, pull requests, reviews, checks, and release comments remain the project-local governance record. Manager receipts and Platform compositions complement that record; they do not replace protected repository review.

## Adoption plan

### Phase 1: portable contract

- Add `treeseed.development-runtime/v1` and `treeseed.development-candidate/v1` to SDK.
- Extend `treeseed.package.yaml` validation and portfolio discovery.
- Define target kinds, reactions, state policies, receipts, and redaction behavior.
- Add negative schema and unsafe-path tests.

### Phase 2: manager sessions and routing

- Add session/lease storage, plan, status, logs, expiry, detach, and restoration.
- Add canonical edge-route switching after direct and routed health verification.
- Keep unrelated released reconciliation active.
- Prove crash and expired-session restoration.

### Phase 3: UI stack

- Declare SDK, UI, and Core package-watch targets.
- Declare Admin live-web target.
- Integrate Core's completed-build watcher with manager sessions.
- Prove same-origin OAuth, confirmation, account, team, and responsive UI development.
- Add packed-candidate freeze and Admin rebuild against exact tarballs.

### Phase 4: API co-development

- Add API live-service and production-image candidate targets.
- Add ephemeral, clone, and shared-compatible database policies.
- Regenerate and compare local catalog/OpenAPI output.
- Prove Admin and CLI against a live API without an API release.
- Prove released API restoration after failure.

### Phase 5: Agent and background runtimes

- Add Agent manager/runner rebuild-restart targets.
- Add drain, lease, active-assignment, availability, and settlement checks.
- Add operations-runner and applicable TreeDX/AI targets.
- Prove candidate failure restoration and zero abandoned work.

### Phase 6: freeze-to-release

- Emit exact candidate closures and semantic bump requirements.
- Reproduce candidates from reviewed commits.
- Publish RCs without rebuilding accepted artifacts.
- Compose exact Platform development generations.
- Run active guarantees, no-op reconciliation, rollback, and restoration.

## Acceptance criteria

The architecture is complete when:

- every participating project can declare a validated development target without manager-specific project code;
- UI changes reach Admin through a completed build generation and browser reload without publishing a package;
- Admin and API can run live together through canonical hostnames and exact OAuth policy;
- SDK/UI/Core candidate packages can replace live links for cross-project verification without source imports;
- API state policies prevent automatic incompatible migration of shared data;
- Agent and background candidates rebuild, drain, restart, verify, and restore without abandoned leases or accounting residue;
- target selection restarts or rebuilds only the declared dependency closure;
- released components continue reconciling while selected targets are leased;
- session expiry and crash recovery restore the known-good routes and components;
- freeze produces immutable artifacts, digests, contract bundles, and compatibility attestations from one source closure;
- project RC publication reuses the accepted candidate artifacts;
- Platform pins exact artifacts and Deployment activates them through its normal signed catalog;
- a host with no development session repeatedly reconciles to `noop`;
- no live overlay, dirty source, development Compose file, or mutable tag can enter production evidence.

## Summary

TreeSeed's managed release architecture remains the authority for integration, rollback, and promotion. Its development architecture adds a faster, explicitly non-authoritative layer coordinated by the same manager and the same package/runtime graph.

Libraries update completed package generations, UI applications hot reload, APIs restart behind stable routes, and agents or background services rebuild and drain safely. The manager preserves real connections and security behavior while isolating state and recording source closure. When work stabilizes, the session freezes exact candidate artifacts, runs standards and guarantee verification, publishes independent RCs, and lets Platform compose the immutable result.

This separation provides real-time productivity without replacing release evidence with a development process.
