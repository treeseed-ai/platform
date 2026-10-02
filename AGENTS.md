# Platform workspace guidance

## CRITICAL: complete automated test coverage

Every behavior, contract, state transition, failure path, and edge case must have automated unit, integration, and scene/guarantee-based acceptance coverage. This is mandatory for all projects, especially the capacity-provider and agent system. A behavior without all three layers is an unresolved delivery gap, not completed work.

- Unit tests must prove exact outputs, validation, invariants, and boundary conditions. Cover valid and invalid inputs, missing/empty/malformed values, authorization denial, stale or moved refs, and every named prohibited field.
- Integration tests must exercise the real owning components and their public boundaries: handlers, provider/kernel execution, APIs, persistence, tools, and downstream consumers. Mocks, string assertions, compilation, or call-order checks alone are not integration proof.
- Coded scenes and guarantees must prove production-shaped end-to-end outcomes: exact governed artifacts and read-back, independent verification, actual usage, exactly-once settlement, and durable teardown. Use the project's existing native acceptance harness and respect package ownership; do not put TreeSeed-specific policy into product-neutral packages.
- Cover duplicate and concurrent execution, idempotency, partial failure, interruption, retry, resume, cancellation, expiry, provider/tool/subprocess errors, unsafe commands, and cleanup without residue. Preserve failed observations; do not fabricate dispositions, usage, citations, receipts, or passing replays.
- For every defect, first add a focused regression that reproduces the failure, then add or strengthen the corresponding integration and scene/guarantee cases. Fix the earliest owning contract. Retain previously covered behavior and all historical failed evidence.
- Never weaken assertions, remove negative cases, narrow acceptance criteria, disable type checks, extend deadlines, increase allowances, or relabel failures as passes to get green results. An unexpected agent timeout is a fatal architecture defect: agents must check authoritative remaining time frequently, reserve verification/closeout time, and produce authorized continuation proposals for unfinished work before the original deadline.
- Delivery requires passing evidence at all three layers on the exact candidate. Missing environments, credentials, skipped tests, or blocked layers remain explicitly unproven. Component passes, suite totals, line coverage, and process completion never substitute for full semantic acceptance.
- Before EVERY acceptance run (scene or guarantee), run ALL automated unit and integration tests for every participating project on the exact candidate. Focused regressions are additional checks, not substitutes for the complete suites. Failed, skipped, missing, empty, or inconclusive prerequisite coverage blocks acceptance; never launch a live campaign first and discover prerequisite failures afterward. Run the complete suites once per participating project per acceptance invocation, before any scene begins; do not reuse a previous invocation's passing receipt or omit tests to save time. Preserve exact command, candidate, run, and result evidence in the existing Issue and Actions artifacts.
- Keep the behavior-to-unit/integration/scene mapping and exact command, commit, run, and artifact evidence in the existing Issue body and Actions artifacts. Reproduce failures with cheap focused tests before another expensive activation or full campaign; batch known fixes, inspect failed jobs, and reuse only unchanged immutable evidence. No duplicate campaigns or new coverage side channels.

## Agent configuration and handler ownership

When this project defines or consumes agents, agent identity, task instructions, prompts, capabilities, permissions, parameters, and activity profiles must be governed YAML configuration. Adding or renaming an agent using existing handlers must not require provider, guest, kernel, or scheduler code changes. Do not hardcode named-role configuration in shared runtime code; shared rules must apply to any configured agent.

Task-specific executable code belongs in the configured handler. Reuse existing class-based handlers and exact profile bindings; new coded functionality may require a pinned handler, but not a parallel dispatch path or duplicated policy. Test arbitrary YAML-defined agents, renamed identities, handler selection, changed prompts/parameters, denied permissions, and unknown/duplicate handlers through unit, real integration, and coded acceptance cases.

This is the public TreeSeed installer and integration workspace. Preserve independent package builds and route infrastructure changes through SDK reconciliation and `trsd`. Market and Market API are first-party portfolio projects governed through the same seed, reconciliation, and exact-ref custody model as the other TreeSeed repositories. Their hosted deployment remains fail-closed until the reviewed OpenTofu topology restores it.

## CRITICAL: simplicity and non-duplication are mandatory

