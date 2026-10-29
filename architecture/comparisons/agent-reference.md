# Agent architectural reading guide

Read implementation/agent.yaml and intent/agent.yaml side by side. Their IDs match, but implementation
is evidence at the recorded source revision and intent is a candidate architectural map plus the
accepted profile obligations. Neither automatically approves the other.

## Capability layers

| Layer | Source boundary | Architectural interpretation |
| --- | --- | --- |
| Execution application | AgentApplication in src/application.ts | Validates binding, selects defaults, controls admission/cancellation and result state. |
| Host plugin | AgentHostPlugin / AgentExecutionChild in src/execution.ts | Native child lifetime, leases and authority checkpoints; no parallel resolver. |
| Execution provider | AgentExecutionPlugin in src/providers.ts | Readable context → handler/tool → reporting sequence with checkpoints. |
| Authority | src/authority.ts | Private-file authority and capacity-assignment contracts; live checks bind accepted identity. |
| Enrollment | src/provider-enrollment.ts | Registration request under explicit identity/authority. |
| Credential exchange | src/provider-credentials.ts | Approved credential protocol, distinct from transport and token issuance. |
| Token issuance | src/provider-token.ts | Token contract and selected issuer, not ambient credentials. |
| Connection | src/provider-connection.ts | Observe registration/control-plane status through public protocol. |
| Proof | src/provider-proof.ts | Private-file signing/proof boundary. |
| Manager | CapacityManagerService in src/manager-service.ts | Separate root; selected connection/proof providers; admission is not implied by registration alone. |
| Worker | WorkerApplication / CapacityWorkerService | Separate worker service, selected sandbox adapter, bounded Deployment client. |
| Guest | CapacityGuest / GuestRun | Separate guest root and runner execution; assignment/profile/generation validation. |
| Activities | ActivityDefinitionResolver in src/activities.ts | Definition/profile compatibility and selected profile/handler contracts. |

The package descriptor lists 20 provider entries. Every entry is retained verbatim in
baselines/public-surfaces.json, mapped to a provider and implementation class, and bound to exact
source in the Agent blueprint. Declaration records and source inventory also capture interfaces,
methods, static declaration expressions, import edges and composition calls. Dynamic registration
and parameter-dependent selection remain inspection limitations, not silently inferred selections.

## Runtime and application composition boundaries

Execution registers seven probe providers (authority, context, tool, handler, reporting, execution,
host). Manager's current defaults register proof and connection. Worker defaults to its private
sandbox adapter. Guest defaults to six guest providers plus the assignment source. Authority, assignment, proof, connection, credential, enrollment and token applications also
have explicit default composition records. Activity resolution accepts a caller-supplied descriptor
and is marked unresolved instead of inventing defaults. The YAML records
these **no-override defaults**; caller overrides and dynamically loaded guest packages are not
claimed to be exhausted by the lists. Source bindings identify each descriptor/compose method.

Cordis's intrinsic composition handle is fixed-bound to the kernel plugin. It is not an independently
swappable provider. Each effective selection is explicit per scope; shared class identities do not
imply shared instances or scopes across processes.

## Five flow readings

1. Startup: parse authority/configuration, reject revoked/mismatched binding, construct selected
   registrations, start native scope, return application. Source shows rejection paths; this draft
   does not prove all partial-start cleanup behavior.
2. Execution: admitted identity and generation are pinned; the host creates a child and leases
   providers; context cannot change the request; checkpoints surround handler/tool/reporting;
   cleanup retains the result state instead of converting a failure into success.
3. Cancellation/denial: abort and authority checks interrupt admitted effects; successful release
   yields cancelled/blocked with no successful output. Cleanup failure supersedes either state.
4. Cleanup failure: failed release clears output, marks recovery-required, records a blocker and
   fences readiness. Later admission must not claim healthy execution.
5. Capacity coordination: manager, worker and guest implementations exist, but this survey has not
   established their complete assembled dispatch/teardown path. The implementation flow terminates
   at unknown; intended cross-process edges appear only in the intent document.

Source statements are narrower than runtime proof. Existing tests are inventoried, not claimed run.
A future verifier needs source-contract resolution and exact artifact-bound execution evidence.

## Quality and placement

The accepted profile requires 20 canonically formatted behavioral body lines, typed boundaries,
class-based behavior and native lifecycle. The imported Agent readability baseline has eight
historical violations. Those remain debt; there are no new exception approvals in this draft.

Cohesion and readable orchestration remain review criteria. Splitting a method into arbitrary
wrappers would not satisfy architectural intent. No new numeric class/file limit is introduced.

Each of the 20 provider plugin classes has a separate observed placement and proposed target
convention. Existing shared files remain valid observations; the proposal does not move code or
require a separate component per file. Review the generated placement findings before accepting
these suggested target locations.

## Documentation mismatch

The pinned Platform Agent architecture reference describes the earlier seven-probe stage while
the pinned package contains later manager/worker/guest/enrollment implementation. This is recorded
as a discrepancy, not corrected by silently treating either description as complete authority.
Cheapest future guard: compare declared public surfaces against a pinned architecture inventory
when accepting new composition evidence. Adding that process gate is a separate proposal, not
part of this specification delivery.
