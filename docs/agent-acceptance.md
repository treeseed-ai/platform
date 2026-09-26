# Agent execution acceptance

**Status:** authoritative acceptance specification
**Scope:** proposal governance, activity profiles, living execution graph, workdays, capacity allocation, isolated workspaces, review, simulated release, reporting, and portfolio coordination  
**Contract:** [`docs/agent.schema.yml`](./agent.schema.yml)  
**Architecture:** [`docs/agent-assignments.md`](./agent-assignments.md) and [`docs/agent-architecture.md`](./agent-architecture.md)

## Purpose

This document fixes the golden proposals and the evidence required to call the agent system accepted. The implementation agent must not invent easier proposals, substitute fixture-only work, skip agent classes, treat a terminal workday as proof, or change a proposal after a failed run merely to make the run pass.

Each software, service, product, platform, template, or skill project in the TreeSeed seed has one project-relevant golden proposal. Team Library is excluded because it is the shared content project rather than an engineering project. The resulting acceptance portfolio contains these 17 projects:

1. SDK
2. API
3. Agent
4. TreeDX
5. CLI
6. Deployment
7. Identity
8. UI
9. Core
10. Admin
11. Reviewer
12. Engineering Template
13. Research Template
14. Market
15. Market API
16. Skill
17. Platform

The first two proposals are SDK and API because they exercise the portable contract and its authoritative control-plane implementation. They must pass independently, then together in one workday, before the remaining projects proceed.

## Non-negotiable rules

- Every acceptance workday has the one authoritative `executionMode: simulation`. Assignments execute under that workday mode; graph, result, settlement, and CLI views derive it rather than owning independent mode values. A contradictory derived label is a failed run.
- Simulation may read and modify any file in a disposable repository workspace, run builds and tests, combine candidates, create local commits and tags, and exercise release logic.
- Simulation must not push to an upstream source or library repository, create or update a remote pull request or issue, publish a package or release, deploy, rotate credentials, mutate live data, or call another externally mutating service.
- Upstream Git remotes are read-only. No upstream write credential may enter an assignment. Local simulation repositories are the only push targets.
- TreeDX authoring uses campaign-local repositories or refs with upstream synchronization disabled. Proposal, discussion, note, question, decision, knowledge, and report commits remain locally auditable but are not published upstream.
- Source candidates remain ordinary Git commits. Content products remain ordinary TreeDX commits. Do not add a source-candidate model, acceptance-artifact taxonomy, or secondary status system.
- PostgreSQL remains authoritative for workdays, graph revisions, nodes, edges, attempts, leases, reservations, results, and settlements.
- Every model-backed assignment makes an authoritative clock call as its first execution action and another as its final tool action. Both readings and their timestamps are retained.
- The deterministic Reporter uses the same assignment, result, reservation, settlement, and teardown path, but does not call a model.
- A workday reaching `ended` or an assignment reaching `completed` is necessary but never sufficient. Acceptance is determined only by the evidence checks in this document.
- No legacy field, record, route, or compatibility translation may be used to make a golden run pass.

### Required contract correction

`Workday.executionMode` is required with supported values `simulation` and `production`. It is the sole mode authority. The immutable assignment identifies its workday and receives the exact grants, remotes, workspace, and provider instructions compiled for that mode; it does not own another independently mutable mode field. Stage 0 must verify this existing contract end to end.

For `simulation`, grant compilation must remove every upstream or external mutation capability and replace writable Git destinations with the local simulation repository. For `production`, ordinary governed authority applies. Do not add compatibility aliases, separate run mode, assignment mode, provider mode, or result mode.

## Simulation custody and repeatability

### Campaign freeze

Before the first run, create one acceptance campaign record outside the product object model as an operator-owned test manifest. It records only reproducibility inputs:

- campaign ID;
- seed name, version, and digest;
- exact protected `staging` commit for every primary and library repository;
- exact SDK, API, Agent, Deployment, TreeDX, CLI, guest-image, and provider runtime build digests;
- exact governed agent-profile refs;
- exact workday-policy revision;
- provider offer revision;
- the proposal IDs and exact draft bytes, fixed work-item topology and acceptance criteria, and subsequently the ready proposal bytes containing genuine agent estimates.

The campaign manifest is test configuration, not a new control-plane resource. Once frozen, subject repository bases, proposal objectives, work-item topology, permissions and acceptance criteria do not change during retries. Agent estimates are measured planning outputs, not prescribed inputs. Record each ready revision/digest and its contributing estimating results; do not coerce estimates to make a run pass. Runtime-under-test builds may change as defects are repaired; every run records their new exact digests.

### High-level allocation inputs

Freeze the resolved workday policy and actual provider offer/configuration alongside the campaign. The campaign manifest must contain one fully expanded, schema-validated workday input for **every** individual project, the SDK/API joint run, the portfolio run, and each controlled failure rerun. The table below is the authoring rule; submit canonical seeded project IDs and canonical `AgentDefinition.agentClass` values, and retain the exact submitted input and resolved policy snapshot with each run. Project-agent-class database row IDs are inventory references, not allocator class keys. A table entry is not permission to omit fields from a submitted input.

| Run | Selected projects and `projectPercentages` | `agentClassPercentages` |
|---|---|---|
| SDK | `sdk: 100` | SDK: eight classes at `12.5` each |
| API | `api: 100` | API: eight classes at `12.5` each |
| Agent | `agent: 100` | Agent: eight classes at `12.5` each |
| TreeDX | `treedx: 100` | TreeDX: eight classes at `12.5` each |
| CLI | `cli: 100` | CLI: eight classes at `12.5` each |
| Deployment | `deployment: 100` | Deployment: eight classes at `12.5` each |
| Identity | `identity: 100` | Identity: eight classes at `12.5` each |
| UI | `ui: 100` | UI: eight classes at `12.5` each |
| Core | `core: 100` | Core: eight classes at `12.5` each |
| Admin | `admin: 100` | Admin: eight classes at `12.5` each |
| Reviewer | `reviewer: 100` | Reviewer: eight classes at `12.5` each |
| Engineering Template | `template-engineering: 100` | Engineering Template: eight classes at `12.5` each |
| Research Template | `template-research: 100` | Research Template: eight classes at `12.5` each |
| Market | `market: 100` | Market: eight classes at `12.5` each |
| Market API | `market-api: 100` | Market API: eight classes at `12.5` each |
| Skill | `skill: 100` | Skill: eight classes at `12.5` each |
| Platform | `platform: 100` | Platform: eight classes at `12.5` each |
| SDK + API | `sdk: 50, api: 50` | Both projects: eight classes at `12.5` each |
| All-project portfolio | All 17 seeded projects, each with equal positive weight `1`; the allocator normalizes to `100/17` percent per project | Every project: eight classes at `12.5` each |
| Controlled failure | Reuse the exact accepted run's selection and allocation snapshot | Reuse the exact accepted run's class targets; only the specified injected fault changes |

The eight classes are `architect`, `researcher`, `tester`, `engineer`, `technical-writer`, `releaser`, `reviewer`, and `reporter`. Every submitted input must also record `executionMode: simulation`, `profileId: default`, the profile revision, `durationSeconds`, `maximumConcurrency`, `communicationConcurrency`, `planningPercent: 20`, `allocationWeight: 1`, `planningTurnMaximumSeconds: 180`, the selected proposal/decision IDs, the provider offer revision, capability/model daily caps, reservations, and remaining supply read-back. Start individual and joint runs from the current `durationSeconds: 28800`, `maximumConcurrency: 1`, `communicationConcurrency: 1` default unless a read-only preflight proves the run cannot fit. Version-check any required policy update and freeze the resulting revision before starting. Expand all class and project mappings into the manifest; do not infer missing mappings from this Markdown table at execution time.

