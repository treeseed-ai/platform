# SDK-First Standards, GitHub, and Cluster Cutover Ledger

## Operating contract

This tracked ledger is the canonical implementation and progress record for the SDK-first cutover. It integrates the independent-development standard, GitHub work-provider architecture, Platform development migration, and collapsed host/guest cluster profile.

Update this file only when a gate changes state, evidence is accepted or invalidated, a human checkpoint is issued or resolved, or the next executable action changes. `CONTINUE.md` is the ignored, concise session handoff. A gate is `verified` only after exact authoritative read-back and residue checks.

Allowed states are `queued`, `in_progress`, `waiting_human`, `blocked`, `verified`, and `superseded`.

Hosted deployment, unscoped `trsd release`, and production promotion remain fail-closed. Platform must never check out, provision, or deploy Market or Market API. Content repositories remain TreeDX/R2 bindings and are not Platform software workset checkouts.

## Current checkpoint

- Updated: 2026-08-19
- Active gate: Gate 0 — truthful Platform and SDK baseline
- State: `in_progress`
- Active repositories: SDK, CLI, API, and Agent, proving one repository-neutral definition/provider lifecycle before the next project source assignment
- Completed bootstrap repositories: `treeseed-ai/cli`, `treeseed-ai/platform`, and the SDK source canary
- Next action: obtain `H-006` approval for the local provider membership-credential rotation, rotate and read back the provider connection without exposing credentials, then schedule a fresh immutable SDK baseline/clean-repeat simulation against the reconciled eight-class generation. Keep SDK main and npm publication blocked.
- Pending human checkpoints: `H-001` Ubuntu host discovery is non-blocking for guest-side work. `H-006` provider credential rotation blocks the fresh live SDK simulation. `H-004` and `H-005` are verified.

### H-006 — local capacity-provider membership credential rotation

- State: `waiting_human`
- Why human authority is required: the cutover contract reserves initial credential provisioning and rotation for an accountable human checkpoint; rotating the approved local provider membership invalidates the prior credential and changes trusted execution authority
- Surface: the Mint guest local API at `http://127.0.0.1:3000`, approved membership `771d896e-6f0e-4f7a-94d5-d475aa83c364`, and local provider `provider_XqCG5P_XN7crGeiWYpU4XXfog2bonlZs`
- Requested action: approve or decline the agent performing the bounded local rotation through the provider/team rotation API. No plaintext secret, token, private key, session cookie, or command output is requested in chat.
- Expected safe result: the API creates a new active membership credential, the provider completes its proof-bound credential exchange using its existing local private-key custody, the prior credential becomes unusable, availability returns healthy, and no credential value appears in logs, chat, Git, the SDK/CLI/API/Agent worktrees, or the VM shell history
- Success criteria: provider/team credential read-back identifies the new active credential generation; a negative request with the prior credential is rejected; provider availability and the exact capability set read back healthy; the four project class generations remain unchanged
- Failure criteria: rotation cannot be reconciled by the provider, any secret is emitted outside trusted custody, the old credential remains accepted, availability does not recover, or project/grant authority changes
- Agent verification: inspect redacted rotation receipts, credential status, provider identity fingerprint, availability, grant/class generations, and zero-secret/residue checks before scheduling the next SDK run
- Independent work while waiting: standards-contract implementation planning, local package tests, host-discovery preparation, and documentation may continue; no new live SDK assignment will be scheduled

### H-004 — API contributor-grant affirmation

