# GitHub Issues and Pull Request Integration

## Status and purpose

This document defines the target architecture and implementation strategy for integrating GitHub Issues and pull requests with TreeSeed's governed development lifecycle.

The first implementation targets GitHub, but the TreeSeed contracts are provider-neutral. A team project binds a repository through a repository provider and may independently bind work-item, change-request, workflow, and secret capabilities. GitHub may implement all of those capabilities for one repository without becoming TreeSeed's governance authority.

This integration participates in the standards-based development and Platform cutover. It does not replace the mandatory first standards federation slice, weaken assignment-scoped repository custody, authorize hosted deployment, or add Market or Market API to Platform.

## Architectural decision

GitHub is a collaboration and source-integration projection. TreeSeed API remains the durable authority for:

- questions, research provenance, proposals, and immutable proposal revisions;
- decisions and the exact proposal revision decided upon;
- estimates, capacity plans, workdays, assignment graphs, and leases;
- repository and path authority;
- checkpoints, reviews, evidence, settlement, integration receipts, and promotion; and
- human, agent, team, project, and provider identities.

GitHub remains authoritative for provider-native facts:

- repository identity and refs hosted by GitHub;
- Git commit and tree identities;
- Issue and pull-request numbers, URLs, and provider timelines;
- native reviews, inline review threads, checks, and merge objects; and
- GitHub App installations, repository grants, and delivery identifiers.

Every integration record binds the two authorities explicitly. Neither system infers the other's durable state from prose, labels, branch names, or process completion.

The governing rule is:

> GitHub makes TreeSeed work visible and reviewable; TreeSeed decides whether that work is authorized, complete, integrated, settled, or promotable.

## Revisions to the proposed mapping

The proposed Issue/PR workflow is directionally correct, with several important refinements:

1. **A proposal projects to an Issue, but the Issue is not the proposal authority.** The binding records the exact TreeSeed proposal revision and content hash. GitHub edits become input to a new revision or stakeholder commentary; they never rewrite a decided revision.
2. **Labels project classification and state; they do not define groups or grant authority.** Teams, groups, roles, and stakeholders retain stable TreeSeed identities. Human-readable labels may mirror them for filtering.
3. **A decision projects as a structured Issue event, not merely an Issue state change.** The decision comment names the exact revision, decision ID, actor, rationale, dependencies, and authoritative link. Closing an Issue does not approve it, and reopening one does not revoke a decision.
4. **Estimates project as structured comments or checks, but remain typed API records.** Editing or deleting a comment cannot alter an accepted estimate or capacity plan.
5. **An assignment/checkpoint maps to a branch and pull request; a lease does not.** Leases expire, renew, interrupt, and may move between agents. The PR is the stable review envelope while lease attempts appear as status/check events in its timeline.
6. **Commits remain native Git commits, not comments.** A checkpoint update may summarize newly admitted commits, but the exact commit and tree identities are read directly from GitHub and bound into TreeSeed receipts.
7. **The four assignment stages have distinct projections.** Plan is a managed PR section and revision event; messages are bounded timeline updates; commits are Git objects and checkpoint events; the completion summary is a managed PR section plus a final lifecycle event.
8. **A GitHub merge is necessary provider evidence but not sufficient TreeSeed integration evidence.** TreeSeed reads back the exact merged commit, validates authority and guarantees, then issues the integration receipt and settles the assignment.

## Provider model

TreeSeed adds two provider-neutral capabilities beside the existing repository, workflow, and secret providers.

| Provider capability | Responsibilities | GitHub implementation |
| --- | --- | --- |
| Repository provider | Repository metadata, refs, branches, commits, trees, comparisons, custody transport, and remote read-back | GitHub repositories and Git data |
| Work-item provider | Issues, issue forms, labels, assignees, comments, state, links, and event observation | GitHub Issues |
| Change-request provider | Pull requests, draft/readiness state, changed files, reviews, inline threads, requested reviewers, mergeability, merge, and read-back | GitHub pull requests |
| Workflow provider | Workflow dispatch, runs, checks, statuses, logs/evidence references, environments, and gates | GitHub Actions and Checks |
| Secret provider | Repository/environment secrets, variables, and bounded credential delivery | GitHub Actions secrets/variables plus TreeSeed secret broker |

