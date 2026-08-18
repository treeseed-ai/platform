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
- Active repositories: `treeseed-ai/cli` and `treeseed-ai/platform` local-Market-disabled bootstrap integration
- Next repository: `treeseed-ai/sdk`
- Next action: publish, independently review, merge, and read back the bounded CLI/Platform bootstrap changes; then create the governed SDK canary worktree at `f843c3cb…`.
- Pending human checkpoint: `H-001` Ubuntu host discovery; non-blocking for guest-side SDK standards work.

## Accepted and observed baselines

| Subject | Exact identity | Disposition |
| --- | --- | --- |
| Platform prior staging | `5106b11b8945608aa185840a3b3ca74b98f90c50` | SDK-first documentation base |
| Platform staging | `8de5440e7dec41a225333d15e6e62bb8f53429c6` | PR [#1](https://github.com/treeseed-ai/platform/pull/1) merged; exact remote read-back verified |
| CLI staging | `37bdc9fb82656b0607410328685e6cbe75ebedc5` | PR [#1](https://github.com/treeseed-ai/cli/pull/1) independently reviewed, merged, and read back; tree `94b2f10571611149f7ed5a4593e7ad515033a349`, lock SHA-256 `8d4c5b4ed48fae8d0115cca63a00880d823dcc0fbab9c40cca19e1265d0c6f8c` |
| CLI local bootstrap candidate | `8d608e474b8e349192b4e4e74cc580e2d6f03e1e` | Draft PR [#2](https://github.com/treeseed-ai/cli/pull/2); complete local verification passed 237 tests, packed-install smoke, and tool-closure pack; independent review and hosted exact-head check pending |
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
| 0. Truthful Platform and SDK baseline | `in_progress` | Platform, CLI/API bootstrap, then SDK | Ready Platform runtime; exact 13-repository workset; governed SDK source canary; clean `0.12.63`; no consumer ref movement; zero residue | Local API is healthy at accepted `b18379fe…`; the local seed is converged and the exact 13-repository read-only workset is verified. CLI/Platform Market-disabled bootstrap changes require PR integration before the SDK canary. |
| 1. SDK standards foundation | `queued` | SDK, Platform composition; API read-only consumer case | Four portable metadata contracts; TS/OpenAPI comparison; SDK `0.13.0-rc.1`; exact composition | Starts only after Gate 0 source canary. |
| 2. SDK-only save/stage/release | `queued` | SDK, CLI wrapper when adopted | PR-gated save/stage; bounded package release; local and live acceptance | Other packages must fail with `standards_migration_not_enabled`; unscoped release stays fail-closed. |
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
6. **Workset — verified read-only baseline** — CLI candidate `8d608e474b8e349192b4e4e74cc580e2d6f03e1e` in draft PR [#2](https://github.com/treeseed-ai/cli/pull/2) loads `seeds/treeseed.yaml` without constructing a Market/API client when `development.local.marketConnectivity: disabled`. Live plan resolved exactly thirteen permitted staging heads and apply wrote `.treeseed/worksets/platform/latest.json` with status `verified`; its SHA-256 is `6e4e7424242e7f15508752bab7cfb5a644e71f5483f3020422685afeb2dc3660`. Immediate apply read-back and a separate replay plan both reported `create=0`, `noop=13`, `blocked=0`. API is `b18379fe…`, SDK is `f843c3cb…`, all checkouts are detached/read-only, and Market, Market API, content repositories, and gitlinks are absent. The candidate passed 237 package tests, packed-install smoke, and tool-closure pack. A later assignment-owned clean Platform checkout may grant assignment-write custody to SDK alone.
7. **SDK canary** — start from a fresh checkout at `f843c3cb…`; reproduce only the malformed type-query and standalone test-fixture repairs; use the current governed lifecycle and a conventional review PR; require exact merge/read-back/settlement/cleanup.
8. **Patch proof** — compare the packed candidate to `0.12.62`, prove no public contract change and no API/Agent/CLI/Core/Admin/UI ref movement, then request human approval for main merge and npm `0.12.63` publication.

Before workset materialization, dependency installation, or image construction, re-read guest storage. `H-002` restored 31 GiB free. An inspected cleanup then removed 11,530,907,807 bytes of reproducible `node_modules` and Cargo `target` material from clean transitional checkouts, increasing free space to 43 GiB before CLI acceptance and 40 GiB afterward. TreeDX data, registered worktrees, receipts, dirty recovery checkouts, the unpublished SDK commit, and the TreeDX scene change were preserved; the running TreeDX service remained healthy. Reclaiming container storage must use an inspected managed cleanup path; an ad hoc Docker prune is not accepted evidence.

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
