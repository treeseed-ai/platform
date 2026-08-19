# Agent Definition and Capacity Compatibility Audit

## Scope and status

This audit is limited to SDK, CLI, API, and Agent so the first development loop can iterate quickly. SDK is the first live fixture; it does not receive a different lifecycle. The same definition, class, grant, provider, assignment, worktree, review, staging, and main contracts apply to all four repositories.

State: `in_progress`. Configuration inspection, the first live SDK failure, packaged-definition remediation, and package-owned static regression gates are complete on draft candidate branches. Hosted review, TreeDX deployment, admission integration, and clean-repeat acceptance remain open.

## Compatibility model

An agent definition is runnable only when all of the following agree at one immutable generation:

1. The repository-backed definition passes the SDK schema and authority compiler.
2. Every required artifact has model-level read/write/link/validate/commit authority.
3. The branch policy can actually provide the TreeDX or source workspace required by the exposed tools.
4. The Agent provider tool catalog exposes every tool required by the profile and omits every unauthorized tool.
5. The project agent class freezes the exact definition ref and does not widen profile capabilities.
6. An active grant and allocation contain every class/profile/runtime capability.
7. The provider offer and selected lane advertise the same capabilities and execution mode.
8. API admission issues bounded repository/TreeDX handles with matching paths, operations, base refs, and expiry.
9. CLI plan/apply and diagnosis report the same effective definition, omissions, and authority as the API and provider.
10. A baseline run, clean repeat, and interruption/resume all create the required durable artifacts, settle, and leave zero residue.

Schema validity alone is not compatibility evidence.

## Inventory

| Surface | SDK | CLI | API | Agent |
| --- | ---: | ---: | ---: | ---: |
| Packaged definitions inspected | 8 | 8 | 8 | 8 |
| Live project agent classes | 1 | 0 | 0 | 0 |
| Live enabled agents | 1 (`engineer`) | 0 | 0 | 0 |
| Packaged definitions passing the compatibility evaluator | 8 | 8 | 8 | 8 |
| Live definition accepted by a clean assignment run | no | no | no | no |

The 32 packaged definitions are eight shared frontmatter generations—architect, engineer, releaser, reporter, researcher, reviewer, technical writer, and tester—copied into four package documentation trees. For each role, the frontmatter policy is identical across the four packages; only the project-specific body text differs. The corrected candidate scan reports 32 passing definitions and zero findings. This is shared policy, not four independent designs.

## Findings

### P0 — API, CLI, and Agent have no live agent classes

The local authoritative API returns zero project agent classes for API, CLI, and Agent. Those repositories cannot currently enter the same planning/acting lifecycle used by the SDK fixture. Packaged documentation files do not substitute for a TreeDX-backed class with an exact immutable ref.

Required correction: deploy the reviewed common engineering definition through TreeDX to each project, reconcile an exact-ref class, and prove capability/grant/provider parity before scheduling work.

### P0 — the first SDK run proved schema-valid but unrunnable authority

Workday `repo-lifecycle-001-run-v3` froze SDK definition `57bb6f507a9643f7d3ca7650a31224289f489538`. Planning assignment `assignment_Yz_M2f32k8tWNyrHCU10d5pM4YJnH9fD` wrote its mandatory assignment plan, terminal status, and summary, but returned without the required `planning_note`.

The frozen definition declared `planningIntent.artifactKind: planning_note` while its planning profile had empty tools and no content permissions. The authority compiler requested the normal content tools, and the Agent tool catalog correctly omitted them because model-level content access was absent. The Codex provider therefore exposed only operational/discussion tools. No source file changed. Cleanup still reported an active demand/workspace and stale authorities, so the run is not accepted evidence.

This is the exact failure mode the compatibility gate must reject before assignment admission.

### P1 — the SDK validator did not prove deployability — source correction implemented

`validateAgentDefinitionModel` and `compileAgentAuthoritySnapshot` accepted the broken SDK definition. Current validation checks shape, supported identifiers, branch field combinations, and authority widening, but it does not prove that:

- a required artifact kind has a writable compatible content model;
- effective tools survive the Agent catalog's handle, workspace, content-access, and commit requirements;
- branch policy can supply the workspace required by those tools;
- output/closeout requirements are satisfiable by the resulting catalog; or
- class, grant, provider offer, lane, and handle capabilities form a closed set.

Source correction: SDK candidate `2de71415477d7e19c332aa8062fe0f587d709651` adds a portable profile evaluator with stable diagnostics for effective content authority, required artifacts, branch/write conflicts, bounded source tools, verification, path scopes, and provider capability availability. The SDK validator invokes it for every enabled profile and tests the exact stale-definition classes of failure. Full class/grant/offer/lane/handle closure and API/CLI/Agent runtime consumption remain open.

### P1 — 28 packaged definitions contained a shared branch/authority ambiguity — source correction implemented

All 32 packaged definitions pass the current schema and authority compiler. The reporter definition in each package has no estimating/reviewing profile and passes the additional static check. The other 28 definitions each have two suspect profiles—estimating and reviewing—for 56 findings total:

- the declared branch is `read-only`;
- the effective bounded permissions retain writable `note` and `question` operations; and
- the profiles declare durable estimate/review outputs.

If `read-only` denies a writable TreeDX assignment workspace, the catalog omits the write/commit tools and these profiles fail in the same way as the SDK planning run. If source-read-only and content-write are intended to coexist, that distinction is not represented explicitly enough for API admission, SDK validation, or operator diagnosis.

Source correction: estimating and reviewing now use the explicit governed `main-planning-content` branch with content commit authority. Source-changing roles use bounded `assignment-feature` profiles with required verify/checkpoint tools and explicit allowed/forbidden paths. The common scan moved from 56 findings to zero; package-owned tests in SDK, CLI, API, and Agent prevent recurrence.