These are capability interfaces, not five mandatory vendor connections. One GitHub installation can satisfy several bindings. A future GitLab adapter, for example, can implement the same work-item and change-request standards without changing proposal, assignment, or receipt semantics.

Each project binding declares:

- provider kind and account/installation identity;
- normalized repository identity;
- enabled capabilities and contract versions;
- authentication mode and observed permission set without secret values;
- webhook/reconciliation status and cursor;
- branch, label, template, review, and merge policy;
- supported provider features and explicit fallbacks; and
- the last verified configuration generation.

Unsupported capabilities fail closed or are declared unavailable. Provider-specific behavior must not leak into project handlers or assignment semantics.

## Current project state as of 2026-08-18

- GitHub adapters already cover repository metadata, repository bootstrap and branches, branch rules, environments, secrets, variables, workflow dispatch and observation, package release workflows, and image workflows.
- First-party repositories currently resolve a central organization token. Imported third-party projects may use repository-scoped overrides.
- The API-owned proposal, decision, planning, estimate, capacity, assignment, lease, checkpoint, review, receipt, stage, and release lifecycle already defines the authority that GitHub must project.
- Canonical work-item and change-request provider contracts, Issue/PR bindings, webhook ingestion, bidirectional synchronization, templates, actor mapping, and merge adoption do not yet exist as accepted project capabilities.
- The GitHub App installation and permission model described below is target state. Token support must remain available throughout and after cutover.
- Hosted deployment, release, and production promotion remain fail-closed; adding Issue/PR collaboration does not change that status.

## Lifecycle mapping

| TreeSeed lifecycle record | GitHub projection | Direction and authority |
| --- | --- | --- |
| Question or research activity | Optional linked Issue or Issue comment | TreeSeed/TreeDX remains the knowledge and provenance authority; not every question needs a GitHub Issue |
| Proposal revision | Project-local Issue with structured body and stable binding marker | TreeSeed creates or adopts; GitHub edits create proposed input, never in-place authority changes |
| Proposal stakeholder comment | Issue comment | Bidirectional after actor mapping and sanitization |
| Accepted or rejected decision | Bot-authored structured Issue comment plus state labels | TreeSeed only; exact proposal hash and rationale included |
| Estimate | Structured Issue comment or check summary | TreeSeed only; later revisions supersede rather than edit accepted evidence |
| Accepted capacity plan | Issue timeline event with dependency and scope summary | TreeSeed only |
| Assignment graph node | Linked work record; branch reserved from an exact base | TreeSeed only |
| Active lease attempt | Check run/status and bounded PR timeline event | TreeSeed only; never the PR identity |
| Assignment plan | Managed PR body section and plan-revision event | Agent proposes; TreeSeed admits; GitHub displays |
| Assignment status | Milestone PR comments/check updates | Agent reports through TreeSeed; sync is rate-limited and idempotent |
| Checkpoint | Exact commit set, evidence links, and checkpoint check | TreeSeed binds provider-observed commits |
| Review assignment | Requested reviewer plus TreeSeed review binding | TreeSeed assigns; GitHub hosts native review |
| Review finding | PR review or inline thread | Bidirectional; disposition is a typed TreeSeed record |
| Completion summary | Managed PR body section plus final summary event | Agent submits; TreeSeed freezes accepted version |
| Integration | PR merge plus fresh merged-ref read-back | Trusted integrator acts; TreeSeed issues receipt only after verification |
| Settlement and promotion | Final check/Issue comment with receipt link | TreeSeed only |

### Project-local Issues and cross-project initiatives

