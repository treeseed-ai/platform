# Agent Architecture and Capacity Allocation Implementation Plan

**Status:** in progress
**Plan created:** 2026-09-12
**Last architecture review:** 2026-09-15
**Scope:** agent profiles, handlers, AgentKernel, assignment workspaces, workday planning, capacity allocation, and provider selection
**Related plan:** [`docs/agent-assignments.md`](./agent-assignments.md) owns proposal planning, decisions, living-graph projection, assignments, results, review, and reconciliation
**Explicit non-goal:** UI implementation

## Objective

Restore the original configuration-plus-code agent model and replace the capacity hierarchy with one understandable workday allocator.

```text
ready execution node
        ↓
workday admission and provider selection
        ↓
immutable assignment with effective activity profile
        ↓
provider isolation → AgentKernel → selected Handler
        ↓
general assignment result
```

Profiles explain who an agent is and how each activity behaves. Reusable handlers provide executable behavior. AgentKernel enforces every assignment through one path. The API owns scheduling and capacity. Providers supply execution environments but never define agent behavior.

Reviewed acting work remains one objective while execution alternates between independently assigned profiles:

```text
Actor acting assignment → immutable candidate → Reviewer reviewing assignment
          ↑                                      │
          └──────── exact request-changes ───────┘
                                      approved → work item complete
```

## Progress Reporting

Whoever implements this plan must update its checkboxes and the short **Observations and blockers** section in the same change. Mark an item complete only when its listed CLI, test, Actions, or exact-ref evidence exists. Keep detailed logs in Actions artifacts and the governing GitHub Issue; do not duplicate them here.

Checkboxes report implementation status only:

- `[ ]` not implemented or not verified
- `[x]` implemented and verified
- `BLOCKED:` requires an active entry under **Observations and blockers**

## Local Development Loop

Persistent development mode is the only implementation loop before coordinated acceptance. A changed package rebuilds with its actual dependents, becomes active only after compilation and readiness succeed, and leaves the previous known-good process serving on failure. Assignment diagnostics expose the exact SDK, API, Agent, Deployment, guest image, provider offer, source authority, workspace, grant, sandbox lifecycle, result, settlement, and successor outcome from existing records rather than creating another tracking system.

The golden proposal and agent-assisted workflow are owned by [`docs/agent-assignments.md`](./agent-assignments.md). Architecture work must move that same live path forward; component tests alone do not prove an activity profile. Publish one coordinated RC set only after local end-to-end acceptance.

Once that receipt exists, use the SDK agent team on real bounded development and clone it to eligible projects only through the native plan/apply operation defined by the assignments plan. Unrelated defects are recorded in the owning GitHub issue and deferred unless they prevent the active assignment frontier.

## Decisions

- The Agent package owns AgentKernel and the reusable default handlers.
- Every enabled activity profile selects one effective handler.
- First-party profiles select Agent-package defaults. A project may select a project-owned handler compiled into its runtime build.
- There are no separate default/override fields, handler versions, handler digests, downloads, marketplaces, or runtime source loading.
- Activity profiles may declare standing dependencies by agent class or lifecycle event. The API resolves them into the graph defined by `docs/agent-assignments.md`.
- An accepted acting work item deterministically expands into an Actor → Reviewer pair when review is required. Rejection repeats that pair against the same work-item objective through bounded node revisions.
- Only the Reviewer agent normally enables `reviewing`; the generated reviewing node selects that profile and receives the exact acting result.
- Every activity profile declares a simple deny-by-default content and tool permission ceiling. The profile is not a runtime grant.
- The API creates exact assignment grants within the profile ceiling and team/project policy. AgentKernel enforces that immutable grant at every runtime service.
- Handlers share one assignment context and one result contract. Do not create schemas for every handler or work product.
- Every model-backed assignment receives one API-authoritative productive window. Its prompt states the total budget, its first execution action must query the live remaining time, and its final tool action before the response must query it again. The provider rejects completion retryably unless both boundary checks are proven, and agents must use each reading to reduce scope, reserve verification time, and finish within the window.
- AgentKernel has one public assignment entry point. Providers do not dispatch behavior by prompt or activity.
- Assignments, not profiles or agents, select and own their one mutable workspace and any Git branch.
- Workdays guarantee self-directed and collaborative planning before proposal-driven work can consume the remaining capacity.
- Ready graph nodes are the only assignment demand.
- No legacy implementation or backward compatibility remains after cutover.

