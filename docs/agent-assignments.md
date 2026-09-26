# Living Agent Assignment Graph Implementation Plan

**Status:** in progress
**Plan created:** 2026-09-12
**Last architecture review:** 2026-09-15
**Scope:** proposal planning, decisions, living execution graph, assignments, results, review, and graph reconciliation
**Related plan:** [`docs/agent-architecture.md`](./agent-architecture.md) owns profiles, handlers, AgentKernel, workspaces, workday allocation, and provider selection
**Explicit non-goal:** UI implementation

## Objective

Replace the frozen planning DAG, per-decision assignment graphs, capacity-plan work units, and demand records with one continuously reconciled team execution graph.

```text
TreeDX content or assignment result
                ↓
deterministic API reconciliation
                ↓
living execution nodes and dependencies
                ↓
ready node → immutable assignment attempt
                ↓
general result → reconciliation
```

Agents author governed content and return assignment results. They never mutate graph nodes, edges, readiness, or scheduling state. A ready node is assignment demand.

For reviewed acting work, the graph treats Actor and Reviewer assignments as alternating phases of one accepted work-item objective. Candidate return enables review; request changes advances the same pair; approval completes the work item.

## Progress Reporting

Whoever implements this plan must update its checkboxes and the short **Observations and blockers** section in the same change. Mark an item complete only when its listed CLI, test, Actions, or exact-ref evidence exists. Keep detailed logs in Actions artifacts and the governing GitHub Issue; do not duplicate them here.

Checkboxes report implementation status only:

- `[ ]` not implemented or not verified
- `[x]` implemented and verified
- `BLOCKED:` requires an active entry under **Observations and blockers**

## Golden Development Acceptance

[`docs/agent-acceptance.md`](./agent-acceptance.md) is the complete and exclusive testing guide. This plan records only implementation TODOs and fully proven completion. Earlier synthetic or reduced workdays are diagnostics and do not satisfy acceptance. The current frontier is the unchanged SDK proposal's generated Actor/Reviewer path; see Observations and Blockers. Do not broaden scenarios or cut an RC before the full path passes.

## Decisions

- TreeDX is the durable authority for proposals, questions, answers, decisions, reviews, reports, and other planning content.
- PostgreSQL stores only operational graph projections, graph revisions, assignments, leases, reservations, provider state, and exact TreeDX references.
- There is one team execution graph. Project and decision graphs are filtered views.
- Graph changes are deterministic reactions to content changes, assignment results, and lifecycle state. There is no user-authored graph-change object.
- Activity profiles may declare standing dependencies using agent-class and lifecycle-event names. Profiles never contain generated node or assignment IDs.
- Accepted proposal work may add work-specific dependencies between stable work-item IDs.
- All concrete dependencies become the same execution-node edges.
- Every acting work item declares whether independent review is required. Required review deterministically projects an Actor → Reviewer pair for the same work-item objective.
- Rejection advances that same stable pair through bounded node revisions; it does not create unrelated revision work items.
- Activity-profile permissions are deny-by-default ceilings. Assignments receive exact narrower grants; profiles never grant runtime authority directly.
- Each accepted work item selects one workspace mode: `read-only`, `treedx`, or `git`. An assignment has at most one mutable workspace.
- Workdays govern admission and accounting but never freeze the graph.
- Running assignments are immutable snapshots. Graph evolution creates later node revisions or assignment attempts.
- No legacy implementation or backward compatibility remains after cutover.

## Canonical Planning Content

### Proposal-owned execution plan

Use one proposal document as the authority for both the proposal and its executable plan:

```yaml
id: pagination-reliability
request: Make pagination behavior reliable across the SDK.
summary: Generated and refined during planning.
executionPlan:
  workItems:
    - id: architecture
      activity: acting
      agentClass: architect
      workspace: treedx
      review: required
      objective: Define the required behavior and boundaries.
      estimate:
        minimumSeconds: 600
        expectedSeconds: 900
        maximumSeconds: 1200
      reviewEstimate:
        minimumSeconds: 180
        expectedSeconds: 300
        maximumSeconds: 600
      maximumReviewCycles: 2
      dependsOn: []
      requestedPermissions:
        content:
          read: [book, knowledge, objective, proposal, decision, note, question]
          write: [book, knowledge]
        tools: [source.read]
      requiredCapabilities: []
      acceptanceCriteria:
        - Public behavior and failure cases are explicit.
```