Use the team's canonical `default` policy (`--profile default`). Freeze its revision and the resolved workday snapshot. Update team defaults through version-checked `workdays profiles update default --input <policy-file>`; explicit workday allocation overrides do not change that policy or existing assignments. Repository allocation profiles, tiers, borrowing, and fixed assignment budgets are not campaign inputs.

```yaml
allocation:
  planningPercent: 20
  allocationWeight: 1
  planningTurnMaximumSeconds: 180
  projectPercentages: {sdk: 100}
  agentClassPercentages:
    sdk:
      architect: 12.5
      researcher: 12.5
      tester: 12.5
      engineer: 12.5
      technical-writer: 12.5
      releaser: 12.5
      reviewer: 12.5
      reporter: 12.5
```

Resolve project and class keys to their canonical seeded identities before submission. Project/class percentages are redistributable opportunity targets, not per-assignment durations. Each assignment read-back must identify its workday-policy snapshot, genuine estimate and rationale, allocator-selected active duration and deadline, limiting constraint, reservation, measured usage, and settlement. Provider-owned capability caps, shared execution-provider/model caps, assignment bounds, remaining usage and reservations must be read back and frozen; a simulation consumes the same real supply as other workdays. Duration and concurrency remain explicit workday inputs. Never insert reservations directly or supply hand-authored assignment allocations.

For this local campaign, configure both `codex-research` and `codex-implementation` with Luna/Low to conserve quota, retaining separate 7,200- and 28,800-active-second daily caps respectively. These are installation inputs, not universal release defaults. Both reuse the Codex harness; capability identity remains independent of the execution-provider ID so other providers can supply the same capability. Freeze actual model and capability limits from provider read-back before running the campaign.

For the all-project portfolio run only, calculate required planning, acting, bounded review, and Reporter supply from the individually accepted genuine estimates. If the normal caps cannot support that work inside the eight-hour window at actual safe concurrency, raise test capability/model caps through versioned provider configuration, preflight again, and freeze the exact temporary offer. Never lower a viable assignment minimum or exceed host/model limits to force admission. Restore and verify the ordinary caps after settlement. If the host cannot supply a viable plan, do not start the portfolio workday; report the exact shortfall.

Admission must explain weighted workday entitlement, the planning pool, project/class opportunity, scoped calibration measurements, viable task minimum, limiting constraint, active-duration reservation and hard deadline. Agent-authored estimate triples and rationale remain unchanged content authority. With no eligible history, acting starts from the maximum estimate subject to real supply/provider ceilings; later allocations use measured calibration. Insufficient viable capacity defers a node without changing its dependencies. At the phase boundary unused planning entitlement becomes acting/review capacity.

Selecting a governed proposal must automatically generate estimating turns for its work owners and Reviewer through the ordinary graph, after planning contributions. Do not require an operator activity override to obtain genuine estimates. Without a selected proposal, autonomous planning remains valid and no subjectless estimating work is generated.

### Local Git custody

For each project and run, the provider creates a disposable checkout from the campaign's exact upstream base and a local bare simulation repository:

```text
upstream (read-only exact base)
  -> disposable assignment branch/worktree
  -> local simulation bare repository
  -> reviewed local integration commit/tag
```

Candidate branches use `simulation/<campaign-id>/<workday-id>/<assignment-id>`. The Releaser may integrate and tag only in the local simulation repository. The control plane catalogs the exact repository identity, commit, branch or tag, verification, and producing result. Simulation refs are retained until the campaign is accepted or explicitly discarded.

Before and after every run, compare upstream branch heads, tags, releases, pull requests, issues, package registries, and deployment selections. Any external mutation fails the campaign immediately.

### Reset between retries

A retry must begin from all of the following original inputs:

- the same proposal identity and bytes;
- the same proposal source base and evidence refs;
- the same primary and library repository base commits;
- the same workday policy and provider offer, unless the failure specifically proves one of those implementations defective;
- no surviving candidate branch, mutable TreeDX workspace, lease, reservation, assignment eligibility, provider session, or sandbox from the prior run.

Failed historical records remain auditable, but they cannot satisfy dependencies in the retry. The new workday receives a new ID. Deterministic source projection must reproduce the same initial graph digest.

Use the existing scoped `trsd workdays stop <exact-run-id>` path for an active failed simulation; do not reset the team, provider, or host. Before a retry, read back that run as terminal with zero unfinished/deferred assignments and settlement errors, no team lease belonging to it, and only stale/cancelled graph nodes. Verify its assignment workspaces and sandboxes are closed, and catalog or explicitly discard only that run's local candidate refs under their normal custody rules. If any of these checks cannot be proven, the reset gate remains open and the retry is not accepted. A new workday ID isolates attempts; it does not excuse leaked resources.

## The canonical proposal lifecycle

Every project follows the same lifecycle. The project sections below supply the exact project-specific request and expected products.

1. Submit the fixed proposal as `draft` with its objective, evidence, and six work items.
2. Start the simulation workday with the frozen high-level allocation policy, then open one proposal discussion addressed to Architect, Researcher, Tester, Engineer, Technical Writer, Releaser, Reviewer, and Reporter. Planning/estimating turns use ordinary graph admission against actual remaining supply.
3. Run one relevant `chat` probe for all eight project agents while the discussion is open. Chat must use the communication lane, must not inherit standing work dependencies, and must not create graph edges.
4. Collect one discussion contribution from each of the eight project agents. Contributions identify risks, questions, dependencies, verification, documentation, release, and reporting concerns without changing the fixed objective.
5. During allocator-driven planning, run estimating assignments for Researcher, Architect, Tester, Engineer, Technical Writer, and Releaser work plus one Reviewer assignment covering all paired-review estimates. Every estimate contains `minimumSeconds`, `expectedSeconds`, `maximumSeconds`, and a rationale, with `minimum <= expected <= maximum`.
6. Update the same proposal to `ready` using those genuine estimating outputs, preserving its fixed objective, topology, permissions and acceptance criteria. Record the exact ready revision/digest; differing estimate values are not a plan-review failure.
7. Resolve every question or gate. The proposal-governance Reviewer binds its disposition to the exact ready proposal revision and digest.
8. Create one classed `proposal` decision accepting that exact proposal. No decision may carry a separate plan, graph, role map, source commit, or capacity plan.
9. Reconcile the accepted content into the living team execution graph.
10. Continue the same simulation workday from repeated planning turns into ready project work, generated Reviewer pairs, simulated release, Reporter closeout, and exactly-once settlement. The workday starts before planning/estimating, not after the estimates exist. Acting cannot begin during planning.

If the current implementation cannot represent this lifecycle without an alternate assignment path or duplicate plan authority, stop. Do not simplify the acceptance case to match the implementation.

## Common activity-profile expectations

These expectations apply to every project and are not repeated in each proposal.

| Activity | Agents | Required exact input | Required output |
|---|---|---|---|
| `chat` | All eight agents | Addressed message, exact subject refs, profile prompt and grant | One general result or discussion message that answers only the addressed question; no graph mutation |
| `planning`, round 1 | All eight agents | Proposal, project objectives and knowledge, exact source base, own profile | Independent contribution from that agent's responsibility; questions use the core `question` model |
| `planning`, later cycles | Same eight agents | Prior published contributions plus unchanged source context | A synthesis that explicitly cites consumed predecessor result IDs and identifies any changed recommendation |
| `estimating` | Six work owners plus Reviewer | Exact work item, acceptance criteria, dependencies, workspace and grants | Valid estimate triple and rationale; Reviewer estimates each generated review independently |
| `acting` | Researcher, Architect, Tester, Engineer, Technical Writer, Releaser | Immutable assignment, exact proposal/decision, predecessor results, profile, grant, base and deadline | One `AssignmentResult` with ordinary TreeDX or Git refs, verification, non-zero observed usage when time elapsed, diagnostics and two clock checks |
| `reviewing` | Reviewer only | Exact objective, acceptance criteria, candidate result/ref, verification and immutable source authority | Notes/questions as needed and one classed `work-review` decision bound to the exact candidate; Reviewer never mutates it |
| `reporting` | Reporter only | Ended planning rounds, complete graph/attempt/result/settlement records and workday-closing event | Deterministic note-based report and exact `Workday.reportRef` through the ordinary result path |

