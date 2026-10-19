# Using TreeSeed agent teams for real work

Last process review: 2026-10-19. This is a living operating guide for the human project owner, the integrating assistant, and every agent participating in TreeSeed development. Read it together with [AGENTS.md](../AGENTS.md) before delegating work. Recheck it before each new objective, after a material intervention, and before expanding concurrency. Edit this guide when the agreed process changes; retain failed observations and delivery evidence in the owning Issues and Actions artifacts.

The human develops ideas and priorities with the integrator. The integrator turns those objectives into governed team work, observes execution, checks the products, and delivers reviewed changes. Project agents should perform useful research, testing, implementation, review, and documentation. The integrator repairs execution defects and coordinates delivery without silently doing an agent's work and attributing it to the agent.

Our immediate objective is a usable Atlas: observe real assignments and their state changes, open their actual products, and implement the center layout from the user's mockup. Keep the application's current outer navigation. Do not make a working Atlas a prerequisite for delegation: use the supported CLI or TreeSeed MCP operations while repairing it.

## 1. What is operating, and what remains unproved

The status authority is [SDK #428](https://github.com/treeseed-ai/sdk/issues/428), with detailed changes in the owning project Issues and verification in Actions. This guide explains the process; it is not another task database or a passing acceptance receipt.

| Capability | Observed evidence and present limitation |
| --- | --- |
| Address an agent and obtain a real product | Research, proposed patches, and reviews have been published as exact TreeDX artifacts with canonical assignments and measured settlement. Several products have failed semantic review or execution checks. |
| Use products to deliver a working interface | [UI #72](https://github.com/treeseed-ai/ui/pull/72) delivered the bounded Atlas center, lower dock, inspector, and live updates while inspecting a product. Chrome checks followed real assignment/result links. This does not mean every remaining detail view works. |
| Run background work concurrently | Three UI agents executed concurrently in isolated workspaces. A source-pinning mistake made the first batch historical-source evidence. The corrected batch used the intended source: the technical Writer completed; Architect and Researcher failed required pre-command clock checks. This is concurrency evidence, not a clean team completion. |
| Execute an accepted team chain | Still unproved for this coached objective. Addressed chat invocations are not an accepted Actor/Reviewer graph. The current UI proposal is open; do not report its chat responses as an accepted Decision or completed implementation chain. |
| Accumulate experience | Discussions, products, and feedback are durable. A complete loop from reviewed reusable lesson to verified retrieval and improved later behavior remains to be demonstrated. Storage alone does not prove learning. |

Check these claims against current Issue evidence before treating them as current runtime readiness. Update this table when a capability is actually demonstrated, including its limitations.

## 2. Authority: a message is different from a proposal and Decision

`trsd send` admits addressed communication through the configured chat profile and ordinary scheduling. It creates durable discussion/invocation records and, when admitted, an assignment to produce a response. It consumes real capacity and must settle and clean up correctly.

It does **not** automatically create, accept, or execute a product-work proposal. `--proposal` attaches an exact open/discussing proposal as context. It does not turn that proposal into accepted acting authority. `--workday` associates communication with an eligible active workday and its allocation; it does not grant additional permissions.

Use addressed communication for bounded research, clarification, progress questions, and review feedback. A chat response containing a patch is a proposed artifact; it is not proof that an Engineer committed the change in the project's Git workspace. State explicitly when the integrator applied an agent's proposed patch and who actually ran the tests.

For team delivery, use the existing governance path:

1. Locate the existing owning Issue and proposal. Reuse them instead of creating a parallel objective or duplicate plan.
2. Prepare an explicit objective, exact source/context refs, products, acceptance criteria, permissions, dependencies, review expectations, and genuine estimate requirements. Keep the proposal's source custody consistent with the assignment.
3. Open discussion and use governed planning/estimating profiles. Have participants consume each other's actual products and resolve questions. Do not fabricate estimates or copy assumed estimates into readiness fields.
4. Read back the ready proposal's exact revision and content digest. Complete the normal voting/evaluation process. Verify the resulting accepted, classed Decision and its exact proposal authority.
5. Plan a simulation workday using accepted Decision identities, inspect the returned preflight and digest, then start that exact preflight. Acting authority is derived and validated by the API.
6. Let the scheduler and configured dependencies advance the Actor/Reviewer chain. Observe it; do not insert assignments into persistence, manually mark prerequisites approved, or emulate the graph with chat messages.

If the planning, estimate, governance, admission, or review boundary fails, retain its exact evidence and repair that boundary. A chat bootstrap may continue useful independent research, but must not be represented as successful governed team execution.

## 3. Build a team around the objective

Begin with the project's actual catalog and governed profiles, not names assumed from this guide. In the current UI catalog, the documentation role is `technical-writer`, and the acting dependencies are:

```text
Researcher: independent evidence and findings
Architect -> Tester -> Engineer -> technical Writer -> Releaser
             each applicable product passes its configured Reviewer gate
Reporter: configured reporting and closeout responsibilities
```

The user's suggested Architect -> Writer -> Tester -> Engineer sequence describes the desired teamwork, but the current YAML orders technical Writer after Engineer. Follow that authority unless a normally reviewed configuration change explicitly changes it. Do not hardcode role names or dependency rules in the runtime.

The Architect should refine the objective and boundaries, not receive unlimited permission to implement or approve everyone else's work. Each participant needs the relevant predecessor products in its actual context. Independent Researcher findings and Reviewer findings should inform the chain; the integrator should not have to restate every predecessor manually. Verify that dependency release and context consumption actually happen.

For Atlas, involve only owners implicated by reproduced failures:

| Owner | Useful contribution |
| --- | --- |
| Admin | Application loader, route wiring, selected workday, real data and error presentation. |
| UI | Center layout, component interactions, responsive inspector, accessibility, browser behavior. |
| API | Authoritative scoped assignment/workday/provider/result/history reads and persistence behavior. |
| Agent | Reliable execution, observations, clocks, products, reviews, accounting, and cleanup. |
| TreeDX | Governed context, publication, discussion/review content, exact artifact resolution and access. |

Add SDK or CLI work only for a reproduced missing public capability. Preserve the reserved golden SDK Tester-on-BASE/Engineer chain and fixed acceptance proposals.

## 4. Prepare execution without turning preparation into the product

Readiness evaluation asks whether execution is safe and capable: authentication, source/runtime custody, healthy provider, available supply, permissions, observation, isolation, and cleanup. Product evaluation asks whether the agent solved the assigned problem. Report these separately. Green environment tests cannot stand in for an actual usable product.

Before activation or retry:

- Authenticate through the supported operator flow. Never put credentials or tokens in a task, Issue, or this guide.
- Inventory all pages of existing workdays, pending/leased/running assignments, provider capacity, and owning-host resources. Preserve unrelated work and services. A missing or incomplete inventory blocks a claim of safety or closure.
- Hold the exact runtime candidates, archive/build/guest digests, governed profile revisions, proposal revision, and Git/TreeDX refs. Verify them against public read-back. Task text cannot override a stale proposal's source ref.
- Complete every participating owner's unit/integration suites on that exact runtime candidate before ordinary coaching. Reuse those receipts only while the candidate is unchanged; run fresh relevant focused checks and operational preflight before each activation/retry. A changed candidate requires fresh complete suites.
- Check existing allocations, real remaining supply, original deadlines, writable custody, tool grants, and observation availability. Do not raise limits or extend deadlines to make an experiment pass.
- Ensure affected prior assignments have settled and their resources have closed before retrying. Diagnose quarantined or expired claims explicitly; do not delete them to obtain capacity.

The human has authorized **up to three active tasks** during this phase. This is an operating ceiling, not a change to provider configuration or entitlement. Count actual existing activity plus proposed admissions across the team; admission must fit the lower of this ceiling, available supply, and owning limits. Pending work must also be accounted for so later admission cannot oversubscribe the experiment. Keep one writer/build owner per shared checkout and serialize Git operations, shared artifact writes, installations, and runtime adoption. Independent research can overlap; shared source mutation cannot.

Expand a capability after two successive clean completions, then test the same class across projects. Do not count clock-rejected, stale-source, unreviewed, or timed-out tasks as clean. Five concurrent assignments remain a later measurement-dependent milestone, not the current authorization.

Preserve the TreeDX 4 GiB service default and environment-configurable cache budget within it. Bound temporary processes and disk artifacts, retain original failed evidence, and remove only delivery-owned disposable resources. No broad cleanup, service shutdown, or storage reset to make capacity appear healthy.

## 5. Give concrete work and communicate through supported operations

Every assignment or addressed task should state:

- The objective and reproduced user-visible problem; the owning Issue and proposal.
- Exact source commit, relevant files, governed context/artifact refs, and predecessor products.
- The required product: research artifact, focused regression, Git candidate, documentation, or independent review.
- Observable completion criteria and negative cases; what constitutes an unresolved result.
- Allowed operations and workspace custody. Governed profiles remain the permission authority.
- Original time constraints, authoritative clock requirements, verification and closeout expectations.

Prefer small source excerpts and exact symbols. Avoid dumping minified stylesheets or entire files: output truncation causes rereads, wastes the assignment window, and has accompanied missed clock checks. Check authoritative time before each protected command as required, reserve verification/closeout time, and use supported continuation for eligible unfinished work before the original deadline.

These examples show supported command shapes, not a ready-to-run authorization. Replace every placeholder with a read-back value; inspect current `--help` and the planned request before mutation. Use the same idempotency key to recover an uncertain request; use a new key only for a genuinely new authorized request.

```bash
trsd auth status --server local --json
trsd agents list --project <project> --server local --json
trsd proposals show <proposal-id> --project <project> --server local --json
trsd capacity status --team <team> --server local --json
trsd capacity explain --team <team> --server local --json
trsd assignments list --team <team> --status running --limit 100 --server local --json
trsd host sandbox status --json

trsd send <topic> '@<configured-address> <bounded task with exact refs and criteria>' \
  --proposal <open-proposal-id> --team <team> --server local \
  --idempotency-key <request-key> --plan --json

# Only after validating that plan and fresh preflight:
trsd send <topic> '@<configured-address> <same task>' \
  --proposal <same-open-proposal-id> --team <team> --server local \
  --idempotency-key <same-request-key> --no-wait --json
```

For team acting, inspect `trsd workdays plan --help`, use accepted `--decision` identities and `--execution-mode simulation`, and inspect the resulting preflight. `trsd workdays start --preflight <id> --digest <digest> --team <team> --server local --yes --json` starts the exact authorized preflight. Planning-only proposal work is available through the existing `workdays plan` selectors; it does not admit accepted acting work by itself. Do not guess proposal input schemas or manufacture a ready plan from these examples.

Agent addresses are parsed from the message: unintended additional `@` text can be interpreted as another recipient. Verify the planned recipient list. Target communication to the exact agent/topic/workday; do not rely on a message to unrelated listeners reaching an issued assignment.

A current concrete example is topic `atlas-ui-team-objective-planning`, proposal `fb21c041-0dab-4b64-830c-45f6224458d7` revision 2, and recipients `@ui/architect`, `@ui/technical-writer`, and `@ui/researcher`. That revision pinned UI source `1ebf34a3f8dd64cc2be4b878959c183b14e8bc0e`. Its corrected send `send-4f8d8daec5fc011c029cf8c6d1651c6f` produced Writer assignment `assignment_c6bys_iGsCAitqijoQSZ06f7B_54Bk-f` and TreeDX product `eb42627f24b22892c177e2e1e615a1d778d4bbbc`; the two peer assignments failed clock checks. This illustrates durable communication and honest partial results, not accepted team delivery. Read current proposal/catalog state before reusing any of these historical identities.

Use the supported TreeSeed MCP equivalents where available, with the same authority and read-back checks. Do not substitute Codex chat subtasks for TreeSeed project-agent execution or private persistence writes for public operations.

## 6. Observe execution and intervene on evidence

The integrator follows these boundaries throughout the task, with available public observations and independent inventories:

| Boundary | What to check |
| --- | --- |
| Admission and claim | Exact recipients, invocation, assignment, project/team/workday, source authority, graph readiness, lease, reservation, selected profile/handler/grant, and provider supply. |
| Execution | State changes, available tool/provider events, original deadline, authoritative clock checks, remaining time, context/source refs, denials, subprocess errors, and interruption. |
| Products and reviews | Exact Git commits/TreeDX artifacts, content, predecessor consumption, review criteria, independent findings, correction, and separate approval. |
| Accounting and closure | Measured usage, one canonical settlement per attempt, result disposition, closed workspaces, and complete owning-host task/container/mount/directory observations for the affected resources. |

For communication, the current operator implementation reads the public SDK operation `CONTROL_PLANE_OPERATIONS.communications.sendStatus` with the admitted send identity and appropriately authorized diagnostics. It retains the original receipt and diagnostics. There is no `trsd send status` command to invent. `trsd topics show <topic>` reads the topic/listeners; it does not substitute for assignment diagnostics.

`trsd send ... --json-stream` is the CLI's ordered communication-stream option. Our observed runs have primarily used public SDK status reads, assignment/event reads, and Atlas SSE updates; do not claim that a persistent CLI stream was used when it was not. Listener timeout is different from an agent's issued execution deadline. After an observer disconnect, recover the existing request rather than sending duplicate work.

For workdays, use `trsd workdays watch <workday>` and scoped `trsd workdays events list <workday> --team <team> --limit 100 --server local --json`, following every cursor. Reconcile identity, scope, duplicates, gaps, and canonical event indices; do not assume timestamp presentation order proves complete transition order. Compare observations with independent owning inventories: a complete public page alone does not prove that its producer emitted everything.

Atlas is an additional observation surface. Confirm it displays the same real assignment/workday and follows actual products. Missing history, lost service access, or incomplete observations must stay visibly unavailable. The operator must not infer success from a terminal badge, an acknowledgment, or the absence of visible errors.

Coaching follows a concrete loop:

1. Preserve the exact observation: assignment/attempt, tool event or error, source ref, expected behavior, and actual behavior.
2. Address the responsible agent through its supported communication lane. Ask a precise question or give measured feedback with exact artifact refs. Verify the response actually received the intended context; persistence does not guarantee an already-running turn consumed it.
3. Let the agent correct its own product under the appropriate current authority, then obtain independent review. Preserve the original and corrected artifacts and findings.
4. If execution itself is broken, reproduce the earliest owning defect, add focused regression plus real integration and existing scene coverage, repair it, verify the exact candidate, and adopt it through supported reconciliation for subsequent assignments.
5. Verify settlement and physical closure before retry. An unexplained failure repeated three times stops for review. Keep unrelated healthy work operating unless authority, isolation, accounting, or resource safety is shared.

Do not hot-swap prompts or issued authority in a running task. A message is not a guaranteed interrupt. Use supported scoped cancellation/stop when required; retain failed observations and any stop failure. Do not replay an unchanged failed request and call the resulting repetition coaching.

## 7. Evaluate products, review independently, and integrate

Evaluate the product against the original criteria, not how convincing the agent's summary sounds:

- Resolve every claimed artifact at its exact commit/ref and read its actual content. Independently verify citations and distinguish preliminary findings from established evidence.
- For code, reproduce the defect and intended failing regression, examine the actual diff/ancestry and committed tests, run the owning checks, and verify permissions and unrelated behavior. A patch in a discussion is not a committed repository fix.
- A Reviewer must inspect the exact candidate and criteria with independent, appropriately read-only custody. Verify substantive findings, the corresponding correction, and a separate approval; an expired review is not approval.
- Compare reported commands, outputs, usage, settlement, and cleanup with retained native/public evidence. Keep mechanically completed but semantically inadequate work distinct from accepted work.
- Validate the user's actual journey against integrated services in Chrome: scoped assignment visibility, truthful live changes, usable center/inspector, result links, errors, reconnection, denied/cross-team access, keyboard/touch, and supported viewports. Fixture browser tests are component evidence only.

The integrator delivers through `Issue -> short-lived codex/ remote branch -> PR -> required Actions -> ordinary staging merge/read-back -> supported Platform composition/adoption -> integrated verification`. Fetch protected heads before branching or merging, preserve test-first commit lineage, and hold the exact source and archive candidate. Clean only the delivery's temporary branch/artifacts after the evidence is retained. Follow repository instructions for any later production promotion; this guide does not authorize tags, publication, unrelated deployment changes, or new environments.

If the integrator must apply a suggested patch or repair an execution boundary, identify that intervention in the Issue. Credit the agent only for its genuine artifact. A task is product-complete when the product supports its summary, applicable independent review passes, integration checks pass, and accounting/resources close; retain each separate delivery gate while it is pending.

## 8. Turn feedback into durable, retrievable experience

Material feedback belongs in the exact discussion/product/review history and owning Issue. Durable improvement uses existing authorities:

| Kind of learning | Where it belongs |
| --- | --- |
| One task's correction or review finding | Its governed discussion, product revisions, and independent review. |
| Reusable project/domain/review knowledge | Reviewed Knowledge in the bound project or Team Library, with exact content refs and applicable context/query selection. |
| Standing instructions, capabilities, parameters, or permissions | Governed YAML profiles/configuration, reviewed and reconciled for subsequent assignments. |
| Functional defect or invariant | Owning package implementation plus unit, real integration, and existing scene/guarantee coverage. |
| Operating-process change | This guide and, where required, the root policy through the existing PR process. |

Start Platform library work with `trsd library show platform` and `trsd library status platform`. Discover paths through supported `paths`, `search`, `query`, or `context`; read known content with `trsd library read platform <path> --ref <exact-commit>`. Use the corresponding bound project library for project-specific lessons. Write through governed library workspace create/read/write/diff/submit and review/publish operations. Never edit `.treeseed/data`, push TreeDX refs around review, or interpret an unhealthy empty binding as authoritative.

An experience update is verified only when:

1. The lesson states the observed failure, exact evidence, corrective rule, applicability, and how to check improvement, without credentials or unsupported generalization.
2. Its owning review approves the change and publishes the exact revision through the existing path.
3. A later assignment's actual context manifest shows the lesson/profile revision was included. Account for omitted or summarized context; discussion history can be optional and context is bounded.
4. The later product and execution demonstrate the correction, with independent review and no regression.

This is explicit context and configuration improvement, not automatic model-weight training. Do not say an agent has learned something merely because feedback was saved. Avoid copying the same rule into prompts, assignments, handlers, providers, and a new memory system. One authority should own each rule.

## 9. Lessons we are applying now

- **Pin authority before dispatch.** The first concurrent UI discussion inherited an old proposal Git ref even though the task named the current source. The normal proposal update preserved the original revision and corrected source custody. Future preflight must compare the actual proposal's Git/TreeDX refs, not just task text.
- **Clock instructions alone are not proof of compliance.** On the corrected source, Architect and Researcher omitted fresh clock checks before later commands; the timing guard correctly rejected them. Architect already had an explicit per-command clock instruction. Bound inspection and verify the actual clock/command sequence; do not weaken the guard or claim a new runtime defect without a regression.
- **Keep long reads bounded.** A minified stylesheet dump truncated useful source and prompted extra commands. Select exact symbols/line ranges, avoid generated/minified output, and preserve verification/closeout time.
- **Test team consumption, not only simultaneous work.** Three isolated replies demonstrate concurrency. A team milestone additionally requires material predecessor consumption, configured dependency/review advancement, and an integrated product. The corrected Writer's product alone does not complete the missing Architect/Researcher work.
- **Reserve time for honest closeout.** Short assignments have exposed deadline/closeout defects. Candidate repairs and native checks must be adopted and exercised before calling that execution capability reliable. Never extend the original deadline or reinterpret an unapproved timeout as success.

## 10. Keep this guide and acceptance evidence current

At each operating change, check whether authority, delegation, concurrency, observation, review, integration, or persistent context changed. Update the relevant section in the same delivery; record what was verified and what remains a hypothesis. The human may edit this guide directly: inspect and preserve those edits, reconcile conflicts explicitly, and do not overwrite their process changes.

Maintain a concise checklist in the existing Issue body:

- Objective, responsible team, exact proposal/Decision and runtime/source/profile refs.
- Actual assignment/send/workday identities, product and independent review refs.
- Interventions, original failures, current blockers, and the next concrete test.
- What the user can now do, exact PR/Actions/adoption/Chrome evidence, settlement and closure.
- Applicable acceptance criteria, semantic coverage still missing, and any reviewed reusable lesson with later retrieval evidence.

Keep detailed logs in Actions artifacts and authoritative content in Git/TreeDX. Do not post routine comments or create another status database. Do not delete historical failures when updating current status.

Preserve [agent-acceptance.md](agent-acceptance.md), its criterion identities, bindings, deferred obligations, and fixed golden assignments. Ordinary coaching can expose defects and accumulate evidence, but it is distinct from formal acceptance. **Before every acceptance scene or guarantee, run fresh complete unit/integration suites for every participating owner on that invocation's exact candidate.** Ordinary coaching's unchanged-candidate reuse never applies to formal scenes. Count a binding complete only when its semantic assertions, selected wiring, and delivery obligations are satisfied.

The final formal path remains SDK -> API -> joint -> remaining individual projects -> portfolio -> controlled failures. Coached cross-project development may proceed earlier under the amended strategy. The practical measure of this strategy is agents helping deliver working products, with independently demonstrated improvements in execution and acceptance evidence over time.