Agents may estimate several work items in one planning contribution, and several agents may propose alternatives during discussion. The accepted estimate for each work item is written into the proposal-owned plan. Alternative values remain in TreeDX history or discussion; they are not separate operational scheduling authorities.

A decision accepts one exact proposal revision and digest. There is no separate execution-plan record, structured-estimate database authority, or decision-time plan reconstruction.

### Proposal readiness

A proposal may be decided only when:

- every executable work item has an activity, agent class, workspace mode, review policy, objective, valid minimum/expected/maximum estimate, and acceptance criteria;
- every required review has its own valid estimate and bounded maximum cycle count;
- the selected workspace and required authority fit the activity profile's permission ceiling and team/project policy;
- every work-specific dependency references another work item in the same plan and the plan is acyclic;
- blocking questions and feedback are resolved or withdrawn;
- decision-authority prerequisites reference exact current content revisions; and
- the exact proposal revision presented for decision is the revision that will be executed.

### Discussion and conditions

Questions, answers, feedback, approvals, external state, and authority validity remain ordinary governed content. Reconciliation represents anything that blocks execution as a condition node. A question addressed to an agent class may also create an answer or research work node.

### Core content

Use the registered core content vocabulary. Do not introduce `architecture` or `review` models merely to name a subject or activity.

- Architect output extends a conventional `<Project> Architecture` `book` through validated `knowledge` pages.
- Review findings and concerns are `note` content.
- Unresolved review matters are `question` content.
- Workday reports are `note` content referencing the exact workday, assignments, results, usage, releases, and publications they summarize.
- `decision` content has an explicit class: `proposal`, `work-review`, or `publication`, plus an authority, approval, or vote method and its exact decision-maker evidence. Proposal acceptance and formal approved/request-changes review dispositions use that one model.
- The general assignment result references the exact TreeDX revisions and Git commits.

The generic entity-reference contract supports an exact model, item, commit, path, optional heading anchor, and optional start/end line and is shared by notes, questions, and decisions. Reuse it for review evidence and workday reports. Add a new content model only when a required validated structure, lifecycle, authorization rule, control-plane action, or query cannot be expressed by a core model.

[`docs/agent.schema.yml`](./agent.schema.yml) is the machine-readable target object model for this plan. Runtime SDK types, generated validators, API storage, Agent assignment context, CLI schemas, and fixtures must be derived from or verified against that one contract; do not maintain a second handwritten schema with different fields.

## Dependency Model

### Profile dependencies

Activity profiles express permanent workflow rules in language suitable for an agent builder:

```yaml
dependsOn:
  agents: [architect]
  events: []
```

Initial semantics are fixed:

- every listed dependency is required;
- an agent selector matches all applicable nodes for that class;
- decision work matches within the same decision;
- proposal work matches within the same proposal revision;
- workday activity matches within the same workday;
- a missing required dependency leaves the node blocked with an explanation; and
- self-dependencies and cycles are invalid.

Standing agent dependencies apply only to the scheduled activity profiles that declare them. They do not implicitly constrain chat. A dependency on reviewed acting work is satisfied only when its work-item pair is approved, not when the actor merely returns a candidate. Reviewer nodes are subject-bound and generated by reconciliation; the Reviewer profile never lists every possible producer.

Lifecycle events are projected as condition nodes. Use `workday-closing`, not `workday-ended`: regular admissions stop at closing, required closeout assignments run, and the workday becomes ended only after closeout and settlement complete.

### Work-specific dependencies

Proposal work items may add ordering needed only for that proposal:

```yaml
- id: integration
  agentClass: releaser
  dependsOn: [implementation, verification]
```