Every source-changing project retains its own proposal, decision, assignment graph, and repository authority. Therefore every changed repository has its own project-local Issue and one or more project-local PRs.

An umbrella initiative may have a coordination Issue that links the project Issues and shows dependency status. It cannot approve work in another project or substitute for that project's authority chain. Cross-project receipts link the exact project-local Issues, PRs, decisions, commits, contract attestations, and integration order.

### Pull request cardinality

The default is one PR per assignment deliverable per repository. A single PR may survive several lease attempts and agent handoffs. One active writer lease controls its branch at a time.

Separate PRs are required when:

- independently reviewable deliverables need different decisions or release timing;
- different repositories are changed;
- parallel writers cannot safely share one branch;
- a dependency must integrate before downstream work can be verified; or
- policy requires isolated security, migration, generated-code, or contract changes.

Review assignments normally do not receive write custody to the acting branch. A requested correction returns to an authorized acting lease or creates a separately governed follow-up assignment.

## The four-stage assignment projection

### 1. Plan

An assignment begins from an exact base ref and an admitted objective. The agent produces a typed plan containing:

- assignment, decision, proposal revision, and dependency identities;
- intended outcome and acceptance criteria;
- repository and allowed-path scope;
- planned contract and artifact effects;
- verification and review strategy;
- risks, assumptions, migration, and rollback;
- expected checkpoints; and
- open questions that require replanning.

GitHub cannot create a meaningful PR until a compare branch differs from its base. TreeSeed must not add fake or empty commits merely to create a plan-only PR. Before the first real pushed checkpoint, the plan appears on the Issue and in TreeSeed. After the first real commit, the adapter creates a draft PR and installs the current plan into a managed body section.

A changed plan produces a new typed plan revision. The adapter updates only its managed PR section and adds a concise revision event; it never overwrites contributor-owned prose outside managed markers.

### 2. Messages

Agents send status through the assignment API. The projection adapter publishes only durable milestones, for example:

- acting began or resumed;
- plan materially changed;
- checkpoint published;
- blocked on a named dependency or decision;
- review requested;
- corrections completed; and
- completion or failure submitted.

High-frequency telemetry, tool logs, token usage, internal deliberation, and transient progress remain in TreeSeed evidence rather than becoming PR comment spam. Repeated updates use a stable external idempotency key and may update a check run instead of adding a comment.

### 3. Commits and checkpoints

Commits use assignment-scoped Git custody and normal GitHub refs. The repository provider observes every pushed commit and tree. A checkpoint binds:

- exact base, head, and admitted commit set;
- assignment and current lease attempt;
- changed paths and contract fingerprints;
- package, integrated, and live evidence generations;
- author/agent attribution and execution provider;
- review readiness; and
- remote read-back.

The PR timeline receives a compact checkpoint summary. The commit objects remain the versioning authority. A force-push, base change, unexpected commit, changed path outside authority, or ref movement invalidates the checkpoint until re-observed and re-admitted.

### 4. Completion summary

The completion summary is a typed, immutable checkpoint artifact rendered for humans. It contains:

- requested objective and actual outcome;
- important implementation decisions;
- exact commits and artifacts;
- tests, contract comparisons, guarantees, and known limitations;
- deviations from the plan and their rationale;
- review findings and dispositions;
- rollout and rollback notes;
- unfinished or follow-up work; and
- final completion, partial, failed, or blocked disposition.

The accepted summary becomes a managed PR body section and a final concise timeline comment. Later corrections create a new summary revision instead of erasing the accepted record.

## Issue and pull request templates

Templates are repository-local contract artifacts produced from a canonical SDK template family and owned by each project release. Platform may reconcile required files, but it must not become the source owner of project-specific content.

### Issue forms

The baseline template set is:

- **Proposal:** problem, desired outcome, evidence, stakeholders, constraints, non-goals, risks, affected projects, dependencies, acceptance criteria, and security/data classification.
- **Defect:** observed behavior, expected behavior, reproduction, affected contract/release, severity, evidence, and rollback or containment.
- **Question/research request:** question, decision it informs, known sources, requested evidence, scope, and completion criteria.
- **Coordination initiative:** participating projects, project-local Issue links, dependency graph, shared objective, and explicit notice that it grants no source authority.

Each form displays a notice that:

- GitHub is a synchronized work surface;
- TreeSeed holds decision and assignment authority;
- public-repository content must contain no secrets, private traces, credentials, or restricted knowledge; and
- closing, labeling, assigning, reacting to, or editing an Issue does not by itself approve work.

### Pull request template

The PR template contains human-editable guidance plus adapter-managed sections for:

- TreeSeed authority and lifecycle links;
- objective and acceptance criteria;
- plan and plan revision;
- change and contract summary;
- verification and evidence;
- security, migration, and rollback;
- exact checkpoints;
- review disposition; and
- completion summary.

Managed sections use versioned markers and stable binding IDs. The adapter must preserve all human-authored text outside those markers and must reject ambiguous or duplicated managed markers instead of rewriting the body destructively.

### Labels

TreeSeed reserves a namespaced label vocabulary, for example:

- `treeseed/kind:proposal`, `treeseed/kind:defect`, `treeseed/kind:initiative`;
- `treeseed/state:research`, `treeseed/state:decision`, `treeseed/state:planned`, `treeseed/state:acting`, `treeseed/state:review`, `treeseed/state:integrated`;
- `treeseed/decision:accepted` or `treeseed/decision:rejected`;
- `treeseed/attention:human`, `treeseed/attention:blocked`, or `treeseed/attention:security`; and
- optional display labels such as `treeseed/group:<slug>` or `treeseed/agent:<class>`.

Reserved labels are derived views. Manual changes are treated as drift and repaired or surfaced according to policy. Unknown, project-owned labels are preserved.

## Reviews, checks, and merge

Native GitHub review is the human-facing review surface. TreeSeed binds each requested review to a review assignment and maps the GitHub actor to an authorized stakeholder or agent identity.

The integration distinguishes:

- conversation comments;
- formal approving, change-requesting, or commenting reviews;
- inline findings and their threads;
- TreeSeed finding dispositions such as accepted, fixed, rejected with rationale, or superseded; and
- required check and guarantee results.

A GitHub approval counts only when its actor is mapped, its review targets the current admitted head, and policy permits that reviewer for the affected contract or risk class. A new head invalidates stale approvals according to policy.

Merge requires all of the following:

1. the exact proposal revision and decision remain valid;
2. the assignment and checkpoint authority cover the repository, paths, and head;
3. required reviews target that head and unresolved blocking findings are zero;
4. package, compatibility, integrated, and live gates required by the change pass on exact artifacts;
5. the PR base and head match the planned integration operation;
6. branch and merge policy permit the selected method; and
7. a trusted integrator performs or adopts the merge and reads back the exact result.

A manual GitHub merge without this chain becomes `externally-merged/unverified`. TreeSeed does not settle or promote it. Reconciliation must either prove and adopt it through an explicit governed recovery operation or report blocking drift.

## Bidirectional synchronization

### Inbound events

GitHub webhooks enter a trusted API or operations-runner endpoint, never an agent VM. The ingress path:

1. retains the raw request bytes long enough to verify the signature;
2. validates the webhook secret with constant-time comparison;
3. records provider, installation, repository, event, action, delivery ID, payload digest, and receipt time;
4. rejects or deduplicates replay by delivery ID and payload digest;
5. returns promptly and queues asynchronous normalization;
6. resolves repository and actor bindings;
7. converts the event into a versioned provider-neutral event; and
8. applies only operations allowed by the current lifecycle and authority.

The initial event set includes installation and repository grant changes, Issues, Issue comments, PR state/synchronization, push, reviews, review comments, check runs/suites, workflow runs, and repository rename/transfer or deletion signals where supported.

