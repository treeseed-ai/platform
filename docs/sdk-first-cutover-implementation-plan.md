# SDK-First Standards, GitHub, and Cluster Cutover Ledger

## Operating contract

This tracked ledger is the canonical implementation and progress record for the SDK-first cutover. It integrates the independent-development standard, GitHub work-provider architecture, Platform development migration, and collapsed host/guest cluster profile.

Update this file only when a gate changes state, evidence is accepted or invalidated, a human checkpoint is issued or resolved, or the next executable action changes. `CONTINUE.md` is the ignored, concise session handoff. A gate is `verified` only after exact authoritative read-back and residue checks.

Allowed states are `queued`, `in_progress`, `waiting_human`, `blocked`, `verified`, and `superseded`.

Hosted deployment, unscoped `trsd release`, and production promotion remain fail-closed. Platform must never check out, provision, or deploy Market or Market API. Content repositories remain TreeDX/R2 bindings and are not Platform software workset checkouts.

## Current checkpoint

- Updated: 2026-08-18
- Active gate: Gate 0 — truthful Platform and SDK baseline
- State: `in_progress`
- Active repository: `treeseed-ai/platform`
- Next repository: `treeseed-ai/sdk`
- Next action: integrate and verify the bounded Platform documentation/ledger change, then make Platform's package-local verification contract truthful before attempting runtime reconciliation.
- Pending human checkpoint: `H-001` Ubuntu host discovery; non-blocking for guest-side SDK standards work.

## Accepted and observed baselines

| Subject | Exact identity | Disposition |
| --- | --- | --- |
| Platform staging | `5106b11b8945608aa185840a3b3ca74b98f90c50` | Accepted documentation baseline; current checkout contains the bounded uncommitted architecture/ledger change |
| SDK remote staging | `f843c3cb11853db737d28ecc6bcc3d5df5e183e9` | Required fresh canary base |
| SDK published package | `@treeseed/sdk@0.12.62` | Current npm `latest` baseline |
| SDK diagnostic commit | `c6db3626ab3cecd3dc74c321b40bb37e94c503eb` | Unaccepted diagnostic input; never cherry-pick implicitly |
| API accepted staging | `b18379fe1521339f71dbf85cf519eed95fe556c2` | Required Platform bootstrap input |
| API ref recorded by Platform staging | `4bf65d95f8b14b390b0c9213824f1e77d6597692` | Transitional mismatch to reconcile without portfolio fan-out |
| Guest | Linux Mint KVM, `192.168.122.99/24` | Active application/agent development node |
| Host | gateway observed at `192.168.122.1`; privileged state unobserved | Requires `H-001` human discovery |

## Gate ledger

| Gate | State | Owning repositories | Exit evidence | Current note |
| --- | --- | --- | --- | --- |
| 0. Truthful Platform and SDK baseline | `in_progress` | Platform, then SDK | Ready Platform runtime; exact 13-repository workset; governed SDK source canary; clean `0.12.63`; no consumer ref movement; zero residue | Platform docs/ledger change is being prepared. SDK hosted CI currently fails on a malformed guarantee test and missing local-provider source-closure projection. |
| 1. SDK standards foundation | `queued` | SDK, Platform composition; API read-only consumer case | Four portable metadata contracts; TS/OpenAPI comparison; SDK `0.13.0-rc.1`; exact composition | Starts only after Gate 0 source canary. |
| 2. SDK-only save/stage/release | `queued` | SDK, CLI wrapper when adopted | PR-gated save/stage; bounded package release; local and live acceptance | Other packages must fail with `standards_migration_not_enabled`; unscoped release stays fail-closed. |
| 3. SDK GitHub work-provider contracts | `queued` | SDK | Provider-neutral contracts; GitHub normalization/templates; token canary; next SDK RC | PR binds assignment/checkpoint, never lease. |
| 4. API and CLI authority | `queued` | API, CLI | Durable sync/outbox/bindings; authenticated routes; CLI parity; replay-safe canary | Consumers change only through their own governed adoption. |
| 5. Agent and review integration | `queued` | Agent, API, SDK | Deterministic simulations plus one live planning/acting/review/integration chain | Baseline, clean repeat, and interruption/resume required. |
| 6. GitHub App parity | `queued` | SDK, API, Platform secrets/reconciliation | Token/App parity; rotation/expiry/permission-loss evidence | Required before final SDK `0.13.0`. |
| 7. Host/guest development profile | `waiting_human` | Platform, AI, Agent, host operator | Isolated capacity network; exact host runtime; positive and negative boundary proof | `H-001` is open but does not block Gates 0–3 guest-side work. |
| 8. Portfolio expansion | `queued` | Live inventory, one project at a time | All 31 registry entries; independent releases; fifteen guarantees; Guide campaign | Order begins API, CLI, Agent, Platform, Admin, then derived dependency graph. |