Profile dependencies are invariant minimums. Work-specific dependencies may add edges but cannot remove profile requirements.

The initial first-party workflow has two parallel branches. Research exists to answer a question and is reviewed independently; it is never an implicit predecessor of architecture or execution work:

```text
question → Researcher acting → Reviewer approval

Architect acting → Reviewer approval
                         ↓
Tester acting ───→ Reviewer approval
                         ↓
Engineer acting ─→ Reviewer approval
                         ↓
Technical Writer acting → Reviewer approval
                         ↓
Releaser acting ─→ Reviewer approval

workday-closing → Reporter
```

For planning, estimating, and acting, the engineering branch uses immediate predecessors only: Tester depends on Architect, Engineer on Tester, Technical Writer on Engineer, and Releaser on Technical Writer. Researcher has no standing dependency and runs only for an admitted research question or research work item. Reviewer has no standing agent dependency because reconciliation generates each exact Actor → Reviewer edge. Chat remains independent.

Use one Reviewer class and its `reviewing` activity. Every acting work item with `review: required` expands into two stable internal nodes: the declared actor node and a Reviewer node. `review: required` is the default; `review: none` must be explicit and is reserved initially for deterministic release, integration, or closeout work whose accepted predecessors are already reviewed. Do not create Reviewer subclasses, enable reviewing on producer agents, or require users to author the generated review node.

Proposal review also uses the Reviewer `reviewing` profile, but it is projected from proposal governance rather than an acting pair. The Releaser depends on approved work-item pairs and all applicable required review decisions.

### Concrete edges

The API resolves both sources into one edge table:

```text
from_node_id → to_node_id
```

Edges, not node JSON, are the storage authority for dependencies. Each edge records whether it came from a profile agent selector, profile lifecycle selector, or proposal work-item relation. Assignment IDs are attempts and are never dependency targets.

A node becomes ready when all predecessor work nodes have completed successfully and all predecessor condition nodes are satisfied. Downstream assignments receive the completed predecessor results.

## Operational Model

### Execution node

An execution node contains only facts required to identify and execute work:

```yaml
id: deterministic-id
teamId: team-id
projectId: project-id
workItemId: architecture
pairRole: actor | reviewer | null
kind: planning | estimating | acting | reviewing | reporting | condition
sourceRef:
  model: proposal
  id: pagination-reliability
  revision: 3
  digest: sha256
ruleRevision: 1
nodeRevision: 2
agentClass: engineer
status: proposed | blocked | ready | assigned | running | completed | failed | cancelled | stale
estimate:
  minimumSeconds: 900
  expectedSeconds: 1800
  maximumSeconds: 3600
requiredCapabilities: []
workspace: read-only | treedx | git
```

Node identity is deterministic from team, project, source content, rule revision, activity, agent class, work-item identity, and pair role. A reviewed acting work item has stable actor and reviewer node IDs. Reconciliation replay cannot create a duplicate.

Do not duplicate edges, active assignment IDs, or derived blocking explanations inside canonical node JSON. API read models may display those values by joining their authoritative stores.

### Graph revision

Use one append-only graph-revision record as revision, reconciliation receipt, audit summary, and watch cursor. It contains:

- revision number;
- changed source and lifecycle refs;
- reconciliation-rule revision;
- resulting graph digest; and
- compact added, changed, completed, blocked, and stale node/edge IDs.

Do not add a second reconciliation-event or receipt authority.

### Assignment attempt

An assignment is an immutable attempt to execute one node revision. It freezes:

- graph and node revision;
- source content and decision authority;
- proposal-plan revision;
- effective activity profile and handler;
- required capabilities, profile permission ceiling, and exact assignment grants;
- provider offer and runtime build;
- authorized context and predecessor results; and
- selected workspace mode and exact mutable scope;
- workday capacity envelope, deadline, lease, and reservation.

The actor and reviewer assignments reserve and settle their own accepted estimates and actual usage. Work-item usage is the derived sum of those attempts. Failure, return, retry, or review rejection creates another attempt against an advanced node revision. Existing assignments are never rewritten.