### Expected planning contributions

- Architect: boundaries, ownership, simplest design, affected contracts, and forbidden duplication.
- Researcher: authoritative source evidence, unresolved facts, and citations or exact repository references.
- Tester: failure model, test-first strategy, negative cases, and observable acceptance evidence.
- Engineer: smallest implementation path, likely files, integration risks, and verification commands.
- Technical Writer: affected user/operator/reference documentation and terminology drift.
- Releaser: integration order, compatibility consequences, local release simulation, and rollback/read-back checks.
- Reviewer: ambiguity, authority, security, correctness, and evidence weaknesses.
- Reporter: evidence completeness, expected workday narrative, accounting checks, and closeout omissions that must prevent acceptance.

At least two complete cycles must prove collaboration by consuming the preceding cycle's eight results. Merely receiving them in context is insufficient; the result must identify the material contribution consumed from each. Two cycles are a minimum acceptance observation, not a fixed runtime round limit. Turns follow standing dependencies and fit within their allocator-issued active duration; no implementation, deployment or release is permitted during planning.

## Common proposal work-item contract

Every golden proposal is a `treeseed.proposal/v1` object with these populated fields:

```yaml
schemaVersion: treeseed.proposal/v1
id: <fixed ID from the project section>
projectId: <resolved seed project ID>
title: <fixed title>
request: <fixed request>
summary: <fixed summary>
status: ready
objectiveRefs: [<exact project and team objective refs>]
evidenceRefs: [<exact governed source-issue/evidence note refs>]
discussionRef: <exact closed discussion ref>
executionPlan:
  workItems: <the six rows below, expanded as WorkItem objects>
```

The shorthand in this document must be expanded into the actual schema before submission. The stored proposal may not contain shorthand, inherited defaults, YAML anchors, or references to this Markdown file as missing configuration.

### Fixed work-item graph

| ID | Class | Workspace | Depends on | Review cycles |
|---|---|---|---|---:|
| `research-context` | Researcher | `treedx` | none | 2 |
| `architecture-contract` | Architect | `treedx` | none | 2 |
| `tests-first` | Tester | `git` | none | 2 |
| `implement-change` | Engineer | `git` | none | 2 |
| `document-change` | Technical Writer | `git` | none | 2 |
| `simulate-release` | Releaser | `git` | none | 2 |

Every ready row has `activity: acting`, `review: required`, a non-empty project-specific objective, its owner's genuine estimate and the Reviewer's genuine review estimate, `maximumReviewCycles: 2`, exact `contextRefs`, requested permissions, required capabilities, and project-specific acceptance criteria. Draft intake must support estimating before those values exist; fabricating seed estimates does not satisfy acceptance.

The proposal does not duplicate generic role ordering. The accepted activity profiles are its single authority: question-driven Researcher → generated Reviewer runs in parallel with Architect → Tester → Engineer → Technical Writer → Releaser, and reconciliation inserts a generated Reviewer after every required acting result. `dependsOn` is reserved for proposal-specific domain dependencies that are not already standing workflow rules.

Reconciliation generates one Reviewer node for each row. Generated Reviewer nodes are not written into the proposal. A downstream work item becomes ready only after the predecessor's exact review decision is approved.

### Fixed permissions and assignment workspaces

- Researcher requests content read for `book`, `knowledge`, `objective`, `proposal`, `decision`, `note`, and `question`; content write for `knowledge`, `note`, and `question`; tools `discussion` and `source.read`.
- Architect requests the same reads; content write for `book`, `knowledge`, `note`, and `question`; tools `discussion` and `source.read`.
- Tester, Engineer, and Technical Writer request the same content reads, no content writes, and tools `source.read`, `source.write`, and `verification`.
- Releaser requests the same content reads, no content writes, and tools `source.read`, `source.write`, `verification`, and `release`.
- Generated Reviewer assignments receive exact candidate read authority, discussion/content decision authority, and verification tools, but no source or candidate write authority.
- Simulation Git assignments use the local simulation repository, the exact predecessor-approved base, a unique assignment branch, and `writablePaths: ['.']`.
- TreeDX assignments receive one campaign-local workspace and only their exact acceptance paths. No assignment has both a mutable Git and mutable TreeDX workspace.

### Fixed product chain

1. In response to its assigned question, Researcher returns an exact TreeDX note or knowledge reference containing source evidence and unresolved questions; its review proceeds independently and never blocks the engineering branch.
2. Architect independently returns exact `<Project> Architecture` book/knowledge refs describing the smallest design and ownership boundaries.
3. Tester returns a Git commit containing tests that fail against the frozen base for the intended reason and pass against the expected implementation. Existing unrelated failures are recorded separately.
4. Engineer starts from the approved Tester candidate, makes the implementation pass those tests, and adds no self-authored substitute tests unless the Tester explicitly requested them in its result.
5. Technical Writer starts from the approved implementation/test chain and updates the repository's actual user, operator, API, or contributor documentation.
6. Releaser combines the exact approved Git predecessors in the local simulation repository, runs the project verification and package/release dry run, and returns a local integration commit and optional local tag. It cannot push, publish, merge upstream, or deploy.
7. Reporter references every planning result, assignment result, review decision, candidate, settlement, failure, retry, and teardown result in one deterministic workday note.

### Reporter selection

Each workday has exactly one closeout Reporter and one `Workday.reportRef`. Individual project runs use that project's Reporter. The SDK/API joint run uses `sdk/reporter`; the all-project run uses `platform/reporter`. The applied workday plan records this selection before activation. Other participating Reporter agents still perform chat and repeated planning cycles, but reconciliation must not create duplicate project reports or a second summary layer.

## Project golden proposals

The source issue is evidence for choosing the work. The golden proposal below is the acceptance authority when an older issue mentions legacy capacity plans, compatibility, publication, or deployment behavior that conflicts with the current architecture.

### 1. SDK — decision-governed workday intent

- `id`: `golden-sdk-decision-governed-workday-intent-v4-golden-20260926-v` (fresh estimate-free draft preserving the six fixed work items, exact Book commit `65106c908bca127ea45d11b3f6b54905878d191c` and Git base `1186bff3b400fe442642013b2de93e7f0d4939df`). Prior terminal workdays provide defect evidence only; their estimates and assignment results are not reused. The Tester checks stable normalized request serialization rather than an SDK-owned digest. CLI transport implementation is separate from this SDK-only workday. Researcher → Reviewer remains independent of Architect → Tester → Engineer → Technical Writer → Releaser. Freeze the current policy and runtime before starting; Platform #520 owns detailed run evidence.
- Source: `treeseed-ai/sdk#299`
- Title: **Select accepted decisions in portable workday intent**
- Request: Add normalized repeated accepted-decision identities to the public SDK workday intent and generated operation contract. The API incorporates the normalized selection in its intent and preflight digests; SDK does not compute those digests. Decision IDs select authority but never contain or grant derived graph, assignment, source, role, estimate, or capacity state. Remove conflicting legacy workday-selection contracts without compatibility aliases.
- Summary: Prove the SDK can express high-level decision-governed execution while keeping all derived execution state API-owned.