## Ownership

| Component | Owns | Must not own |
|---|---|---|
| SDK | Portable profile, permission-ceiling, handler-selection, dependency-selector, workspace, assignment-context/result, capacity, and CLI contracts | Runtime handler code, scheduling, provider execution |
| API | Graph readiness, workday lifecycle, admission, grant compilation, workspace selection, fair selection, assignments, leases, accounting, and settlement | Prompts, handler implementation, provider-local execution |
| Agent package | AgentKernel, default handlers, build-time registry, assignment-scoped runtime services, result validation | Scheduling, graph mutation, capacity allocation, settlement |
| Project runtime | Project-owned handlers compiled into that project's runtime build | Remote handler loading, hidden scheduling policy, provider credentials |
| Capacity provider | Offers, availability, isolation, runtime/model/tool supply, credentials, native quotas, and execution transport | Agent semantics, graph topology, team priorities |
| TreeDX | Governed profiles, books, knowledge, notes, questions, proposals, decisions, and reports | Operational graph state, leases, reservations, provider availability |
| CLI | Generated operator and acceptance surface | Duplicate business logic or a second scheduler |

## Agent Profile

### Minimal complete shape

```yaml
id: sdk/engineer
name: SDK Engineer
agentClass: engineer
purpose: Implement accepted SDK behavior through scoped TypeScript changes.
responsibilities:
  - Participate in self-directed and collaborative planning.
  - Estimate engineering work.
  - Implement authorized source changes and return exact verification.
capabilities:
  - code-change
  - refactoring
  - build-verification
context:
  include:
    - project-objectives
    - accepted-decisions
    - repository-structure
    - assignment-subject
    - predecessor-results

activityProfiles:
  planning:
    handler: writer
    dependsOn:
      agents: [architect]
    permissions:
      content:
        read: [book, knowledge, objective, proposal, decision, note, question]
        write: [proposal, question, knowledge]
      tools: [discussion, source.read]
    prompt:
      system: Study the authorized SDK context and identify valuable work.

  estimating:
    handler: estimate
    dependsOn:
      agents: [architect]
    permissions:
      content:
        read: [book, knowledge, objective, proposal, decision, note, question]
        write: [proposal, question]
      tools: [discussion, source.read]
    prompt:
      system: Estimate complete work items, dependencies, and acceptance criteria.

  acting:
    handler: actor
    dependsOn:
      agents: [tester]
    permissions:
      content:
        read: [book, knowledge, objective, proposal, decision, note, question]
        write: []
      tools: [source.read, source.write, verification]
    additionalContext:
      - assigned-source-scope
    prompt:
      system: Implement the accepted SDK work with the smallest strict TypeScript change.

  chat:
    handler: writer
    permissions:
      content:
        read: [book, knowledge, objective, proposal, decision, note, question, discussion]
        write: [discussion]
      tools: [discussion]
    prompt:
      system: Answer within SDK engineering scope and preserve authority boundaries.
```

Required fields are identity, agent class, responsibilities, capabilities, common context, and enabled activity profiles. Each enabled activity requires a handler, meaningful prompt, and permissions. `dependsOn`, `additionalContext`, and handler parameters are optional and appear only when needed.

Common context is declared once. Activities add context rather than restating the common list. Context byte, token, time, and item limits belong to the immutable assignment and provider capacity envelope, not every profile.

Permissions are ceilings, not grants. Content permissions use model groups with `read` and `write`; write includes governed create, update, link, validate, and commit behavior. Tool permissions use stable human-readable groups such as `discussion`, `source.read`, `source.write`, `verification`, and `release`. The SDK expands those groups into concrete operations. There is no separate allow/deny pair, commit flag, authority preset, raw tool list, shell-command list, network-domain list, or branch policy in a profile. Anything not allowed is denied.

