# Agent communication readiness

## Authoritative runtime status

The local control plane and TreeDX service are live. The canonical `treeseed` seed is applied at digest `sha256:5c2ca42c74e21523940cf576fb08f4513eb6c21a49ccf23d8b573d945a577b0c` with zero resource drift. It owns one TreeSeed team, two owner memberships, fifteen root projects, sixteen Git source/support repositories, and fifteen automatically derived TreeDX virtual knowledge repositories.

The owner memberships are:

- An installation-supplied interactive human owner.
- `service-principal:treeseed/automation`, bound as a non-login service owner. Provider workers do not inherit this owner's authority.

The unified local capacity provider is enrolled and owner-approved as `provider_LtqmnSGecDlhDPb2-7WgyLkKwxI8VDAO`. Its manager is renewing availability session `5e033c5a-c8c2-439d-8a0c-96dff8da1e24`, and its runner is live and polling without claiming work. `codex-local` is available only on the `communication` lane with one reserved worker and two-worker maximum. Exactly fifteen active project grants are narrowed to that adapter and lane. `platform-local` remains unavailable and the `workday` lane is paused, so global seed closure truthfully retains `lane_execution_unavailable:platform` and `lane_execution_unavailable:workday` without blocking communication.

No live message, agent assignment, workday, repository mutation, model execution, or TreeDX discussion mutation was started during this readiness campaign.

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

## Closure before the first communication run

- SDK `0.13.0-rc.25` owns the portable send, send-status, and provider discussion-response contracts, catalog bindings, command descriptor, and deterministic catalog projections.
- API `0.8.0-rc.6` owns recipient resolution, accepted-definition inventory, team-channel metadata over the project-bound TreeDX Discussion, invocation admission, response commit, assignment suspension, settlement guards, OpenAPI, and MCP projection. API `0.8.0-rc.7` additionally reconciles least-privilege partial-lane grants and retires stale availability state.
- Agent `0.13.0-rc.9` owns the trusted process-isolated Codex chat executor. It receives only the local executable and copied local auth custody, reads the source message through the assignment-scoped TreeDX facade, runs Codex with tools disabled and a read-only empty workspace, posts through the catalogued provider response operation, settles, and closes the suspended communication execution. Portable module identifiers resolve through a reviewed registry and observation workers are shut down after use.
- CLI `0.13.0-rc.11` maps `trsd send` directly to `communications.send`, supports bounded `--wait`, renders human Markdown response panels, and reserves the stable command-result envelope for `--json`.
- `agents list` now resolves all eight accepted SDK definitions and joins runtime state. All eight report `chatEnabled: true` and `status: ready`.
- Focused deterministic simulations cover catalog shape, command-to-operation mapping, no-mutation planning, executor isolation, response publication, settlement ordering, unknown module rejection, and idle runner behavior. SDK passed 6 assertions, CLI 15, and Agent 13. API seed/provider focused tests and hosted checks passed.

The first live run intentionally uses the executor's narrow no-tools response profile. The richer semantic chat-tool dispatcher remains a later capability expansion; it is not required to prove the initial Discussion message/response plumbing and must not be implied by this readiness state.

## Proposed `send` contract

The public command should remain intentionally small:

```text
trsd send <channel> <message> --team <team> --project <project> [--to <agent>]... [--topic <topic>] [--wait <duration>] [--json]
```

`--project sdk` establishes the default project for unqualified recipients. Qualified recipients use `project/agent`, for example `sdk/architect`. An unqualified agent name is accepted only when the selected project makes it unambiguous. Cross-project sends require qualified recipients. The API resolves every name to `{ teamId, projectId, projectSlug, agentSlug, definitionRevision }` before committing the message and returns that frozen recipient set in the receipt.

The SDK catalog should add one semantic send operation plus read/watch operations for its durable result. The create operation writes one team-channel message and admits one project-scoped invocation per resolved recipient. It returns a send ID, channel/message refs, frozen recipients, invocation resource links, and current responses. Waiting is a client concern over a subscription or bounded polling operation; it must not turn the initial mutation into an unbounded HTTP request.

Human CLI output renders one Markdown-aware panel per response with project-qualified agent identity, status, elapsed time, evidence links, and a compact footer. Without `--json`, it never dumps the command-result envelope. With `--json`, it emits the stable typed send result without ANSI formatting.

The same semantic operations project to MCP tools/resources. REST, CLI, MCP, and the future site harness must share authorization, idempotency, recipient resolution, receipts, and response state.

## First live execution boundary

Communication execution is ready. The first run should address one SDK agent, wait for one response, and verify the durable chain before expanding fan-out:

```bash
TREESEED_API_BASE_URL=http://127.0.0.1:3002 \
node packages/cli/dist/cli/main.js send sdk-readiness \
  "Confirm your role and readiness for SDK discussion work." \
  --server local \
  --team 6f7b1b49-ea7c-4013-8a3a-f5709389681e \
  --project 44bef978-43d0-433f-b326-52baded90a15 \
  --to engineer \
  --wait 180
```

The accepted preflight uses the same arguments with `--plan --json` and returns `mutation: false`. Acceptance for the live run requires one committed source message, one communication-lane assignment, one agent response committed through TreeDX, one exact settlement, a completed send receipt, human Markdown rendering, and no remaining lease, reservation, child process, or temporary Codex custody.

Global provider closure is not green and is not claimed: platform and workday execution remain fail-closed. Retiring historical provider memberships and adding semantic chat tools, multi-agent fan-out, cancellation, outage, and interruption/reassignment scenes follow the successful single-agent baseline and clean repeat.