| Work item | Project-specific objective and expected output |
|---|---|
| Researcher | Trace every current SDK workday-selection, decision, graph, assignment, and legacy planning contract; return exact refs and a duplication/deletion note. |
| Architect | Extend the SDK Architecture book with the single authority boundary and exact portable shape; identify all retired competing contracts. |
| Tester | Add normalization, duplicate/empty rejection, stable normalized request serialization, omission, and schema/CLI-descriptor contract tests that fail on the frozen base. |
| Engineer | Implement the minimal strict TypeScript contract and delete superseded unions, aliases, and exported paths. |
| Technical Writer | Update SDK API/reference examples to show repeated decision selection and explicitly forbid caller-authored derived state. |
| Releaser | Build, run contract/release verification, pack locally, inspect exports/types, and produce an unpushed local candidate. |

Each Actor is reviewed against its own deliverable: Researcher supplies exact source refs; Architect publishes the SDK Architecture Knowledge page; Tester commits failing-on-base tests; Engineer commits the implementation passing those tests; Technical Writer commits and verifies examples; Releaser integrates and verifies the local candidate. The proposal-wide contract gates below apply to the final integrated candidate, not to an earlier Actor's isolated workspace.

Required acceptance: empty and duplicate IDs fail; omitted selection retains planning-only intent without a compatibility path; normalized order and digest are deterministic; generated descriptors expose the field once; no legacy execution-plan/capacity-plan input survives.

### 2. API — content-derived acting promotion

- `id`: `golden-api-content-derived-acting-promotion`
- Source: `treeseed-ai/api#356`, corrected to the living-graph architecture
- Title: **Project accepted decisions directly into living-graph work**
- Request: Resolve SDK-owned decision identities against current accepted proposal authority, exact project scope, estimates, source refs, profiles, and conditions; reconcile affected content directly into the living graph and admit ready nodes during an active workday. Reject caller-authored graph, assignment, source, role, execution-input, demand, or capacity-plan state, and delete the superseded promotion path.
- Summary: Prove the API turns governed content into assignments without a second plan or scheduling authority.

| Work item | Project-specific objective and expected output |
|---|---|
| Researcher | Trace proposal decision resolution, reconciliation, admission, retries, and legacy promotion/storage paths with exact refs. |
| Architect | Record the transaction and authority boundaries from accepted content through graph revision, assignment, reservation, result, and settlement. |
| Tester | Add positive, stale, wrong-team, wrong-project, unaccepted, superseded, missing-estimate/profile/source, replay, and mid-workday-admission tests. |
| Engineer | Implement direct content-derived reconciliation/admission and remove capacity-plan, execution-input, demand-row, and alternate synthesis behavior. |
| Technical Writer | Document public API behavior, failure explanations, watch/readback fields, and the absence of caller-authored internals. |
| Releaser | Run database migration from a clean pre-launch schema, API/runner builds and tests, local service smoke, replay-as-noop, and rollback simulation. |

Required acceptance: one exact accepted proposal revision creates one deterministic connected component; replay is noop; content accepted mid-workday becomes eligible without restart; transactional claim creates one assignment/lease/reservation; each attempt settles once; no legacy records are read or written.

### 3. Agent — fail-closed AgentKernel execution

- `id`: `golden-agent-fail-closed-kernel-execution`
- Source: `treeseed-ai/agent#122`
- Title: **Execute every activity through one fail-closed AgentKernel**
- Request: Complete the isolated provider-to-AgentKernel path so every enabled activity selects exactly one compiled handler, enforces its immutable grant/workspace/deadline, emits one general result, records real usage, and tears down. Remove remaining provider semantic branches and prove actionable failures.
- Summary: Prove the Agent package executes profiles rather than reimplementing their workflow semantics.

| Work item | Project-specific objective and expected output |
|---|---|
| Researcher | Inventory runtime semantic branches, provider/Kata boundaries, sandbox lifecycle, usage sources, and known failure gaps. |
| Architect | Specify the one entry point, handler registry, runtime services, timing boundary, cancellation, teardown, and forbidden responsibilities. |
| Tester | Add fail-closed tests for unknown handler/build, denied service, invalid result, timeout, cancellation, teardown, usage, and no alternate path. |
| Engineer | Complete the minimal kernel/provider implementation and delete superseded routing and dynamic behavior. |
| Technical Writer | Update package runtime, handler-authoring, diagnostics, and local Kata guidance. |
| Releaser | Build provider and guest locally, run all activity profiles in Kata, verify teardown and local artifact identity, and retain no upstream effect. |

Required acceptance: every model profile and deterministic Reporter uses the same kernel; clock evidence brackets productive work; observed usage is not zero when elapsed time is non-zero; no sandbox/worktree survives; failure diagnostics identify the exact boundary.

### 4. TreeDX — byte-exact unified changesets

- `id`: `golden-treedx-byte-exact-changesets`
- Source: `treeseed-ai/treedx#54`
- Title: **Apply standard patches with byte-exact Git semantics**
- Request: Correct unified changeset application for creation, update, deletion, empty files, terminal-newline transitions, trailing blanks, Unicode, and CRLF. Validate hunk counts and context and reject malformed, truncated, or overlapping patches atomically without changing valid bytes.
- Summary: Prove TreeDX preserves exact repository bytes and trustworthy commit/digest custody.

| Work item | Project-specific objective and expected output |
|---|---|
| Researcher | Compare applicable unified-diff rules and current TreeDX behavior against exact Git fixtures without relying on prose-only assumptions. |
| Architect | Define byte, parsing, atomicity, error, and service ownership boundaries with no TreeSeed-specific model logic. |
| Tester | Build a shared byte matrix and malformed-patch suite that demonstrates the frozen defect and exact expected digests. |
| Engineer | Repair the Elixir patch engine minimally and preserve atomic changeset behavior. |
| Technical Writer | Document supported patch semantics, digest guarantees, and diagnostic behavior. |
| Releaser | Run TreeDX tests, compare every fixture to `git apply`, exercise local API read-back, and create only a local candidate. |

Required acceptance: Git and TreeDX bytes/digests agree for the complete matrix; invalid patches mutate nothing; no trimming or newline normalization occurs.

### 5. CLI — decision-governed operator surface

- `id`: `golden-cli-decision-governed-workday`
- Source: `treeseed-ai/cli#216`
- Title: **Expose decision-governed workday execution without derived internals**
- Request: Generate and expose repeatable/comma-separated decision selection on workday planning and start, normalize IDs, bind start to the exact preflight digest, and provide graph/assignment/workday watch and explanation output without implementing business logic or exposing legacy plans.
- Summary: Prove `trsd` is a complete human and automation surface over the canonical SDK/API contracts.

| Work item | Project-specific objective and expected output |
|---|---|
| Researcher | Audit generated command descriptors, handwritten exceptions, JSON stability, help, and missing acceptance-observation commands. |
| Architect | Define the smallest generated command/readback surface and strict CLI/API responsibility boundary. |
| Tester | Cover repeated/comma-separated parsing, empty/duplicate rejection, body mapping, digest binding, JSON output, watch cursors, and terminal cleanup. |
| Engineer | Implement generated command wiring and delete aliases or handwritten duplicate schemas. |
| Technical Writer | Update command help and one complete proposal-to-report operator story. |
| Releaser | Build/pack locally and run the complete simulation through installed-package-style `trsd` with machine-readable receipts. |

Required acceptance: `--decision` cannot directly select acting activity or author graph state; JSON remains parseable without warning pollution; operators can explain every gate and inspect all acceptance evidence.

### 6. Deployment — manager-owned sandbox rebuild and restoration

- `id`: `golden-deployment-manager-owned-sandbox-rebuild`
- Source: `treeseed-ai/deployment#743`
- Title: **Rebuild and restore Agent Kata guests through manager custody**
- Request: Provide a manager-owned development target that performs fixed guest build, import, digest binding, broker restart, active-assignment exclusion, and restoration without caller Docker authority, host-path parameters, package publication, or productive-time charging.
- Summary: Prove sandbox runtime development is privileged, exact, reversible, and independent of assignment time.