Profiles do not contain provider selection, credentials, runtime images, generated graph IDs, estimates, concrete work items, exact paths, output taxonomies, reviewer mappings, or collaborator lists.

### Core content usage

Do not introduce `architecture` or `review` content models in the initial implementation. They are subjects and workflows, not yet distinct data contracts.

- Each project has a conventional `<Project> Architecture` `book`.
- The Architect extends that book with validated `knowledge` pages.
- Reviewer findings and concerns are `note` content.
- Unresolved review matters are `question` content.
- Workday reports are `note` content referencing the exact workday, assignments, results, usage, releases, and publications they summarize.
- `decision` content has an explicit class: `proposal`, `work-review`, or `publication`, plus an authority, approval, or vote method and its exact decision-maker evidence. Proposal acceptance and formal approved/request-changes review dispositions use that one model.
- Assignment results reference the exact TreeDX revisions and Git commits involved.

Extend the generic content entity reference once and use it consistently on notes, questions, and decisions so each can identify an exact model, item, commit, path, optional heading anchor, and optional start/end line. Do not create architecture-note or review-note variants. Exact commit plus anchor/range keeps feedback and dispositions precise while allowing later pages to evolve.

Add a new content model only when existing core models cannot express a required validated field structure, lifecycle, authorization rule, control-plane action, or query. A directory name or subject category alone is not sufficient.

[`docs/agent.schema.yml`](./agent.schema.yml) is the machine-readable target object model. The SDK remains the runtime contract owner: implementation must generate SDK types and validators from the schema or prove exact structural equivalence in CI. API storage, Agent context/results, CLI schemas, and fixtures must use that same generated contract rather than restating it.

The Reviewer is the only first-party agent that normally enables `reviewing`:

```yaml
activityProfiles:
  reviewing:
    handler: writer
    permissions:
      content:
        read: [book, knowledge, objective, proposal, decision, note, question]
        write: [note, question, decision]
      tools: [source.read, verification]
    prompt:
      system: Review the assigned candidate against its objective, acceptance criteria, exact references, and verification. Record findings as notes or questions and finish with an exact approved or request-changes decision. Never modify the reviewed candidate.
```

### Standing dependency defaults

Use readable selectors only:

```yaml
dependsOn:
  agents: [engineer, tester]
  events: []
```

`docs/agent-assignments.md` defines their fixed scope and graph semantics. Profiles never resolve or mutate the resulting edges.

Initial first-party defaults:

| Agent | Default handlers by activity | Standing dependency |
|---|---|---|
| Architect | planning/chat: `writer`; estimating: `estimate`; acting: `writer` | none |
| Engineer | planning/chat: `writer`; estimating: `estimate`; acting: `actor` | planning and estimating require Architect; acting requires Tester |
| Tester | planning/chat: `writer`; estimating: `estimate`; acting: `actor` | planning, estimating, and acting require Architect |
| Releaser | planning/chat: `writer`; estimating: `estimate`; acting: `releaser` | planning and estimating require Architect; acting requires Engineer, Technical Writer, and approved required reviews |
| Reporter | planning/chat: `writer`; reporting: `reporter` | reporting requires `workday-closing` |
| Researcher | planning/chat/acting: `writer`; estimating: `estimate` | none |
| Reviewer | planning/reviewing/chat: `writer`; estimating: `estimate` | planning and estimating require Architect; reviewing depends on the exact work being reviewed |
| Technical Writer | planning/chat: `writer`; estimating: `estimate`; acting: `actor` | planning and estimating require Architect; acting requires Engineer and Tester |

Standing dependencies apply to scheduled planning, estimating, and acting work. They do not apply automatically to chat, because an addressed message must not wait for an unrelated workflow node. Reviewing is subject-bound: reconciliation creates an edge from each exact reviewed node to its Reviewer node rather than placing every possible review target in the profile.