### Assignment result

Use one result contract:

```yaml
status: completed | blocked | failed
summary: concise outcome
references:
  - kind: git | treedx | url
verification: []
usage: {}
diagnostics: []
```

Git references contain repository, exact commit, and optional branch. TreeDX references contain project, path, and exact commit. Do not create source-candidate records, bundles, artifact manifests, output taxonomies, or per-operation result schemas.

### Review and revision

- The actor assignment returns an immutable candidate result and completes that actor attempt; the reviewed work item remains awaiting review.
- Its paired Reviewer node becomes ready and receives the exact candidate, objective, acceptance criteria, references, verification, and relevant `<Project> Architecture` knowledge.
- The Reviewer cannot mutate the candidate. Findings are notes, unresolved matters are questions, and the formal disposition is a decision bound to the exact candidate.
- Approval completes the Reviewer attempt and the work item. Only then are work-item dependencies satisfied.
- Request changes advances the same actor and Reviewer nodes to their next revisions. The actor receives the exact decision and findings; the prior candidate and review remain immutable.
- Each revision repeats Actor → Reviewer against the same objective and accepted plan. No new work item or alternate graph path is created.
- Exhausting `maximumReviewCycles` blocks the work item and requires an explicit new decision; it never silently approves or continues.
- Proposal review uses the same Reviewer profile and core content outputs but gates decision readiness rather than an acting work item.

This preserves the internal act/review loop while keeping the two attempts independently assigned, permissioned, metered, and auditable.

### Capability demand

Reconciliation compiles activity-profile and accepted-work requirements once into `node.requiredCapabilities`. Admission compares that demand with provider supply. The assignment snapshots the result. AgentKernel enforces assignment grants but does not recalculate scheduling demand.

At admission, the API compiles the work item's requested content and tool authority within the activity profile ceiling and team/project policy. It verifies provider support and freezes the exact result on the assignment. Missing required authority blocks the node with an explanation; it is not silently removed. Exact paths, content scope, and external grants belong only to the assignment.

## Implementation Checklist

### Phase 1 — Canonical proposal and plan

- [x] Draft proposal intake accepts the human request plus optional title, objective refs, and evidence refs.
- [ ] Replace separate execution-plan and operational estimate authorities with the proposal-owned `executionPlan.workItems` contract.
- [ ] Support several work items per estimating contribution and collaborative refinement of their canonical estimates.
- [ ] Require workspace mode, review policy, actor/reviewer estimates, bounded review cycles, acceptance criteria, acyclic work dependencies, satisfiable permission ceilings, and resolved blockers before decision.
- [ ] Use `book`, `knowledge`, `note`, `question`, and classed `decision` content for architecture, review, workday reporting, and publication workflows; record authority/approval/vote evidence inside the decision and add no `architecture`, `review`, or `workday-report` content model.
- [ ] Extend generic entity references with exact path, commit, optional heading anchor, and optional line range and use them on notes, questions, and decisions.
- [ ] Generate or verify SDK types, validators, API records, CLI schemas, and fixtures against `docs/agent.schema.yml`.
- [x] Bind every accepted decision to one exact executable proposal revision and digest.
- [ ] Project questions, answers, feedback, approvals, external state, and authority prerequisites as conditions.
- [ ] Delete obsolete content schemas, routes, and parsers in the same cutover; add no compatibility translation.

Acceptance:

- [ ] `trsd` can create, read, discuss, estimate, validate, and decide the proposal through normal TreeDX operations.
- [ ] Invalid estimates, dependencies, blockers, or stale authority prevent decision without mutating graph state.

### Phase 2 — Living graph and dependency projection