| Work item | Project-specific objective and expected output |
|---|---|
| Researcher | Trace manager, supervisor, container runtime, broker, digest, and active-assignment boundaries and known restoration evidence. |
| Architect | Define fixed privileged operations, state transitions, exclusion gates, rollback, and untrusted caller inputs. |
| Tester | Add security, active/recoverable assignment, idempotency, digest, archive cleanup, restart, and restoration tests. |
| Engineer | Implement the minimal manager target and remove any caller-owned privileged path. |
| Technical Writer | Document operator behavior, diagnostics, timing separation, and explicit restoration. |
| Releaser | Build/import a changed guest locally, prove Kata observes it, then restore the prior digest and verify no residue. |

Required acceptance: no sudo/Docker-group requirement enters the assignment; active work blocks replacement; released selection restores the exact prior digest; preparation time is not billed as productive assignment time.

### 7. Identity — stable source watcher boundaries

- `id`: `golden-identity-stable-development-watcher`
- Source: `treeseed-ai/identity#36`
- Title: **Prevent generated Identity assets from retriggering source builds**
- Request: Make persistent Identity development watch only handwritten package/theme sources, ignore generated theme output and `.treeseed` state, produce one atomic build marker per real input change, and remain compatible with direct build and tests.
- Summary: Prove a sovereign identity package can run persistently without self-triggered rebuild loops.

| Work item | Project-specific objective and expected output |
|---|---|
| Researcher | Trace source, generated theme, build marker, watcher, and manager interactions with exact file/event evidence. |
| Architect | Define source/generated ownership, event coalescing, atomic readiness, and recovery boundaries. |
| Tester | Add unchanged-start, one-change, generated-output, `.treeseed`, burst, failure, and restart watcher tests. |
| Engineer | Implement minimal watch filters/coalescing and atomic marker behavior. |
| Technical Writer | Document watched inputs, ignored state, diagnostics, and recovery. |
| Releaser | Run direct verify and a timed local watch simulation proving one build per source change and no loop. |

Required acceptance: generated output never retriggers; real changes are not lost; no live Identity service, account, issuer, or credential is mutated.

### 8. UI — reusable capacity and AI management primitives

- `id`: `golden-ui-operational-management-primitives`
- Source: `treeseed-ai/ui#48`
- Title: **Provide reusable operational lists and focused management wizard**
- Request: Complete reusable capacity/AI operational list and management-wizard primitives with authoritative states, retained drafts, validation, direct navigation, accessibility, responsive behavior, and no fabricated inventory or application business logic.
- Summary: Prove shared UI owns reusable presentation and interaction contracts while Admin owns workflows.

| Work item | Project-specific objective and expected output |
|---|---|
| Researcher | Inventory current consumers, accessibility guidance, responsive failures, and duplicated list/wizard implementations. |
| Architect | Define generic component props/events/state ownership and the boundary against Admin/API semantics. |
| Tester | Add unit/component and browser tests for search, filters, empty/unavailable, drafts, errors, keyboard use, and 390px layout. |
| Engineer | Implement or simplify the primitives and remove duplicate component paths. |
| Technical Writer | Update component API, examples, accessibility behavior, and migration guidance. |
| Releaser | Build package/sandbox, run unit and Playwright checks locally, pack, and verify exports/assets. |

Required acceptance: no horizontal overflow; no invented service instances; consumers need no copied controller; no credentials or live provider state are mutated.

### 9. Core — atomic direct-build readiness

- `id`: `golden-core-atomic-build-readiness`
- Source: `treeseed-ai/core#8`
- Title: **Make direct package builds publish atomic readiness**
- Request: Ensure the declared direct package build writes `dist/.treeseed-build-complete.json` last and atomically, retains watch behavior, and cannot expose a stale or partial generation to dependent UI/Core/Admin development rebuilds.
- Summary: Prove Core's package development contract has one reliable readiness authority.

| Work item | Project-specific objective and expected output |
|---|---|
| Researcher | Trace build/watch marker writers, overlay consumers, dependency rebuilds, and stale-marker failure modes. |
| Architect | Define one marker schema/write owner, atomic replacement, generation identity, and failure cleanup. |
| Tester | Add direct build, watch build, interrupted build, stale marker, atomicity, and dependent-consumption tests. |
| Engineer | Make the ordinary build own the final atomic marker and reuse it from watch without duplicate implementations. |
| Technical Writer | Document direct/watch readiness and dependency-consumption semantics. |
| Releaser | Run Core build/test/fixture checks and a local UI -> Core -> Admin rebuild simulation. |

Required acceptance: a failed build never advertises readiness; successful direct and watched builds use the same marker implementation; no timeout after a valid direct build.

### 10. Admin — truthful assignment-permission management

- `id`: `golden-admin-assignment-permission-authoring`
- Source: `treeseed-ai/admin#96` remaining permission-authoring gate
- Title: **Author and explain assignment permissions from authoritative policy**
- Request: Complete the Admin capacity workflow for viewing and authoring the simplified content/tool permission ceilings and exact assignment grants. Use current API/SDK authority, expose denials and provenance, and never fabricate policy digests, provider grants, credentials, or alternate permission models.
- Summary: Prove administrators can understand and manage the one permission architecture safely.

| Work item | Project-specific objective and expected output |
|---|---|
| Researcher | Trace current Admin/API/SDK permission displays, six-policy ambiguity, authorization, CSRF/CAS/idempotency, and help gaps. |
| Architect | Define screen/workflow ownership and the exact ceiling -> policy -> grant explanation without duplicating evaluation. |
| Tester | Add authorization, stale-CAS, invalid ceiling, denied grant, idempotency, redaction, accessibility, and browser-flow tests. |
| Engineer | Implement the focused workflow against generated operations and delete fabricated/legacy permission paths. |
| Technical Writer | Update contextual help for ceilings, policies, grants, denials, and provider capabilities. |
| Releaser | Build Node/Cloudflare variants, run unit/browser simulation with disposable records, and verify cleanup and no live approval. |

Required acceptance: Admin displays API explanations rather than recomputing policy; no secret appears in HTML/results; disposable changes clean up; no provider is approved/revoked and no paid capacity is activated.

### 11. Reviewer — correlated fixture identity and cleanup

- `id`: `golden-reviewer-correlated-fixture-cleanup`
- Source: `treeseed-ai/reviewer#47`
- Title: **Correlate browser identities and clean failed fixture campaigns**
- Request: Derive bounded deterministic fixture identities from complete correlated run IDs, preserve profile-scoped immutable evidence, and run blocked deletion producers as best-effort cleanup without reporting their functional guarantees as passed.
- Summary: Prove Reviewer separates guarantee evidence from cleanup evidence and leaves no destructive fixture residue.

| Work item | Project-specific objective and expected output |
|---|---|
| Researcher | Trace run/profile/scene identity derivation, evidence roots, prerequisite blocking, and cleanup residue. |
| Architect | Define deterministic identity, evidence immutability, cleanup scheduling, loopback safety, and pass/fail semantics. |
| Tester | Add repeated-profile collision, failed prerequisite, blocked delete, cleanup failure/success, evidence, and non-loopback rejection tests. |
| Engineer | Implement bounded full-correlation IDs and independent best-effort cleanup execution. |
| Technical Writer | Document guarantee versus cleanup outcomes and evidence interpretation. |
| Releaser | Run repeated local browser campaigns with injected failure and verify residue removal and truthful summaries. |

Required acceptance: cleanup never converts a failed guarantee to passed; profile evidence IDs remain distinct; all target origins remain loopback-only.

