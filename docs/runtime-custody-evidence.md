# Runtime custody and installed capacity evidence

This is an owner-evidence reference for [the Agent architecture](agent-architecture.md) and
[seed architecture](seed-architecture.md). It records independent accepted capabilities, not a
completed installed Capacity Provider or a newly assembled release lock. All issues remain open;
productive Work/model execution and accounting remain Task 10.

## Composition and admission boundaries

```mermaid
flowchart TB
  SDK[SDK .44 portable contracts and public TLS clients]
  Archive[Deployment: exact archive and component custody]
  Alias[Deployment: retained installed aliases]
  Policy[Deployment .133: complete effective policy and image-aware bounds]
  Boot[Deployment .132: actual QEMU process and boot observation]
  Join[Draft #1070: join retained policy to the actual finite launch]
  Profile[Pending: native advertised profile admission]
  Pool[Pending: Agent-owned virgin pool and dispatch]
  Seed[Pending: API live seed coordination and CLI integration]
  SDK --> Archive --> Alias --> Policy
  Alias --> Boot
  Policy --> Join
  Boot --> Join
  Join -.-> Profile -.-> Pool -.-> Seed
```

The archive/component/alias/policy stages verify real bytes and retained filesystem identities.
Boot observation binds actual process generation, command identity and selected boot inputs.
Neither stage alone establishes that an owned VM used the complete retained policy. The joined
launch candidate must pass fresh hosted positive verification before it can support native profile
admission. A profile then needs actual owner/worker integration; it cannot replace leases, live
authority, pool ownership or service readiness.

Every privileged operation remains behind Deployment's bounded service boundary. Cordis roots
compose separate manager, worker and guest processes; they do not cross process boundaries or
provide an OS sandbox. Agent retains kernel, handler/profile, pool and environment ownership.
API retains seed coordination and existing-team authority through its public control plane.
UI retains reusable mobile-first React/Cordis presentation, and Identity retains Keycloak identity.

## Accepted owner identities

These are exact independent owner candidates. Producer commits identify the frozen packaged bytes;
accepted PRs record their complete owner checks, public consumers and hosted evidence.

