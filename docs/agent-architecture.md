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
      agents: [tester]
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
      agents: [tester]
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
| Engineer | planning/chat: `writer`; estimating: `estimate`; acting: `actor` | planning, estimating, and acting require Tester |
| Tester | planning/chat: `writer`; estimating: `estimate`; acting: `actor` | planning, estimating, and acting require Architect |
| Releaser | planning/chat: `writer`; estimating: `estimate`; acting: `releaser` | planning, estimating, and acting require Technical Writer |
| Reporter | planning/chat: `writer`; reporting: `reporter` | reporting requires `workday-closing` |
| Researcher | planning/chat/acting: `writer`; estimating: `estimate` | none; admitted research answers a question in parallel with engineering |
| Reviewer | planning/reviewing/chat: `writer`; estimating: `estimate` | no standing agent dependency; reviewing depends on the exact work being reviewed |
| Technical Writer | planning/chat: `writer`; estimating: `estimate`; acting: `actor` | planning, estimating, and acting require Engineer |

Standing dependencies apply to scheduled planning, estimating, and acting work. They do not apply automatically to chat, because an addressed message must not wait for an unrelated workflow node. Reviewing is subject-bound: reconciliation creates an edge from each exact reviewed node to its Reviewer node rather than placing every possible review target in the profile.

The first-party default is two parallel branches: question-driven Researcher → Reviewer, and Architect → Tester → Engineer → Technical Writer → Releaser, with each acting result independently reviewed. The Tester returns an exact test commit; the Engineer receives that approved commit as its base and normally receives no grant to modify test paths. Incorrect tests return to the Tester as revision work instead of being silently rewritten by the Engineer.

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

Planning has a minimum initial window of `planningPercent` of wall-clock duration. Repeated short turns follow activity dependencies, give eligible agents equal turn ceilings, and load previous contributions through TreeDX. Class/project percentages govern opportunity frequency. Planning requires no existing proposal and admits no implementation, deployment, or release. Estimates are authored during planning; proposals may originate in any authorized activity. After the initial window, act only when approved, estimated graph work is ready; otherwise continue or return to planning. Agents may finish before their maximum allocation.

Provider-owned capability caps and a shared execution-provider/model cap bound every workday. Normalize active workday weights (default 1), preserve existing reservations, and redistribute idle project/class target shares only to admissible graph-ready work. Both production and simulation consume real supply. Charge active harness/model/tool time, including model-backed preparation and closeout; record infrastructure setup, queueing, and teardown separately.

Cold-start acting uses the task's maximum estimate, bounded by provider limits and available allocations. Replay the latest 20 eligible measurements within the same provider/model, capability, class, and activity, normalized by expected task duration. Successful completion targets 1.25 times observed duration with at most 10% downward adjustment per sample, weighted by the smaller expected task duration divided by the larger one; very different task sizes supply weaker evidence for reducing the current ceiling. Expiration increases allocation by at least 25%. Other failure classes do not calibrate task duration. Insufficient viable capacity defers work without changing the graph.

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
3. within that class, select canonical integer node priority projected unchanged from the governed Proposal work item (higher first, omission means zero), then oldest readiness using stable ties; and
4. select the eligible provider with available concurrency and the least recent fair usage.

Unused weighted share flows automatically to other ready work. Add a strict cap only for a verified external limit.

Provider arbitration compares eligible teams globally so one busy team cannot monopolize provider concurrency. It compares scheduling metadata only and preserves team/project isolation.

Charge actual attempt seconds, including failures and retries, and settle each attempt exactly once. Provider-native usage remains separate from fairness seconds.