- [x] Add monotonic team graph revisions and deterministic projection from test TreeDX fixtures.
- [x] Make projection replay order-independent and idempotent.
- [x] Store nodes, edges, assignments, and graph revisions once each; remove duplicated node JSON fields.
- [x] Resolve activity-profile agent selectors and lifecycle selectors into concrete edges.
- [ ] Apply dependencies only to the declaring activity; exclude chat from implicit workflow dependencies.
- [x] Expand every `review: required` acting work item into stable actor and Reviewer nodes under the same work-item identity.
- [x] Project proposal governance review through the same Reviewer `reviewing` profile without creating an acting pair.
- [ ] Project lifecycle events as condition nodes, including `workday-closing`.
- [ ] Union profile and work-item edges with deterministic provenance and cycle validation.
- [ ] Reconcile only the affected connected component after a source change.
- [ ] Expose graph, node, edge provenance, blocking explanation, and read-only reconciliation plan through generated CLI operations.

Acceptance:

- [ ] Researcher → Reviewer remains parallel to Architect → Tester → Engineer → Technical Writer → Releaser, and every required actor is independently reviewed, without profile-authored graph IDs.
- [ ] Proposal review gates decision and every required Actor → Reviewer pair gates downstream work-item readiness.
- [ ] Releaser waits for approved Engineer and Technical Writer work-item pairs and every other applicable required review.
- [x] `workday-closing` → Reporter materializes as an ordinary condition dependency.
- [x] Replaying identical inputs produces no changes, duplicate nodes, or duplicate edges.

### Phase 3 — Direct assignment lifecycle

- [x] Treat every ready assignable node as demand for the allocator defined in `docs/agent-architecture.md`.
- [ ] Claim a node and create its immutable assignment, lease, reservation, and idempotency receipt transactionally.
- [x] Compile required capabilities during reconciliation and compare them directly with provider offers during admission.
- [x] Validate requested content/tool authority against the activity profile ceiling and team/project policy; freeze the exact grant on the assignment.
- [x] Select the accepted work item's `read-only`, `treedx`, or `git` workspace and permit exact read context from either custody system.
- [ ] Enforce one mutable workspace per assignment and reject dual Git/TreeDX mutation work items.
- [ ] Preserve running assignments when the graph changes; cancel or supersede only through explicit lifecycle rules.
- [x] Advance node revision for retry or replacement so a new assignment has a distinct deterministic identity.
- [ ] Remove decision execution inputs, capacity-plan work units, workday demand rows, and alternate assignment-synthesis paths.

Acceptance:

- [x] One CLI-visible ready node produces exactly one assignment and reservation.
- [x] The assignment exposes its profile ceiling, exact grant, workspace mode, mutable scope, and denied or missing authority explanation.
- [x] Replay produces no duplicate assignment or charge.
- [ ] Ineligible providers and blocked dependencies have exact explanations.

### Phase 4 — Results, review, revision, and multiple projects

- [x] Accept only the one general result contract and ordinary Git, TreeDX, or URL references.
- [x] Complete an actor attempt on candidate return while keeping its work item incomplete until the paired review is approved.
- [x] Pass predecessor results into dependent assignment context.
- [x] Record review findings as notes/questions and formal disposition as a decision bound to the exact candidate.
- [x] Advance the same actor/reviewer node pair on request changes; create no unrelated revision work item.
- [ ] Enforce bounded review cycles and block for a new decision when exhausted.
- [ ] Support one team graph spanning multiple projects and decisions.
- [ ] Preserve project-scoped content and repository authority across cross-project scheduling.
- [ ] Fail closed when a cross-project dependency lacks an explicit TreeDX relation and read grant.
- [x] Admit newly ready work during the current active workday.

Acceptance:

- [ ] Proposal review → decision and each required Actor → Reviewer pair → downstream readiness pass through the CLI. The earlier reduced proposal did not include the six fixed SDK work items required by the acceptance specification.
- [ ] Request changes → same actor revision → same Reviewer revision → approval passes without changing prior candidates or reviews. This remains to be replayed inside the approved SDK v4 golden campaign.
- [ ] Two projects progress in one team graph without copying project graphs or leaking context.

### Phase 5 — Clean cutover and managed CLI acceptance