The SDK default is test-first: Architect → Tester → Engineer. The Tester returns an exact test commit; the Engineer receives that commit as its base and normally receives no grant to modify test paths. Incorrect tests return to the Tester as revision work instead of being silently rewritten by the Engineer.

Use one Reviewer class. A required acting work item automatically gets a paired reviewing node; no profile attaches itself to another agent and no user authors the generated node. The pair shares one work-item objective. The actor produces an immutable candidate, the Reviewer evaluates it, and rejection advances both stable nodes to another bounded revision with the exact findings. The work item becomes complete only after approval.

Proposal review is also performed by the Reviewer `reviewing` profile, but it is generated from proposal governance rather than an acting work item. A different review subject does not require another Reviewer class.

## Handlers

### Shared interface

```ts
interface Handler {
  readonly id: string;
  run(context: AssignmentContext, runtime: AgentRuntime): Promise<AssignmentResult>;
}
```

The Agent package provides:

- `WriterHandler`
- `ActorHandler`
- `EstimateHandler`
- `ReleaserHandler`
- `ReporterHandler`

These handlers are reusable across agent classes. The activity profile supplies identity, prompt, context, and standing dependencies. The assignment supplies concrete work, authority, predecessor results, limits, and workspace.

`EstimateHandler` uses the one proposal work-item estimate contract. This is a domain contract shared by all estimators, not a handler-specific artifact schema.

### Project-owned handlers

A project may change the activity profile's single `handler` value to a project-owned implementation. That class may call or compose a default handler, or implement `Handler` directly. It is registered when the project runtime is built and is available only when the assignment pins that exact build.

Do not copy a default handler merely to change a prompt or context selector; those changes belong in the activity profile. Create project code only when executable behavior differs.

One build-time registry contains Agent defaults plus handlers from the selected project runtime. Missing selections fail before execution.

## AgentKernel

```ts
interface AgentKernel {
  runAssignment(request: KernelAssignmentRequest): Promise<KernelAssignmentResult>;
}
```

AgentKernel performs seven steps:

1. Validate assignment identity, authority, deadline, profile, handler, runtime build, grants, and context limits.
2. Materialize context only from assignment-authorized references.
3. Resolve the selected handler from the build-time registry.
4. Create assignment-scoped runtime services and workspace.
5. Run the handler once under cancellation and hard limits.
6. Validate the shared result and exact references.
7. Return the canonical result or failure to the provider runner.

AgentKernel does not schedule, evaluate graph readiness, allocate capacity, select providers, renew leases, approve decisions, or settle usage.

### Runtime services

```ts
interface AgentRuntime {
  readContext(ref: AuthorizedContextRef): Promise<unknown>;
  invokeModel(request: ModelInvocationRequest): Promise<ModelInvocationResult>;
  runVerification(request: VerificationRequest): Promise<VerificationResult>;
  commitTreeDx(request: TreeDxCommitRequest): Promise<AssignmentReference>;
  commitSource(request: SourceCommitRequest): Promise<AssignmentReference>;
}
```

The activity profile defines the maximum content and tool authority appropriate for that activity. The API validates the assignment's requested authority against that ceiling and team/project policy, verifies that the provider supplies the required capabilities, and freezes the exact narrower grant on the assignment. Missing required authority blocks admission with an explanation; it is never silently removed. The runtime enforces the assignment grant whenever a handler calls a service. Do not duplicate required-service declarations in handler metadata.

Deterministic handlers never invoke a model. Model-assisted handlers cannot bypass deterministic input, authority, reference, or result validation.

## Assignment Workspaces and Git

An assignment has at most one mutable workspace. Its mode identifies where mutable work may be staged; it does not restrict which exact Git or TreeDX references the assignment may read.

| Mode | Mutable authority | Use |
|---|---|---|
| `read-only` | none | Analysis and deterministic inspection; exact Git and TreeDX context may be read |
| `treedx` | one governed TreeDX workspace | Books, knowledge, proposals, estimates, notes, questions, decisions, reports, and other governed content |
| `git` | one isolated Git worktree and branch | Tests, implementation, repository documentation, integration, and release |