When terminal execution evidence exists but the original active measurement is irrecoverably unavailable, a team-management-authorized operator may recover the held assignment reservation using its exact state version, a reason, and an idempotency key. Verify native workspace closure first. Retain the expired assignment, result, failure and provider evidence unchanged; record usage explicitly as unresolved in the existing audit. Release only terminal concurrency claims and retain period-budget claims until actual consumption is known. This is not a zero charge, successful UsageSettlement, passing result, or permission to declare the workday accepted. Never reconstruct usage from elapsed time or refresh the original lease.

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
- [ ] Enforce immutable assignment grants at runtime-service calls and validate the one result contract. BLOCKED: Agent312's native Kernel regressions permit handler-side source-write grant/path widening and deadline mutation before real Git publication.
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
- [ ] Prove parallel Researcher → Reviewer and Architect → Tester → Engineer → Technical Writer → Releaser ordering for planning, estimating, and acting, with generated review pairs and no cross-branch edge.
- [ ] Make the Architect maintain a conventional `<Project> Architecture` book of validated knowledge pages.
- [x] Route Reviewer findings through notes/questions and formal dispositions through decisions, all bound to exact candidate references.
- [ ] Remove Reviewer acting behavior and separate proposal-feasibility review; route each required acting-work review through the Reviewer `reviewing` profile. The external approval and agent estimates jointly gate acting.
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
- [ ] Reporter runs during closing and the workday ends only after report completion and settlement. Focused lifecycle tests pass; complete report evidence and stored exact reference still require live acceptance (see `agent-assignments.md`).

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

