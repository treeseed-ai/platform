# Platform workspace guidance

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
