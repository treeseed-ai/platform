# CLI-first platform contract

Date: 2026-10-24. Audience: developers and integrating agents. Status: Tasks 1–2 and 3A/3B are integrated with bounded exact artifact evidence; broad remote parity, plugin acquisition and Agent remain future work. The approved [composition/provider design](superpowers/specs/2026-10-24-cordis-composition-providers-design.md) remains the foundation. The [extensible-container and required-UI amendment](superpowers/specs/2026-10-24-extensible-deployment-ui-design.md) and [Task 3C owner plan](superpowers/plans/2026-10-24-task3c-extensible-plugins-ui.md), tracked by [#722](https://github.com/treeseed-ai/platform/issues/722), are reviewed for integration. The maintainer resumes only UI initialization next, followed by setup review; product implementation remains gated.

This is the specification for the [development plan](superpowers/plans/2026-10-23-cordis-platform.md). The [migration reference](migration-reference.md) records the original sources and setup gates. Development instructions and skills govern development only; deployed behavior and tests must not depend on the contents of any project's AGENTS.md.

The maintainer's PR #723 review selects pure reusable React TSX class components in UI, with native Cordis provider selection and UI-owned browser/SSR/terminal adapters. Astro consumes the React exports; renderer-neutral contracts support future desktop/native adapters without claiming DOM/native equivalence. Identity retains shared Keycloak authority and hosts retain session/token custody. Only UI setup is resumed now, followed by its setup review; see the detailed Task 3C amendment/plan.

## 1. Product and scope

The first product is an extensible platform that a person can download, install, start, inspect, update and recover using a single CLI executable. It exposes a small authorized operation catalog through REST, SDK, CLI, MCP and browser actions. Feature plugins are added after that lifecycle is reliable.

The initial success journey is:

1. Download the correct verified `trsd` executable.
2. Run prerequisite diagnostics; select the intended local container engine and installation location.
3. Inspect an exact installation plan, including endpoints, volumes, images and credential/bootstrap requirements.
4. Apply the plan; observe durable progress independently of the CLI process.
5. Establish the administrator through the supported identity flow; open the browser and read actual composition health.
6. Add a harmless diagnostic plugin with one operation and one browser page; use the same operation through all five interfaces.
7. Change, upgrade, disable and remove that plugin; retain data, reject invalid dependency changes and recover interrupted activation.
8. Develop a selected plugin locally, freeze its candidate, and promote the same verified bytes without losing the explicit selection or unrelated state.

Installation success is not proof of any deferred domain feature. A diagnostic plugin tests composition mechanics and cannot be represented as a real agent product.

### Included and deferred

| Initial platform | Later, separately authorized slices | Excluded from this migration's initial product |
| --- | --- | --- |
| CLI/bootstrap/recovery, one Compose deployment, SDK contracts/client, Cordis host, identity integration, operation transports, small browser shell, plugin/provider registration from NPM or Git, qualified hot replacement, controlled updates and persistent development selection. | Projects; Knowledge and a TreeDX adapter; Work and scoped Agent execution; independent product review and Git delivery; optional public reader. | AI appliance/training/GPU management; Market/commerce; plugin marketplace; multi-cloud provisioning; fleets; arbitrary hot replacement; general workflow designer; advanced Atlas and autonomous portfolios; native Windows. |

The user's separate AI project may later supply a capability through a reviewed interface. Do not add placeholder model/training/GPU services or schemas to reserve its place.

### Required implementation architecture

The Cordis rewrite is a **pluggable object-oriented TypeScript system**, governed for its
lifetime by [AGENTS.md](../AGENTS.md#architecture-typescript-classes-and-swappable-plugins-mandatory).
All handwritten SDK, CLI, service/plugin, deployment/tooling, browser/UI and owner test code
uses classes with instance/static methods, not JavaScript, standalone function modules,
function factories or functional UI components. Declarative schemas and interface/data types
remain appropriate; framework callbacks bind class methods. Generated output and unchanged
upstream dependencies/resources are not a second handwritten source implementation. TreeDX
retains its existing Elixir/Rust service and its own workflow.

Native Cordis roots are required in CLI, API, Deployment worker and Agent. Each process
composes native class plugins through typed service contracts; the ServiceLocator facade
adds explicit provider selection/inspection while Cordis remains the sole resolver and
lifecycle. Portable schemas and data objects need no context. The detailed
[context and package map](superpowers/specs/2026-10-24-cordis-composition-providers-design.md#context-and-process-map)
defines ownership, scope lifetimes, adapter seams and invariant exceptions.

A capability has one typed interface or abstract-class contract and a selected implementing
class in the same owning repository. Consumers use the contract; constructors and Cordis
service bindings provide the implementation. Required selections must be present, unique and
compatible. A different plugin class can supply the same capability through existing config,
without changing consumer code, operation schemas, ownership or authorization policy. Do not
create another container/registry or speculative inheritance hierarchy to accomplish this.

`PlatformApplication` is the proposed API production composition class; `DeploymentApplication`
and `AgentApplication` own the other long-lived runtime roots. `CliApplication` is required
to become a real native Cordis root rather than a manual concrete-provider graph. `CliApplication` and
`CliOutput` own the executable interface; `OperationDefinition.define(...)` is a static class
method for schema-backed bindings. `DeploymentHost` is the lifecycle capability contract;
`ComposeDeploymentHost` supplies the first implementation. Required plugin entrypoints such
as Identity/Deployment/Transport/Web are classes using Cordis's own lifecycle. Browser views
and UI components also use class-based implementations. Task 1 exports CliApplication, CliOutput, OperationDefinition and ComposeDeploymentHost
with diagnostics in Task 1 and persisted non-activating planning in Task 2. Other names remain proposed design contracts;
none adds an extra remote operation.

One shared contract suite runs against every advertised implementation. Default-construction
and installed replacement tests prove selection, authorization, disposal/drain, unchanged
caller semantics and read-back across a qualified live swap, with explicit restart where required. An alternative diagnostic class
may prove this mechanism in a fixture; it does not justify shipping extra providers early.

## 2. Distribution and operating-system boundaries

The CLI source is strict TypeScript. Bun compilation is the intended standalone distribution mechanism; source tools remain explicitly pinned and tested. Bun documents Linux/macOS x64/ARM64 compilation and embedding its runtime in the executable. This establishes feasibility, not a passing TreeSeed build. [Bun executable reference](https://bun.sh/docs/bundler/executables).

The initial platform server uses a pinned Node.js runtime in its application container; the CLI's Bun distribution does not impose its runtime on the server or browser. Qualify the SDK's portable client under both consumers and the Cordis server under the selected Node.js version. Changing that server-runtime choice is a separately evidenced decision, not an automatic consequence of choosing Bun for the executable.

| Target | CLI artifact proposal | Runtime | Qualification rule |
| --- | --- | --- | --- |
| Linux x64 | `trsd-linux-x64` | Docker Engine + Compose | First complete managed-host lifecycle. Select one concrete Linux distribution/version in the implementation issue; do not claim all Linux distributions. |
| Linux ARM64 | `trsd-linux-arm64` | Docker Engine + Compose, matching ARM64 images | Build and run on a native target before claiming support. |
| macOS Apple Silicon | `trsd-darwin-arm64` | Docker Desktop Linux VM | Verify actual install/start/update, permissions, file watches and restart/sleep behavior. |
| macOS Intel | `trsd-darwin-x64` | Docker Desktop Linux VM | Independently qualify the binary and every selected image. |
| Windows WSL2 | Matching Linux executable inside WSL2 | Docker Desktop's selected WSL integration | Sources on the Linux filesystem; browser access from Windows explicitly tested. No native `.exe` in the initial matrix. |

Cross-compilation is not native execution proof. Unsupported or untested host/image combinations fail diagnostics with a specific reason. Musl builds are deferred until a supported installation requires them. Container images must include each supported architecture; never silently use CPU emulation as native support evidence.

Docker Desktop runs Linux containers using a Linux VM; its filesystem/network/VM lifecycle remains a real boundary. WSL bind mounts perform better and support file-change notifications from Linux-hosted sources. Treat these as integration test requirements. [Docker VM documentation](https://docs.docker.com/desktop/features/vmm/), [WSL guidance](https://docs.docker.com/desktop/features/wsl/best-practices/).

Prerequisite checks report the chosen engine context, server architecture, Compose availability, free resources, writable owned storage, usable ports and transport access. Reject an unexpected remote Docker context instead of installing on another host. Do not install Docker, accept its licenses, change global contexts, modify DNS/trust stores or stop unrelated services automatically. Missing prerequisites produce instructions and a nonzero diagnostic result.

Normal users need neither Node nor Bun installed to run the released executable. The executable does not contain Docker, the application's databases, every future plugin or a complete development toolchain. No user-provided AGENTS.md/skill file is required to run it.

## 3. CLI and initial user experience

These command names are the proposed user interface. The implementation plan must create the command/help/tests together; do not run them against the legacy CLI and infer replacement behavior.

| Command | Observable result | Authority |
| --- | --- | --- |
| `trsd --version` / `trsd --help` | Version/help on stdout, exit 0, no configuration or service mutation. | None. |
| `trsd doctor --json` | Structured checks and blockers; exit 0 only when required checks pass. | Local read access; no secret output. |
| `trsd platform describe --json` | Permission-filtered supported contract, installed plugins and operation catalog. | Local owner or authorized remote principal. |
| `trsd platform plan --file <configuration> --json` | Exact resolved changes and blockers, before activation. | Protected local owner before startup; authenticated administrator remotely. |
| `trsd platform apply --plan <id> --digest <digest> --idempotency-key <key> --json` | Durable application identity, never a false readiness claim. | Same protected lifecycle boundary. |
| `trsd platform status --json` | Actual selected engine, desired/active composition, readiness and blockers. | Local owner or authorized remote principal. |
| `trsd platform application <id> --json` | Persisted progress/result/recovery state. | Installation/application scope checked. |
| `trsd platform events <id> --cursor <cursor> --json-stream` | Ordered resumable NDJSON event stream. | Same scope as application read. |
| `trsd platform cancel <id> --json` | Acknowledged cancellation request and whether a safe boundary has been reached. | Administrator; does not promise data rollback. |
| `trsd platform recover <id> --json` | Resume/complete the recorded interrupted lifecycle through the local deployment adapter; refusal if state cannot be proven. | Protected local installation owner; works with API unavailable. |
| `trsd platform open` | Open the configured browser origin only after confirming its installation identity. | Local interaction; report the URL if opening is unavailable. |

First install and subsequent upgrade use the same plan/apply path. Initially omit synonym commands such as install/up/upgrade that could diverge; add aliases later only if they call precisely this lifecycle. Stop/start are represented as desired runtime state in a plan, with explicit state-preservation semantics. Never equate stopping an installation with clearing its development selection.

Use a stable JSON command envelope containing command, success/failure, result or structured problem, blockers and references. Exit codes: `0` successful requested outcome (including acknowledged asynchronous submission); `1` runtime/transport failure; `2` invalid arguments/input; `3` unmet prerequisites, authority or stale-plan/conflict rejection. An asynchronous apply returning exit 0 means accepted, not deployed. Preserve stdout for requested machine output, stderr for human diagnostics, and redact secrets in both.

Global flags select an installation or remote server explicitly. Local ownership comes from the installation directory/socket permissions, not a writable JSON field naming the administrator. Interactive browser/session actions and local privileged changes must stay visible; machine mode never fabricates consent.

## 4. Integrated deployment and authority

### One composition and one lifecycle implementation

The current Task 3B format-2 profile has four fixed services. The proposed Task 3C format-3 contract replaces that limit with named service instances, exact typed dependency/endpoint/probe bindings and profiles. The original four remain the default profile. Generic host code cannot dispatch by role or assume service/package names; capability owners declare them. Additions retain unchanged service generations/resources/credentials/TLS. A non-activating plan classifies changes; safe activation, explicit restart/migration authority and old-format refusal follow the [amendment](superpowers/specs/2026-10-24-extensible-deployment-ui-design.md).

The initial composition includes one application image/bundle with the required server plugins and matching browser assets, PostgreSQL, a selected identity integration and an HTTPS edge. Ship one tested composition. Use existing identity protocol primitives rather than writing another token issuer. TreeDX is added when Knowledge is deliberately introduced; the initial status page must not require it.

Use one local browser origin, initially `https://localhost:8443`, avoiding automatic global hosts-file/DNS edits and privileged host-port assumptions. Detect port conflicts before activation. Bind published application ports to loopback by default; do not expose databases, manager sockets or credential endpoints. Provision a stable installation-specific TLS identity; explain trust setup without silently modifying system trust. SDK/CLI trust the configured installation authority; never disable certificate validation to get green tests. Remote hosting requires explicit domain/network configuration and its own qualification.

The CLI's embedded deployment adapter and the platform's deployment plugin call the **same** lifecycle implementation. Transport/session handling differs; plan semantics, locking, identity checks, activation, journals and recovery do not. The app can request its own replacement, but a host-side worker completes the operation after the app exits. That worker comes from the verified release and accepts a fixed validated lifecycle protocol, not arbitrary executable/plugin hooks. Do not recreate all legacy root/systemd supervision on macOS.

The CLI local adapter is necessary because REST/MCP/browser availability cannot be a prerequisite for first installation or recovery. This is an explicit trusted bootstrap boundary, not an anonymous remote fallback or a second domain API.

### One authority per fact

| Fact | Owner |
| --- | --- |
| Desired plugin/configuration/runtime selection | Installation configuration, changed through plan/apply. |
| Exact dependency/package/image bytes | Standard package lock and verified release artifact inventory. |
| Accepted plan, application progress and active composition | Deployment lifecycle's persisted records/journal. API and UI read projections. |
| In-process plugin registrations and availability | Cordis context plus the operation registry; rebuilt from accepted composition on restart. |
| Human/workload identity | Selected issuer and explicit application principal mapping. |
| Domain records introduced later | Owning plugin; no shared universal entity/task schema. |

The host journal is needed before PostgreSQL/API startup and through their replacement. Do not copy its authority into a second API database or CLI current-selection store. Database availability must not prevent read-only local diagnosis of the host journal. The journal and credentials are private runtime state outside Git; reject tampered, malformed or foreign installation state.

### Plan/apply and recovery invariants

- Plans bind installation identity, expected active composition, exact artifact/configuration/recipe digests, dependency resolution and data/migration effects. No mutable tags enter an accepted plan.
- Apply validates those facts again under installation-scoped cross-process exclusion. A second CLI/server process cannot bypass the lock. PID existence or elapsed lock age alone is not sufficient ownership proof.
- Persist the application identity and current phase before its external side effect. Re-entry observes actual runtime/artifact state and safely completes or compensates; do not replay partially applied commands blindly.
- Reusing an idempotency key with the identical request returns the same application. Reuse with different inputs is a conflict. A plan whose expected active state moved is rejected.
- Stages are resolve/validate, stage bytes, prepare credentials/data, drain affected writers, activate, check direct+routed readiness, commit active selection and read back. Phase observations remain in the existing application journal.
- Failure before activation retains the previous active composition. Failure after activation attempts only a proven-compatible recovery; incompatible or uncertain migrations remain blocked with precise recovery instructions. Never start an old database writer on an unproven new schema.
- Killing the invoking CLI or platform server does not cancel host ownership. Recovery locates the same application and observes the owning worker. A lost response is resolved by read-back using the same request identity.
- Cancellation is a request handled at safe boundaries. A terminal cancelled/failed status must include actual active composition, retained data and cleanup/recovery result. Preserve original failure events.
- Ordinary stop, restart, update, disable and uninstall retain user data and explicit development selection. Destructive data removal requires a separately specified and authorized feature; none is included initially.
- Scope ports, Compose project names, volumes, directories, processes and cleanup to the installation. Never use broad prune/reset/kill commands. Observe pre-existing resources before claiming ownership.

## 5. Plugin model and SDK boundary

Preserve one integrated platform composition assembled from independently built project repositories. Platform remains at the top; each project lives in a separate Git checkout under `packages/{project}`, excluded by the top-level `/packages/` gitignore rule. These are not Platform-tracked source directories or submodules. Suggested owning paths appear in the [plan](superpowers/plans/2026-10-23-cordis-platform.md#proposed-file-ownership). Public npm names/version policy are not allocated here; do not overwrite legacy packages, tags or latest channels.

### Repository and plugin ownership

Every human-facing browser/server/terminal interface must consume reusable `ui` presentation contracts/providers. CLI/Admin/Agent retain domain view models, commands and authorized actions; API/Identity retain HTTP and session authority. Machine JSON schemas/serialization remain SDK/CLI-owned. Browser-safe UI composition uses the proposed SDK portable entry; Node loaders and credentials cannot enter browser bytes. UI is absent from the migration checkout and must receive its own canonical initializer/review gate before code.

| Repository / local checkout | Ownership | Initial participation |
| --- | --- | --- |
| [Platform](https://github.com/treeseed-ai/platform) / workspace root | Composition/source-artifact selections, integration documentation, assembled verification and portfolio CI. No application/plugin runtime copied here. | From the start. |
| [CLI](https://github.com/treeseed-ai/cli) / `packages/cli` | Standalone `trsd`, arguments/output, local/remote adapters, CLI builds/program tests. | Task 1. |
| [SDK](https://github.com/treeseed-ai/sdk) / `packages/sdk` | Executable schemas, typed bindings/client, portable plugin declarations and server-only operation helpers. | Task 1. |
| [Deployment](https://github.com/treeseed-ai/deployment) / `packages/deployment` | Read-only host diagnostics, lifecycle/worker/journal/Compose, development selection, packaging. Same exported implementation serves CLI and server plugin. | Diagnostics in Task 1; plan/apply in Tasks 2–3. |
| [API](https://github.com/treeseed-ai/api) / `packages/api` | Cordis application host, default composition/loader and REST/MCP adapters. Domain operations stay with their capability owner. | Task 3. |
| [Identity](https://github.com/treeseed-ai/identity) / `packages/identity` | Maintained identity/session/principal integration exposed as a required plugin. | Task 3. |
| [Admin](https://github.com/treeseed-ai/admin) / `packages/admin` | Authorized feature view models, session/action facade and UI presentation contributions. | Task 3B; reusable UI adoption in 3C. |
| [UI](https://github.com/treeseed-ai/ui) / `packages/ui` | Required reusable browser/server/terminal components, renderers and presentation providers; no domain/auth/backend authority. | Task 3C first initializes UI and stops for setup review. |
| [Core](https://github.com/treeseed-ai/core) / `packages/core` | Optional public-reader/site plugin, retaining its separate repository. | Deferred; not the Cordis runtime host. |
| [TreeDX](https://github.com/treeseed-ai/treedx) / `packages/treedx` | Existing Elixir/Rust repository/knowledge service; no Cordis rewrite or initialization. Integrate its public boundary from owning adapters. | Knowledge integration later; service remains intact. |
| [Agent](https://github.com/treeseed-ai/agent) / `packages/agent` | Scoped execution provider and handlers; durable project/work authority stays at its owning API capability. | Work/Agent slice later. |
| Reviewer, templates and other retained projects / `packages/{project}` | Their existing independent capability/test/template ownership. | Only when needed; same setup pause. |

The repository links above name the **existing canonical repositories**, not new repos to
create. An eligible capability's replacement stays in its current repository's own `cordis` branch. TreeDX is retained as its existing Elixir/Rust service, excluded from Cordis initialization.
For example, `treeseed-ai/deployment` lifecycle becomes the Deployment Cordis plugin in that
same repo, not a new Platform/API implementation; `treeseed-ai/agent` execution remains in
Agent even when API exposes its operations. A consumer adapter does not acquire ownership.
Retain repository history, license, capability identity and independent delivery lineage.

Before implementing a slice, its owning issue maps each in-scope legacy public capability
and source location to the same repository's proposed plugin/export/interface and its
outside-in test, marking kept/replaced/deferred explicitly. Do not infer transfers from the
coarse host table or move capabilities between repositories for convenience. An ownership
change requires a separate explicit maintainer decision; none is authorized here.

Combine duplicated **interfaces and execution paths**, not these repositories. A capability
plugin is a module/export in its owner repository; do not create a repository per small plugin.
Do not introduce AI. Add only participating repositories for the current slice, each through
its own [initializer and user review pause](migration-reference.md#dependent-repository-setup-gate); TreeDX is excluded from this process.

Each repository owns its manifests/lock/build/unit/integration tests, Git commits/PRs and
release artifacts. Platform's composition selects exact reviewed source/candidate and artifact
identities; its integration checks consume that actual closure. An ignored local checkout is
not a release pin. Independent builds consume SDK/public package interfaces and resolved
artifacts, never relative source imports into a sibling checkout or a second root-owned copy.
Local source substitution is explicit and must produce independently verifiable artifacts.
There is no blanket root workspace link that makes unbuilt sibling source the production path.

### Four plugin-author contracts

1. **Package/composition:** exported TypeScript plugin class, package identity, version, supported platform contract, server/optional browser entrypoint and configuration schema. Keep plugin metadata in standard package metadata when sufficient; resolve code through the normal package manager. One deployment configuration enables plugins/settings; secret values are credential references.
2. **Service composition:** use Cordis services, `inject`, `plugin` and effects. Do not implement a second start/stop/dependency lifecycle. Missing dependencies, duplicate public names and cycles are candidate blockers. Dependency metadata needed for planning is derived from the same author declaration, not handwritten twice.
3. **Operation binding:** one executable source schema for exact input/output and inferred TypeScript types; capability/scope, effect, exposure and concurrency/idempotency policy. Generate OpenAPI/MCP/client projections from that binding. Avoid a permissive `Record<string, unknown>` public result.
4. **Browser contribution:** a page/route, optional navigation and actions naming registered operation IDs, composed from UI-owned public providers. Admin/feature owners supply authorized view models/actions; they do not copy HTML/DOM/CSS rendering. Browser bundles contain no server entrypoints, credentials or deployment internals. Build contributions into the tested composition; initially do not fetch executable browser modules from arbitrary runtime URLs.

Use Cordis's native constructor/class plugin form, declared injection and configuration validation hooks; its acceptance of other plugin forms is not permission for function-based TreeSeed implementations. Its service/fiber behavior is a dependency to pin and qualify, not a reason to copy its internals. [Inspected registry](https://github.com/cordiverse/cordis/blob/35fdc969e4b6c48c48ed44717c7a018324e4dd88/packages/core/src/registry.ts), [lifecycle](https://github.com/cordiverse/cordis/blob/35fdc969e4b6c48c48ed44717c7a018324e4dd88/packages/core/src/fiber.ts). Tasks 3A/3B implement native composition foundations; broader operation/contribution and generic container contracts retain their separate acceptance gates.

### Required modules/plugins

| Part | Interface ownership |
| --- | --- |
| SDK contracts/client | Portable schemas, operation/plugin declarations, typed caller and generated transport contracts. |
| SDK runtime helpers + API host | SDK owns Node/server-only registration helpers; API owns Cordis root and default production wiring. |
| Identity plugin (`identity`) | Resolve sessions/principals and authorize capabilities/resources. Token scopes cannot be enlarged by roles. |
| Deployment plugin + local adapter (`deployment`) | Shared host lifecycle, status and development selection. |
| HTTP/MCP transport plugin (`api`) | Explicit REST and selected MCP bindings of registered operations, discovery and errors. |
| Web plugin (`admin`) + UI kit (`ui`) | Server-side session boundary, shared forms, navigation/status/application views. |
| CLI | Arguments, help, local/remote selection, SDK calls and output. No independent domain lifecycle. |

Same-process plugins are trusted code. Context isolation is service composition, not a sandbox. Untrusted task execution and provider credentials remain separate boundaries when Agent arrives. Credentials never appear in package metadata, browser assets, plans, telemetry or user-visible error bodies.

NPM/Git acquisition is a Deployment-owned provider capability, exposed locally through
proposed `trsd plugin install <source>`. It resolves immutable artifacts, validates descriptors
and attempts safe activation through the shared exact plan/apply authority. Per the
maintainer decision, prepare-only is not the default successful install: safe changes activate;
restart/migration/build/trust/selection requirements retain a candidate and return a truthful
non-successful activation outcome. Targets and providers are explicit. No new remote installer
endpoint or anonymous MCP package-execution tool is implied; the seven operation IDs remain.

The loader only mounts previously installed approved bytes. It does not run package install scripts in the live server or dynamically resolve unpinned code. Candidate build/installation is separate from loading. Each registration returns a disposer; disposal failure remains visible. Durable work/resources need their own drain/fence/recovery proof beyond calling a disposer.

Qualified live activation/replacement is required, with admission gating, pinned in-flight
leases, bounded drain, native Cordis dependency/effect teardown and verified generation
read-back. Restart/migration is an explicit planned alternative when safety is unproven,
not an automatic side effect of install. Cordis alone is not a transactional cross-process
switch or a durable recovery journal. Removing a required core plugin or a dependency of another enabled plugin is rejected. Optional failure must be visible and prevent its dependent operations from being advertised as ready. Do not silently fall back to another identity/provider or older implementation.

### Proposed SDK signatures

OperationDefinition.define, DeploymentHost.diagnose and persisted non-activating DeploymentHost.plan are implemented in merged Tasks 1–2. Native runtime composition, provider management and the remaining methods are proposed for later tasks. Capability interfaces describe class implementations, never function bags. Exact wire shapes are listed below; infer caller types from the executable schema rather than maintaining parallel interfaces.

| API | Contract |
| --- | --- |
| `OperationDefinition.define(definition)` | Return typed binding; validate stable unique ID, input/output schema, capability/scope, effect, surface bindings and mutation rules. |
| `OperationService.register(binding, handler)` | Return disposer; reject duplicate IDs and route/tool collisions. |
| `OperationService.invoke(binding, input, request)` | Validate, authorize and call handler once; validate result; preserve request/trace identity and cancellation signal. |
| `PlatformClient.invoke(binding, input, options?)` | Typed output or structured problem; options include cancellation, idempotency key and expected version as applicable. No caller-created remote paths. |
| `DeploymentHost.diagnose(configuration?)` | Read-only local engine/installation diagnostics; never activate, create state or grant authority. Not an extra remote operation. |
| `DeploymentHost.plan(configuration)` | Read/resolve and persist a non-activating plan with blockers. |
| `DeploymentHost.apply(planId, digest, options)` | Return one durable application reference; options bind idempotency and expected state. |
| `DeploymentHost.status()` / `application(id)` / `events(id, cursor)` | Read authoritative host state; unavailable/unknown is distinct from healthy/empty. |
| `DeploymentHost.cancel(id)` / `recover(id)` | Safe local lifecycle requests with checked ownership and recorded outcomes. |

The request context is trusted: principal, authorized resource scope, request ID and abort signal. It is never accepted as an ordinary body field. Scope-sensitive handlers resolve resource ownership again where required. Identity tokens stay server-side in browser flows; mutations require the app's same-origin/CSRF boundary.

## 6. Small public operation catalog

These seven operations are the entire initial remote platform domain. Identity discovery/session protocols and private process probes are separate infrastructure boundaries. Do not expose raw Docker commands, journal writes, arbitrary shell/file access, universal CRUD or full legacy catalogs.

| ID | Essential input → output | REST binding | CLI binding |
| --- | --- | --- | --- |
| `platform.describe` | Empty → supported contract, platform version, filtered plugins/operations and schema digest. | `GET /v1/platform` | `platform describe` |
| `platform.status` | Empty → installation ID, engine, desired/active composition, required readiness, plugin/service status, blockers, current application. | `GET /v1/platform/status` | `platform status` |
| `platform.plan` | Desired configuration → plan ID/digest, expected composition, resolved artifacts, effects, blockers. | `POST /v1/platform/plans` | `platform plan` |
| `platform.apply` | Plan ID/digest plus request headers → application ID and accepted state. | `POST /v1/platform/applications` | `platform apply` |
| `platform.applications.get` | Application ID → phase/history reference, desired and actual composition, terminal result/recovery state. | `GET /v1/platform/applications/{id}` | `platform application` |
| `platform.applications.events` | Application ID, optional cursor/limit → ordered events and next cursor; SSE is a transport representation of this source. | `GET /v1/platform/applications/{id}/events` | `platform events` |
| `platform.applications.cancel` | Application ID and expected state → recorded cancellation request/actual current state. | `POST /v1/platform/applications/{id}/cancel` | `platform cancel` |

Read scopes require `platform.read`; lifecycle mutations require `platform.manage` and installation ownership. `plan` requires management authority because it resolves potentially private artifact/credential metadata and persists a plan. Catalog metadata is permission-filtered. Do not auto-expose install/apply as an unauthenticated MCP tool.

`recover` remains a protected local bootstrap/recovery adapter method initially; it does not add an eighth remote API. The seven operations have local bindings so installation can occur before HTTP exists. Client-side doctor/open/help are CLI presentation/environment class methods, not hidden domain operations.

Each operation binding defines a stable MCP tool name derived by a collision-checked mapping from the operation ID. Discovery includes only explicit exposed bindings supported by the authenticated connection. Pin and negotiate the MCP protocol versions supported by the chosen maintained adapter; validate actual initialize/list/call and denied-access flows. Do not hardcode a remembered protocol version into prose or duplicate protocol handling.

SDK clients use the same binding/schema authority. Browser actions use the server-side session and that same invocation service; a disabled button is not authorization. Human presentation can differ while exact result/problem/authority semantics remain the same.

### Wire and error rules

- Generate field/type/reference docs from executable schemas when implementation starts. Reject unknown/prohibited fields, malformed/missing/empty values, invalid cursors and scope escalation. No manually maintained shadow schema.
- Success uses the established control-plane `{data, meta?}` style; metadata carries request and contract identity. Binary/stream representations must be explicitly declared. CLI wraps the semantic result in its command envelope.
- Public errors use structured problem details with stable machine code, safe description, request ID and field-addressable validation issues. Retain current RFC-style client semantics rather than inventing a parallel error protocol.
- Classify invalid input as 400; unauthenticated 401; unauthorized 403; missing authorized resource 404; stale state/idempotency conflict 409 or declared conditional-write 412; unavailable dependency 503. Avoid revealing private existence via differing unauthorized errors.
- HTTP `Idempotency-Key` and expected-state headers map to the same SDK call options and MCP/browser action semantics. Equivalent remote/local retries have equivalent effects.
- A disconnected request aborts reads/request work where safe. It cannot erase an accepted host application or imply its side effects were cancelled.
- Persisted event order/cursors support restart/reconnect. Unknown application/cursor, unavailable journal and zero events are different outputs. Retention limits must report that resynchronization is required instead of silently skipping history.

## 7. Development and release

Development uses the installed composition with explicit per-target `released`, `candidate` or `live` substitutions. Source location, commit/dirty bytes, recipe and dependency generation are observable. Selection persists until switched/stopped through the supported lifecycle; no expiry watchdog or timed fallback. A failed build retains complete previous output or clearly blocks readiness. Never advertise partially written output as accepted.

Declare only relevant consumer reactions and rebuild the affected closure. A Git checkout change does not prove that compiled output or a consumer changed. Freeze records exact source/recipe/dependency state and package/image digests, rejects concurrent source/output changes, and runs integrated checks on those immutable candidates.

Promote accepted bytes without rebuilding. The candidate identity, artifacts and actual installed files/images must match. Keep prior known-good recovery inputs and data compatibility evidence. Do not invent another catalog/status/evidence service to coordinate these facts.

Use separate migration release identities so existing SDK/CLI/npm channels and deployed services continue unchanged. `cordis` is the migration integration branch. No migration-to-`staging`/`main` or production publication is authorized by this document. A separate reviewed cutover, explicitly authorized by the maintainer, must preserve legacy work and adopt the verified successor as `staging` before `staging` → `main` PR promotion resumes. `staging` and `production` remain the only future GitHub deployment environments; `cordis` is an isolated source branch, not a new environment. Agents may not approve or merge `main` under the new AGENTS.md.

## 8. Completion and expansion

A milestone is complete only with documentation, an initially failing test at the user-observable boundary, regression/integration/unit coverage, production default wiring, a clean build/CI and execution of the assembled artifact. Missing environments or target machines remain unproven. Before each coded acceptance invocation, run complete participating-owner unit/integration suites on that exact candidate; focused tests do not replace them.

After the foundation passes, add Projects → Knowledge → one authorized Work/Agent/independent-review/product-retrieval journey. Keep external execution and durable authority distinct. Defer advanced scheduling, broad service catalogs and public content frameworks until the relevant journey needs them. No repository or module can be considered migrated solely because it has a plugin declaration.

## Task 1 implementation boundary

The maintainer reviewed the three initialized owner worktrees and authorized publication and
Task 1 resumption. [Delivery plan](superpowers/plans/2026-10-23-task1-diagnostics.md) and
[composition record](../composition/task1.json) identify exact owner candidates and native
qualification. CLI `CliApplication`/`CliOutput`, SDK `OperationDefinition`/`PlatformOperations`
and Deployment `ComposeDeploymentHost` implement only the diagnostic executable and contracts.
Owner READMEs in the linked PRs define exact current fields and flags:
[CLI#310](https://github.com/treeseed-ai/cli/pull/310),
[SDK#451](https://github.com/treeseed-ai/sdk/pull/451),
[Deployment#901](https://github.com/treeseed-ai/deployment/pull/901).

Current executable syntax: `trsd --help`, `trsd --version`,
`trsd doctor [--json] [--context NAME] [--installation ABSOLUTE_PATH] [--port INTEGER]`.
Doctor checks Ubuntu26.04x64, local Unix engine authority, Linux/amd64 server, Compose,
2CPUs/2GiB engine memory, owned writable storage with1GiB free and temporary loopback bind.
JSON has command/success/result/problem/blockers/references; exits0/1/2/3 follow the catalog.
Lifecycle commands explicitly fail as unsupported. SDK seven-operation schemas do not imply
an executing transport. All subsequent plan/apply, installation, identity and plugin work
requires a new bounded statement of work.

## Task 2 merged planning boundary

The approved implementation specification is [non-activating plans](superpowers/plans/2026-10-24-non-activating-plans.md). That historical Task 2 candidate adds local planning only. Task 3A/3B subsequently added native roots and the first installed composition; broad remote parity remains future work. Task 3 is now decomposed into [3A native CLI/Deployment composition, 3B installation/API root, 3C package installation and 3D Agent composition baseline](superpowers/plans/2026-10-24-cordis-composition-providers.md). Tasks 3A/3B are integrated. The proposed #722 Task 3C revision requires generic container plugins and reusable UI; only UI initialization is resumed, retaining the setup pause before implementation.

## Task 3C resumed: mobile-first UI

The maintainer accepted UI setup and authorized exact baseline publication and Task 3C implementation. Every visual component must be mobile-first from 320 CSS pixels to widescreen monitors; test 320/375/768/1024/1440/1920/2560 widths, long content, keyboard/touch and 200% text resizing. Keep authored controls at least 44×44 CSS pixels, required actions visible, logical/fluid dimensions and no page overflow (labeled local semantic-table overflow is permitted). UI owns components/styles/renderers; consumers retain domain behavior and Identity retains Keycloak authority. All issues, including #678, remain open.