### 12. Engineering Template — governed generated-project adoption

- `id`: `golden-template-engineering-governed-adoption`
- Source: `treeseed-ai/template-engineering#4`
- Title: **Generate and adopt an engineering project idempotently**
- Request: Complete the template-owned contract for authenticated project creation by generating a disposable project from the exact template release, validating only portable substitutions, proving build/test, adopting Git/TreeDX resources, and replaying as noop without credentials or host-specific state.
- Summary: Prove the engineering starter is portable, governed, buildable, and idempotently consumable.

| Work item | Project-specific objective and expected output |
|---|---|
| Researcher | Audit template placeholders, lockfile, tracked archive, generated outputs, adoption preconditions, and rc supersession. |
| Architect | Define template versus Platform/API/CLI ownership and exact create/adopt/noop/rollback boundaries. |
| Tester | Add clean generation, invalid substitution, archive identity, collision, partial failure, adoption, and noop tests. |
| Engineer | Complete only template-owned initialization behavior and remove obsolete template paths. |
| Technical Writer | Update generated contributor and project-creation guidance. |
| Releaser | Generate a disposable local project, run its checks/build, simulate Git/TreeDX adoption twice, and prove second run noop. |

Required acceptance: generated source has no credentials/personal paths; exact pins and lockfile remain; only tracked files enter the archive; no remote repository is created in simulation.

### 13. Research Template — reproducible evidence-backed research project

- `id`: `golden-template-research-reproducible-evidence-project`
- Source: `treeseed-ai/template-research#5`, expanded to project purpose
- Title: **Generate a reproducible source-backed research project**
- Request: Complete a source-only development and template contract that generates a disposable research project containing a book, gathered-source registry, synthesis notes, knowledge pages, citation validation, and exact provenance without a service endpoint or release publication.
- Summary: Prove the research starter supports governed evidence-to-knowledge work and verifies as source-only.

| Work item | Project-specific objective and expected output |
|---|---|
| Researcher | Use a fixed local evidence corpus to specify provenance, citation, conflicting-source, and synthesis requirements. |
| Architect | Define the smallest generated repository/library structure and boundaries among source, note, knowledge, and book. |
| Tester | Add generation, missing/invalid citation, conflicting evidence, deterministic output, source-check, and no-endpoint tests. |
| Engineer | Implement the portable template/development declaration and validation fixtures. |
| Technical Writer | Produce the generated research workflow and contributor guidance. |
| Releaser | Generate twice from identical inputs, compare bytes, run source-check, and prove no process, endpoint, RC, or upstream change. |

Required acceptance: repeated generation is byte-stable; every synthesized claim resolves to fixed evidence; the project declares no false runtime target.

### 14. Market — canonical shared brand assets

- `id`: `golden-market-canonical-ui-brand-assets`
- Source: `treeseed-ai/market#4`
- Title: **Consume canonical TreeSeed brand assets from UI**
- Request: Remove Market ownership of duplicated logo/favicon bytes. Synchronize them from the selected local `@treeseed/ui` package during development and build, prove byte identity, and preserve Market-specific application content and independent deployment authority.
- Summary: Prove cross-package asset ownership without copied source authority.

| Work item | Project-specific objective and expected output |
|---|---|
| Researcher | Inventory Market/UI asset copies, build paths, consumers, licenses, and drift history with exact digests. |
| Architect | Define UI ownership, Market synchronization timing, generated-file treatment, and failure/readiness behavior. |
| Tester | Add missing-export, byte-drift, dev/build, stale-output, favicon/logo, and independent-build tests. |
| Engineer | Implement one synchronization path and remove Market-owned duplicate source bytes. |
| Technical Writer | Document asset ownership and local package-development behavior. |
| Releaser | Build/test Market against the local UI candidate, compare digests, and produce an unpushed web candidate only. |

Required acceptance: Market and UI emitted bytes match exactly; Market does not gain authority over UI source; no hosted deployment occurs.

### 15. Market API — resource-bound workload credentials

- `id`: `golden-market-api-resource-bound-workload-credentials`
- Source: `treeseed-ai/market-api#6`
- Title: **Replace shared gateway assertions with scoped workload credentials**
- Request: Integrate resource-specific workload credentials that preserve caller and workload actor independently, reject issuer/audience/client/scope crossover, and remove HS256 shared-service assertion handling without fallback. Keep all live authentication and data unchanged during simulation.
- Summary: Prove Market API authenticates delegated workloads without conflating service and user identity.

| Work item | Project-specific objective and expected output |
|---|---|
| Researcher | Trace current gateway assertions, caller/workload propagation, SDK/Identity interfaces, and threat boundaries. |
| Architect | Define verification, principal representation, authorization separation, failure, migration, and rollback boundaries. |
| Tester | Add valid delegation plus issuer, audience, client, scope, signature, expiry, replay, actor-confusion, and legacy-token rejection tests. |
| Engineer | Implement strict adapters/middleware and delete shared-secret compatibility behavior. |
| Technical Writer | Document configuration, principal semantics, errors, migration, and no-role-from-token boundary. |
| Releaser | Run local provider fixtures/build/tests with disposable keys and verify no key, live account, database, or deployment mutation. |

Required acceptance: caller and workload remain distinct; authentication grants no application role by itself; old assertions fail after the simulated cutover.

### 16. Skill — current source-only TreeSeed operating skill

- `id`: `golden-skill-current-source-only-guidance`
- Source: `treeseed-ai/skill#7`, expanded to skill purpose
- Title: **Verify the TreeSeed operating skill against the current CLI and architecture**
- Request: Make the versioned TreeSeed skill source-only developable and verify that its instructions use current generated `trsd` commands, exact-ref custody, living graph, simulation safety, and issue/Actions authority without retired commands, compatibility paths, or a false service runtime.
- Summary: Prove the skill teaches the same architecture the system actually exposes.

| Work item | Project-specific objective and expected output |
|---|---|
| Researcher | Compare every documented command and workflow to current SDK/CLI descriptors and architecture plans. |
| Architect | Define skill scope, progressive disclosure, exact authority boundaries, and source-only development contract. |
| Tester | Add link/command/schema/reference checks, forbidden-term checks, representative task simulations, and no-runtime assertions. |
| Engineer | Update the skill and verification tooling with the smallest non-duplicated instruction set. |
| Technical Writer | Edit user-facing operating guidance for clarity, recovery, and evidence interpretation. |
| Releaser | Run source-check and skill validation from a clean checkout; prove no process, endpoint, RC, install, or upstream mutation. |

Required acceptance: every command exists in the generated catalog; retired architecture terms do not survive; the skill remains a skill rather than another CLI/business-logic implementation.

### 17. Platform — complete declarative development composition

- `id`: `golden-platform-declarative-development-composition`
- Source: `treeseed-ai/platform#518`
- Title: **Compose every first-party project for persistent local development**
- Request: Complete the canonical seed/profile/site declarations and documentation so every first-party project is selectable according to its actual runtime type, dependency closure, and source-only or runnable behavior without RC publication. Platform remains declarative and contains no package implementation, credentials, host identity, or duplicate runtime policy.
- Summary: Prove the portfolio composes as one development system while package ownership remains independent.

| Work item | Project-specific objective and expected output |
|---|---|
| Researcher | Inventory all seed projects, repositories, libraries, runtime declarations, profiles, dependencies, and development gaps. |
| Architect | Record the canonical declarative composition, ownership boundaries, dependency closure, persistent selection, and failure restoration. |
| Tester | Add seed/profile/site validation, complete-inventory, runtime-type, forbidden-environment, visibility/license, closure, and source-only tests. |
| Engineer | Correct only Platform-owned declarations/docs and remove stale composition paths. |
| Technical Writer | Update the one no-RC local development and verification story. |
| Releaser | Validate/plan the seed without applying externally, exercise local development selection in simulation, and verify exact composition/readback. |

