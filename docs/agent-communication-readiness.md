# Agent communication readiness

## Authoritative runtime status

The local control plane and TreeDX service are live. The canonical `treeseed` seed is applied at digest `sha256:5c2ca42c74e21523940cf576fb08f4513eb6c21a49ccf23d8b573d945a577b0c` with zero resource drift. It owns one TreeSeed team, two owner memberships, fifteen root projects, sixteen Git source/support repositories, and fifteen automatically derived TreeDX virtual knowledge repositories.

The owner memberships are:

- Adrian Webb, bound to `adrian.webb@knowledge.coop` as an interactive human owner.
- `service-principal:treeseed/automation`, bound as a non-login service owner. Provider workers do not inherit this owner's authority.

The unified local capacity provider is enrolled and owner-approved as `provider_LtqmnSGecDlhDPb2-7WgyLkKwxI8VDAO`. Its manager is renewing availability and its `communication`, `platform`, and `workday` lanes are registered. It is not yet runnable: both declared adapters lack trusted executor modules, so the API reports zero active execution providers. The fifteen project grants are intentionally not activated while execution is unavailable. Seed verification therefore remains `waiting_provider` with one blocker for each lane. This is a truthful readiness failure, not seed drift.

No live agent, assignment, workday, repository mutation, or TreeDX content mutation was started during this audit.

## Existing communication foundation

The modern control plane already contains most of the required communication lifecycle:

- TreeDX-backed Discussion documents, messages, and lifecycle events;
- committed-message read-back before invocation admission;
- agent mention parsing and one invocation per addressed project agent;
- hidden conversation executions charged to the shared communication lane;
- communication reserve, borrowing, backpressure, cancellation, lease renewal, interruption, reassignment, and settlement records;
- assignment-scoped TreeDX proxy handles and path restrictions;
- invocation list/show/cancel/status operations in the SDK catalog;
- REST and MCP projections for Discussions and communication status;
- chat activity profiles with bounded runtime, tool, content, and mutation permissions.

The SDK project currently has eight active agent classes with enabled chat profiles: `architect`, `engineer`, `releaser`, `reporter`, `researcher`, `reviewer`, `technical-writer`, and `tester`.

## Gaps before the first communication run

1. **Trusted execution adapters.** Agent has the process-isolated executor contract and credential projection boundary, but no production `createAgentExecutor()` module. The Codex adapter must use local Codex custody without exposing credentials to assignments. The platform adapter must remain a separate process and receive only assignment-derived infrastructure credentials.
2. **Agent semantic tool host.** Chat profiles declare `treeseed.discussion.*`, content, status, assignment, and TreeDX tools, but the stripped Agent runtime does not yet provide the semantic tool dispatcher. Direct raw-path or broad-token access is not an acceptable substitute.
3. **Durable response transition.** The API has the guarded conversation-suspension/final-message lifecycle, but no catalogued provider operation currently invokes it. A response operation must atomically commit the agent message through TreeDX, read it back, record the final message reference, revoke the assignment proxy, settle the reservation, and terminalize the hidden conversation execution.
4. **Team channel ownership.** The current Discussion implementation persists through a selected project's virtual knowledge repository. The target channels are team resources. A team channel needs a stable team-scoped identity and message log while every addressed agent invocation retains an explicit project scope for definitions, permissions, and knowledge access.
5. **Agent inventory projection.** The SDK project has eight configured chat agents, while `agents list` currently projects only agents observed in historical runtime activity. The operation must enumerate accepted active definitions and join runtime state, not derive identity from mode runs.
6. **Scene harness.** Current core packages have guarantee scene documents but no accepted `trsd scenes ...` command tree or catalogued scene simulation runner. Historical Market documentation describes a removed runtime and is not evidence. The new harness must exercise normal API/provider/TreeDX paths with deterministic fake model adapters before live model use.
7. **Human rendering.** The slim CLI has no shared Markdown panel renderer. Human output must use a reusable renderer; structured envelopes remain exclusive to `--json`.

## Proposed `send` contract

The public command should remain intentionally small:

```text
trsd send <channel> <message> --team <team> --project <project> [--to <agent>]... [--topic <topic>] [--wait <duration>] [--json]
```

`--project sdk` establishes the default project for unqualified recipients. Qualified recipients use `project/agent`, for example `sdk/architect`. An unqualified agent name is accepted only when the selected project makes it unambiguous. Cross-project sends require qualified recipients. The API resolves every name to `{ teamId, projectId, projectSlug, agentSlug, definitionRevision }` before committing the message and returns that frozen recipient set in the receipt.

The SDK catalog should add one semantic send operation plus read/watch operations for its durable result. The create operation writes one team-channel message and admits one project-scoped invocation per resolved recipient. It returns a send ID, channel/message refs, frozen recipients, invocation resource links, and current responses. Waiting is a client concern over a subscription or bounded polling operation; it must not turn the initial mutation into an unbounded HTTP request.

Human CLI output renders one Markdown-aware panel per response with project-qualified agent identity, status, elapsed time, evidence links, and a compact footer. Without `--json`, it never dumps the command-result envelope. With `--json`, it emits the stable typed send result without ANSI formatting.

The same semantic operations project to MCP tools/resources. REST, CLI, MCP, and the future site harness must share authorization, idempotency, recipient resolution, receipts, and response state.

## Readiness sequence

1. Implement and verify the trusted Codex and isolated platform executor modules.
2. Add the provider semantic tool dispatcher and catalogued durable Discussion response operation.
3. Reconcile the provider; require active observations for all three lanes; then activate exactly fifteen project grants.
4. Fix accepted-definition inventory so SDK read-back returns all eight chat agents.
5. Add team channel and project-qualified recipient contracts, the `send` operation, MCP projection, and CLI panel/JSON rendering.
6. Add deterministic scenes for one agent, all eight SDK agents, ambiguous-name rejection, cancellation, provider outage, interruption/reassignment, and response settlement.
7. Run simulation baseline, clean repeat, and interruption/resume. Only then run the first live Codex-backed SDK communication.
8. Retire the four old unhealthy memberships only after the new provider is runnable, granted, and read back.

Agent execution readiness is achieved only when seed verification is green, the target provider has active adapters and fifteen active grants, all eight SDK agents read back from accepted definitions, deterministic communication scenes pass, and no credential or disposable execution residue remains.