Always choose the simplest complete solution. Avoid new models, schemas, storage, services, abstractions, adapters, artifacts, workflows, configuration fields, and compatibility paths unless they are strictly necessary to produce a verified requirement. One fact must have one authority, one representation, and one implementation path. Reuse existing contracts, Git state, TreeDX content, receipts, commands, and runtime boundaries instead of copying or translating them. Do not encode the same policy in profiles, prompts, handlers, assignments, providers, and API services. Delete superseded paths as part of the replacement; do not preserve speculative flexibility or backward compatibility. Before adding any concept, identify why the current simplest mechanism cannot satisfy the requirement. If that necessity cannot be demonstrated, do not add it.

Optimize first for the smallest end-to-end path that works and can be verified through the supported CLI. Prefer ordinary commits, branches, exact refs, typed assignment inputs/results, and small class-based handlers over new artifact taxonomies or orchestration layers. Do not create work whose only purpose is to reconcile duplication introduced by the design itself. Complexity and duplicated effort are critical defects, not acceptable tradeoffs.

## First-party repository visibility and licensing

All TreeSeed repositories are public, including Team Library and Market API. First-party repositories use Apache-2.0 except API and Market API, which use AGPLv3. Preserve their exact license notices. This policy does not relicense third-party dependencies or make customer repositories public. The TreeSeed seed must declare public repository visibility; license choice is independent of visibility.

## Efficient delivery is mandatory

Conserve human and AI capacity by optimizing for verified outcomes rather than repeated discussion or duplicated evidence. GitHub Issues are the planning and status authority, GitHub Actions are the verification authority, and agents must not post routine issue or pull-request comments. Keep the current decision-complete contract and evidence table in the Issue body; put implementation context in commits and the pull-request description; retain detailed logs as Actions artifacts. Read only the exact context needed, batch independent reads and checks, reuse immutable receipts, inspect failed jobs rather than rerunning successful work, and batch known defects into one replacement release candidate before repeating expensive activation. Stop at real authority boundaries instead of spending quota speculating around them.

Every delivery follows `Issue -> branch -> pull request -> Actions -> staging merge -> release/read-back -> Platform composition -> managed acceptance -> main/production`. Before branching, merging, or releasing, fetch and verify the exact protected-branch head. Do not create undocumented side channels for plans, progress, or acceptance.

During pre-launch integration, no human approval or review is required for pull requests (including `main`), releases, deployments, infrastructure plans, reconciliation, or acceptance. Authorized agents may merge after required automated checks pass; retain pull requests, exact-ref custody, and all unrelated protections. This temporary policy is tracked in Platform #489. Before public production launch, establish a separate reviewer identity and explicitly restore required human review for PRs to `main`; verify the restored settings before promoting a public production release. Do not reintroduce human-only gates for staging or non-production work.

## TypeScript source standard

Use TypeScript for handwritten application, infrastructure, CLI, tooling, and test code across the integrated projects. JavaScript is generated build output, not a parallel source implementation. Keep strict type-checking enabled; do not use unchecked JavaScript or disable TypeScript checks to bypass this standard. Convert handwritten JavaScript when extending that implementation, and update its build and test entrypoints together. Keep configuration declarative. This does not authorize implementation in Platform: functional code still belongs in its owning package.

## Development selection lifetime

Local development selections persist until explicitly switched or stopped through `trsd`. Do not add session expiration, wall-clock watchdog shutdowns, or time-based fallback to released code. Preserve process ownership, readiness checks, explicit stop/drain behavior, and normal credential/token expiration; those are separate from development selection lifetime.

## Branch and deployment boundary

`main` is the only production branch and maps only to the `production` deployment environment. `staging` is the only development-integration branch and maps only to the `staging` deployment environment. Short-lived pull-request branches may validate without deploying, but they must never define another deployment environment. Do not create or use `development`, `preview`, `stable`, or any other GitHub deployment environment; preview deployments are prohibited. Release tags may promote an exact reviewed `staging` commit to `production` without creating another branch or environment. Artifact channel names must never become GitHub deployment environments.

## Project library

The Platform library is `treeseed-ai/platform-library`; its TreeDX binding is authoritative. Start with `trsd library show platform` and `trsd library status platform`. Discover with `paths`, `search`, `query`, or `context`, and read a known file with `trsd library read platform <path> --ref <exact-commit>`. Use exact commits for reproducible work and protected `main` or `staging` only for deliberate moving-head inspection.

Collections live at library repository root, never under `src/content`. Save knowledge through `trsd library workspace create platform`, then `workspace read`, `write --input <yaml-or-json>`, `diff`, and `submit`; complete governance through `trsd library reviews`. Never edit `.treeseed/data` directly, expose provider credentials, bypass review by pushing TreeDX refs, or interpret an empty response from an unhealthy binding as authoritative.