Required acceptance: all 17 engineering projects and their libraries are represented; Identity is not silently omitted from eligible simulation capacity; only `staging` and `production` environments exist; Platform contains no functional package implementation.

## Execution order

### Stage 0 — preflight

- [ ] Refreeze the campaign manifest and exact proposal bytes against the current integrated runtime. The corrected 17-project manifest validated at `sha256:559db20ad4bb0b057d4cad2139012b8c50eda1a831436bd51e421cba3599d3e3`, but capture finished after the provisional SDK planning run began; the pre-run freeze boundary is not yet proven (Platform #520).
- [x] Validate all 17 proposal objects against `docs/agent.schema.yml` and semantic rules. The corrected campaign validator accepted all 17 draft objects, 136 project agents, and provider offer revision 1; exact TreeDX read-back of SDK v4 commit `34664812cb8303f61eb93d3d31d1c325f3ac3303` confirms six role-scoped criteria and no inherited estimates (Platform #520).
- [x] Confirm all eight agent definitions exist for all 17 projects and every required activity resolves one handler from the pinned runtime build.
- [x] Confirm the simulation provider offers every required capability/tool group and is allowed to serve all 17 projects, including Identity.
- [x] Confirm upstream write credentials and all external mutation tools are absent.
- [ ] Confirm local simulation Git and TreeDX custody, retention, reset, watch, and teardown work. Prior simulation assignments were terminalized with zero unfinished/deferred work and no settlement errors; sandbox and candidate-ref teardown remain unproven.
- [ ] Capture pre-run upstream branch/tag/release/issue/registry/deployment state for the current campaign. The previous baseline `sha256:be62f1c8c1109fa06b8348541956ab77989f68ede93761b7de6e5765b8e740da` predates the SDK v4 correction and Issue #520 update; recapture before judging the active run.

### Stage 1 — SDK alone

- [ ] Run the complete SDK proposal lifecycle and workday until it passes this document.
- [ ] On an implementation defect, repair the owning package/runtime, reset, and rerun the identical SDK proposal from the frozen source.
- [ ] Do not proceed on missing evidence, unexplained retry, zero usage, contradictory mode, stale planning state, or leaked workspace.

### Stage 2 — API alone

- [ ] Run the complete API proposal lifecycle and workday under the same rules.
- [ ] Reset and rerun the identical API proposal after each implementation repair.
- [ ] Require direct content-to-graph projection and prove no capacity-plan/execution-input compatibility path participates.

### Stage 3 — SDK and API together

- [ ] Reset both projects to their campaign bases and restore the identical proposal bytes.
- [ ] Start one simulation workday with the accepted SDK proposal.
- [ ] At the deterministic trigger `SDK tests-first review approved`, accept the already-ready API proposal through its normal proposal decision. Do not call a graph mutation operation.
- [ ] Observe the API proposal's nodes enter the existing living graph and compete fairly for current capacity without restarting the workday.
- [ ] Require the one workday Reporter to include both projects' evidence and require isolated project grants/workspaces/settlements.
- [ ] Reconcile again and prove noop.

### Stage 4 — remaining projects individually

Run in the numbered order above, beginning with Agent and ending with Platform. A project advances only when all its lifecycle, graph, assignment, output, review, usage, settlement, teardown, and no-upstream-mutation checks pass.

- [ ] Agent
- [ ] TreeDX
- [ ] CLI
- [ ] Deployment
- [ ] Identity
- [ ] UI
- [ ] Core
- [ ] Admin
- [ ] Reviewer
- [ ] Engineering Template
- [ ] Research Template
- [ ] Market
- [ ] Market API
- [ ] Skill
- [ ] Platform

### Stage 5 — all projects in one workday

- [ ] Reset all 17 projects and use the same campaign bases and proposal bytes proven individually.
- [ ] Add the fixed cross-project relations below through the existing ordinary TreeDX relation/link mechanism, bound to exact proposal refs and work-item anchors. Do not modify the proposals or create a portfolio plan object.
- [ ] Start one simulation workday with the first eight accepted proposal decisions selected.
- [ ] At the deterministic trigger `every selected project has one approved acting result`, accept the other nine proposals normally and verify content-driven graph expansion during the active workday.
- [ ] Apply project and agent-class weighted fairness with stable ties and automatic idle-share flow; no project or class may starve while an eligible provider has capacity.
- [ ] Exercise provider-global team fairness without combining project grants, workspaces, branches, results, or settlements.
- [ ] Require all 17 simulated release candidates, all review decisions, one deterministic portfolio report, complete settlement, teardown, and noop reconciliation.
- [ ] Compare post-run external state to Stage 0 and prove no upstream mutation.

Fixed cross-project relations for the portfolio run:

| Approved predecessor | Dependent work item | Reason |
|---|---|---|
| SDK `simulate-release` | API `tests-first` | API validates the accepted portable contract candidate |
| SDK `simulate-release` and API `simulate-release` | CLI `tests-first` | CLI validates the generated contract and live operation behavior |
| Agent `simulate-release` | Deployment `tests-first` | Deployment validates the exact guest/provider candidate |
| TreeDX `simulate-release` | API `simulate-release` | API acceptance uses byte-exact content custody |
| Identity `simulate-release` | Market API `tests-first` | Market API validates the exact workload-credential adapter |
| Identity, UI, Core, and API `simulate-release` | Admin `tests-first` | Admin validates its exact integrated dependency chain |
| UI and Core `simulate-release` | Market `tests-first` | Market validates canonical shared assets and web runtime |
| Engineering Template, Research Template, Skill, CLI, and Deployment `simulate-release` | Platform `tests-first` | Platform validates the exact portfolio composition inputs |

The accepted architecture already requires explicit TreeDX relations for cross-project dependencies. If no one canonical existing content operation can express these exact source/target relations and grants, classify that as `PLAN_REVIEW_REQUIRED`; do not invent a hidden portfolio graph or silently omit cross-project dependency acceptance.

### Stage 6 — controlled failure campaigns

Run these only after the normal golden portfolio passes. Faults belong to the acceptance harness, not to the proposal or agent prompt.

- [ ] Corrupt one SDK Actor summary so it disagrees with its structured Git reference; Reviewer must request changes and the same Actor/Reviewer pair must advance once to approval.
- [ ] Repeat a deterministic review defect through the configured maximum; the work item must block for a new decision rather than loop or silently pass.
- [ ] Interrupt one provider after candidate creation; retry must preserve exact evidence, create no duplicate execution or settlement, and clean both attempts.
- [ ] Make one provider ineligible by capability and one by time; admission must explain both and choose only an eligible provider.
- [ ] Let a content question open and resolve mid-workday; only its affected connected component may change.
- [ ] Attempt upstream Git, TreeDX synchronization, publication, deployment, and credential mutation; every attempt must fail before external effect.

## Mandatory live monitoring

The implementation agent must watch every workday while it runs. Starting a workday and checking the terminal status later is not acceptance.

At minimum, inspect and retain a snapshot on:

- every GraphRevision;
- every node becoming ready, blocked, assigned, awaiting review, approved, exhausted, or complete;
- every assignment creation, claim, clock check, completion, failure, return, cancellation, or retry;
- every lease/reservation transition and settlement;
- every candidate/content commit and review decision;
- workday activation, planning-round transition, closing, Reporter completion, and end;
- every provider health, eligibility, timing, sandbox, and teardown transition.

For each new assignment, compare its exact source/authority/context refs, predecessor result IDs, effective profile, handler and origin, grant, workspace/base/branch/writable paths, estimate, deadline, provider/runtime build, execution mode, and node revision with the expected graph before allowing the run to continue.

The monitor must immediately stop new admissions and report when an assignment has the wrong project, class, activity, handler, dependency, context, grant, base, workspace, mode, estimate, or deadline; when an agent mutates outside its workspace; when a Reviewer mutates a candidate; when an expected node is skipped; or when a result cannot support its summary.

## Pass criteria for one project

A project passes only when all checks below are evidenced from authoritative records.

### Governance and graph

- [ ] The accepted decision binds one exact ready proposal revision and digest.
- [ ] Discussion, questions, estimates, authority, and acceptance criteria are complete before decision.
- [ ] The initial graph is deterministic; identical reconciliation is noop.
- [ ] Exactly six authored Actor nodes and six generated Reviewer nodes represent the proposal work.
- [ ] Every edge has source provenance and downstream readiness waits for approved review, not merely Actor completion.
- [ ] Researcher → Reviewer has no edge into the engineering branch; Architect → Tester → Engineer → Technical Writer → Releaser uses only immediate reviewed predecessors.
- [ ] Mid-workday content changes affect only the connected component.

### Profiles and collaboration

- [ ] All eight chat probes use exact addressed context and create no workflow edges.
- [ ] All eight agents complete at least two bounded, dependency-ordered planning cycles; later turns materially cite all eight predecessor contributions.
- [ ] Seven valid estimating results supply the accepted owner/review estimates without manually prescribed allocation values.
- [ ] Researcher, Architect, Tester, Engineer, Technical Writer, Releaser, Reviewer, and Reporter all perform their distinct responsibilities.
- [ ] Tester authors the tests before Engineer implementation; Engineer consumes the approved Tester result rather than replacing it.

### Assignments and outputs

- [ ] Every ready node creates exactly one assignment, lease, and reservation transactionally.
- [ ] Normal golden runs have no failed, returned, cancelled, duplicated, or unexplained extra node revisions.
- [ ] Every assignment belongs to the authoritative simulation workday, receives a simulation-compiled immutable grant, and has at most one mutable workspace; no record owns a contradictory mode.
- [ ] Every completed assignment has exactly one valid general result with a truthful summary and resolvable exact refs.
- [ ] Every model result retains two correctly ordered clock checks and real elapsed/token/native usage.
- [ ] Every verification record contains command, status, exit code, duration, and output digest.
- [ ] Every Reviewer decision binds the exact candidate and criteria; Reviewer changes no candidate bytes.
- [ ] The final local integration candidate contains exactly the approved predecessor chain and passes project verification.

### Workday, capacity, and cleanup

- [ ] All admitted planning turns are terminal and list their exact assignment IDs; at least two complete collaborative cycles are proven.
- [ ] Admitted seconds by project and agent class are populated and agree with reservations/results.
- [ ] Assignment elapsed usage agrees with timestamps within an explained tolerance; visibly elapsed work is not stored as zero.
- [ ] Every attempt has exactly one UsageSettlement, including failed controlled attempts.
- [ ] Closing begins only when ordinary admissions stop and required Reporter capacity is available.
- [ ] Reporter finishes and `Workday.reportRef` resolves before the workday becomes `ended`.
- [ ] Every sandbox, worktree, mutable TreeDX workspace, lease, and provider session is closed or removed.
- [ ] Upstream refs, releases, issues, registries, deployments, credentials, and live data are unchanged.

### Clean architecture

- [ ] CLI/API records match `docs/agent.schema.yml` and expose no retired compatibility fields.
- [ ] No assignment plan/status/summary TreeDX model, frozen signal graph, capacity-plan work unit, demand row, execution input, source-candidate record, or alternate synthesis path participates.
- [ ] One fact has one authority and one representation.

## Failure classification and retry instruction

The implementation agent must classify every failure before changing code:

- `IMPLEMENTATION_DEFECT`: the fixed proposal is valid, but a contract, projection, scheduler, provider, handler, workspace, result, review, accounting, CLI, or teardown implementation violated it. Fix the owning implementation, reset completely, and rerun the same proposal from the same source bases.
- `ENVIRONMENT_DEFECT`: required local supply or infrastructure is unhealthy. Repair the environment without changing proposal semantics, reset, and rerun.
- `PLAN_REVIEW_REQUIRED`: the fixed proposal is ambiguous, impossible, unsafe, contradicts project ownership/current source, lacks a necessary input, or cannot be represented by the agreed architecture without adding duplicate authority.

On `PLAN_REVIEW_REQUIRED`, stop the project and portfolio campaign. Do not edit the golden proposal, invent a replacement, weaken acceptance, skip the project, or continue to later stages. Report:

```text
PLAN_REVIEW_REQUIRED
project: <slug>
proposal: <id and exact digest>
workday: <id or not-started>
failed expectation: <exact section/check>
observed evidence: <exact refs and concise facts>
why implementation repair is insufficient: <reason>
smallest proposed plan correction: <proposal only; not applied>
```

Continue retrying implementation and environment defects from the frozen start while each retry produces new, useful evidence. Stop and request review if the same unexplained failure repeats three times, because repeated blind retries are not progress.

## Progress record

The agent running this campaign must update only this section's checkboxes and tables plus concise observations/blockers. It must not rewrite proposal definitions or pass criteria during execution.

| Stage/project | Latest workday | Attempts | Result | Evidence/report ref | Observation or blocker |
|---|---|---:|---|---|---|
| Preflight | — | 10 | prior Stage 0 freeze invalidated by guest repair | Platform #520; prior campaign `sha256:64941f7bc58bf83328c5d42a7192decb89d8ecbf7acd4e19ffb9b6b1971e4b7f`; external baseline `sha256:be62f1c8c1109fa06b8348541956ab77989f68ede93761b7de6e5765b8e740da` | Seventeen proposals, 136 profiles, 25 CLI allocation inputs, and Luna/low supply were validated. Refreeze the rebuilt guest and prove real Codex schema acceptance before the next golden run. |
| SDK | `workday-38e96044-e9d7-4448-9985-2897b14db703` | 15 | no golden pass; O cancelled | Platform #520; estimate-free proposal O from exact TreeDX source `ade82437cbe53c2a573c111758e781f11b23eeeb` | O completed eight chat replies, seven estimates, and two eight-role planning cycles without failed assignments. Proposal review became graph-ready but could not fit the remaining 20% planning entitlement after earlier runs consumed most of today's 28,800-second implementation-model cap. Refreeze a fresh attempt only when read-back proves sufficient daily supply. |
| API | — | 0 | not started | — | — |
| SDK + API | — | 0 | not started | — | — |
| Agent | — | 0 | not started | — | — |
| TreeDX | — | 0 | not started | — | — |
| CLI | — | 0 | not started | — | — |
| Deployment | — | 0 | not started | — | — |
| Identity | — | 0 | not started | — | — |
| UI | — | 0 | not started | — | — |
| Core | — | 0 | not started | — | — |
| Admin | — | 0 | not started | — | — |
| Reviewer | — | 0 | not started | — | — |
| Engineering Template | — | 0 | not started | — | — |
| Research Template | — | 0 | not started | — | — |
| Market | — | 0 | not started | — | — |
| Market API | — | 0 | not started | — | — |
| Skill | — | 0 | not started | — | — |
| Platform | — | 0 | not started | — | — |
| All projects | — | 0 | not started | — | — |
| Failure campaigns | — | 0 | not started | — | — |

## Completion

Agent execution is accepted only when every project proposal passes alone, SDK and API pass together, all 17 pass in one living-graph workday, the controlled failure campaigns behave exactly as specified, every result and transition is auditable, all simulation effects remain local and cataloged, all mutable resources are torn down, external state is byte-for-byte or identity-for-identity unchanged, and no legacy or alternate implementation path remains.