- Five concurrent Kata assignments and complete planning cycles are proven in simulation with `gpt-6-luna:low` on the ChatGPT subscription; graph and review outcomes belong to `agent-assignments.md` (Platform #520).

### Current active blocker

- October 6 continuation: capacity-provider and Agent execution test resolution and implementation alignment are active; UI work is deferred. [Agent #321](https://github.com/treeseed-ai/agent/issues/321) records staging `eef952e` (PR #332): complete 840-test verification plus a fresh complete 840-test prerequisite suite before 586 passing coded component steps. Main promotion requires its own fresh CI. [API #494](https://github.com/treeseed-ai/api/issues/494) records 1,915 passing native control-plane tests across 367 complete files on held source, but strict compilation remains failing; later changes need fresh verification. New upstream-error regressions preserve genuine failures and exact retries. [Platform #626](https://github.com/treeseed-ai/platform/issues/626) tracks lineage-preserving staging-to-main cleanup. These are scoped component results, not complete semantic coverage, managed physical closure or an SDK golden pass. The dated observations below remain historical evidence, not instructions to restart the earlier authoring-only gate.

- Human-approved priority clarification (October 4): the governed Proposal work item owns optional safe integer priority, projected unchanged onto its Actor and Reviewer nodes; higher values rank first only after eligibility and project/class fairness, and omission means zero. SDK validation/selection, native API producer/persistence/admission, and managed historical selection replay tests are authored in [API #490](https://github.com/treeseed-ai/api/issues/490), but remain unexecuted. This target clarification is not an implementation or passing acceptance claim.

- Architecture-first test correction (October 2): [Agent312](https://github.com/treeseed-ai/agent/issues/312) now tests profile-owned instructions, class-rename invariance, exact-grant output selection, explicit integration, ordinary deterministic-handler admission/closure, immutable grants/paths/deadlines, and identity-neutral observed verification through native Node/Kernel/Git/runner boundaries. Focused regressions reproduce violations; component scene bindings are declared, not executed acceptance. Per the direct user instruction, unrelated testing and Agent319 delivery are held while these architectural gates are corrected. Full architecture/assignment acceptance remains open; the older observations below are historical, not the current frontier.

- The same test-first audit now reproduces API name-dependent reporting and wrongly scoped lifecycle edges through actual SQL persistence. Seven existing graph guarantee contracts were corrected to the desired architecture, but remain planned without complete executable CLI/managed proof. API strict checking still fails on existing source/dependency declarations; no check was disabled. All three test layers must be aligned before product repair or unrelated testing resumes; implementation failures must not change the test oracle.

- SDK schema regressions now reject the implementation-generated five-model subset as complete target verification. Native Git-backed repository verification currently accepts incomplete declarations and unchecked assignment definitions; union/exclusion constraints are also ignored. The previously excluded schema test is now in the active suite. Whole-target equivalence and CLI/managed semantic acceptance remain unproven; local component bindings do not close the Phase 1 gate ([Agent312](https://github.com/treeseed-ai/agent/issues/312)).

- The SDK tests now consume the exact tracked canonical document through declared development-workspace authority, without copying its model registry. The unchanged canonical input passes, while target-derived definition, field, required-field, closure, reference and conditional mutations expose ignored contracts; real Git commits reproduce undetected stored/runtime definition changes. These are focused failing tests, not whole-system equivalence or executed managed acceptance. Missing canonical input blocks coverage, and standalone CI input wiring remains open. Product work stays held under the pure test-first gate.

- Calibration tests now prove exact eligible sample selection, hard-ceiling arithmetic, independent public SDK execution, and original-DDL SQL selection without changing persisted graph or reservation authority. The managed read-back verifier rejects absent or malformed allocation receipts and immutable-limit drift after three genuine verifier regressions. These component and verifier-unit passes do not prove live sample custody, atomic admission, concurrent fairness, or complete managed acceptance; the all-three-layer architectural test gate remains open (Agent312).

- Proposal-readiness tests now reject estimate-only scope, malformed review bounds, coerced estimates, and non-local or cyclic dependency graphs. Native Git/SQL/official-client tests preserve exact source bytes through repeated and concurrent reads, and expose the SDK's rejection of a canonical optional-capability omission. The existing managed graph verifier now requires exact typed Proposal and Decision authorities after a genuine verifier regression. These focused diagnostics and declared component bindings do not prove profile-grant admission, independent content joins, or complete managed acceptance; product repair stays held (Agent312). Package-owned test branches now reside in durable Git worktrees outside `/tmp`; diagnostic reports remain separate.

- Decision-authority tests now reproduce acceptance of an operational SQL substitute without governed Decision content, unassigned review makers, conflicting dispositions, and out-of-window review evidence through unit and original-DDL/native content-reader boundaries. The existing managed verifier independently reads proposal and final review Decisions and checks exact source/candidate/identity/time after genuine verifier-unit failures. Its synthetic unit passes and component bindings are not live acceptance, full decision-policy/evidence retrieval, or complete three-layer alignment. Preserve the REDs and keep product repair held (Agent312).

- Admission-replay tests now reproduce acceptance of changed grants, profiles, source/decision authority, runtime builds, deadlines, graph context, estimates and unrelated principals through unit and original-DDL/owning SQL repository boundaries. Exact replay remains read-only. The managed verifier now checks typed grants against frozen ceilings, context and one mutable workspace after six genuine verifier regressions. These checks do not prove independent policy retrieval, initial atomic admission, authenticated transport, provider isolation or full managed acceptance; the all-three-layer test-first gate remains open (Agent312).

- Planning tests now require exact cycle membership, unchanged source context, all eight predecessor result identities and exact published contribution read-back. Native configured-Writer/content-serialization/Git tests reproduce publication with omitted, ID-only or foreign contribution evidence. The actual managed verifier and campaign monitor were strengthened after failing verifier regressions; later and terminal collaboration must be rechecked. Controlled transport responses are not live model/clock/usage proof, structural citations do not establish material correctness, and full per-event monitoring and three-layer alignment remain open. Product repair stays held (Agent312).
- Workday-observation tests now reproduce missing/unavailable/malformed scheduling and incomplete/moving event evidence being accepted, including failure counts hidden by a completed run. The actual campaign assertions fail closed after verifier REDs. Original-DDL SQL/API reads prove a failed event can reside beyond the first 50-event page, while SDK and independent native CLI regressions still fail because the existing paginated event operation has no command binding. No product repair, live campaign or full transition-snapshot/semantic-join proof; architecture test completion remains open (Agent312).
- Assignment-collection regressions now require explicit terminal page authority, exact cursor/row binding, ordered unique records and original workday clocks. The actual managed read-back gate was strengthened after verifier REDs; original-DDL SQL/service and independent native CLI tests read a failed assignment beyond page 50. These scoped diagnostics do not prove hidden-tail producer completeness, all-attempt usage pagination, independently expected assignment semantics or full managed acceptance. Product repair remains held while three-layer architecture test alignment is open (Agent312).
- Usage-collection regressions now require complete scoped pages, finite measured time/native usage and accounting-mode authority rather than an ID suffix. The actual managed assertions were strengthened after verifier REDs; original-DDL SQL/service tests still admit a corrupt creation clock and zero recorded active time with positive elapsed time. Native CLI page read-back is scoped transport proof, not actual provider usage, canonical UsageSettlement equivalence, timestamp agreement, transactional exactly-once settlement or full managed acceptance. Those three-layer gaps remain open (Agent312).
- Settlement authority regressions now reproduce accepted native/provider/model replay changes, coerced attempt identities, incomplete frozen attempts and corrupt native units through the actual owning accounting functions and transactional SQL. Matching retry, real late-write rollback/retry and truthful overrun/no-cap-raise controls pass only at their scoped boundaries. The managed gate now compares aggregate measurements with completed-result usage; provider-generated measurements, independent clock agreement, full canonical settlements, separate-server concurrency and durable teardown remain unproven. Product repairs remain held (Agent312).
- Provider-facing accounting tests now reproduce coerced values, conflicting provider identity, invalid nonterminal accounting modes and lost incremental token counts through the owning service and original SQL. Matching incremental/terminal replay, cleanup replay and refusal of zero-release with unaccounted seconds pass only at those isolated boundaries. Managed assertions were strengthened after verifier REDs to reject informational productive time and incremental seconds outside the sole attempt or above its aggregate. Authentication, live provider usage, canonical settlement and complete recovery/teardown remain open; API395 preserves continuing evidence because Agent312 is at its body limit. Product repairs stay held.
- Cancellation/recovery tests now reproduce fabricated zero settlement after a stored execution clock started, unsafe retry classification with unknown productive usage, and a real recovery SQL parameter failure. Active cancellation remains a request and measured cleanup replay stays exactly once at the isolated SQL boundary. The managed stopped gate now rejects zero usage after visible productive time following a verifier RED. Full canonical attempt/settlement joins, provider-generated measurements, authenticated transport, server concurrency and physical durable teardown remain unproven; all-three-layer alignment and product repairs stay held (API395).
- Workday-level SQL tests also reproduce zero-usage terminalization after productive execution and a false complete-cleanup result with an orphan running node. Scoped lease preservation, measured cleanup replay, actual transition rollback/retry, and continued recovery past a corrupt historical run pass only at their isolated boundaries. The managed stopped verifier now rejects retained lease state, expiry and renewal after a verifier RED; historical runner identity alone is not an open-session receipt. Physical cleanup, independent graph/resource joins and full acceptance remain open. API395 retains the exact failed evidence; product repair remains held.

- Workspace cleanup tests now reproduce an open remote resource being skipped after SQL handle revocation, an interrupted operator close not being retried, unqualified upstream 404 denial being accepted as absence, and success responses being accepted without exact closed-resource agreement. Real owning SQL and the official TreeDX HTTP client exercise a controlled endpoint, not a native TreeDX server or physical sandbox. Managed verifier regressions also exposed issued or malformed handles despite claimed verified teardown; the acceptance-only checks now deny those contradictions. Independent resource/session closure and the all-three-layer test gate remain open; exact failures are preserved in API395.
- Independent workspace read-back tests now reproduce successful public API replies with a foreign or missing workspace identity despite the correct repository. Exact open/closed reads and scope denials pass through the owning catalog, original SQL and official client against controlled HTTP resources. Five managed-verifier regressions exposed missing independent reads; its terminal gates now require an exact closed resource and project receipt through the existing project-scoped CLI command, failing closed on unavailable or denied reads. Native CLI transport tests preserve both open status and denials; they do not prove native TreeDX, physical workspace/session teardown or complete acceptance. All-three-layer alignment and product repair remain held (API395).
- Provider terminal-report tests now reproduce synthesized or coerced performance facts, a changed terminal attempt ordinal, and SQL revocation while an independently read workspace remains open. Original transactional SQL preserves matching replay and rolls back an injected late revocation failure; controlled upstream resources and supplied usage are not native provider or physical cleanup proof. Two managed-verifier regressions exposed missing immutable-ordinal joins; the acceptance-only gate now checks the presented assignment and measurement against that ordinal. Retry/recovery races, complete canonical records, generated usage and full scene acceptance remain open; product repair stays held (API395).
- Provider-return SQL tests now reproduce an unchanged retry node revision with a rewritten historical attempt ordinal, missing measured settlement, and duplicate successful transitions/graph revisions from concurrent matching reports. Wrong-owner/token/expired-return denials and sequential replay remain read-only at the isolated SQL boundary. A managed-verifier regression exposed acceptance of returned history at the completed retry's same node revision; the acceptance-only graph gate now rejects that contradiction. Embedded SQL concurrency and supplied measurements are not independent PostgreSQL connections, actual provider charges or full scene proof. All-three-layer alignment and product repair remain held (API395).
- Successful-completion tests now reproduce accepted canonical result clocks before the original start or beyond the original productive/reporting interval. The actual provider sequence settles usage before completion; an initial unsupported expectation that completion itself creates that charge is preserved as an oracle error, not a product failure. The managed result gate rejects missing or contradictory clocks after a verifier RED. Exact Git content, independently generated clock/usage evidence, separate-server races, canonical settlements and physical cleanup remain unproven; scoped SQL and component declarations do not complete three-layer acceptance. Product repairs remain held (API395).

- Source-publication receipt tests now reproduce accepted foreign repositories and branches through the owning wrapper and real broker client with isolated Git. The endpoint is a controlled input, not the actual Deployment broker or its authorization/verifier. After a genuine verifier RED, the managed results gate requires a Git candidate in the sole immutable repository and agreement for any presented optional branch; read-only citations remain valid. Native broker publication, base/grant/path verification, sandbox closure, complete canonical content read-back and full scene proof remain open. Product receipt failures are preserved in API395; product repair stays held.

- Native Reporter closure is proven by the passing continuation; SDK #347/#348 calibration and Agent #277/#278 observed-red evidence repairs are integrated. Fresh DR stopped before acting when a chat response lacked its exact invocation binding. API #468/#469 repairs a reproduced denied-admission binding defect with package-owned SQL scenes; checked staging delivery and live proof remain required. DR's missing teardown receipt remains failed evidence, not proof of a physical leak. No full SDK pass (Platform #520).

### Next acceptance milestone

- Prove the fresh one-hour full SDK golden through AgentKernel, measured accounting and teardown using package-owned scenes; see `agent-assignments.md` for the graph and product gates.

## Completion

This plan is complete only when every assignment executes through one AgentKernel and one handler from the pinned Agent/project build; every first-party activity has a complete profile, default handler, meaningful prompt, simplified permission ceiling, and applicable standing dependencies; only Reviewer normally enables reviewing; architecture, review, and workday reporting use registered core models and classed decisions; `docs/agent.schema.yml` matches runtime contracts; TreeDX contains no assignment plan/status/summary authority; every assignment has one exact enforced grant and at most one mutable workspace; workdays guarantee planning and fairly allocate ready graph work; managed CLI acceptance passes; and no legacy implementation or backward compatibility remains.