The accepted work item identifies its workspace mode. The profile permission ceiling must allow the requested mutation, and the assignment contains the exact paths, content scope, references, and grants. A `treedx` assignment may read exact Git refs; a `git` assignment may read exact TreeDX refs. `read-only` means no mutable workspace, not a third storage system. Merge and release permission comes from assignment grants, not another workspace mode.

If one outcome requires commits to both Git and TreeDX, represent it as two dependent work items. Do not introduce a dual-write workspace or cross-system commit protocol.

For Git work:

- the API supplies an exact base commit;
- each source-changing attempt receives one isolated worktree and short-lived branch;
- handlers cannot share mutable worktrees or write directly to `staging` or `main`;
- completion returns repository, exact commit, and optional branch in the general result;
- retry or revision uses a new branch and never rewrites a reviewed commit; and
- branches may be removed after normal pull-request integration because Git history and assignment results retain custody.

A single predecessor commit may be the next assignment's base. When several predecessor commits must be combined, create an explicit integration assignment. Do not hide automatic composite-base construction inside admission or context loading.

`staging` remains the only development-integration branch and `main` remains production. Integration and release follow graph order and normal Actions verification.

## Workday Capacity

### Minimal policy

```yaml
durationSeconds: 28800
maximumConcurrency: 8
planningPercent: 20
allocationWeight: 1
planningTurnMaximumSeconds: 180
communicationConcurrency: 1
projectPercentages:
  sdk: 60
  api: 40
agentClassPercentages:
  sdk:
    engineer: 60
    reviewer: 30
    reporter: 10
  api:
    engineer: 60
    reviewer: 30
    reporter: 10
```

Do not add allocation sets, minimum/target/maximum tiers, priority bands, borrow rules, a generic reserve, or separate capacity-plan and demand records.

Manual and recurring workdays use one high-level intent and the same preflight/start admission path. Intent selects simulation or production custody; the resolved Workday remains the sole execution-mode authority. Recurrence retains canonical intent and existing receipts, not separate time tiers or manually supplied capacity. Allocation receipts expose weighted supply opportunities and the SDK selector's project/class deficits.

### Planning phase

Planning uses the first `planningPercent` of wall-clock duration and allocated capacity. Repeated short turns follow activity dependencies, give eligible agents equal turn ceilings, and load previous contributions through TreeDX. Class/project percentages govern opportunity frequency. Planning requires no existing proposal and admits no implementation, deployment, or release. Estimates are authored during planning; proposals may originate in any authorized activity. At the phase boundary, stop unfinished planning turns and release unused capacity to acting/review.

Provider-owned capability caps and a shared execution-provider/model cap bound every workday. Normalize active workday weights (default 1), preserve existing reservations, and redistribute idle project/class target shares only to admissible graph-ready work. Both production and simulation consume real supply. Charge active harness/model/tool time, including model-backed preparation and closeout; record infrastructure setup, queueing, and teardown separately.

Cold-start acting uses the task's maximum estimate, bounded by provider limits and available allocations. Replay the latest 20 eligible measurements within the same provider/model, capability, class, and activity, normalized by expected task duration. Successful completion targets 1.25 times observed duration with at most 10% downward adjustment per sample; expiration increases allocation by at least 25%. Other failure classes do not calibrate task duration. Insufficient viable capacity defers work without changing the graph.

The read-only `workday plan` operation and mutating `workday start` use the same compiler. The workday stores the applied plan rather than creating another scheduling authority.

### Lifecycle and Reporter

Workday lifecycle is:

```text
planned → active → closing → ended
```

- `active` admits phase-eligible graph nodes and addressed communication; acting waits until the planning boundary.
- `closing` stops ordinary admissions and satisfies the `workday-closing` condition.
- Reporter and any required settlement/closeout nodes run during closing.
- `ended` is reached only after required closeout nodes finish and usage settles.

Preflight reserves capacity from the estimated required closeout nodes. There is no separately configured generic reserve.

### Admission and fairness

Admission first applies hard gates:

- current graph/node and decision authority;
- effective profile, handler, runtime build, and grants;
- node-required capabilities;
- eligible provider offer, availability, native limits, and concurrency;
- remaining workday time and assignment deadline.