| Owner candidate | Producer source | Archive SHA256 | Accepted evidence |
| --- | --- | --- | --- |
| SDK .44 | `00be028b92998f8d7039a3906e784c6b8598e730` | `d95c54cf6081c7634498dfb4f3235d42d65b8664a5d62cc87c4dd4e85381f0f3` | [SDK #508](https://github.com/treeseed-ai/sdk/pull/508) |
| Deployment .133 | `7d2fdf605e6c8aabe6e75276300bbc331d7bd2d7` | `beb76d0896f4c0b856214b0429d3e959300454db20a139b940ab22d6a9a4ac0c` | [Deployment #1068](https://github.com/treeseed-ai/deployment/pull/1068) |
| Agent .35 | `4404149276af9b35cedf88aea0e67c8bcf982030` | `a4a8609e8d427337a0e1470fac3b397a591b741105f6f958a94ad2a2d228d341` | [Agent #562](https://github.com/treeseed-ai/agent/pull/562) |
| API .16 | `9fb1af1e52370120d561f897d804c16ba85db091` | `44b5e4d6dcb9bae08e089d84516eea268edaacecf0ff2f16f51e2cdbf45dede0` | [API #658](https://github.com/treeseed-ai/api/pull/658) |

Agent .35 still selects Deployment .127, while API .16 selects Deployment .130. They must not be presented
as an assembled closure using Deployment .133. Update consumers through exact public archives and
fresh owner/assembled verification before making that claim. UI .24, Identity .10 and Admin .13 are
accepted compatible owner candidates through [UI #108](https://github.com/treeseed-ai/ui/pull/108),
[Identity #61](https://github.com/treeseed-ai/identity/pull/61) and
[Admin #154](https://github.com/treeseed-ai/admin/pull/154). Their acceptance preserves React reuse,
mobile-to-widescreen behavior and Keycloak identity; it does not implement Agent UI or activation.

The frozen earlier assembled evidence remains immutable historical evidence. In particular,
Platform #817's SDK .39/Deployment .95/Agent .21 selection is not a current installed manager/worker/pool
proof. Do not repack, relabel or rewrite those artifacts or their acceptance expectations.

## What the current evidence proves

- Deployment .133 has complete template-policy comparison, private descriptor custody, exact installed
  alias checks, real QEMU boot observation and bounded root-image address-space interpretation.
  Both complete owner closures passed, including 102 foundation cases each. The new finite policy
  has not yet been joined to a running VM by an accepted owner candidate.
- Agent .35 has separate built manager/worker/guest programs and twenty native provider descriptions.
  Both 139-case owner acceptance runs included genuine worker/Kata readiness. Default manager/worker
  diagnostics remain unready. The frozen guest channel is readiness-only; run/cancel and productive
  handlers are not established by that result.
- API .16 includes API-owned native seed-journal semantics over Deployment's private installation
  records, with public default construction and isolated real Keycloak/browser verification.
  A journal is not the seed coordinator, team-management authority or resource reconciliation.
- SDK .44 has exact portable contracts and real TLS availability create/refresh/close transport.
  A transport or registration-status response is not approval, a live grant or manager orchestration.
  The seven global platform operation IDs remain unchanged.

## Agent provider catalogue

All twenty entries belong to the independent `@treeseed-cordis/agent` package. Their declared
metadata target is `agent`; each program's native root selects its required subset. The table
records accepted class declarations and archive modules, not a claim that every provider is
active or that pending enrollment/dispatch/pool behavior is qualified.

| Provider class | Typed capability | Declared archive module |
| --- | --- | --- |
| `ProviderEnrollmentPlugin` | `agent.provider.enrollment` | `dist/src/provider-enrollment.js` |
| `WorkerSandboxPlugin` | `agent.worker.sandbox` | `dist/src/worker.js` |
| `ProviderTokenPlugin` | `agent.provider.token` | `dist/src/provider-token.js` |
| `ProviderCredentialPlugin` | `agent.provider.credential` | `dist/src/provider-credentials.js` |
| `ProviderRegistrationPlugin` | `agent.provider.connection` | `dist/src/provider-connection.js` |
| `ProviderFileProofPlugin` | `agent.provider.proof` | `dist/src/provider-proof.js` |
| `GuestProfilePlugin` | `agent.guest.profile` | `dist/src/guest-providers.js` |
| `GuestContextPlugin` | `agent.guest.context` | `dist/src/guest-providers.js` |
| `GuestHandlerPlugin` | `agent.guest.handler` | `dist/src/guest-providers.js` |
| `GuestToolPlugin` | `agent.guest.tool` | `dist/src/guest-providers.js` |
| `GuestReportingPlugin` | `agent.guest.reporting` | `dist/src/guest-providers.js` |
| `GuestExecutionPlugin` | `agent.guest.execution` | `dist/src/guest-providers.js` |
| `AgentCapacityAssignmentFilePlugin` | `agent.capacity.assignment` | `dist/src/authority.js` |
| `AgentFileGrantPlugin` | `agent.authority` | `dist/src/authority.js` |
| `AgentHostPlugin` | `agent.host` | `dist/src/execution.js` |
| `AgentContextPlugin` | `agent.context` | `dist/src/providers.js` |
| `AgentEchoToolPlugin` | `agent.tool` | `dist/src/providers.js` |
| `AgentEchoHandlerPlugin` | `agent.handler` | `dist/src/providers.js` |
| `AgentReporterPlugin` | `agent.reporting` | `dist/src/providers.js` |
| `AgentExecutionPlugin` | `agent.execution` | `dist/src/providers.js` |

Deployment's custody/observation/attestation classes are invariants beneath its selected native
Kata provider; they are not another plugin registry. This wave adds public owner package
capabilities, not a new public CLI or HTTP endpoint. New seed/capacity commands and installed
manager/worker interfaces still require their owner integration and assembled tests.

## Draft native launch binding

[Deployment #1070](https://github.com/treeseed-ai/deployment/pull/1070) is a review candidate for
`KataLaunchAttestation`. Its frozen .134 producer is
`8c4e95714d32c1a40d13dcbe4a8a94266446432c`, archive SHA256
`34130ebddc71b24844b104b68be7efc6904441faff4c91ca1beece6ef0d15f19`.
The fixture-only diagnostic head is `ebbe8c8d178965ed6edf24db7dd6f3b368c310ee`;
all 176 packaged files/modes remain identical, with no repack. Fresh corrected-head hosted finite
launch, valid mismatched-policy denial and destruction invalidation remain required. The first
fixture stopped at invalid sandbox-ID admission; its corrected successor failed sandbox creation
before attestation. Bounded fixture diagnostics are investigating the runtime cause. Neither
failed run counts as finite-policy VM evidence.

Owner references: [effective policy](https://github.com/treeseed-ai/deployment/blob/0e88b49b8957772110bb26271dcd4e86a1f439e9/docs/runtime-policy-custody.md),
[installed aliases](https://github.com/treeseed-ai/deployment/blob/0e88b49b8957772110bb26271dcd4e86a1f439e9/docs/runtime-alias-custody.md),
[guest artifact boundary](https://github.com/treeseed-ai/deployment/blob/0e88b49b8957772110bb26271dcd4e86a1f439e9/docs/kata-guest-runtime.md),
and [candidate launch contract](https://github.com/treeseed-ai/deployment/blob/ebbe8c8d178965ed6edf24db7dd6f3b368c310ee/docs/kata-launch-binding.md).

## Remaining delivery gates

Native profile publication and installed named host grants/socket mounts remain required before
Agent can admit a qualified virgin pool. Then prove exclusive claims, background replenishment,
generation discard, setup/verification/egress, real runner dispatch/cancellation and verified
one-use destruction. Preserve manager lease fencing, live existing-team enrollment/heartbeat/
revocation, exact Keycloak authority and cross-team denial. Complete the API coordinator/resource
owners, CLI seed/capacity and project/profile selection, exact final assembly and qualified Agent
replacement transitions. General replacement expansion remains Task 4; productive Work/models and
accounting remain Task 10. Integration into cordis neither closes issues nor authorizes production
publication or cutover.