## Candidate implementation evidence

| Repository | Exact base | Exact candidate | Pull request | Local evidence |
| --- | --- | --- | --- | --- |
| SDK | `000a4a058e97ace3cc217cbfdea1a1ec096b8e93` | `2de71415477d7e19c332aa8062fe0f587d709651` | [#4](https://github.com/treeseed-ai/sdk/pull/4) | 30 agent-capacity files/147 tests; focused 9/9; build and architecture pass |
| CLI | `49d1c225285ce72b0ba5a6b1e43cec23add45309` | `95cd2ef7e1aa2b093218f3269262bde77f243740` | [#6](https://github.com/treeseed-ai/cli/pull/6) | full clean install; 8/8 definition test; installable single-SDK closure |
| API | `b18379fe1521339f71dbf85cf519eed95fe556c2` | `0ebccc6653e50176d01ec226f11ae8e033762c23` | [#1](https://github.com/treeseed-ai/api/pull/1) | full clean install; 8/8 definition test |
| Agent | `6e1a7345e6ec1c75d8020ce4c08c68bea7ad99e7` | `44525fe2dc8bc258cb563cbbed870bc7c2739b01` | [#2](https://github.com/treeseed-ai/agent/pull/2) | full clean install; 8/8 definition test |

The first SDK hosted head failed only the file-architecture limit and an external R2 publication attempt on feature push. The corrected head moves the evaluator into a compatibility subdomain and restricts push publication to `main`/`staging`; pull-request validation remains credential-free. Fresh exact-head hosted checks and independent reviews are required before any staging merge.

### P1 — capability authority is currently widened across layers

The corrected SDK profile declares acting capabilities `engineering`, `repo_read`, `repo_write`, `repository_work`, and `verification`; reconciliation adds `agent-execution` and `agent_mode_run` to the class. Earlier admission required expanding the active grant after the class was already reconciled. A class must not become selectable by acquiring capabilities absent from the frozen definition or active grant without an explicit compatibility decision.

Required correction: define capability composition rules (`profile required` + `runtime required`) in the SDK, freeze the resulting digest into the class, and require exact subset checks against grant, allocation, offer, lane, and live availability.

### P1 — canonical source and generated copies are not attestable

The four package trees contain identical role frontmatter, the engineering template contains a newer variant, and live project definitions reside in separate TreeDX content repositories. No current portfolio attestation ties template generation, packaged copy, TreeDX commit, project class, and provider compatibility result together.

Required correction: produce one deterministic definition bundle and compatibility attestation per project. Package documentation may be a generated consumer, but TreeDX exact refs and project classes remain runtime authority. Drift must fail diagnosis rather than silently selecting one copy.

### P2 — local authoring still has a hosted-service coupling

Local simulation authoring works through the local API and TreeDX. Production-mode authoring attempted to require `TREESEED_GITHUB_TOKEN`, even though GitHub is not required to validate or locally integrate a TreeDX definition. Local development must remain fully functional with Market and GitHub disabled.

Required correction: separate local TreeDX authoring/integration from optional remote publication. GitHub publication becomes an explicit provider capability and never a hidden authoring prerequisite.

### P2 — terminal lease races are noisy and underdiagnosed

After the SDK assignment returned, the provider logged a lease-renew rejection while the authoritative assignment was already terminal. This did not cause the missing-tool failure, but the provider should classify terminal-state renewal rejection as an expected stop condition and persist a concise lifecycle receipt rather than a generic error.

## Corrected SDK candidate

A governed local TreeDX simulation updated SDK `engineer` from base `57bb6f507a9643f7d3ca7650a31224289f489538` to exact commit `0538364ebf8f1d9d0b49733b5edd720b12f42ff6`. The change adds explicit planning content authority for read-only objective/decision/knowledge and writable note/question operations, with content commit allowed. It preserves source mutation denial during planning and the common staging-target acting policy.

The SDK validator and authority compiler now report no diagnostics for this candidate. The planning authority includes content describe/query/read/create/update/link/validate/commit plus operational/discussion tools; acting includes repository read/search, changed paths, verify, and checkpoint. This is candidate evidence only until a fresh immutable workday completes and cleanup is verified.

## Implementation sequence

1. **Implemented on candidate branch** — add the portable compatibility evaluator and failing fixtures in SDK, including the exact stale-authority failure class.
2. Make API admission call the evaluator before freezing a class or synthesizing an assignment.
3. Make CLI `agent-author`, class sync, workday plan, and diagnose display the evaluator result and fail before mutation on incompatibility.
4. Make Agent consume the frozen compatibility projection and add provider tests for exact exposed/omitted tools, terminal renewal, and restart/resume.
5. **Implemented for packaged source** — resolve the read-only source versus writable content policy and update the four scoped package copies consistently.
6. **In progress** — obtain hosted review, merge/read back exact definitions to SDK, CLI, API, and Agent, then deploy them through TreeDX and reconcile classes/grants without widening.
7. Run SDK baseline, clean repeat, and interruption/resume. Then run one bounded planning/acting cycle in CLI, API, and Agent using the same process.
8. Only after those four pass, expand the audit and deployment to the remaining repositories.

## Acceptance evidence

- deterministic bundle and compatibility-attestation digest;
- exact TreeDX definition ref and source digest;
- class generation and capability digest;
- grant/allocation/provider/lane subset proof;
- expected exposed and omitted tool catalog;
- required-artifact satisfiability proof;
- exact repository/content handle scope and expiry;
- baseline, clean-repeat, interruption/resume receipts;
- plan/status/checkpoint/summary and PR/staging/main read-back; and
- settlement with zero active leases, reservations, demands, workspaces, worktrees, unpublished branches, or stale authorities.