Webhook arrival is an observation, not proof of complete state. Every consequential action performs a fresh provider read.

### Outbound operations

TreeSeed writes through an API-owned transactional outbox. Each operation includes:

- stable TreeSeed operation and idempotency IDs;
- target binding and expected provider version when available;
- desired normalized body, labels, state, reviewers, or check result;
- acting authority and credential class;
- retry and expiry policy; and
- secret-free audit metadata.

The adapter executes the operation, reads the result back, and stores a digest-bound provider receipt. Stable hidden markers and external IDs prevent its own webhook echoes from producing duplicate lifecycle events.

### Reconciliation and backfill

Webhooks are supplemented by bounded reconciliation. The adapter periodically or manually:

- lists items changed since the last cursor;
- refreshes open bound Issues and PRs;
- verifies expected labels, bodies, refs, reviewers, checks, and states;
- detects missed deliveries and provider-side edits;
- repairs safe projection drift;
- records conflicts that require policy or human review; and
- advances its cursor only after durable processing.

Repeated reconciliation against unchanged provider state must converge to `noop`.

### Conflict policy

| External change | TreeSeed behavior |
| --- | --- |
| Issue title/body edited | Preserve provider revision; propose a new TreeSeed revision or flag conflict if the bound revision was already decided |
| Issue closed or reopened | Mirror external state without creating, revoking, or changing a decision |
| Reserved label changed | Repair derived label or report policy drift |
| Comment edited or deleted | Preserve prior observed event; add revision/tombstone metadata without rewriting accepted TreeSeed evidence |
| PR base changed | Invalidate integration plan until replanned and revalidated |
| PR head force-pushed | Invalidate checkpoints, reviews, checks, and exact-ref evidence affected by the new history |
| Unexpected commit pushed | Block checkpoint if commit or paths are outside assignment authority |
| PR manually merged | Record external merge; fail settlement closed pending governed adoption and exact read-back |
| PR closed unmerged | Pause/terminalize projection according to TreeSeed assignment policy; never silently cancel the authoritative assignment |
| Repository renamed/transferred | Re-resolve canonical provider identity and block writes until binding is verified |

## Portable contracts and records

The first implementation adds SDK-owned portable schemas and normalized bundles for:

- `treeseed.work-provider-binding/v1`;
- `treeseed.work-item/v1` and `treeseed.work-item-binding/v1`;
- `treeseed.change-request/v1` and `treeseed.change-request-binding/v1`;
- `treeseed.review/v1` and `treeseed.review-finding/v1`;
- `treeseed.assignment-plan/v1`, plan revision, status milestone, and completion summary;
- `treeseed.provider-event/v1` and webhook receipt;
- `treeseed.provider-operation/v1` and operation receipt;
- `treeseed.sync-cursor/v1`, conflict, and reconciliation report;
- Issue/PR template bundle and reserved-label policy; and
- provider capability, error, rate-limit, and retry contracts.

Bindings use stable TreeSeed IDs plus normalized provider IDs, URLs, repository identity, number, node ID when available, created/updated versions, and content digests. Prose URLs or hidden HTML markers aid recovery but are never the only binding authority.

These contracts are published and compared under `treeseed.contract-bundle/v1`. Breaking webhook normalization, lifecycle mapping, template markers, provider errors, or merge semantics requires the semantic version dictated by the standards policy.

## Ownership

- **API:** durable bindings, normalized events, actor mapping, sync cursor, outbox, conflicts, lifecycle transitions, decisions, assignments, reviews, receipts, and merge/promotion authority.
- **SDK:** portable provider contracts, GitHub adapters, normalization, template compilation, reconciliation graph, policy evaluation, client interfaces, and deterministic test kits.
- **CLI:** setup, plan/apply, import, sync, reconcile, diagnose, conflict resolution, and lifecycle command surfaces over API/SDK operations.
- **Admin:** guided connection, installation, permission health, binding, template preview, sync status, Issue/PR links, conflict review, and approval experiences.
- **Agent:** assignment-scoped plan, status, checkpoint, and completion tools; no reusable GitHub credential or direct authority expansion.
- **Workflow provider:** executes declared checks and returns exact evidence; it does not decide TreeSeed lifecycle state.
- **Platform:** composes the integration, reconciles repository templates, and runs portfolio acceptance; it does not own member Issues, PRs, releases, or credentials.