- [ ] Route planning, estimating, acting, reviewing, reporting, and communication exclusively through living graph nodes.
- [ ] Remove TreeDX `assignment_plan`, `assignment_status`, and `assignment_summary`; proposal content owns planning and PostgreSQL owns assignment state and results.
- [ ] Delete frozen signal scheduling, fixed engineering graph compilation, decision graph documents, execution inputs, capacity plans, demand records, duplicate estimate storage, source-candidate storage, and superseded operations.
- [ ] Remove all compatibility fields, aliases, parsers, routes, tables, tests, fixtures, documentation, and feature switches for retired paths.
- [ ] Initialize a clean pre-launch schema and rebuild operational graph state from exact TreeDX refs.
- [ ] Run the complete CLI story below locally and in managed staging.
- [ ] Publish and read back one coordinated compatible release set.

Final CLI story:

1. Create and collaboratively complete a proposal-owned execution plan.
2. Resolve a blocking question and validate the exact proposal revision.
3. Accept the proposal and observe deterministic graph reconciliation.
4. Explain profile-derived and work-specific dependencies.
5. Admit and execute the required Architect, Tester, Engineer, Technical Writer, Reviewer, Releaser, and Reporter nodes in graph order.
6. Verify each assignment's permission ceiling, exact grant, workspace mode, and mutable scope.
7. Request changes on one candidate, repeat the same Actor → Reviewer pair, and approve the replacement.
8. Add a proposal or answer during the active workday and observe immediate graph evolution.
9. Read exact results, references, usage, settlement, and final graph state.
10. Replay reconciliation and prove zero duplicate nodes, edges, assignments, reservations, or settlements.

Required CLI surface:

```text
trsd execution graph show --team <team> --json
trsd execution graph watch --team <team> --json-stream
trsd execution node show <node-id> --json
trsd execution node explain <node-id> --json
trsd execution reconcile --team <team> --plan --json
trsd execution assignments list --team <team> --json
trsd execution assignments show <assignment-id> --json
```

## Package Responsibilities

This plan adds only assignment-specific responsibilities to the ownership table in `docs/agent-architecture.md`:

- SDK: proposal-plan, graph, edge, condition, assignment, result, and CLI contracts; permission and workspace contracts remain owned by the architecture plan.
- API: projection, storage, readiness, exact-grant compilation, workspace selection, assignment lifecycle, result reconciliation, and explanation.
- Agent: enforce the immutable assignment grant, operate only in the selected workspace, return the general result, and never mutate graph state.

## Verified Baseline

| Date | Verified fact | Evidence |
|---|---|---|
| 2026-09-14 | Draft proposal intake, exact proposal revision/digest binding, and proposal-governance review use the living graph contracts | Focused SDK/API proposal and projection suites; current development read-back |
| 2026-09-14 | Ready-node admission compiles provider capability demand and closing Reporter dependency from the same graph | Focused API admission/projector suites; Reporter settlement receipt retained in Issue #520 |

## Observations and Blockers

### Current integrated state

- Proposal, estimate, one-graph projection, exact dependency intake and settlement have focused tests. The SDK diagnostic completed six approved Actor/Reviewer pairs, including genuine Engineer and Writer revisions; Reporter closeout and clean full golden acceptance remain unproven (Platform #520).

### Current active blocker

- Clean acceptance remains unproven: canonical completion and truthful send receipts now have merged API regression coverage, but coordinated activation and a fresh run are required. Preserve diagnostic failed attempts rather than backfilling them (Platform #520).

### Next acceptance milestone

- Finish diagnostic Reporter/settlement, activate the checked repair at an idle boundary, then refreeze and prove the unchanged SDK golden with canonical chat results, exact authority, useful reviewed outputs, settlement, teardown and unchanged external state.

## Completion

This plan is complete only when all phase checkboxes are verified, one content-derived graph and assignment path remains, agents have no graph mutation capability, required acting work deterministically completes bounded Actor → Reviewer cycles against one objective, architecture/review/reporting workflows use registered core content models and classed decisions, `docs/agent.schema.yml` matches runtime contracts, TreeDX contains no assignment plan/status/summary authority, every assignment has an enforceable exact grant and at most one mutable workspace, the managed CLI story passes, and no legacy implementation or backward compatibility remains.