Among eligible nodes:

1. select the project furthest below its weighted share of actual admitted seconds;
2. within it, select the agent class furthest below its weighted share;
3. within that class, select graph priority then oldest readiness using stable ties; and
4. select the eligible provider with available concurrency and the least recent fair usage.

Unused weighted share flows automatically to other ready work. Add a strict cap only for a verified external limit.

Provider arbitration compares eligible teams globally so one busy team cannot monopolize provider concurrency. It compares scheduling metadata only and preserves team/project isolation.

Charge actual attempt seconds, including failures and retries, and settle each attempt exactly once. Provider-native usage remains separate from fairness seconds.

## Implementation Checklist

### Phase 1 — Profiles and contracts

- [x] Replace the current profile schema with the minimal complete shape above.
- [x] Keep common context once and activity-specific additions only where needed.
- [x] Require one effective handler, meaningful prompt, and simple content/tool permission ceiling for each enabled activity; keep parameters optional.
- [x] Permit `reviewing` only on the Reviewer profile by default; remove reviewing profiles from Architect, Engineer, Tester, Releaser, Researcher, and Technical Writer.
- [x] Replace authority presets, raw tool allow/deny lists, commit flags, branch policy, and per-model operation matrices with deny-by-default `content.read`, `content.write`, and stable tool groups.
- [x] Use only registered core content models in permission ceilings; add no `architecture`, `review`, or `workday-report` model.
- [x] Extend the one generic entity-reference contract with exact path, commit, optional heading anchor, and optional line range; use it on notes, questions, and decisions.
- [x] Add explicit `proposal`, `work-review`, and `publication` classes plus authority/approval/vote evidence to the one decision model.
- [ ] Generate SDK types/validators from `docs/agent.schema.yml` or enforce exact structural equivalence in CI.
- [x] Add simple `dependsOn.agents` and `dependsOn.events` selectors with no cardinality or scope configuration.
- [x] Add the shared `Handler`, assignment context/result/reference, workspace, workday, and capacity contracts.
- [x] Accept built-in and project-owned handler IDs structurally; validate availability against the exact runtime build.
- [ ] Generate CLI descriptors from the SDK and delete old profile/allocation schemas without compatibility unions.

Acceptance:

- [x] Complete first-party profiles validate and missing handlers, prompts, permissions, invalid dependencies, non-Reviewer reviewing profiles, or unavailable runtime handlers fail clearly.
- [ ] CLI profile inspection shows the effective handler, origin, prompt, context, permission ceiling, and unresolved dependency selectors for each activity.

### Phase 2 — AgentKernel and deterministic Reporter

- [x] Implement the single AgentKernel entry point and build-time handler registry.
- [x] Route the existing isolated provider transport through AgentKernel.
- [x] Compile exact grants within the activity ceiling and team/project policy; block admission when required authority is unavailable.
- [x] Enforce immutable assignment grants at runtime-service calls and validate the one result contract.
- [x] Implement deterministic `ReporterHandler` with no model dependency.
- [x] Commit the report through TreeDX and return its ordinary exact reference.
- [ ] Remove Reporter-specific scheduling/provider behavior.

Acceptance:

- [x] One real closing Reporter assignment executes API → provider → AgentKernel → Reporter → result → settlement through the CLI.
- [x] Identical authorized inputs produce identical report bytes.
- [ ] Unknown handler, wrong build, expired assignment, denied service, invalid result, cancellation, and timeout fail closed.
- [ ] Every model-backed activity receives its authoritative productive window, uses the clock as its first execution and final tool actions, and scopes its work to finish within that window. Chat, planning, estimating, Architect acting, Tester acting, Engineer acting, and Reviewer reviewing are proven; Releaser, Researcher, and Technical Writer acting remain to be proven against the strengthened boundary-order gate.

### Phase 3 — Reusable and project-owned handlers

