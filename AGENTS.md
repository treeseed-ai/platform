# Platform workspace guidance

This is the public TreeSeed installer and integration workspace. Preserve independent package builds and route infrastructure changes through SDK reconciliation and `trsd`. Market and Market API are first-party portfolio projects governed through the same seed, reconciliation, and exact-ref custody model as the other TreeSeed repositories. Their hosted deployment remains fail-closed until the reviewed OpenTofu topology restores it.

## Efficient delivery is mandatory

Conserve human and AI capacity by optimizing for verified outcomes rather than repeated discussion or duplicated evidence. GitHub Issues are the planning and status authority, GitHub Actions are the verification authority, and agents must not post routine issue or pull-request comments. Keep the current decision-complete contract and evidence table in the Issue body; put implementation context in commits and the pull-request description; retain detailed logs as Actions artifacts. Read only the exact context needed, batch independent reads and checks, reuse immutable receipts, inspect failed jobs rather than rerunning successful work, and batch known defects into one replacement release candidate before repeating expensive activation. Stop at real authority boundaries instead of spending quota speculating around them.

Every delivery follows `Issue -> branch -> pull request -> Actions -> staging merge -> release/read-back -> Platform composition -> managed acceptance -> main/production`. Before branching, merging, or releasing, fetch and verify the exact protected-branch head. Do not create undocumented side channels for plans, progress, or acceptance.

Human approval is reserved exclusively for pull requests targeting `main` as the production promotion boundary. Staging pull requests, candidate publication, staging deployments, infrastructure plans, reconciliation, and acceptance proceed through authorized agents and required automated checks without human-only approval gates.

## Branch and deployment boundary

`main` is the only production branch and maps only to the `production` deployment environment. `staging` is the only development-integration branch and maps only to the `staging` deployment environment. Short-lived pull-request branches may validate without deploying, but they must never define another deployment environment. Do not create or use `development`, `preview`, `stable`, or any other GitHub deployment environment; preview deployments are prohibited. Release tags may promote an exact reviewed `staging` commit to `production` without creating another branch or environment. Artifact channel names must never become GitHub deployment environments.

## Project library

The Platform library is `treeseed-ai/platform-library`; its TreeDX binding is authoritative. Start with `trsd library show platform` and `trsd library status platform`. Discover with `paths`, `search`, `query`, or `context`, and read a known file with `trsd library read platform <path> --ref <exact-commit>`. Use exact commits for reproducible work and protected `main` or `staging` only for deliberate moving-head inspection.

Collections live at library repository root, never under `src/content`. Save knowledge through `trsd library workspace create platform`, then `workspace read`, `write --input <yaml-or-json>`, `diff`, and `submit`; complete governance through `trsd library reviews`. Never edit `.treeseed/data` directly, expose provider credentials, bypass review by pushing TreeDX refs, or interpret an empty response from an unhealthy binding as authoritative.
