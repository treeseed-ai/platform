# Using TreeSeed agent teams for real work

Last process review: 2026-10-19. This is a living operating guide for the human project owner, the integrating assistant, and every agent participating in TreeSeed development. Read it together with [AGENTS.md](../AGENTS.md) before delegating work. Recheck it before each new objective, after a material intervention, and before expanding concurrency. Edit this guide when the agreed process changes; retain failed observations and delivery evidence in the owning Issues and Actions artifacts.

The human develops ideas and priorities with the integrator. The integrator turns those objectives into governed team work, observes execution, checks the products, and delivers reviewed changes. Project agents should perform useful research, testing, implementation, review, and documentation. The integrator repairs execution defects and coordinates delivery without silently doing an agent's work and attributing it to the agent.

Our immediate objective is a usable Atlas: observe real assignments and their state changes, open their actual products, and implement the center layout from the user's mockup. Keep the application's current outer navigation. Do not make a working Atlas a prerequisite for delegation: use the supported CLI or TreeSeed MCP operations while repairing it.

## 1. What is operating, and what remains unproved

The current continuation is [SDK #429](https://github.com/treeseed-ai/sdk/issues/429), linked from [SDK #428](https://github.com/treeseed-ai/sdk/issues/428) after that retained body approached GitHub's limit. Detailed changes remain in the owning project Issues and verification in Actions. This guide explains the process; it is not another task database or a passing acceptance receipt.

| Capability | Observed evidence and present limitation |
| --- | --- |
| Address an agent and obtain a real product | Research, proposed patches, and reviews have been published as exact TreeDX artifacts with canonical assignments and measured settlement. Several products have failed semantic review or execution checks. |
| Use products to deliver a working interface | [UI #72](https://github.com/treeseed-ai/ui/pull/72) delivered the bounded Atlas center, lower dock, inspector, and live updates while inspecting a product. Chrome checks followed real assignment/result links. This does not mean every remaining detail view works. |
| Run background work concurrently | Three UI agents executed concurrently in isolated workspaces. A source-pinning mistake made the first batch historical-source evidence. The corrected batch used the intended source: the technical Writer completed; Architect and Researcher failed required pre-command clock checks. This is concurrency evidence, not a clean team completion. |
| Execute an accepted team chain | Still unproved for this coached objective. The UI proposal's actual support vote produced accepted status, but canonical Decision publication failed and its Decision link remains absent. Repair and recover that authority before acting. Addressed chat responses are not an accepted Decision or completed implementation chain. |
| Obtain genuine team estimates | Architect, Tester, Engineer and Reviewer completed proposal-owned estimating assignments through the scheduler. The UI proposal advanced from revision 2 to 6 with its static objective and work items unchanged. All four products settled once and their TreeDX workspaces closed. Estimating success does not prove acting or review success. |
| Accumulate experience | One bounded loop is demonstrated: independent findings led to a Researcher correction, measured integrator feedback refined its governed chat prompt, a subsequent assignment used that exact revision and produced a cleaner correction, and a separate Reviewer approved it. Both products settled once and their tasks/VMs closed. This does not prove general reliability or automatic retrieval of every stored lesson. |

Check these claims against current Issue evidence before treating them as current runtime readiness. Update this table when a capability is actually demonstrated, including its limitations.

## 2. Authority: a message is different from a proposal and Decision

`trsd send` admits addressed communication through the configured chat profile and ordinary scheduling. It creates durable discussion/invocation records and, when admitted, an assignment to produce a response. It consumes real capacity and must settle and clean up correctly.

It does **not** automatically create, accept, or execute a product-work proposal. `--proposal` attaches an exact open/discussing proposal as context. It does not turn that proposal into accepted acting authority. `--workday` associates communication with an eligible active workday and its allocation; it does not grant additional permissions.

Use addressed communication for bounded research, clarification, progress questions, and review feedback. A chat response containing a patch is a proposed artifact; it is not proof that an Engineer committed the change in the project's Git workspace. State explicitly when the integrator applied an agent's proposed patch and who actually ran the tests.

For team delivery, use the existing governance path:

1. Locate the existing owning Issue and proposal. Reuse them instead of creating a parallel objective or duplicate plan.
2. Prepare an explicit objective, exact source/context refs, products, acceptance criteria, permissions, dependencies, review expectations, and genuine estimate requirements. Keep the proposal's source custody consistent with the assignment.
3. Open discussion and use governed planning/estimating profiles. Have participants consume each other's actual products and resolve questions. Do not fabricate estimates or copy assumed estimates into readiness fields.
4. Read back the ready proposal's exact revision and content digest. Complete the normal voting/evaluation process. Verify the resulting accepted, classed Decision and its exact proposal authority. An accepted proposal with no published Decision is incomplete authority: retain the actual vote and partial failure, repair its owning boundary, and recover the same reserved Decision through supported evaluation. Do not create replacement proposals, fake votes or insert assignments to bypass publication.
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

A supplied-code review and an attached-checkout inspection have different evidence scopes. If the reviewed candidate is absent from the checkout, do not replace it with that checkout's older base or repeatedly attempt unavailable Git objects. State which exact bytes were supplied, which observations were independently obtained, and what remains unverified. A raw approval rejected by the runtime is failed evidence, even when its wording looks correct. Two observed consecutive-command failures led to a governed Reviewer prompt refinement that explicitly requires a fresh authoritative clock before every protected command; the subsequent supplied-test review completed with two clocks and no source commands. This is a measured improvement for that bounded task, not a general reliability claim.

Supply the actual public input and display types with proposed-test tasks. The Admin history Tester returned executable code after its governed prompt clarified the deliverable and handler-owned publication, but its fixtures used incorrect event and operation fields. The integrator had supplied insufficient contract context. Retain that original proposal, attribute contract corrections explicitly, and verify intended RED before implementation. Do not add a retired field merely to satisfy an older installed type declaration; use the observed canonical contract and keep dependency differences explicit.

Preflight inventories are observations taken while work can finish. If active-assignment and capacity reads disagree because an observed assignment closed between them, retain both observations and refresh the affected public reads before admission. Do not weaken the consistency guard or treat a stale snapshot as current capacity.

Before every run, explicitly ask: **What change to the prompt, selected context, or governed definition is most likely to improve this result?** Choose a concrete improvement from the last observed failure or uncertainty, state the expected effect in the owning Issue, and check the actual result afterward. Prefer removing irrelevant history and supplying exact bounded source/product refs over adding more instructions. If the problem recurs across tasks, review the owning definition or context selection; do not leave the fix permanently as an operator reminder. Keep the original deadline, permissions, and truthful failure conditions.

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

For workdays, use public workday/assignment reads and scoped `trsd workdays events list <workday> --team <team> --limit 100 --server local --json`, following every cursor. The installed CLI advertises `trsd workdays watch <workday>`, but an actual invocation returned `standards_migration_not_enabled`; that watch capability remains blocked and must not be described as an active stream. Reconcile identity, scope, duplicates, gaps, and canonical event indices; do not assume timestamp presentation order proves complete transition order. Run-level events may have a null `workdayId` while retaining the exact canonical `runId`; validate the owning event contract rather than inventing a scope alias or treating null as a foreign workday. Compare observations with independent owning inventories: a complete public page alone does not prove that its producer emitted everything.

Atlas is an additional observation surface. Confirm it displays the same real assignment/workday and follows actual products. Missing history, lost service access, or incomplete observations must stay visibly unavailable. The operator must not infer success from a terminal badge, an acknowledgment, or the absence of visible errors.

Coaching follows a concrete loop:

1. Preserve the exact observation: assignment/attempt, tool event or error, source ref, expected behavior, and actual behavior.
2. Address the responsible agent through its supported communication lane. Ask a precise question or give measured feedback with exact artifact refs. Verify the response actually received the intended context; persistence does not guarantee an already-running turn consumed it.
3. Let the agent correct its own product under the appropriate current authority, then obtain independent review. Preserve the original and corrected artifacts and findings.
4. If execution itself is broken, reproduce the earliest owning defect, add focused regression plus real integration and existing scene coverage, repair it, verify the exact candidate, and adopt it through supported reconciliation for subsequent assignments.
5. Verify settlement and physical closure before retry. An unexplained failure repeated three times stops for review. Keep unrelated healthy work operating unless authority, isolation, accounting, or resource safety is shared.

Do not hot-swap prompts or issued authority in a running task. A message is not a guaranteed interrupt. Use supported scoped cancellation/stop when required; retain failed observations and any stop failure. Do not replay an unchanged failed request and call the resulting repetition coaching.

A published response can precede failed terminal acknowledgement. Verify the assignment, settlement, workspace and host separately: task/VM absence does not mean a committed TreeDX workspace is closed or accounting is complete. Hold the affected retry until its closure gate passes. Independent read-only work may continue only with fresh owning inventories, immutable failed-attempt evidence, retained conservative reservations, isolated workspace authority and measured remaining supply; never erase a hold or call the failed product approved to obtain capacity.

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
- **Measure whether the refinement helped.** A later Researcher run used one 38-line file and one bounded read, returned 99 words with valid clock evidence, settled once for 18 measured seconds, and closed its workspace/resources. Its independent review remains a separate gate. That is one observed improvement, not proof that the capability is generally reliable.
- **Clock checks must support completion.** The subsequent Reviewer inspected the source, then repeatedly polled the clock instead of returning its findings and timed out. The normal governed workspace/review/publication path changed only UI Reviewer's `chat.prompt.system` to terminate inspection and answer immediately after the final clock. A subsequent assignment proved adoption of revision `d3c130f9b8999a095962d15de630799ddedb4073`, returned substantive REQUEST_CHANGES with two clock checks, settled for 15 active seconds and closed its workspace. A later supplied-diff review still ran two commands without a fresh clock before the second; the timing guard correctly rejected it despite an APPROVE response. One improved run does not establish reliable compliance. Preserve both failures; grants, handler, dependencies, model and deadlines remain unchanged.
- **Check the transport and candidate before sending a review.** The discussion boundary limits a message to 20,000 characters and interprets addressed mentions. Check length and unintended recipients before admission. For minified CSS, a lossless extraction of every changed rule's complete before/after declarations can reduce irrelevant formatting; retain exact hashes and distinguish that extraction from byte-identical source. If the candidate is absent from the attached checkout, say so and supply exact permitted source evidence. A failed lookup is still a protected command requiring its own preceding clock. Never count a plausible approval whose execution, custody or timing failed.
- **Correct misleading framing as well as the main result.** A Researcher correction supplied useful citations and regression criteria but incorrectly said durable publication was impossible, even though its configured handler published that response. It also treated a failed lookup as evidence that the source file was absent. Feedback changed only its governed chat prompt to distinguish supplied evidence, failed lookups and handler-owned publication. A later assignment adopted revision `b35131ea4fc7902774cf9944b49dc01a5c88dd9e`, returned a truthful 129-word correction, and obtained separate source-based approval. Actual settlements were 17 and 12 active seconds; complete owning inventory verified task/VM absence. The exact products and original failures remain in SDK #429. No browser execution or implementation approval is implied.
- **Test team consumption, not only simultaneous work.** Three isolated replies demonstrate concurrency. A team milestone additionally requires material predecessor consumption, configured dependency/review advancement, and an integrated product. The corrected Writer's product alone does not complete the missing Architect/Researcher work.
- **Reserve time for honest closeout.** Short assignments have exposed deadline/closeout defects. Candidate repairs and native checks must be adopted and exercised before calling that execution capability reliable. Never extend the original deadline or reinterpret an unapproved timeout as success.
- **Update executable wiring with test identities.** Splitting an aggregate native test into independently reported cases requires selecting every resulting exact case in its existing scene. API verification passed all 2,197 complete-suite assertions but its stale aggregate selection correctly failed with zero assertions. Compare current discovered identities with selected registry entries before another full run; collection proves wiring only, not native execution. Preserve all original cases and deadlines.
- **Exercise the actual data volume.** Admin history passed fixture tests and read 154 real events across two public pages for a completed Engineer run. The older stuck workday exceeded the bounded page budget and remained unavailable. Preserve that failure and investigate its owning lifecycle/history production; do not enlarge the budget, present partial history as complete, or treat the smaller successful read as universal readiness.

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