- [x] Implement `WriterHandler`, `ActorHandler`, `EstimateHandler`, `ReleaserHandler`, and `ReporterHandler` against the shared interface.
- [x] Migrate Architect, Engineer, Tester, Releaser, Reporter, Researcher, Reviewer, and Technical Writer to the default matrix above with complete prompts.
- [ ] Prove Architect → Tester → Engineer ordering, activity-specific planning/estimating dependencies, and the Releaser/Technical Writer dependencies above.
- [ ] Make the Architect maintain a conventional `<Project> Architecture` book of validated knowledge pages.
- [x] Route Reviewer findings through notes/questions and formal dispositions through decisions, all bound to exact candidate references.
- [x] Remove Reviewer acting behavior; route proposal review and every required acting-work review through the same Reviewer `reviewing` profile.
- [ ] Add one project-owned handler that reuses or implements the shared interface and prove selection without changing Agent-package code.
- [ ] Keep books, knowledge, proposals, notes, questions, classed decisions, proposal-embedded estimates, and note-based workday reports on ordinary TreeDX operations.
- [ ] Remove TreeDX assignment-plan, assignment-status, and assignment-summary content; consume PostgreSQL assignment state and general results instead.
- [ ] Keep source work on ordinary Git commit/push and general-result references.
- [ ] Delete generic guest/provider semantic branches replaced by handlers.

Acceptance:

- [ ] Every enabled activity resolves exactly one handler from its pinned runtime build.
- [ ] Default handlers are reused across agent classes.
- [ ] Project prompt/context customization requires no handler copy.
- [x] One reviewed acting work item automatically dispatches Actor then Reviewer assignments without either profile naming the generated node.
- [x] Request changes returns exact findings to a new actor attempt against the same objective and then dispatches the next Reviewer attempt.
- [ ] One project-owned behavior override passes a real CLI assignment.

### Phase 4 — Workday planning and fair capacity

- [x] Implement `workday plan` and `workday start` with one shared compiler.
- [ ] Guarantee repeated dependency-ordered planning turns within the planning percentage/window; fixed two-round evidence does not prove this replacement requirement.
- [ ] Admit ready graph nodes directly; create no capacity-plan or demand records.
- [ ] Implement project and agent-class weighted fairness with stable ties and automatic idle-share flow.
- [ ] Implement provider-global team fairness and hard provider-native gates.
- [ ] Enforce UTC-day capability and shared model caps at provider and atomic API admission, including restart/monotonic-report safety.
- [ ] Allocate concurrent workdays by weight, then phase/project/class shares, preserving reservations and redistributing only idle opportunities.
- [ ] Calibrate task budgets from scoped terminal usage, including censored timeouts, and issue one active duration/deadline through AgentKernel.
- [ ] Replace fixed planning/profile contracts in SDK/API/CLI/schema and remove the retired allocator without compatibility paths.
- [x] Implement active → closing → ended lifecycle and derive closeout capacity from required closeout estimates.
- [ ] Keep communication concurrency independent from ordinary work.
- [ ] Settle every attempt exactly once and expose allocation explanations through the CLI.

Acceptance:

- [ ] A zero-proposal workday gives every participating agent allocation-derived repeated planning opportunities and can create new proposals; earlier fixed-round evidence is insufficient.
- [ ] Later planning cycles load prior published contributions through TreeDX; earlier second-round evidence does not prove repeating cycles.
- [ ] Mid-workday content changes add eligible work without restarting the workday.
- [ ] Multi-project, multi-class, multi-team, retries, failures, idle share, and stable ties pass deterministic tests.
- [x] Reporter runs during closing and the workday ends only after report completion and settlement.

### Phase 5 — Integration, clean cutover, and managed acceptance