## Authentication and GitHub App setup

### Preferred GitHub App mode

The production integration should use a GitHub App installed only on selected repositories. GitHub Apps provide fine-grained repository permissions and short-lived installation tokens and are not tied to one employee's continuing access. GitHub recommends Apps for long-lived organization integrations and recommends minimum permissions. See [Deciding when to build a GitHub App](https://docs.github.com/en/apps/creating-github-apps/about-creating-github-apps/deciding-when-to-build-a-github-app) and [Choosing permissions for a GitHub App](https://docs.github.com/en/apps/creating-github-apps/registering-a-github-app/choosing-permissions-for-a-github-app).

The setup flow is:

1. An organization owner creates or approves the TreeSeed GitHub App.
2. Configure the webhook callback and a high-entropy webhook secret.
3. Select only the webhook events required by the enabled capabilities.
4. Grant the minimum repository permissions needed for the selected mode.
5. Install the App on explicit repositories rather than the whole organization by default.
6. Store the App private key and webhook secret only in the trusted API/secret-provider domain.
7. Bind installation and repository IDs to TreeSeed projects through inspected reconciliation.
8. Mint installation tokens server-side and only for the bounded operation; never deliver the App private key to a guest or agent.
9. Run read-only permission and webhook diagnostics before enabling writes.
10. Apply templates, labels, and branch/check policy through an explicit plan, then verify provider read-back and `noop` convergence.

The capability-dependent permission plan should start with:

- Metadata: read;
- Issues: read/write;
- Pull requests: read/write;
- Contents: read for observation, or read/write only when the installation token performs assignment-scoped Git writes;
- Checks: read/write when publishing TreeSeed checks;
- Commit statuses: read/write only when statuses are used in addition to Checks;
- Actions: read, and write only when dispatch/cancellation is enabled;
- Workflows: write only when TreeSeed is explicitly authorized to change `.github/workflows`;
- Administration: avoid by default; enable only for separately governed repository/branch-setting reconciliation;
- Environments, secrets, and variables: retain separate least-privilege paths for the existing workflow and secret-provider features.

Exact permissions must be derived from the GitHub endpoints and webhook subscriptions actually enabled. GitHub documents that App permissions determine available APIs and webhooks and provides accepted-permission diagnostics for failed calls.

Recommended webhook subscriptions are the minimum relevant subset of:

- `issues` and `issue_comment`;
- `pull_request`, `pull_request_review`, and `pull_request_review_comment`;
- `push`;
- `check_run`, `check_suite`, and `workflow_run` when those providers are enabled;
- `installation` and `installation_repositories`; and
- relevant repository lifecycle events for rename, transfer, archive, or deletion observation.

Webhook processing must validate `X-Hub-Signature-256`, use `X-GitHub-Delivery` for deduplication, process asynchronously, and support redelivery/backfill. These follow GitHub's [webhook validation](https://docs.github.com/en/webhooks/using-webhooks/validating-webhook-deliveries) and [webhook best practices](https://docs.github.com/en/webhooks/using-webhooks/best-practices-for-using-webhooks).

### Token mode remains supported

Token authentication is a permanent compatibility mode, not a temporary undocumented bypass. It is useful for local bootstrap, imported third-party repositories, testing, recovery, and installations where an organization owner has not installed the App.

Token mode must:

- prefer a fine-grained personal access token restricted to the required repositories and permissions;
- permit a classic token only as an explicitly configured legacy fallback;
- record credential owner, repository scope, observed capabilities, expiration, and last verification without recording the token;
- store the token only in the API/secret-provider authority domain;
- refuse silent fallback from a misconfigured App to a more powerful token;
- select credentials by explicit binding and operation class;
- expose missing permission, expiration, SSO/organization-policy, and repository-scope failures distinctly; and
- support rotation without changing project or Issue/PR bindings.

GitHub recommends fine-grained tokens over classic tokens and minimum scope/expiration for token use. See [Keeping API credentials secure](https://docs.github.com/en/rest/authentication/keeping-your-api-credentials-secure) and [Managing personal access tokens](https://docs.github.com/en/enterprise-cloud@latest/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens).

GitHub Actions should normally use its repository-scoped `GITHUB_TOKEN` for workflow-local operations. That token is not the credential for the external TreeSeed integration or cross-repository coordination.

## Host/guest and cluster placement

GitHub credential custody follows the same host/guest rule as accelerator administration:

- webhook ingress, App private key, PATs, token minting, provider outbox, and merge authority run in the trusted API/platform-operation plane;
- the QEMU/KVM agent guest receives assignment-scoped repository custody and short-lived bounded Git transport when required;
- agents call TreeSeed plan, status, checkpoint, summary, Issue, and PR tools through assignment-scoped APIs;
- the guest never receives the GitHub App private key, central organization PAT, webhook secret, or unrestricted merge authority; and
- all provider operations produce secret-free receipts and exact read-back.

On a collapsed machine the trusted service and guest communicate over the isolated service network. In a multi-node cluster the same API and provider contracts apply; changing physical placement does not change the GitHub binding.

## Implementation and cutover strategy

### Phase 0: inventory and freeze current behavior

1. Inventory repository, workflow, and secret-provider contracts and every direct GitHub API/`gh` call across SDK, API, CLI, Agent, Admin, and templates.
2. Inventory the current central token, repository overrides, permissions, branch rules, workflows, labels, templates, and webhook state without exposing secrets.
3. Record the current absence of canonical Issue/PR lifecycle integration and prohibit new ad hoc GitHub mutations outside adapters.
4. Define test fixtures for renamed repositories, forks, private repositories, missed webhooks, rate limits, and manual provider drift.

Exit: a reviewed provider graph and no unidentified production GitHub mutation path.

### Phase 1: portable contracts and read-only adapter

1. Implement the portable binding, event, operation, plan, status, checkpoint, summary, review, conflict, and reconciliation schemas.
2. Extend `treeseed.package.yaml` with produced and consumed GitHub work-integration standards.
3. Add GitHub normalization for Issues, comments, PRs, commits, reviews, checks, actors, and repository identity.
4. Implement capability discovery and permission diagnostics for App and token modes.
5. Sync one canary repository read-only using webhook fixtures plus live reconciliation.

Exit: deterministic normalization, compatibility comparison, replay safety, and a `noop` read-only reconciliation.

This phase follows the mandatory four-metadata-contract standards slice; it does not replace it.

### Phase 2: GitHub App installation and inbound sync

1. Register a least-privilege development GitHub App and install it only on the canary repository.
2. Add signed webhook ingress, durable deduplication, async processing, cursor backfill, and redelivery diagnostics.
3. Bind GitHub actors to TreeSeed identities, keeping unknown actors as external participants without assignment authority.
4. Import or link existing Issues and PRs only through an inspected plan.
5. Prove App-key and token material never enters agent, journal, log, or evidence payloads.

Exit: live inbound events reconcile after interruption and redelivery without duplicate lifecycle actions.

### Phase 3: Issue projection canary

1. Publish proposal, defect, research, and coordination Issue forms plus namespaced labels.
2. Project a real project-local proposal and stakeholder comments to one Issue.
3. Project decision and estimate events with exact immutable TreeSeed references.
4. Exercise body edits, label drift, close/reopen, comment edits, unknown actors, and dependency links.
5. Prove no GitHub-only action can create an accepted decision or source authority.

Exit: the Issue is useful to GitHub participants while TreeSeed retains exact lifecycle authority and reconciliation converges.

### Phase 4: assignment and draft PR canary

1. Admit one bounded source assignment from an accepted decision and exact base.
2. Record its plan before source changes without creating an empty commit.
3. Create the draft PR on the first real pushed checkpoint.
4. Project plan revisions, bounded status milestones, exact commits, checks, and completion summary.
5. Interrupt and re-lease the assignment to another agent without replacing the PR or losing attribution.
6. Reject out-of-scope paths, unexpected commits, force-push drift, and stale evidence.

Exit: the four-stage assignment lifecycle is complete, readable, idempotent, and bound to exact commits.

### Phase 5: review, merge, receipt, and recovery

1. Bind TreeSeed review assignments to GitHub requested reviewers and native reviews.
2. Synchronize inline findings and typed dispositions.
3. Publish required checks against exact candidate artifacts and contract attestations.
4. Perform one trusted merge, read back the exact merged ref, issue the integration receipt, settle, and clean up custody.
5. Exercise changes-requested, new-head approval invalidation, closed-unmerged, manual merge, merge conflict, and rollback/recovery paths.

Exit: only the governed path settles and promotes; external merge drift is detectable and recoverable but never silently accepted.

### Phase 6: portfolio and standards integration

1. Add Issue/PR bindings and exact provider receipts to the Platform composition and portfolio registry.
2. Use contract compatibility results to choose required reviewers, checks, version bump, and affected consumer test kits.
3. Prove a compatible SDK patch uses one SDK Issue/PR and changes no consumer repository.
4. Prove a breaking producer change creates explicit downstream project-local work rather than cross-repository authority.
5. Run a multi-project initiative with coordination Issue, project-local Issues, dependent PRs, and federated integration receipt.

Exit: GitHub collaboration respects independent project ownership and semantic release boundaries across the portfolio.

### Phase 7: rollout and legacy retirement

1. Roll out App installation and templates repository by repository through inspected reconciliation.
2. Retain explicit token bindings and test both App and token acceptance paths.
3. Enable automatic writes only after read-only sync and permission health pass for that repository.
4. Activate guarantees for inbound replay, outbound idempotency, actor authorization, assignment interruption/resume, review, merge, recovery, and zero residue.
5. Remove direct Issue/PR mutations, duplicated webhook handlers, and GitHub-specific lifecycle logic outside the adapters.

Exit: every bound project has verified provider health, templates, sync, lifecycle guarantees, credential rotation, and rollback.

## Required guarantees

The integration is not complete until live or packaged acceptance proves:

- provider swapping does not change proposal, assignment, review, or receipt semantics;
- every Issue and PR binding survives restart and webhook redelivery without duplication;
- outbound replay produces one provider effect and authoritative read-back;
- GitHub edits cannot mutate a decided proposal revision;
- labels, closure, assignment, reactions, and comments cannot mint decision or source authority;
- an assignment can be interrupted and re-leased while preserving one PR and exact attempt attribution;
- unauthorized commits, paths, force-pushes, base changes, and stale reviews fail closed;
- commits and merge results are observed from GitHub rather than trusted from agent messages;
- manual merges do not settle until explicitly adopted through governed verification;
- App and token modes both pass least-privilege, rotation, expiry, and secret-nondisclosure tests;
- cross-project initiatives retain project-local decisions and PRs;
- compatible producer patches do not modify consumer repositories;
- successful merge produces exact receipt, settlement, remote read-back, and zero assignment residue; and
- GitHub unavailability queues bounded work, exposes degraded status, and recovers without losing TreeSeed authority.

Until these guarantees pass, GitHub Issues and PRs are an optional synchronized visibility surface. They are not evidence that the standards-based development cutover, agent lifecycle, or production release path is ready.