## Gate 0 work breakdown

1. **Platform documentation and ledger** — preserve the cluster, standards, and GitHub direction; link this ledger; run `git diff --check` and `npm run verify`; integrate as one bounded Platform documentation change.
2. **Platform package-local contract** — add and verify `verify:local` without weakening `verify`; prove `trsd save` no longer depends on the transitional Market CLI path.
3. **Bounded API bootstrap reconciliation** — consume API staging `b18379fe…` without a portfolio-wide exact-ref fan-out; record plan/apply/read-back receipts.
4. **Managed runtime** — start the local Platform stack and verify exact SDK/API/Agent source-closure and image identities.
5. **Workset** — materialize the thirteen inventory-authorized software repositories; SDK alone receives assignment-write custody; reject forbidden and dirty identities.
6. **SDK canary** — start from a fresh checkout at `f843c3cb…`; reproduce only required fixes; use the current governed lifecycle and a conventional review PR; require exact merge/read-back/settlement/cleanup.
7. **Patch proof** — compare the packed candidate to `0.12.62`, prove no public contract change and no API/Agent/CLI/Core/Admin/UI ref movement, then request human approval for main merge and npm `0.12.63` publication.

## SDK target interfaces

The first compatible minor line adds bounded public entrypoints:

- `@treeseed/sdk/standards` — contract bundles, compatibility attestations, compositions, registry entries, fingerprints, semantic bump results, and shared errors;
- `@treeseed/sdk/standards/typescript` — normalized TypeScript public API extraction and comparison;
- `@treeseed/sdk/standards/openapi` — normalized OpenAPI extraction and comparison;
- `@treeseed/sdk/work-providers` — provider-neutral work items, change requests, plans, milestones, checkpoints, summaries, reviews, events, operations, conflicts, and sync contracts; and
- `@treeseed/sdk/work-providers/github` — GitHub normalization, templates, managed markers, auth capability selection, and provider adapter behavior.

The package manifest gains versioned `standards` declarations. Package commands build contracts, compare compatibility, resolve a composition, and verify the packed artifact deterministically.

SDK workflow semantics converge to:

- `save`: assignment authority → package proof → contract/attestation → commit/push → draft PR update;
- `stage`: exact PR head/reviews/checks → feature-to-staging merge → read-back → immutable prerelease;
- `release --package @treeseed/sdk`: accepted staging composition → human-approved staging-to-main merge → npm publish/read-back;
- every non-migrated package: explicit `standards_migration_not_enabled`;
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
nvidia-smi --query-gpu=name,memory.total,driver_version --format=csv,noheader
docker version --format '{{json .Server}}'
df -h /
ip -brief address
ss -ltnp
```

- Expected result: identify the Mint VM domain, current libvirt networks, working NVIDIA/container runtime, available host storage, address collisions with `10.77.0.0/24`, and existing listening services.
- Resume criterion: sanitized command output is supplied; the agent then emits an exact inspected plan for the isolated service network and trusted capacity runtime.

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