- [x] Consume ready nodes and predecessor results only through the contracts owned by `docs/agent-assignments.md`.
- [x] Use one assignment-selected `read-only`, `treedx`, or `git` workspace mode and permit reads from exact refs in either custody system.
- [ ] Split required Git and TreeDX mutations into dependent assignments; add no dual-write workspace.
- [ ] Create explicit integration assignments whenever several Git predecessors must be combined.
- [ ] Delete AgentKernelProfile/Policy, metadata-only handler routing, dynamic module/process loading, duplicate authority presets/raw tools/branch policies/context, old allocation hierarchy, fixed team polling, and alternate provider execution paths.
- [ ] Remove every compatibility field, parser, alias, route, table, fixture, test, document, and feature switch associated with the retired architecture.
- [ ] Run architecture-specific CLI acceptance, then reference the assignment plan's graph acceptance receipt rather than repeating it. Earlier synthetic workdays are diagnostic evidence only.
- [ ] Publish and read back one coordinated compatible release set.

Architecture CLI surface:

```text
trsd agents handlers list --json
trsd agents handlers show <handler-id> --json
trsd agents profiles validate <profile-ref> --json
trsd agents profiles show <profile-ref> --json
trsd workdays plan --team <team> --profile default --json
trsd workdays start --team <team> --preflight <id> --digest <digest> --yes --json
trsd workdays show <workday-id> --team <team> --json
trsd workdays stop <workday-id> --team <team> --json
trsd capacity explain --team <team> --json
```

Handler inspection identifies Agent-package or project-runtime origin. Profile inspection shows one effective handler per activity. Capacity explanation shows gates, fair-share state, provider choice, and reservation evidence.

## Delivery Order

```text
Profile/handler contracts
        ├── AgentKernel + Reporter
        └── assignment graph dependency projection
                    ↓
default/project handlers + profile migration
                    ↓
workday planning + fair capacity
                    ↓
clean cutover + managed acceptance
```

AgentKernel and API graph work may proceed concurrently after shared SDK contracts are fixed. Do not parallelize final schema cutover, generated catalogs, deletion audit, coordinated releases, or managed acceptance.

Stop and record a blocker if exact authority, isolation, project access, provider capability, or clean cutover cannot be proven. Do not add compatibility behavior to work around a blocker.

## Verified Baseline

| Date | Verified fact | Evidence |
|---|---|---|
| 2026-09-14 | One build-time handler registry and AgentKernel execute the isolated provider transport | Focused Agent kernel/provider suites; source-backed Kata acceptance retained in Issue #520 |
| 2026-09-14 | Deterministic Reporter commits through TreeDX and settles through the ordinary completion path | Focused Agent/API tests; live Reporter receipt retained in Issue #520 |
| 2026-09-14 | Persistent development selections run the touched SDK, API, Agent, and TreeDX components | Managed development status read-back; no RC required |

## Observations and Blockers

### Current integrated state

- Canonical team policy, recurring intent/preflight, graph-only admission, explicit workday mode, allocation explanations, terminal accounting and managed migration are integrated on staging. All eight SDK agents completed two planning cycles; each second-cycle result materially cites all eight prior contributions and passes both clock checks with nonzero native usage. Two genuine seven-agent estimating rounds and eight durable chat responses are proven; integrated golden and concurrent-sharing gates remain unproven (Platform #520).

### Current active blocker

- No host-shutdown blocker remains: installed rc.320/Platform generation 266 passed managed stop/start acceptance; manager, provider, sandbox, and API were healthy on 2026-09-19. The current CLI session and exact Stage 0 runtime/provider/proposal freeze must be revalidated before the unchanged SDK golden replay. No golden lifecycle has passed (Platform #520).

### Next acceptance milestone

- Complete the unchanged SDK lifecycle owned by `agent-assignments.md`, then API and concurrent simulation; verify allocation explanations, measured settlement and clean teardown throughout.

## Completion

This plan is complete only when every assignment executes through one AgentKernel and one handler from the pinned Agent/project build; every first-party activity has a complete profile, default handler, meaningful prompt, simplified permission ceiling, and applicable standing dependencies; only Reviewer normally enables reviewing; architecture, review, and workday reporting use registered core models and classed decisions; `docs/agent.schema.yml` matches runtime contracts; TreeDX contains no assignment plan/status/summary authority; every assignment has one exact enforced grant and at most one mutable workspace; workdays guarantee planning and fairly allocate ready graph work; managed CLI acceptance passes; and no legacy implementation or backward compatibility remains.