- State: `verified`
- Why human authority is required: the API repository requires the contributor—not an agent—to affirm the rights statement in `CONTRIBUTING.md`; the hosted `Contributor License Grant` check fails closed until the human checks the template-provided affirmation
- Surface: GitHub pull request [treeseed-ai/api#1](https://github.com/treeseed-ai/api/pull/1)
- UI steps: open the pull request, choose **Edit** on the description, read the visible **Contribution grant (human action required)** section and linked `CONTRIBUTING.md`, check the existing box only if the statement is true, and save. No text needs to be remembered, copied, or pasted.

- Expected safe result: the pull-request description visibly contains the checked line and the `Contributor License Grant / affirmation` check reruns successfully; no credential or private information is requested
- Failure criteria: do not check the box if the statement is not true or acceptable; report that decision and API PR #1 will remain blocked
- Agent verification: re-read the API PR body and exact-head check rollup, require a successful affirmation check, and record its run receipt before merge
- Independent work while waiting: SDK/CLI/API/Agent source verification, independent review, ledger publication, and non-API staging preparation may continue
- Verification receipt: the human checked the template-provided affirmation; hosted run [`32202839257`](https://github.com/treeseed-ai/api/actions/runs/32202839257) passed at API head `063f323aafd5eed03f873edc34c71fd0a36115f6`

### H-005 — API staging-content correction contributor affirmation

- State: `verified`
- Why human authority is required: API repository policy requires the contributor—not an agent—to affirm the rights statement independently on each pull request
- Surface: GitHub pull request [treeseed-ai/api#2](https://github.com/treeseed-ai/api/pull/2)
- UI steps: open the pull request, choose **Edit** on the description, read the visible **Contribution grant (human action required)** section and linked `CONTRIBUTING.md`, check the existing box only if the statement is true, and save; do not paste or invent any text
- Expected safe result: the description retains the exact unchecked template language with only its checkbox changed to checked, and `Contributor License Grant / affirmation` reruns successfully
- Redaction: do not paste credentials, session cookies, tokens, or private account data into the PR or chat
- Success criteria: the affirmation check passes at the exact current API correction head and the PR body otherwise remains unchanged
- Failure criteria: if the grant is not true or acceptable, leave it unchecked; API #2 remains blocked and no merge occurs
- Agent verification: re-read the provider PR body and exact-head status rollup and record the successful run receipt before merge
- Independent work while waiting: SDK/CLI/API/Agent package and Content checks, independent review, ledger publication, and local residue cleanup continue
- Verification receipt: the human checked the template-provided affirmation without changing the required text; hosted run [`32208434130`](https://github.com/treeseed-ai/api/actions/runs/32208434130) passed at exact API correction head `ae2fe26223520185cff641d5ac77faf323248277`

### SDK-COMPAT-001 — superseded manual-checkout checkpoint

- State: `superseded`
- Authority scope: bounded SDK-only diagnostic and repair; no consumer repository writes, npm publication, dist-tag mutation, hosted deployment, or global release
- Exact source base: SDK main `ee9e9440596de14635bad1eb4b54ad14019ca574`
- Immutable comparison baseline: published `@treeseed/sdk@0.12.62`
- Standing-workset rule: `packages/sdk` remains detached/read-only at `f843c3cb11853db737d28ecc6bcc3d5df5e183e9`
- Acceptance target: classify every added/removed export, restore every declared packed target, prove the intended public surface and semantic bump, run clean package and zero-commit API consumer acceptance, then submit an independently reviewable SDK PR
- Current evidence: a separate SDK-main diagnostic clone performed only `npm ci` and a diagnostic pack; no SDK source edit or commit occurred. The checkout was moved to the desktop Trash when the user rejected repository-specific process.
- Supersession reason: a manual SDK checkout bypasses proposal, decision, capacity, assignment, and workset custody and therefore cannot become accepted implementation evidence

### REPO-LIFECYCLE-001 — active repository-neutral lifecycle repair

- State: `in_progress`
- Scope: one local operator/control-plane path for every software repository; SDK is only the first acceptance subject
- Exact operator source target: CLI main `f8d3a9f14356cf0f3ec35cac83871e0725879382`
- Required lifecycle: proposal → decision → accepted capacity plan → assignment/lease → assignment-writable workset → plan/status/commits/summary → PR → staging → main → authoritative read-back/settlement
- Durable governance: proposal `2aacee09-6868-45ee-9916-b49e07820f78`; accepted decision `e83c29a4-8541-4649-9526-285ec7e8ae01`; accepted structured estimate `repo-lifecycle-001-estimate`; execution input `repo-lifecycle-001-execution-v2`; scheduled capacity plan `repo-lifecycle-001-capacity-plan-v3`; allocation set `seed-allocation-4f931c26d45d9a413f6df5ca`
- Repository-neutral agent-class policy: SDK, CLI, API, and Agent each own the same eight class slugs—`architecture`, `engineering`, `release`, `reporting`, `research`, `review`, `technical-writing`, and `testing`—while every class projects only that project's own immutable definition. The common engineering execution contract supports planning and acting and requires `engineering`, `repo_read`, `repo_write`, `repository_work`, and `verification`; repository work requires a commit and summary.
- Superseded workdays: `repo-lifecycle-001-run` targeted an expired legacy provider; `repo-lifecycle-001-run-v2` froze an incomplete agent-class generation and was cancelled after two bounded failed attempts. Attempt `assignment_D1DJW0lYjPzeLS2UbeJBe3r57Ips4HU5` returned because the local API proxy omitted its TreeDX JWT configuration. Supported cancellation/requeue created `assignment_ax9SiiBiVwNT4A23PLyS9fQQfm65tGjI`, which failed truthfully because its frozen class referenced an `engineer` definition that was not enabled at that immutable ref.
- Reconciled provider authority: local provider `provider_XqCG5P_XN7crGeiWYpU4XXfog2bonlZs`; approved membership `771d896e-6f0e-4f7a-94d5-d475aa83c364`; SDK grant `01e30b27-212f-4f14-8289-c1848910ab9b` is active with `agent-execution`, `agent_mode_run`, engineering, planning/acting, repository read/write, repository work, and verification. Provider availability advertises the same common capability set on `codex-sub-operation`. The API now runs with the local TreeDX JWT secret/issuer/audience explicitly configured; no GitHub or hosted service is required for assignment execution.
- Repository-neutral agent contract: SDK TreeDX staging commit `57bb6f507a9643f7d3ca7650a31224289f489538` was schema-valid but not runnable: its required `planning_note` had no model-level content authority. The reviewed definitions from each repository's exact final staging head were authored through the same local TreeDX simulation operation, never copied between projects and never published externally. Exact local authoring commits are SDK `87bd2127490574c79672e955f73fcbc78c335589`, CLI `fe83bf96f10f1cbcea0075b8ee39d7e3d2dbf34d`, API `c1dd5a4595b963cef6369cf2712f0a255a0b3b86`, and Agent `0e7c677cb7dce2643dbee2928de62e38f90a4e4d`. Each project reads back eight active project-owned classes at its exact immutable commit. A second identical authoring execution returned the same commit and zero changed paths for all four projects with `executionMode: simulation` and `upstreamMutationPolicy: denied`. Live assignment acceptance remains pending.
- Superseded API-owned acceptance workday: `repo-lifecycle-001-run-v3`; preflight froze definition `57bb6f50…` and admitted planning assignment `assignment_Yz_M2f32k8tWNyrHCU10d5pM4YJnH9fD`. The assignment wrote its mandatory plan, terminal status, and summary, then returned because content create/link/validate/commit were omitted from the provider catalog and the required `planning_note` was impossible. No source file changed. Authoritative cleanup now reports zero active demands, workspaces, worktrees, leases, reservations, stale authorities, unpublished branches, and unpublished commits. This terminal degraded run cannot be retried as compatibility evidence because its immutable definition is obsolete.
- Agent-definition audit: `docs/agent-definition-capacity-compatibility-audit.md` is the bounded SDK/CLI/API/Agent audit. Its original scan found 56 read-only-branch/content-write conflicts across 28 of 32 definitions. The accepted SDK/CLI/API/Agent heads report 32 passing definitions and zero findings. SDK PR [#4](https://github.com/treeseed-ai/sdk/pull/4) adds an internal compatibility evaluator and package-owned regression fixtures without changing the existing public validator contract. CLI PR [#6](https://github.com/treeseed-ai/cli/pull/6), API PR [#1](https://github.com/treeseed-ai/api/pull/1), and Agent PR [#2](https://github.com/treeseed-ai/agent/pull/2) adopt the accepted SDK staging artifact and its internal verifier. All four carry the common PR template and corrected exact-SHA validator; API alone carries its repository-policy contributor grant. All four PRs are merged and read back on staging; API's post-merge artifact check remains the only open source-integration receipt.
- Generic lifecycle defects found during bootstrap: administrative proposal approval can bypass proposal content-readiness; an administratively accepted decision does not initialize decision-planning state; CLI has no mutations for planning requests, structured estimates, or execution inputs; a manually created workday envelope can be active without governed grant provenance; `workday-status` inspects capacity envelopes while `workday` inspects API-owned workday runs; returned single-attempt assignments are reported `alreadyLeasable` even when the provider cannot reacquire them; provider scheduling initially considered only one lane; local API TreeDX admission and proxy token defaults diverged; agent-class reconciliation can add capabilities that the active grant does not contain; local authoring incorrectly routes production publication through GitHub; schema/authority compilation does not prove provider-catalog tool or required-artifact satisfiability; and terminal assignment lease-renew rejection is logged as a generic provider error.
- Acceptance target: no repository-specific clone, branch, merge, or publication orchestration; repository differences are declarative manifest policy only
- Next executable action: resolve `H-006`, rotate and read back the local provider credential under trusted custody, then schedule a fresh immutable SDK run against SDK TreeDX commit `87bd2127490574c79672e955f73fcbc78c335589`

### AGENT-DEFINITION-001 — common SDK/CLI/API/Agent definition cutover

- State: `verified`
- Common branch: `codex/agent-definition-compatibility`, based independently on each repository's exact staging head
- Exact bases: SDK `000a4a058e97ace3cc217cbfdea1a1ec096b8e93`; CLI `49d1c225285ce72b0ba5a6b1e43cec23add45309`; API `b18379fe1521339f71dbf85cf519eed95fe556c2`; Agent `6e1a7345e6ec1c75d8020ce4c08c68bea7ad99e7`
- Exact accepted heads: SDK definition `5eff7d1bf728c1eb40e50073b164a7dd99721d8f`, final staging `cf9ae76edc181fe80cacf4fe1aa9c582e08a22d5`; CLI definition `2e9610a60cfddc7a7bea679487530667b10a8407`, final staging `125cfa22fcf50f447c6fe9dda8ebb3b218276b48`; API definition `f952c17e103d888974b03cd58504542c4c946241`, final staging `f5132e5a516629b97b263aa939e28fb8e6625c5d`; Agent definition `b6f07113536d8420f0ac6c0e1c445dc38947062c`, final staging `4a35bcc7c99482a682041b890e48426d7f939ca6`
- Pull requests: definition PRs SDK [#4](https://github.com/treeseed-ai/sdk/pull/4), CLI [#6](https://github.com/treeseed-ai/cli/pull/6), API [#1](https://github.com/treeseed-ai/api/pull/1), and Agent [#2](https://github.com/treeseed-ai/agent/pull/2), followed by common staging-content correction PRs SDK [#5](https://github.com/treeseed-ai/sdk/pull/5), CLI [#7](https://github.com/treeseed-ai/cli/pull/7), API [#2](https://github.com/treeseed-ai/api/pull/2), and Agent [#3](https://github.com/treeseed-ai/agent/pull/3), all merged to `staging` after exact-head checks, completed durable PR records, and independent review
- Static acceptance: the original audit reports 32 definitions and zero compatibility diagnostics. Corrected SDK tests pass 34 agent-capacity/workflow files and 170 tests, plus `build:dist` and a negative public-export read-back. CLI, API, and Agent each passed a clean install and package-owned compatibility evaluation against accepted SDK staging `92a66135…`. Earlier results against obsolete SDK `2de71415…` remain diagnostic only. CLI's direct-dependency npm override remains required to prevent mixed Git SDK instances.
- Hosted correction: the first SDK head failed architecture because the new evaluator created an eleventh direct validation file, and a feature-branch Content push attempted external R2 publication. Commit `2de71415…` moves the evaluator under functional ownership and limits content publication pushes to `main`/`staging`; PR validation remains local and credential-free. The next exact-head run exposed one pre-existing read-only question-answerer fixture that relied on implicit mutation presets; SDK commit `2cb803ab…` declares the four content mutation tools denied and passes the focused contract. Agent commit `0f619e0b…` likewise moves its regression test into a functional subdomain after the first head exceeded the ten-file test-root limit. The final heads add the PR submission contract without changing shipped package source; all exact-head hosted checks passed before merge.
- PR submission contract: `.github/PULL_REQUEST_TEMPLATE.md` collects outcome; work item, proposal/decision, assignment/checkpoint, actor, accountable human, agent/provider, exact base/head; contributor mode; plan/status; changes/commits; verification; risk/rollback; completion summary; and readiness checks. Validation compares recorded full SHAs to the provider base/head, requires exactly one contributor mode, and requires all readiness boxes only when the PR leaves draft. It executes only base-owned workflow code, never checks out PR code, and pins its action. SDK, CLI, API, and Agent staging now carry the byte-identical corrected workflow; API retains its exact human contributor grant, which passed under `H-004`. The validator remains advisory until each trusted-base workflow is canaried and a human-governed policy checkpoint makes the status required.
- SDK review correction: independently reviewed head `429c4473877fc278022b0abfac317028e121d451` had green, byte-identical push/PR artifacts but was not merge-ready. It accidentally made the compatibility evaluator public and behavior-changing through existing validators, checked only nonempty path arrays, ignored provider-override capabilities, accepted stale PR-body SHAs, used a mutable workflow action ref, and had no enforced branch policy. Corrected head `5eff7d1bf728c1eb40e50073b164a7dd99721d8f` keeps the evaluator internal and opt-in, preserves existing public validation behavior/export surface, rejects fully forbidden allowed-path sets, combines execution and provider-override requirements, binds recorded refs to provider base/head SHAs, pins `actions/github-script` to `f28e40c7f34bde8b3046d885e986cb6290c5673b`, and adds stale-base/head tests. Focused tests pass 15/15; expanded agent-capacity/workflow tests pass 34 files/170 tests; `build:dist` passes and direct public-entrypoint read-back proves the internal evaluator is absent. The PR validator remains advisory until merged into the trusted base, canaried, and added to governed staging/main branch policy at a human policy checkpoint.
- SDK staging integration: independent re-review found no remaining findings at `5eff7d1bf728c1eb40e50073b164a7dd99721d8f`. Push Verify `32204837867`, PR Verify `32204841864`, and Content `32204841934` passed; local, push, and PR artifacts were byte-identical at SHA-256 `e19dc65481dceb76ca60b6c36b93ff1314cdd5c0b85dc977365f5c7c825510ba`. PR [#4](https://github.com/treeseed-ai/sdk/pull/4) merged to staging as `92a66135fbda5575bee058b0ab25339c6c7d6398`, and `git ls-remote` returned that exact ref. Staging Verify run [`32205531009`](https://github.com/treeseed-ai/sdk/actions/runs/32205531009) passed in 9m45s. Artifact `sdk-92a66135fbda5575bee058b0ab25339c6c7d6398` is non-expired, provider size 1,999,779 bytes, and downloaded SHA-256 exactly matches the reviewed `e19dc654…` digest. Temporary download material was moved to Trash after read-back.
- API hosted failure: Verify runs [`32202582218`](https://github.com/treeseed-ai/api/actions/runs/32202582218) and [`32202586194`](https://github.com/treeseed-ai/api/actions/runs/32202586194) timed out after twenty minutes in `Hydrate exact SDK artifact`; no API dependency install or test ran. API declared SDK commit `2de71415477d7e19c332aa8062fe0f587d709651`, whose two SDK Verify runs failed and emitted no artifact. This exposed the sequencing defect: consumers must never adopt an intermediate producer commit. SDK must merge and emit an accepted staging artifact first; consumers then adopt that exact staging identity in their own changes. Consumer hydration must also replace blind polling with a bounded fail-fast producer diagnostic.
- Consumer adoption: CLI `2e9610a60cfddc7a7bea679487530667b10a8407`, API `f952c17e103d888974b03cd58504542c4c946241`, and Agent `b6f07113536d8420f0ac6c0e1c445dc38947062c` declare and lock SDK staging `92a66135fbda5575bee058b0ab25339c6c7d6398`, explicitly run the internal compatibility evaluator after public structural validation, and carry the byte-identical corrected PR validator. API hydration classifies accepted `92a66135…` as run `32205531009` and failed intermediate `2de71415…` as immediate `failed_fast`. Clean local installs passed: API 629 packages, CLI 1,202, Agent 620. Package-owned compatibility tests pass 1/1 in each repository; Agent required its declared fixture submodule at exact `940d1de…`.
- Consumer review/integration: independent review found no findings in CLI `2e9610a6…`, Agent `b6f07113…`, or corrected API `f952c17e…`. Feature-branch push/PR artifacts were byte-identical at CLI SHA-256 `420c7c11e9430dfd4a9c0a5460bd2fd5ce0383aca96895e5d48d46570e335aa3`, Agent `3e5756ec99ecae0210a502e3019702dd66c8c29f9ff2eb29957319b4c4fd86af`, and API `41d9f01985857fc0d74335c0c7169295c34ac7539387e53d7196c3e90e4b54a1`. CLI PR #6 merged/read back on staging at `cafe7efbd29db3d58dbfbd841002b69b4e166572`; staging Verify [`32207567279`](https://github.com/treeseed-ai/cli/actions/runs/32207567279) passed and its downloaded CLI tarball exactly matched `420c7c11…`. Agent PR #2 merged/read back at `a444f1cca0cdd61e7854e219d1db243d08531129`; staging Verify [`32207568045`](https://github.com/treeseed-ai/agent/actions/runs/32207568045) passed and its downloaded tarball exactly matched `3e5756ec…`. API head `65495a70…` first passed both Verify runs, Content, and affirmation but review found a duplicate template Verification section. Corrected head `f952c17e…` changed only that template, passed push Verify `32207525324`, PR Verify `32207527924`, Content `32207527889`, and affirmation `32207539050`; independent re-review found no findings. API PR #1 merged/read back on staging at `a58aa53c9507e5af61a8c19dac51797a6abe6f6a`; staging Verify [`32207990367`](https://github.com/treeseed-ai/api/actions/runs/32207990367) passed. Artifact `api-a58aa53c9507e5af61a8c19dac51797a6abe6f6a` is non-expired, provider size 2,977,853 bytes, and its downloaded API tarball SHA-256 exactly matches reviewed `41d9f01985857fc0d74335c0c7169295c34ac7539387e53d7196c3e90e4b54a1`; temporary download material was moved to Trash.
- Common staging-content defect: post-merge Content runs failed in SDK `32205530990`, CLI `32207567268`, Agent `32207567969`, and API `32207990453` because the shared workflow treated every non-PR push—including staging—as an external R2 publication and none of the repositories supplied publication credentials. The repository-neutral correction defaults to `--validate-only`, clears it and performs R2 acceptance only for non-PR `main`, and adds the workflow path to its own push/PR filters so contract changes exercise the correct path. Exact correction heads SDK `caf24e067ef2e57a30a421038c9a47b3032df71a`, CLI `70d6078883c5836e495122a2758db641de5dc132`, API `ae2fe26223520185cff641d5ac77faf323248277`, and Agent `5893f925135628517a115bb8749caafe43cedd1e` passed credential-free Content checks, full Verify checks, and independent review. CLI push Verify `32208293094` initially stopped in `npm ci` with runner-side `ECONNRESET`; exact-head attempt 2 passed. All four correction PRs merged/read back at the final staging heads above. Post-merge staging Content is `verified`: SDK run `32209160738`, receipt SHA-256 `b1f0c17193cb531f045fc69b6b64e6a78dfcbe2575f82954231e87837ae88dc7`; CLI run `32209068198`, receipt `3b89ff00a48c646e0e2d2b061446fc42368583a2d4055537513784f93f7aeff4`; API run `32208983872`, receipt `2ae588c2bdc7403b215beee9243f626da5f5effa1b29c4872484b4d9b63b2a10`; Agent run `32208980155`, receipt `357b64e055750216914038d538876cff5404360e0a8cf23886677befa02d1e1b`. Each receipt reports its exact staging merge source, channel `staging`, and zero uploads. Temporary PR/staging receipt downloads were moved to Trash after inspection.
- Cleanup evidence: exact reproducible `node_modules` trees in the four definition-cutover worktrees were deleted after source/package artifact acceptance, reducing the worktree footprint from 6.0 GiB to 101 MiB and restoring root free space from 16 GiB to 22 GiB. Source worktrees, Git state, accepted artifacts, runtime processes, databases, receipts, and the user's modified capacity-provider file were preserved.
- Final package read-back: post-correction staging Verify passed at SDK run [`32209160745`](https://github.com/treeseed-ai/sdk/actions/runs/32209160745), CLI [`32209068276`](https://github.com/treeseed-ai/cli/actions/runs/32209068276), API [`32208983824`](https://github.com/treeseed-ai/api/actions/runs/32208983824), and Agent [`32208980036`](https://github.com/treeseed-ai/agent/actions/runs/32208980036). Downloaded package tarballs are byte-identical to the independently reviewed pre-correction artifacts: SDK `e19dc65481dceb76ca60b6c36b93ff1314cdd5c0b85dc977365f5c7c825510ba`, CLI `420c7c11e9430dfd4a9c0a5460bd2fd5ce0383aca96895e5d48d46570e335aa3`, API `41d9f01985857fc0d74335c0c7169295c34ac7539387e53d7196c3e90e4b54a1`, and Agent `3e5756ec99ecae0210a502e3019702dd66c8c29f9ff2eb29957319b4c4fd86af`. Provider artifact names bind each final staging merge; temporary downloads were moved to Trash.
- Local TreeDX/class deployment: all four repositories used the same `capacity agent-definitions-author` plan/execute/read-back sequence with eight project-owned definition paths. Plans resolved independent repository bindings and immutable bases; execution produced local-only simulation checkpoints SDK `87bd2127490574c79672e955f73fcbc78c335589`, CLI `fe83bf96f10f1cbcea0075b8ee39d7e3d2dbf34d`, API `c1dd5a4595b963cef6369cf2712f0a255a0b3b86`, and Agent `0e7c677cb7dce2643dbee2928de62e38f90a4e4d`. Each project now exposes exactly eight active classes with matching class/agent ownership and `treedx_agent_lab_authoring` provenance. Exact repeat executions returned the same commits and zero changed paths. Cross-project `agent-deploy` plans were intentionally not executed because they correctly reported eight target-owned definition conflicts; project differences remain declarative rather than copied source.
- Superseded-run settlement: assignment `assignment_Yz_M2f32k8tWNyrHCU10d5pM4YJnH9fD` is `failed` with lease `released`; its TreeDX proxy/workspace handles are revoked. Authoritative cleanup observed at `2026-08-19T02:45:20.544Z` reports zero active assignments, leases, reservations, demands, workspaces, worktrees, stale authorities, unpublished branches, or unpublished commits. Parent `repo-lifecycle-001-run-v3` is terminal `degraded`; a cancellation plan rendered successfully, while execution correctly rejected an invalid `degraded` → `cancelled` transition. The degraded terminal record and exact failure evidence are retained; no destructive cleanup or forced state rewrite occurred.
- Residual gates: provider credential rotation, grant/capability read-back after rotation, baseline/clean-repeat/interruption runs, main read-back, and npm compatibility classification remain open. Main/npm and production publication remain fail-closed.

## Accepted and observed baselines

| Subject | Exact identity | Disposition |
| --- | --- | --- |
| Platform prior staging | `5106b11b8945608aa185840a3b3ca74b98f90c50` | SDK-first documentation base |
| Platform staging | `8de5440e7dec41a225333d15e6e62bb8f53429c6` | PR [#1](https://github.com/treeseed-ai/platform/pull/1) merged; exact remote read-back verified |
| Platform local bootstrap staging | `8593a09dfe39c0387ff08b25d0a620004b6ebbf1` | PR [#2](https://github.com/treeseed-ai/platform/pull/2) independently reviewed, merged, and read back; merge tree equals reviewed head `fd8575eb…`; hosted run [`32190154982`](https://github.com/treeseed-ai/platform/actions/runs/32190154982) passed |
| Platform source-reconciliation checkpoint | main `a77614610cbcf973d8b3b4fc9f7da8c650f99090`; staging `6d71adb559e15d3790804ff6a1634e0a99021d7f` | PRs [#4](https://github.com/treeseed-ai/platform/pull/4) and [#5](https://github.com/treeseed-ai/platform/pull/5) integrated the exact reviewed source tree into main and restored shared staging history with zero changed files. Later ledger-only main/staging merge receipts are authoritative provider observations and intentionally are not self-embedded as a supposed current head. |
| CLI prior staging | `37bdc9fb82656b0607410328685e6cbe75ebedc5` | PR [#1](https://github.com/treeseed-ai/cli/pull/1) independently reviewed, merged, and read back; tree `94b2f10571611149f7ed5a4593e7ad515033a349`, lock SHA-256 `8d4c5b4ed48fae8d0115cca63a00880d823dcc0fbab9c40cca19e1265d0c6f8c` |
| CLI local bootstrap staging | `23a3869d63e0176311e000087de2fcbc74620daa` | PR [#2](https://github.com/treeseed-ai/cli/pull/2) independently approved, merged, and read back; reviewed head `58632b3…`; both hosted exact-head checks passed in 6m52s and local acceptance passed 240 tests plus packed-install smoke |
| CLI reconciled main/staging | main `f8d3a9f14356cf0f3ec35cac83871e0725879382`; staging `49d1c225285ce72b0ba5a6b1e43cec23add45309` | PR [#4](https://github.com/treeseed-ai/cli/pull/4) integrated the exact staging source tree into main after refreshed SDK/content and source checks passed; PR [#5](https://github.com/treeseed-ai/cli/pull/5) restored shared history with zero changed files after Verify run [`32193798337`](https://github.com/treeseed-ai/cli/actions/runs/32193798337) passed. npm/hosted production remained fail-closed |
| SDK remote staging | `f843c3cb11853db737d28ecc6bcc3d5df5e183e9` | Required fresh canary base |
| SDK baseline repair | reviewed head `7bdb291dd8989359e9c94e39d22e3acd8b88ca3c`; staging merge `e9c99accdde7a335f8b54cee752196fc234407a1` | PR [#1](https://github.com/treeseed-ai/sdk/pull/1), exact base `f843c3cb…`; independently approved, hosted verification green, merged, and read back; local proposal `6795bdc7…`, accepted decision `85bd44c4…` |
| SDK reconciled main/staging | main `ee9e9440596de14635bad1eb4b54ad14019ca574`; staging `000a4a058e97ace3cc217cbfdea1a1ec096b8e93` | PRs [#2](https://github.com/treeseed-ai/sdk/pull/2) and [#3](https://github.com/treeseed-ai/sdk/pull/3) integrated the exact staging source tree into main and restored shared branch history with a zero-file staging reconciliation. Source Verify run [`32193234521`](https://github.com/treeseed-ai/sdk/actions/runs/32193234521) passed; production publication failed closed before steps and published nothing |
| Definition/PR-contract cutover | SDK verified staging `92a66135fbda5575bee058b0ab25339c6c7d6398`; CLI staging `cafe7efbd29db3d58dbfbd841002b69b4e166572`; API candidate `f952c17e103d888974b03cd58504542c4c946241`; Agent staging `a444f1cca0cdd61e7854e219d1db243d08531129` | SDK is accepted. CLI/Agent are independently approved, merged, and read back with staging verification pending. API's sole template ambiguity is corrected and awaits fresh checks/re-review before merge. |
| SDK published package | `@treeseed/sdk@0.12.62` | Current npm `latest` baseline |
| SDK diagnostic commit | `c6db3626ab3cecd3dc74c321b40bb37e94c503eb` | Unaccepted diagnostic input; never cherry-pick implicitly |
| API accepted staging | `b18379fe1521339f71dbf85cf519eed95fe556c2` | Required Platform bootstrap input |
| API ref recorded by Platform staging | `4bf65d95f8b14b390b0c9213824f1e77d6597692` | Transitional mismatch to reconcile without portfolio fan-out |
| Guest | Linux Mint KVM, `192.168.122.99/24` | Active application/agent development node |
| Host | gateway observed at `192.168.122.1`; privileged state unobserved | Requires `H-001` human discovery |

## Gate ledger

| Gate | State | Owning repositories | Exit evidence | Current note |
| --- | --- | --- | --- | --- |
| 0. Truthful Platform and SDK baseline | `in_progress` | Platform, SDK, CLI, API, Agent | Ready Platform runtime; exact 13-repository workset; governed source canary; compatible agent definitions; no ungoverned publication; zero residue | Four-package definition source, hosted artifacts, local TreeDX projections, eight active classes per project, clean repeat, and superseded-run cleanup are verified. `H-006` and the fresh SDK baseline/clean-repeat/interruption chain remain; SDK npm publication is still blocked. |
| 1. SDK standards foundation | `queued` | SDK, Platform composition; API read-only consumer case | Four portable metadata contracts; TS/OpenAPI comparison; SDK `0.13.0-rc.1`; exact composition | Starts only after Gate 0 source canary. |
| 2. Unified repository save/stage/release | `queued` | SDK, CLI, API, Platform; then every inventory repository | One PR-gated lifecycle engine with local and live acceptance | SDK is the first fixture, never a separately dispatched workflow. Repository capabilities and release policy are declarative; unscoped production release stays fail-closed. |
| 3. SDK GitHub work-provider contracts | `queued` | SDK | Provider-neutral contracts; GitHub normalization/templates; token canary; next SDK RC | PR binds assignment/checkpoint, never lease. |
| 4. API and CLI authority | `queued` | API, CLI | Durable sync/outbox/bindings; authenticated routes; CLI parity; replay-safe canary | Consumers change only through their own governed adoption. |
| 5. Agent and review integration | `queued` | Agent, API, SDK | Deterministic simulations plus one live planning/acting/review/integration chain | Baseline, clean repeat, and interruption/resume required. |
| 6. GitHub App parity | `queued` | SDK, API, Platform secrets/reconciliation | Token/App parity; rotation/expiry/permission-loss evidence | Required before final SDK `0.13.0`. |
| 7. Host/guest development profile | `waiting_human` | Platform, AI, Agent, host operator | Isolated capacity network; exact host runtime; positive and negative boundary proof | `H-001` is open but does not block Gates 0–3 guest-side work. |
| 8. Portfolio expansion | `queued` | Live inventory, one project at a time | All 31 registry entries; independent releases; fifteen guarantees; Guide campaign | Order begins API, CLI, Agent, Platform, Admin, then derived dependency graph. |

## Gate 0 work breakdown

1. **Platform documentation and ledger — verified** — PR [#1](https://github.com/treeseed-ai/platform/pull/1) preserves the cluster, standards, and GitHub direction and links this ledger. Independent review found stale ledger evidence, hard-coded verifier counts, rollout-order drift, and incomplete host network observation. Commit `2b78adb18ed9d3869f43cc4019ae5c783baffffa` addressed the substantive findings. Hosted Verify runs [`32177288144`](https://github.com/treeseed-ai/platform/actions/runs/32177288144) and [`32177648675`](https://github.com/treeseed-ai/platform/actions/runs/32177648675) passed at their exact heads. The PR merged to staging as `8de5440e7dec41a225333d15e6e62bb8f53429c6`, and `git ls-remote` returned that exact ref.
2. **Platform package-local contract** — `verify:local` exists without weakening `verify`. The verifier now observes root-index gitlinks and nested Market custody, reports the available guarantee-definition count, and explicitly reports live activation as unobserved rather than claiming 15 active guarantees. Proving canonical `trsd save` independence from the transitional Market CLI remains pending.
3. **Trusted operator closure — verified** — use an immutable CLI/SDK closure that can authenticate and invoke `platform workset` without resolving transitional Market workspace links. CLI PR [#1](https://github.com/treeseed-ai/cli/pull/1), exact reviewed head `2c27100dec54939be8846d6d5aba6f81eb8bc4c8`, adds only the missing nested `semver@7.8.5` lock record. Hosted runs [`32178152083`](https://github.com/treeseed-ai/cli/actions/runs/32178152083) and [`32178155520`](https://github.com/treeseed-ai/cli/actions/runs/32178155520) passed and emitted byte-identical artifacts. Local parity initialized fixtures at `940d1de…`, performed scripted `npm ci` with 1,202 packages under Node `24.15.0` and npm `11.7.0`, passed all 234 CLI tests, packed-install smoke, `pack:tool-closure`, and `platform workset` command discovery. The PR merged and remote staging read back at `37bdc9fb82656b0607410328685e6cbe75ebedc5`; its tree exactly equals the reviewed head. Closure SHA-256 digests are Agent `505a69d7dbde0c8e607cb25b90135132ec12058597f2c8bfd51727010e4239bc`, CLI `2db0368608233439c78010af8fa8ad885f3c2db2097488ca1ebaae822d9dd8fb`, Core `3ac86b779f6c452d882ab06ce06ce299f7a7c11ea9c2daf94c1d43ab6419f7e0`, SDK `fbebfef9e4b0589875dd058d4cc3d7b4ce0c7964f6009aa54f22f648b5ac8969`, and UI `3bae0cf732040afd4e7f87e652a71aa06d8d577891046c85456c62917c04e65e`. The accepted Git source and reviewed lock—not the tarball set alone—are bootstrap authority. A future nonblocking change must add a closure manifest/install lock and packed workset-plan smoke. The transitional Market CLI and unpublished SDK `c6db3626…` cannot become evidence.
4. **Bounded API bootstrap reconciliation — verified for the local API** — accepted API staging `b18379fe1521339f71dbf85cf519eed95fe556c2`, tree `1a8644fb3804633f80b4b85949876976f4cc233b`, and lock SHA-256 `86946fa79351e069fbc4c1ea187a18d32ce53e2b2ae26c96ce0b5e16a5193e04` were independently materialized as the read-only `packages/api` workset checkout. A clean `npm ci --workspaces=false` installed 631 packages and rebuilt the API. `/healthz` and `/healthz/deep` pass at `127.0.0.1:3000`, including PostgreSQL. Local bearer read-back of `/v1/me`, the TreeSeed team profile, and the project inventory passes. The local seed apply and clean re-plan both report `create=0`, `update=0`, `unchanged=29`, `error=0`, no diagnostics, and verification true. The accepted API requires its test-only local acceptance token to be explicitly configured before agent-lab credential reconciliation; replacing this fallback with generated local operator custody remains a Gate 4 requirement.
5. **Managed runtime — in progress** — the accepted API is running locally with Platform as `TREESEED_API_REPO_ROOT`; PostgreSQL, TreeDX, and Mailpit remain healthy. Start and verify the operations runner, then replace this foreground bootstrap with the managed supervisor only after SDK desired-state generation honors the disabled Market surface.
6. **Workset — verified read-only baseline** — CLI candidate `58632b370b6819358cb60e2479620fd47332bd5d` in draft PR [#2](https://github.com/treeseed-ai/cli/pull/2) loads a schema-validated `seeds/treeseed.yaml` without constructing a Market/API client when the configured inventory source is `seed`. Live nested-checkout plan resolved the Platform root and exactly thirteen permitted staging heads. Apply wrote `.treeseed/worksets/platform/latest.json` with status `verified`; its current SHA-256 is `1295c1fffa8d1eda834668b073078aa61308ad416fa97070723904af1c997367`. Immediate apply read-back and a separate replay plan both reported `create=0`, `noop=13`, `blocked=0`. Independent API read-back normalized to the canonical allowlist of thirteen repository/role/path/branch records with digest `sha256:26507b3f8065a36f1ba01c62425ac020f05928c054a4e89703aaf02ce16dc9ff`; the historical Market and Market API project records remain explicitly reported as external exclusions and are not Platform custody. `authority:null` is the expected absence of writable assignment authority, not absence of inventory authority. API is `b18379fe…`, SDK is `f843c3cb…`, all checkouts are detached/read-only, and Market, Market API, content repositories, and gitlinks are absent. A later assignment-owned clean Platform checkout may grant assignment-write custody to SDK alone through `--market local`.
   The CLI change was independently approved after 240 local tests, packed-install smoke, and two green exact-head hosted checks, then merged/read back at `23a3869d63e0176311e000087de2fcbc74620daa`. The Platform profile and verifier were independently approved after hosted run `32190154982`, then merged/read back at `8593a09dfe39c0387ff08b25d0a620004b6ebbf1`. The template remains an unreleased staging contract until CLI `0.12.59` is published.
7. **SDK canary — verified for source integration** — fresh assignment checkout at exact `f843c3cb…`; local proposal `6795bdc7-2cd2-40a9-aaee-c53cb1407fb7` and accepted decision `85bd44c4-e6a5-45cd-9d44-96cce898d4b3`; PR [#1](https://github.com/treeseed-ai/sdk/pull/1) reviewed head `7bdb291dd8989359e9c94e39d22e3acd8b88ca3c`. The diff changes only the malformed type-query and standalone local-provider test fixture; `c6db3626…` was not adopted. Clean install added 637 packages. Focused tests passed 2 files/9 tests; isolated release verification passed 391 files/1,532 tests, lifecycle 6 files/60 tests, packed-install smoke, and hosted verification. The packed candidate SHA-256 is `7466e0f9ca9eb0dbd7eccf1b2c8ca5e81779a4fa381aa8e5a928e057d3f1f325`. It merged/read back on staging at `e9c99acc…`, was integrated to main at `ee9e944…`, and main history was reconciled back to staging at `000a4a05…` without a source-tree change.
8. **Patch proof — blocked for publication, active for repair** — consumer heads were snapshotted before the SDK change: API `b18379fe…`, Agent `6e1a734…`, CLI `23a3869d…`, Core `32a5c1e…`, Admin `1565686…`, UI `d622525…`; none was modified by the canary. Comparing the exact staged candidate with published `0.12.62` found 81 baseline versus 90 candidate export entries: 15 additions, 6 removals, and 5 candidate export declarations missing from the tarball. Therefore the current source cannot truthfully publish as contract-unchanged `0.12.63`. Human approval integrated the reviewed source baseline to main, but npm publication and `latest` remain fail-closed pending a separate compatibility decision and export/package repair.

Before workset materialization, dependency installation, or image construction, re-read guest storage. `H-002` restored 31 GiB free. An inspected cleanup then removed 11,530,907,807 bytes of reproducible `node_modules` and Cargo `target` material from clean transitional checkouts, increasing free space to 43 GiB before CLI acceptance and 40 GiB afterward. TreeDX data, registered worktrees, receipts, dirty recovery checkouts, the unpublished SDK commit, and the TreeDX scene change were preserved; the running TreeDX service remained healthy. Reclaiming container storage must use an inspected managed cleanup path; an ad hoc Docker prune is not accepted evidence.

## SDK target interfaces

The first compatible minor line adds bounded public entrypoints:

- `@treeseed/sdk/standards` — contract bundles, compatibility attestations, compositions, registry entries, fingerprints, semantic bump results, and shared errors;
- `@treeseed/sdk/standards/typescript` — normalized TypeScript public API extraction and comparison;
- `@treeseed/sdk/standards/openapi` — normalized OpenAPI extraction and comparison;
- `@treeseed/sdk/work-providers` — provider-neutral work items, change requests, plans, milestones, checkpoints, summaries, reviews, events, operations, conflicts, and sync contracts; and
- `@treeseed/sdk/work-providers/github` — GitHub normalization, templates, managed markers, auth capability selection, and provider adapter behavior.

The package manifest gains versioned `standards` declarations. Package commands build contracts, compare compatibility, resolve a composition, and verify the packed artifact deterministically.

The repository workflow semantics, first exercised by SDK, converge to:

- `save`: assignment authority → package proof → contract/attestation → commit/push → draft PR update;
- `stage`: exact PR head/reviews/checks → feature-to-staging merge → read-back → immutable prerelease;
- `release --package @treeseed/sdk`: accepted staging composition → human-approved staging-to-main merge → npm publish/read-back;
- every inventory repository: the same authority, assignment, workset, PR, staging, main, read-back, settlement, and cleanup state machine; unsupported capabilities return a typed capability/policy result derived from that repository's manifest, never a repository-name special case;
- unscoped/global release: fail-closed.

## GitHub and agent rollout

Token mode is the bootstrap path, with credentials retained only in the trusted API/secret-provider domain. GitHub App parity is mandatory before final SDK `0.13.0`. Staging may merge automatically when all TreeSeed and GitHub gates pass; main merge and npm publication require human approval.

Before live agent execution, deterministic simulations cover success, plan revision, interruption/re-lease on one PR, unauthorized paths/commits, stale reviews, force-push/base drift, external merge adoption, failed checks, and cleanup. The first live chain uses separate planning, acting, independent review, and integration authority.

## Human checkpoints

### H-001 — Ubuntu host discovery

- State: `waiting_human`
- Blocking: host-capacity and local-model guarantees only
- Required authority: human access to the Ubuntu host
- Secret handling: return no tokens, keys, credential values, complete environment dumps, or private configuration bodies
- Requested observation:

```bash
hostnamectl
virsh list --all
virsh net-list --all
for network in $(virsh net-list --all --name); do virsh net-dumpxml "$network"; done
nvidia-smi --query-gpu=name,memory.total,driver_version --format=csv,noheader
docker version --format '{{json .Server}}'
df -h /
ip -brief address
ip route
ss -ltnp
```

- Expected result: identify the Mint VM domain, current libvirt networks, working NVIDIA/container runtime, available host storage, address collisions with `10.77.0.0/24`, and existing listening services.
- Resume criterion: sanitized command output is supplied; the agent then emits an exact inspected plan for the isolated service network and trusted capacity runtime.

### H-002 — Mint guest disk-reserve recovery

- State: `verified`
- Blocking: local CLI acceptance, workset materialization, SDK dependency installation, and image builds
- Required authority: human approval to remove the current user's re-downloadable npm cache on the Mint guest, or privileged host/guest disk expansion
- Surface: Mint guest at `192.168.122.99`; Ubuntu host only if cache cleanup does not restore the reserve
- Secret handling: commands below print filesystem/cache sizes only; do not paste environment variables, npm configuration, tokens, or credential files
- Preferred guest cleanup:

```bash
df -h /
du -sh "$HOME/.npm"
npm cache verify
npm cache clean --force
df -h /
```

- Expected safe output: npm reports cache verification/removal and the final root filesystem has at least 21 GiB available
- Failure criterion: final availability is below 21 GiB, any path other than the current user's npm cache would be removed, or npm reports a permissions/filesystem error
- Human result: npm cache cleanup raised free space from 18 GiB to 31 GiB; direct `df -B1 /` read-back reported 33,274,908,672 bytes available
- Agent verification: inspected cleanup raised free space to 43 GiB, exact CLI checkout remained clean except for the reviewed lock repair, and the clean scripted install/build/test/pack acceptance passed
- Cleanup disposition: generated paths are re-creatable through npm, Cargo, or agent image builds; no source, runtime database, registered worktree, or governed evidence was deleted

### H-003 — Official TreeSeed device authentication

- State: `superseded`
- Blocking: none; this checkpoint was issued prematurely and must not be retried while hosted deployment is suspended
- Required authority: human approval in the browser for the official TreeSeed account
- Surface: Mint guest Platform checkout and the browser approval page opened by the accepted CLI staging closure
- Superseded command retained only as failure evidence; do not run it again while hosted deployment is suspended:

```bash
node /tmp/treeseed-cli-closure-root/cli-3b0483a.kkyhZ2/dist/cli/main.js auth:login --market treeseed --json
```

- Observed result: `auth:login` returned `fetch failed`; direct health probes found no local API listener, and DNS lookup found no records for the configured hosted endpoint
- Redaction: do not paste approval codes, login URLs containing codes, tokens, session material, cookies, or credential/configuration file contents; report only success/failure and non-sensitive account/team identifiers
- Failure criterion: browser approval is denied or expires, the CLI cannot resolve the `treeseed` profile, or the final command reports `ok: false`
- Replacement path: restore the accepted local API, verify health, then issue a separate local-authentication checkpoint only if the running API requires human participation
- Safety disposition: no credentials or session material were created, and no provider or repository mutation occurred

Future mandatory human checkpoints cover GitHub App creation/permission approval, initial or rotated PAT/npm credentials, SDK main merge, npm `latest` publication, destructive recovery, and authority expansion.

## Evidence and update requirements

Every accepted gate records:

- repository, branch, base, head, merged, and authoritative read-back commits;
- package versions, tarball/image/content digests, contract bundle and generation digests;
- local, packed, consumer-driven, hosted, integrated, and live verification results;
- Issue, PR, review, check, merge, provider-operation, integration, and settlement receipts where applicable;
- consumer heads before and after producer publication;
- active assignment, lease, reservation, worktree, branch, and unpublished-artifact cleanup counts; and
- the next permitted action.

Mock-only, stale, skipped, mismatched-generation, or process-exit-only evidence cannot verify a gate.

## Completion conditions

The SDK-first milestone completes only when SDK `0.13.0` is published from an accepted composition, both GitHub token and App modes pass, save/stage/release use the bounded PR-gated path, API/CLI/Agent integrations have their own accepted releases, the live SDK agent chain passes all three guarantee variants, and no consumer repository changed merely because SDK published a compatible artifact.

The portfolio migration completes only when all `docs/standards-dev.md` acceptance criteria pass across the 31 live project records, the collapsed and multi-node profiles consume the same contracts, hosted OpenTofu/release authority is restored separately, and the transitional Market-root exact-commit workflow is retired without entering Platform custody.
