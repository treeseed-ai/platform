# Task 3B installed composition implementation plan

> **For implementing agents:** Use the actual available workflow/testing tools, preserve the user's execution method, and deliver one bounded task at a time. Checkboxes record verified results, not intentions. Retain child-repository setup pauses.

**Goal:** Apply an exact local composition through a durable native Cordis worker and expose its real identity-backed status over HTTPS.

**Architecture:** Deployment owns the installation journal, single writer, worker protocol and Docker operations. Independent API, Identity and Admin packages supply native class plugins. Docker services are plugins with typed contracts, native dependencies and read-back, not an unowned Compose catalog. SDK owns portable contracts; CLI and API invoke the same public Deployment host interface.

**Tech Stack:** Existing strict TypeScript/Bun CLI, Node 24 server, Cordis 4.0.0-rc.12, PostgreSQL, Keycloak OIDC and Caddy HTTPS. Exact archives and native amd64 OCI selections are prepared before planning. Versions and image bytes are qualified in acceptance evidence.

**Spec:** [Approved composition design](../specs/2026-10-24-cordis-composition-providers-design.md), [migration Task 3B](2026-10-24-cordis-composition-providers.md#task-3b-first-installed-composition-and-durable-host-root), [platform contract](../../platform-contract.md).

## Global constraints

- User approved API, Identity and Admin setup and authorized baseline publication and Task 3B implementation on 2026-10-24. All three exact bootstrap branches were published and read back. Agent still requires its own future initialization and review pause in Task 3D.
- Runtime issues: SDK #457, Deployment #908, CLI #315, API #617, Identity #44, Admin #135; Platform #713. All remain open, including Platform #678. PRs target cordis; no production channels or legacy services change.
- No source imports across checkouts. Consume exact public archives with source commit, SHA-256 and lock SRI. API retains AGPL licensing; Identity/Admin retain Apache licensing.
- Native Cordis owns every plugin graph and lifecycle. The typed service locator is its facade. Installed, selected, active and ready remain different states.
- Only accepted, installation-owned fixture resources may start during verification. No global trust-store, DNS, Docker daemon or original checkout changes.
- Task 3C acquisition/installer, Task 3D Agent, generalized hot replacement and full crash recovery remain deferred. No arbitrary package-provided host shell commands.

## Owner and plugin map

| Context | Owner / public package | Native capabilities |
| --- | --- | --- |
| CLI | CLI | arguments/configuration, command dispatch, output; selected Deployment host |
| Host worker | Deployment | journal/writer, engine, application coordinator, PostgreSQL container/database readiness, Caddy container/HTTPS readiness |
| Host worker | Identity | Keycloak container and configured realm readiness |
| Host worker | API | API container and server/asset readiness |
| API root | API | HTTP listener/router, operation invoker, host-worker adapter |
| API root / request child | Identity | OIDC protocol, principal mapping, server-side session and request authority |
| API root / browser contribution | Admin | login/callback/logout, protected status page and class-based browser status contribution |
| Browser | Admin | class plugins for page/status actions; browser-only exports exclude server credentials and modules |

Container plugins consume a typed engine contract and expose typed ready-service adapters. Their native inject fields encode readiness dependencies: PostgreSQL precedes identity/API; identity precedes API; API precedes HTTPS edge. Owner declarations generate planning metadata. Container images do not substitute for plugin declarations or transfer ownership.

## Human and machine interfaces

- Local: `trsd platform plan --file CONFIG --json`; `platform apply --installation DIR --plan ID --digest SHA --idempotency-key KEY --json`; `platform status --installation DIR --json`; `platform application --installation DIR --id ID --json`.
- Fixed owner-private Unix socket under installation/.cordis, mode 0600. Requests are strict versioned submit/status/application messages, never arbitrary commands. CLI and authenticated API use the public Deployment client. Local directory ownership is the host authority.
- HTTPS localhost origin: `/health/ready`, `/v1/platform/status`, `/v1/platform/applications/{id}`, `/admin`, `/admin/login`, `/admin/callback`, `/admin/logout`, `/assets/...`, and Keycloak's routed `/identity/...` endpoints. Seven SDK operation IDs remain unchanged. Unsupported transport bindings report unsupported rather than fake success.
- Admin performs actual authorization-code OIDC with state, nonce and PKCE. Tokens stay server-side. Secure HttpOnly SameSite cookies and origin/CSRF checks protect mutations. Identity maps issuer/subject to durable principals; only the explicitly bootstrapped subject receives administrative authority. No credential fallback.

## Formats, authority and effects

Historical format-1 plans remain readable and unchanged. New installed plans and private journal use explicit format 2; old readers reject new state. A migration receipt binds original receipt bytes before any active-state mutation. Interrupted migration is not silently adopted. A format-1 plan alone never authorizes activation.

Format-2 plans bind normalized configuration, verified package/OCI closure, native selections, approved owner recipe projection, worker executable SHA-256, expected engine and expected active generation. Planning imports no plugins and creates no credentials or runtime resources. Owner preset parameters permit only the fixed service commands, secret-file mounts and internal network wiring required by this composition; arbitrary environment/commands/host mounts remain rejected. The sole host bind exception is the owner-private worker socket directory mounted read-only into API; Docker.sock is never exposed.

Apply freshly revalidates source bytes, engine identity, ownership, expected generation and resource namespace, then persists canonical idempotent intent before accepting. Same key/same intent returns the same application; same key/different intent blocks. A cross-process exclusive writer prevents concurrent controllers. No stale lock is automatically stolen. Accepted is not ready. Private append-only application records expose phases and safe failures; resources are active only after all required plugins and actual readiness checks succeed.

The worker executable is an immutable staged copy of the accepted compiled CLI, entered through a fixed internal worker protocol, with sanitized environment and no cwd/module dependency. Detach and acknowledge only after durable intent and worker readiness. Client/API exit does not cancel accepted work. Unexpected worker death leaves truthful incomplete state; generalized recovery remains later work.

Docker operations are bounded to exact owned labels, names, images and generated Compose projection. Verify manifest/config/layer bytes before loading; bind loaded image config IDs to the selected manifest. No pull/build during apply. Private credentials/configuration are generated once at apply, never returned in envelopes. Bootstrap credentials are accessible only through an owner-private local file reference. Durable service resources are not deleted merely because a context/process exits.

Caddy owns stable installation-local TLS authority in an owned volume. Export only its public root certificate for explicit CLI/SDK/browser trust; never disable TLS validation or mutate global trust. Installed acceptance uses an isolated browser profile trusting that fixture authority.

## Review focus

1. A lost response must not duplicate an accepted application: repeat the same key after client termination and compare durable identity.
2. Concurrent clients, stale active generation and changed engine must block before Docker effects.
3. Private state symlink/ownership swaps, interrupted migration and partially published records must fail closed.
4. Unauthenticated/cross-request sessions and forged issuer/subject must not acquire host management authority.
5. Server exit, missing service readiness or wrong browser assets must never yield an active/ready claim.

## Delivery sequence

### 1. SDK contracts (#457)

Files: existing contracts/source-policy/tests/tooling, README, CHANGELOG, package/lock. Add strict installed-plan, service declaration, application/journal/protocol schemas and inferred types; preserve format-1 and native provider contracts. Add public development tooling entry so new owner builds remain independent.

- [ ] Commit owner documentation and exact interfaces first.
- [ ] Add outer projection/strict protocol tests, then migration/idempotency/schema regressions; run intended behavioral red.
- [ ] Implement contracts and generated projections. Keep seven IDs. Run `bun run verify`; pack without scripts and record exact candidate commit/hash.

### 2. Identity, Admin and API owners (#44, #135, #617)

Files per owner: README, CHANGELOG, package.json, bun.lock, exact vendor archives, focused class-based source, owner tests and verification CI. Split independently reviewable changes exceeding the repository size gate.

Public interfaces: Identity exports its container provider and OIDC/session/principal contracts/plugins; Admin exports session/action/page contributions and a browser-only class entry; API exports container provider and `ApiApplication` default root. API consumes public Identity/Admin packages; Admin consumes Identity/SDK, never API source. Shared invocation contract is SDK-owned.

- [ ] Commit each owner's legacy mapping, interfaces, route and container/plugin declarations before tests.
- [ ] Write built-program rejection/default-construction and actual identity/session/browser tests before implementation; run intended reds.
- [ ] Implement actual native roots, scoped authority, owner-generated image context/assets and service declarations. Run each owner's nonempty check/build/unit/integration/smoke commands.

### 3. Deployment durable composition (#908)

Files: existing resolver/filesystem/diagnose/composition and focused worker/controller modules, owner tests/docs/package metadata. Public methods extend `DeploymentHost` with apply/status/application. `DeploymentWorker.run` implements only the fixed private protocol. Service classes consume engine/journal tokens using native injection.

- [ ] Document migration, apply authority and exact fixed service policy; commit.
- [ ] Write accepted/read-back/idempotency/concurrency/engine/stale-generation/worker-program reds, including default real construction.
- [ ] Reuse artifact verification for format 2 without weakening format 1. Implement descriptor-anchored private state, explicit migration, atomic records, one writer and detached acknowledgement.
- [ ] Mount actual container plugins, load only verified images, await actual database/OIDC/API/HTTPS/asset readiness. Test safe failure and interruption after submission. Run full owner verification.

### 4. CLI integration (#315)

Files: arguments/root, public host invocation, built-program tests, docs and exact owner pins.

- [ ] Commit documented commands/envelopes first, then write program reds for valid invocation and sanitized failure paths.
- [ ] Implement apply/status/application and internal worker dispatch using public Deployment interfaces. Render and await native cleanup before emission. No concrete host construction in CLI.
- [ ] Run Task 1–3A regressions and new program/default worker checks; build standalone artifact and record SHA-256.

### 5. Platform installed scene (#713)

Files: exact composition evidence, class-based assembly/acceptance program, CI and integration documentation. Runtime construction remains in owners.

- [ ] Prepare genuine owner archives and selected OCI bundles from exact built artifacts, with public build commands and complete lock closure.
- [ ] Run `installed_composition_has_real_contexts`: compiled CLI plan/apply, durable application read-back, native worker/API identity, actual Keycloak login, PostgreSQL principal persistence and HTTPS Admin browser status/assets.
- [ ] Terminate submitting client/API after acceptance; verify worker survives and read-back remains truthful. Exercise wrong scope, missing/duplicate providers, stale generation, idempotency conflict and artifact tampering before effects.
- [ ] Compare direct/routed resources/assets and clean only fixture-owned resources. Run all owner verification and assembled regressions, then native CI including mandatory ubuntu-26.04 positive gate.
- [ ] Open bounded reviewed PR candidates targeting cordis with Part of issue references, exact pins and actual evidence. Keep all issues open and hand back for maintainer review.

## Container ownership implementation detail

A service class owns a generated `cordisService` declaration as well as its native provider declaration. It binds the bounded container command/environment, named-volume/secret mounts, private slot definitions and readiness expectations. Deployment contains no switch catalog implementing Identity or API configuration. Format-2 release service selections include these exact declarations; planning compares them with the owning archive metadata without importing code, and activation compares the class declaration again before use.

The positive recipe extends format 1 only in format 2: owner-declared container argv and non-secret environment, a fixed API worker-socket mount, and private configuration projections. Host shell execution, arbitrary host paths, Docker.sock, privileged mode, interpolation and package hooks remain forbidden. Native injection orders services, while a generic engine renders only the accepted declarations and provides bounded observation. New service implementations change their own package/declaration rather than Deployment's controller.

Private slot kinds are random, UUID, JSON, properties and text. Declarative JSON templates may reference another declared secret slot, the origin, installation ID, owner UID, public asset digest, or concatenate these values. Dependency cycles/missing slots fail planning. References never put plaintext credentials into plans or environment. All materialized values remain owner-private and are generated only after durable acceptance. Identity owns its realm/client/bootstrap/configuration slots; API owns server configuration; Deployment owns database/edge configuration. Templates cannot select an output path: slots always map beneath the fixed private credential directory.

`InstallationStore.migrate()` is an explicit owner-local public method for verified format-1 plan-only stores. Plan/apply never invoke it implicitly. CLI/remote migration transport is deferred; a historical installation reports MIGRATION_REQUIRED until the owner explicitly calls the migration method. Fresh format-2 installations need no migration. Read-back validates the preserved original receipt hash and original plans.

## Assembled verification interface

Platform consumes five exact public owner archives through private development dependencies and builds only the exact selected CLI source. New verification uses strict TypeScript classes in tests/task3b-installed.test.ts, checked against the SDK semantic source policy and strict compiler. `bun run test:installed` requires Ubuntu 26.04, local Docker/Compose, certutil and the qualified Playwright Firefox binary; missing prerequisites fail. An isolated Firefox profile imports only the fixture authority, with ignoreHTTPSErrors false. The fixture producer standard-locks the complete flat runtime closure with scripts disabled, prepares genuine native OCI selections and invokes API's public image-context program. It never imports checkout source. The root archive pins and source/tree evidence live in composition/task3b.json; all older composition evidence remains historical and unchanged. Owner checks retain Task 1–3A behavior; historical assembled jobs continue checking their exact historical candidates.
