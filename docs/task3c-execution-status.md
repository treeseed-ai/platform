# Task 3C execution status

Work is authorized by the maintainer's acceptance of UI setup, request for mobile-first rendering and explicit resumption. This is an in-progress ledger, not accepted release/composition evidence. Preserve the independent owner repositories, Identity/Keycloak authority, historical formats, original services and all open issues. Task 3D remains gated.

## Published UI baseline and owner candidates

UI `cordis` is the reviewed setup-only bootstrap `d24d02ab842fe9fd431eb840b2a91083c086027c`, from UI source `034b8811e42d7bededb8e2444ca4c099d79de4a3` and Platform `382eefad709a5fa3d60944f3540ded5d8d8f2c01`. UI #79 records explicit approval/publication/resumption. No original UI checkout was cleared or rewritten.

The UI feature is split into independently verified candidates targeting `cordis`:

| Candidate | Head | Private package | Verification |
| --- | --- | --- | --- |
| [UI #81](https://github.com/treeseed-ai/ui/pull/81), contracts/enforcement | `2bb9ecd31a48822de3b9538430cd90baa00d62b6` | `0.0.0-cordis.1` | check/build; 3 unit, 1 integration, 1 public-program smoke; push + PR CI green |
| [UI #82](https://github.com/treeseed-ai/ui/pull/82), React/server/terminal | `c073b0783fd8021e4ca4152ebbe1a57d6752aebb` | `0.0.0-cordis.2` | check/build; 4 unit, 6 integration, 2 program smoke; push + PR CI green |
| [UI #83](https://github.com/treeseed-ai/ui/pull/83), browser/Astro | `c146508bb0dc85b3f8cf834970350977232427fd` | `0.0.0-cordis.3` | check/build; 4 unit, 8 integration, 5 program/browser smoke; push + PR CI green |
| [UI #84](https://github.com/treeseed-ai/ui/pull/84), exact SDK adoption | `1617b2134a39671a93ae41cada5617ccdb4850b9` | `0.0.0-cordis.4` | check/build; 5 unit, 8 integration, 5 program/browser smoke; push + PR CI green |

All CI above uses Ubuntu 26.04. The candidates remain drafts pending complete Task 3C integration/review. Merge in order only after the maintainer's eventual review and refreshed gates. The original complete `feature/80-task3c` branch is retained as an unmerged split-source snapshot; do not delete it merely by branch ancestry.

Historical UI foundation archive (new owner adoption must use the later verified candidate): source `c146508bb0dc85b3f8cf834970350977232427fd`, SHA-256 `7bda2e95205e848838a784ce147e2ff12176f2563dae5330442a63cf56b05729`. The temporary development artifact is `/tmp/cordis-task3c-artifacts/treeseed-cordis-ui-0.0.0-cordis.3.tgz`; this path alone is not a reproducible pin. Later owner commits must vendor/verify the exact public archive and record its source/digest.

Six React class components (text/status/table/form/navigation/feedback) have real browser proof at 320/375/768/1024/1440/1920/2560, actual 16px/32px text measurement, long content, 44px targets and bounded semantic-table overflow. Native component/theme/server/terminal alternatives share a contract suite; browser replacement/read-back/cleanup is exercised. A genuine packed archive is consumed by Astro SSR/interactive hydration and a standalone React browser root. No hydration mismatch or server-renderer code remains in Astro browser assets. Contribution identity binds selected provider/model-schema/style alongside presentation/asset/action admission. No Astro implementation ships in UI; native mobile/Electron remain future qualification.

## SDK contract and native lifecycle stack

SDK #460 is split into five dependent draft candidates targeting `cordis`. Each incremental
slice changes at most ten files; preceding candidates remain included until integration review.

| Candidate | Exact head | Local verification |
| --- | --- | --- |
| [SDK #461](https://github.com/treeseed-ai/sdk/pull/461), extensible contracts | `48424078c9339e6a0c0417432fae0d3bbcfd0d11` | check/build, 21 tests |
| [SDK #462](https://github.com/treeseed-ai/sdk/pull/462), portable native composition | `b34024fe3e9a4305fae1c55de03e26c407318403` | check/build, 24 tests |
| [SDK #463](https://github.com/treeseed-ai/sdk/pull/463), exact package management data | `68c3ff9eb4606b33dd47fc453218e9b29988f380` | check/build, 31 tests |
| [SDK #464](https://github.com/treeseed-ai/sdk/pull/464), service journals/private protocol | `38657dc7634dd38eb3dfb20edc9abde15bf080b3` | check/build, 41 tests |
| [SDK #465](https://github.com/treeseed-ai/sdk/pull/465), native replacement lifecycle | `fc36ec1c66d275336de40f292c992d1047e1fcd8` | check/build, 51 tests |

Latest push/PR verification and work-authority description gates passed for these exact heads.
Earlier description-validation failures on #461/#462/#464 were corrected with the canonical
repository template and actual exact refs; no policy was changed. SDK CI currently remains on
its existing Ubuntu 24.04 workflow; UI and the new Deployment plan gate use Ubuntu 26.04.

The final SDK private `.7` archive SHA-256 is
`dedc2c3b13fcd9d87b3f9c94a6490cdf398b6eca4746823b8eb0c99bca02a575`, from
`fc36ec1c66d275336de40f292c992d1047e1fcd8`. UI #84 and Deployment #911 consume exact
vendored bytes through public exports. Earlier `.5`/`.7` archive digests in historical candidate
evidence are superseded for new adoption; do not substitute bytes under their old digest.

Contracts include scoped credential grants, typed provided ports/dependencies/probes, service
resource receipts and snapshots, private worker3 requests and safe envelopes, native package
metadata and exact source/helper/image data. Seven public operation IDs and historical readers
remain. Native scope replacement closes admission, drains held leases, disposes old effects,
mounts an owner-inspectable candidate and reopens only after explicit owner commit. A built Node
program replaces a real listener on the same port, reads old/new responses and verifies cleanup.
Shutdown during replacement, concurrent writers, failed constructors and asynchronous Config
failures have regression checks. Mounting alone makes no application-active claim.

## Deployment artifact and plan slices

[Deployment #911](https://github.com/treeseed-ai/deployment/pull/911), exact head
`36599d3a9cb3ed9faa649cdcc26fccaa5af5acf7`, verifies complete format-3 local bundles,
locked archives, native export/configuration projections, package-owned OCI selection edges,
recipes and assets without provider imports or installation state. Local check/build and
38 tests pass; push and PR CI are green. Genuine compiled container/probe fixture exports and
a separately calibrated import canary prove the archive and metadata agree. Five named
instances share provider exports; instance identity is independent of a fixed role catalog.

The following service-plan slice, `feature/910-task3c-service-plans`, extends the real default
host with format-3 planning and private persistence. Its built program verifies deterministic
five-instance plans, private modes, read-back after source removal and unchanged Docker
resources/images/listeners/credentials. Tests also verify stable per-service generations when
a sixth private instance is added, blocked-plan state absence, explicit legacy migration
refusal, malformed/private journal rejection, doctor recognition and read-only engine commands.
Local full check/build/44 tests passed; final candidate source and CI are recorded in its PR.
This slice deliberately accepts plan-only state; active resource retention and migration still
require the subsequent durable worker implementation and qualification.

## Additional exact candidates

- [UI #85](https://github.com/treeseed-ai/ui/pull/85): native package metadata/assets, head `b81f02d16c87bbcb6f534eed449d487415cdea09`; 20 local tests and exact-head Ubuntu 26.04 CI green. UI `.5` archive SHA-256 `de3b897dc0b821cfffc038ce32469b1ab84b456ded706921c6e65aca8dd085c0`.
- [SDK #466](https://github.com/treeseed-ai/sdk/pull/466): instance-neutral projection/helper contracts, head `a8c2c3532482b3f68dc75f3abdf90dbd40b904b2`; 59 tests and exact-head CI/description gates green. SDK `.8` SHA-256 `5d58eef491456c4db22fcca914daf30bcac447cd5ebcff3bc1933574b8a82624`.
- [SDK #467](https://github.com/treeseed-ai/sdk/pull/467): acyclic runtime image associations and actual owner Firefox composition gate, head `85a7b6036c9a390a5c56b9db419fc5b6f8f8cd77`; 62 tests and exact-head Ubuntu 26.04 CI/description gates green. SDK `.9` SHA-256 `80337c6ad9cb4f493fa06ed9a22e3863ae41610cc1027817bd54c1eece3954d3`. New owner adoption uses this candidate.
- [Deployment #912](https://github.com/treeseed-ai/deployment/pull/912): plan-only persistence, head `aef0988c424eae7426b6475d1652a69507a979fc`; 44 tests and Ubuntu 26.04 CI green.
- [Deployment #914](https://github.com/treeseed-ai/deployment/pull/914): materialize owner projections, validate standard formats, bind asset sizes and prepared helper inventories, head `92dd54cf1ebfdd8329402e7478e939294e029d9e`; 51 tests and exact-head CI green. Deployment `.6` SHA-256 `956dcc611cfbb1a1e646db35b284a6cc6a05719cd4dd6ddb6bd50009abda0bdc`.
- [Deployment #915](https://github.com/treeseed-ai/deployment/pull/915): acyclic exact runtime image/entry/closure bindings, head `93c5b885d96b9eb28be595911a661793e4d53cd5`; 54 local tests, exact-head CI pending at this ledger update. Deployment `.7` SHA-256 `41413b5f195f0f8c518b8c86a972692c5c6c3a4d45e22a72ea327a21860329c0`.

The runtime-image regression assembles genuine compiled archives and explicit zero-layer OCI inspection fixtures in dependency order, verifies a new unrelated package leaves the runtime image identity unchanged, and rejects changed/missing packaged entries. It does not claim real installed API activation. Platform #732 tracks the missing self-hosted assembled build check; no placeholder hashes or process-policy edits were introduced. Prepared helper inspection uses a bounded tar/gzip tree with exact 0400/0500 file modes; genuine standard Bun/Git acquisition/execution remains later acceptance.

SDK `.9` now includes its own actual Firefox lease-drain/replacement/read-back/effect-cleanup program. The earlier SDK CI description above applies to the prior candidates only. UI's next slice adopts `.9` and centralizes default package identity; reusable host document/layout and owner application adoption remain in progress.

## Reusable document/composition continuation

UI's current implementation adds a seventh `stack` component/provider, a bounded lease-retained
tree with per-child provider/schema/style identity, complete server documents and validated
standalone/Astro hydration. All visible components still qualify at seven widths and actual
100%/200% text sizing. Public action context stays in validated model data; no credentials,
authentication implementation or domain endpoints moved into UI.

| Candidate | Exact current head | Verification / private archive SHA-256 |
| --- | --- | --- |
| [UI #86](https://github.com/treeseed-ai/ui/pull/86), SDK .9 adoption | `f1c31017a8ceb10f6a4a501ba4175c96f8eaaac4` | 20 tests, CI green; `.6` `a9ea2ddcfec950ee099c6b314b71273ad65b89a8f7d13b7a141a4b7aa48b4c3c` |
| [UI #87](https://github.com/treeseed-ai/ui/pull/87), checked default identity | `96b241672a136d8a0aaed2ba4c9208bfbf08e933` | 20 tests, CI green; `.7` `caf4f61a58a453e0fb70cf121d6fb5a8dd17d1d36fae5b42ae89f8927d5cec44` |
| [UI #88](https://github.com/treeseed-ai/ui/pull/88), composite server/terminal | `6a2dc472a85807519dbb863cc7a44f3e2c10a7db` | 24 tests, CI green; `.8` `ce03cfe9c43d23ecac6b87ae862916456b0cb6e331b8249f9061998a340de3d9` |
| [UI #89](https://github.com/treeseed-ai/ui/pull/89), composite browser/Astro | `12c78351a2ede4c2eae28f2fbdc72a0c69e9590b` | 25 tests, CI green; `.9` `1c0eb6b6c3e1dfae230b43e8d820a961678accafee59d2699a02710c003b9d3d` |
| [UI #90](https://github.com/treeseed-ai/ui/pull/90), complete documents | `012172bb804cab2356d16e84538c040de7418de6` | 27 tests, CI green; `.10` `ff901f38c80cdd4ed59e13ca48e4be5fe712e542c005427ff974706237456d75` |
| [UI #91](https://github.com/treeseed-ai/ui/pull/91), stream boundary fix | `624519a2f9d6a4ba1376979b4bdaf5497d75bf64` | 28 tests, CI green; `.11` `5be30ea9d91ca99f6fcbfd6445f347bea05f0a652b2d268dd7cb5a63f4a8205e` |

UI #87's initial compiler-pair regression exceeded Bun's default five-second test budget on
CI; the outer limit now accommodates two separately bounded 30-second compiler invocations,
and both exact-head CI runs are green. UI #91 corrects a consumer-gate false positive on native
stdout/stderr/class writes, retaining direct/aliased/computed document-write refusals. CLI
adopts `.11`; earlier intermediate UI archives above are historical candidate evidence.

Deployment #915 now has exact head `c43b66d6609dc6b7815c22b081c3b1fa6605280f`, 55 local
checks and exact-head CI green. Its public compiled fixture constructs from an unrelated CWD,
resolving its module within its own package. Updated `.7` archive SHA-256:
`4d247d7cfa8528b3cb5efa8fcb113a34340d87c392199fffb557ebf285032a4b`.
This supersedes the earlier unconsumed `.7` archive listed above. SDK remains the exact `.9`
source/archive already recorded. CLI human presentation adoption is underway through these
three public archives; no owner source imports or legacy checkout changes were introduced.

## CLI and Identity consumer continuation

- [CLI #318](https://github.com/treeseed-ai/cli/pull/318), head `20a813fb68e9520f6758ca2259673e63acaeb161`: human diagnostics/plans/status/errors now map to UI models through the public terminal renderer; machine JSON/exit/streams stay CLI-owned. Exact SDK `.9`, Deployment `.7` and UI `.11` archives are vendored. Strict owner/UI-boundary check, standalone compile and 15 tests passed; exact-head CI/description validation green. Built binary SHA-256 `682a968e259c3389ad3c218a234ab8e126d12da5a5b09697331f5465a1f38217` at that source.
- [CLI #319](https://github.com/treeseed-ai/cli/pull/319), head `a79e4bc57a5c4bd62eeb38bf19503e0fbf6a83ca`: qualified Ubuntu 26.04 positive gate, with prerequisites required. All 16 checks passed locally and in exact-head CI. The actual standalone CLI saves/repeats/reads a genuine five-instance format-3 bundle, produces UI service tables, operates with Docker-only PATH and leaves resources/listeners/credentials/import canary unchanged; tampered archives block without saved references. This is planning, not installed activation.
- [SDK #468](https://github.com/treeseed-ai/sdk/pull/468), head `32aea4a7be9ccde3a06dd8552020ab1042cc694d`: accepted probe context/runtime evidence, private writer-owned plan requests and exact prepared external images. All 66 local tests and exact-head CI/description gates passed. SDK `.10` SHA-256 `a94dfd38f1d4bae09b211f1517cddb620bb5bbbb3a6afa46cfa9c8e857242393`. Durable enforcement still needs the worker implementation.
- [Identity #47](https://github.com/treeseed-ai/identity/pull/47), head `63565e5b7f6f0eb7c720d9d5e035812b3a5894f4`: named instance-neutral Keycloak container and bounded OIDC discovery probe, exported persistence/OIDC/session provider classes and five format-4 projections. All six checks and exact-head Ubuntu 26.04 CI passed. Identity `.2` SHA-256 `d9ac6c80345ae976efa2d27f0809e617656cb57ae3260835794d2a0ff9c28753`. Real Keycloak login/session/default-worker/resource retention remain required assembled gates.
- [UI #92](https://github.com/treeseed-ai/ui/pull/92), head `2f0fbbf65b68606a9ad62d851035cad8f3fdcc6f`: adopt exact SDK `.10`; 28 local checks and exact-head CI passed. UI `.12` SHA-256 `e1c20d1702854ffd49b05d7db5874eea5f5665ca8c22a5f424e0525b1c921bf2`.

## Verified reusable model updates and Admin presentation

- [UI #93](https://github.com/treeseed-ai/ui/pull/93), exact head `f1de1270bc6ac131a3f259c6d98aea3fa24e7bc9`: `.13` model updates preserve draft/focus, reject invalid/concurrent updates and drain admitted actions before cleanup. All 28 owner checks and both exact-head Ubuntu 26.04 CI runs passed. React development passive-effect inspection exposed a retained render-prop reference to a released Cordis proxy; prepared nodes now contain validated models/stable class data while borrowed provider leases stay private. Twenty repeated updates guard this race. Archive SHA-256 `7077c9a81d32cbc6e158267b57244ca4fe2937bb74d3a7a9c6b4d0f48c012cf7`.
- [Admin #138](https://github.com/treeseed-ai/admin/pull/138), exact head `5ba0cf826edcf1b05d78b9be34563958a91fe725`: exact SDK `.10`, Identity `.2` and qualified UI `.13` adoption. Fresh-cache frozen install, all three historical owner checks and both exact-head Ubuntu 26.04 CI runs passed. CI caught a stale Bun file-tarball SRI hidden by the warm local cache; the refreshed lock is verified. Platform #734 tracks mechanical source/archive/lock receipts separately.
- [Admin #139](https://github.com/treeseed-ai/admin/pull/139), exact head `0c5e0a1a5b7e7a3230ddb6ebdf0298d3f966cb86`: native asset/presentation/data/action/navigation providers consume UI's complete React document/hydration/models. Admin retains sessions, Origin/CSRF/cookies/routes/navigation; Identity retains Keycloak. All six local owner checks pass, including a real Firefox/private-CA browser flow and negative asset/presentation-source tests. `.3` archive SHA-256 `1e1ac2e9b90c5b27f26f756621544a2329942b141bf4e26d07feca1cfef1233c`. Both exact-head Ubuntu 26.04 verify checks passed. Authority fixtures are explicit: genuine installed Keycloak/API/worker and asset/image replacement remain assembled acceptance.

No source/acquisition or installed activation success is claimed by these UI/consumer checks.

## Deployment observer, journal and native staging continuation

| Candidate | Exact current head | Verification / private archive SHA-256 |
| --- | --- | --- |
| [Deployment #916](https://github.com/treeseed-ai/deployment/pull/916), observer client | `506b62e6f6734b496d5ab470f2bd6770ed5ebcef` | 59 owner checks and both exact-head Ubuntu 26.04 CI checks passed; `.8` `f548d60bb8fcf69b9ccfc739cb8d136c1d08c01beea8e6134dda5e619345c0f5` |
| [Deployment #917](https://github.com/treeseed-ai/deployment/pull/917), ordered journal | `a6828e8eb34e4cc15db42878e22db223561ebc8a` | 62 owner checks and both exact-head Ubuntu 26.04 CI checks passed; `.9` `e8e3f2cb2ef26caddf77f80ec10de98cf4233690a52f3af842217d82eebe9225` |
| [Deployment #919](https://github.com/treeseed-ai/deployment/pull/919), writer authority correction | `1dbf0c7e61f9394c42870f72e4ee7245003cc891` | 63 owner checks and both exact-head Ubuntu 26.04 CI checks passed; `.10` `a0832a1030c547c74928ad0eac489e388c23a4a6362f8fc0285a83a9ba605d37` |
| [Deployment #920](https://github.com/treeseed-ai/deployment/pull/920), immutable native staging | `3efe30c24fe088644161ac16f8c15c585fd40eab` | 67 owner checks pass locally; exact-head CI pending; `.11` `5045d36dba4875e7c41e5585723b7cbe9a7be465d73245e902b359d774b0e880` |

The observer uses a read-only `host.sock` contract; the forthcoming worker must enforce separate
owner-control dispatch, not rely on client methods as permission boundaries. The same format-3
store/publisher/writer now validates ordered application intent, retries, scope, immutable resource
versions and committed snapshots. Ready journal completion requires a matching ready snapshot;
its tests use explicit observations, not runtime evidence. Staging qualifies complete private
archive closure, named native classes and two genuine Cordis scopes. Locked peers are copied;
unrelated package changes leave the provider identity unchanged. No imports/scripts occur until
explicit accepted activation in the program fixture, whose engine is labelled and starts no
containers. The future real engine/probes must supply actual observations and retained identities.

Review reproduced an existing writer gap: modifying `owner.json` after acquisition did not
revoke authority and cleanup could remove a changed record. Open [Deployment #918](https://github.com/treeseed-ai/deployment/issues/918)
records the missing check and correction in #919. The writer now pins bytes/inode identity,
permanently fences detected changes and preserves uncertain locks while closing descriptors.
Its red/green regression and existing writer tests passed. This is a bounded runtime correction;
no process instruction files changed. All new and existing issues remain open.

## Remaining authorized Task 3C work

API #624 still has a documentation-first branch with runtime changes outstanding.
Identity #46 has the named provider/probe slice above; Admin #137 has exact artifact adoption and reusable presentation candidates above. CLI #317 now has its reusable human presentation implementation
in progress; final installed/source integration and assembled verification remain outstanding. Platform #726 still needs exact final artifact/composition pins
and assembled acceptance. Continue reusable UI host
presentation, the generic container/probe worker and durable resource/credential/TLS retention,
Identity/API owner metadata and actual target read-back, Admin/CLI UI adoption, pinned standard
source/helper acquisition and registry, then exact Platform assembly.

Provider-owned container declarations must support instance-selected dependency endpoints and
credential grants without hard-coded role names; verify that projection while adapting the real
Identity/API providers. Current static fixture projections alone do not qualify that seam.
The initial planner is not evidence of installed fifth-service activation or safe live swap.
Mandatory genuine fifth-service/two-instance/new-probe activation, NPM/HTTPS-Git retry, safety
and trust gates, old-format migration/refusal, resource/credential/TLS preservation and Ubuntu
26.04 assembled gates remain unchecked. Agent initialization/Task 3D remain outside this task.

Process gaps remain tracked separately in Platform #734 (mechanical owner/lock receipts), #724 (copied authorization text), #729
(normalized native defaults/configuration projection) and #732 (assembled self-hosted image/consumer boundaries). No opportunistic process-policy edits accompany these features.
API's restored committer policy per #620 remains untouched. On this checkpoint the owning
issues, UI setup #79 and Platform #678 were read back as open. No integration merges, tags,
production channels or original services were changed.

The [approved implementation plan](superpowers/plans/2026-10-24-task3c-extensible-plugins-ui.md)
remains the acceptance authority. Task 3C implementation and isolated acceptance are authorized;
none of these candidate results authorize production cutover or changes to legacy installations.

## Verified credential and OCI preparation continuation

- [Deployment #921](https://github.com/treeseed-ai/deployment/pull/921), scoped private credentials/configuration: `670bfdb98d2de65509ea70acecc813bc16cabab1`, 72 owner checks and both exact-head Ubuntu 26.04 CI runs green. `.12` SHA-256 `a610e170e32a5fd6e84835b3acc6b1351c5ba692429f39bc4afeb768573f774e`. Real archived declarations qualify separate instance secrets, explicit dependency/probe grants, stable existing bytes/paths/creator receipts and bounded template expansion before publication. This is private preparation evidence, not installed readiness.
- [Deployment #922](https://github.com/treeseed-ai/deployment/pull/922), exact native OCI image preparation: `322dfdf8f2782ac0c925e41b8620b9f8dcbe37aa`, 74 owner checks and both exact-head Ubuntu 26.04 CI runs green. `.13` SHA-256 `b7d0fa5a8f1b385dcbaa3ec165323a65d306844fd2abaa3ced7d181b637e5b1c`. Built Node program loads a genuine uniquely identified zero-layer OCI inspection fixture, verifies private persistence/reuse and unchanged runtime-resource inventories. It creates no credentials/containers and makes no runnable application or readiness claim. Incomplete cache entries, unsafe private modes and changed input bytes are rejected.

The bounded generic container actuator is now in progress in Deployment. The durable worker,
owner protocol probes, retained active transitions, explicit historical-format migration,
source management/CLI commands, API adoption and complete assembled Task 3C acceptance remain
unverified. Drafts remain open for the eventual integrated review; no Task 3C merge is authorized
by this progress record. All release-policy issues, including #678, remain open.

[Deployment #923](https://github.com/treeseed-ai/deployment/pull/923) now verifies the bounded
actuator at `0e1703856f7ce1ae4aa718b43b3d9eaac1884c46`, with 76 owner checks and both
exact-head Ubuntu 26.04 CI runs green. `.14` archive SHA-256:
`edf7945b4f5c6bb3e712e18e4b416dcbf25333df7fde0427f6b1aba922e0ae9a`.
Its built program starts five disposable compiled TypeScript services using genuine native OCI
bytes, checks independent configuration/credential mounts and volume markers over HTTP, and
proves receipt reuse, namespace-conflict refusal and no implicit restart. Engine-level readiness
remains deliberately unqualified. The next native-scope candidate connects actual archived
container and protocol-probe classes through Cordis; durable worker/application acceptance is
still outstanding. The engine candidate's incremental diff touches ten files.

[Deployment #924](https://github.com/treeseed-ai/deployment/pull/924) qualifies native per-instance
container/probe roots at `a923da7d0a255ed09377b9650ae856c4aebf2eb1`: 77 owner checks and both
exact-head Ubuntu 26.04 CI runs green. `.15` SHA-256:
`8b5747633494c3d55f2fb948b6e3aaab1d958e5e1c4bc8477bbd85bfe520f8fd`.
The built program loads genuine archived classes, uses two real HTTP probes and a separately
identified boundary fixture, verifies distinct native generations and refuses undrained disposal.
Wrong-instance, secret-like, false and late observations are rejected. The executable regression
caught a late success racing a delayed timer after event-loop blockage; settlement/publication
now check the deadline directly. Probe contexts are immutable and credential callbacks expire.
Provider disposal preserves installed fixture services; only the explicit fixture cleanup removes
them. This is no claim of a committed application, standalone host worker or assembled API readiness.
The durable native application coordinator is now being implemented in its owning Deployment repo.

[Deployment #925](https://github.com/treeseed-ai/deployment/pull/925) verifies durable native
application coordination at `f1827c1bec6f9402c8ad7807f421856e3087de42`: 82 owner checks and both
exact-head Ubuntu 26.04 CI runs green. `.16` SHA-256:
`007ace8e3122a5126528891cd8ef53f7b5f4408032c89dd3d1bf14376846a633`.
Built default-root programs commit actual receipted resources and selected-probe acknowledgements,
recover a same-key response without repeating activation, refuse concurrent work, read back
without the original bundle, and report a stopped-after-commit container as unready. A stopped
composition stays non-serving. Partial unready effects require repair; occupied-port validation
fails before staging. Deferred close cannot claim writer cleanup until accepted leases settle.
This remains coordinator evidence, not standalone worker/socket or API/Keycloak assembly proof.

Platform [#737](https://github.com/treeseed-ai/platform/issues/737) records a separate process
proposal after unchecked scripted edits missed formatted source and one wrong-mode fixture left
an empty test network. The exact fixture ID/labels/time/empty attachments were verified before
cleanup. The behavior regression and fixture-owned cleanup were corrected in the owning feature;
no AGENTS.md/skill changes were included. The proposal remains open for separate acceptance.

[Deployment #926](https://github.com/treeseed-ai/deployment/pull/926) shares the existing store/writer
through one native host-private authority at `76e14bdf99c1916428468b8141ad78872cd2d576`, with 83
owner checks and both exact-head Ubuntu 26.04 CI runs green. `.17` SHA-256:
`990058b3aac003c584ff18f1aee85f47ca74bc2ab84199f7f6bd12e9cb5f9e0b`.
The actual native default root reports its selected installation/application providers. A background
application holds an authority lease after submit returns; immediate close reports pending, admitted
work finishes, and final disposal releases the writer. Removing that lease establishes an executable
red. The host-private authority is not registered in installed container/probe scopes.
Private observer/owner socket providers are the next in-progress owner slice; no standalone worker,
API/Keycloak assembled composition, active transition/migration or source acquisition claim is made.

[Deployment #927](https://github.com/treeseed-ai/deployment/pull/927) verifies separate private host
endpoints at `7819002e94b26c6aef826f8b76abb3ba0238eafa`, with 85 owner checks and both exact-head
Ubuntu 26.04 CI runs green. `.18` SHA-256:
`e5d8634a92068ea083b93fc2c155a2470b521ba831f11141449c9dd3e761e580`.
The default native root serves observer-only `.cordis/run/host.sock` and owner-local
`.cordis/control/worker.sock`, initially for submit/status/application. Built programs verify
server-side write refusal, bounded strict frames/safe output, a discarded accepted response with
same-key recovery, five real native fixture services and verified close. A partial-start fault
establishes red/green cleanup of the known first listener while preserving the conflicting entry.
Socket replacement is refused and unfamiliar files remain intact. Historical runtime directories
are not silently adopted. Standalone executable bootstrap is in progress, followed by remaining
Task 3C owner adoption, active transitions/migration and exact source acquisition/assembly.

[Deployment #929](https://github.com/treeseed-ai/deployment/pull/929) rejects socket aliases at
`5a75168099985240ac17ba5f6c278f6235235fa0`, with 86 owner checks and both exact-head CI runs green.
The built default host regression proves hard links and symlinks cannot route owner mutation
through the observer path. `.19` SHA-256:
`6a96bb512547efff55133c992c8ced2d8bcd25bd93bbdc35ed900c6535e80fa9`.
Issue #928 remains open. The temporary fix worktree was removed after inheritance verification;
its unmerged review branch remains intact.

[Deployment #930](https://github.com/treeseed-ai/deployment/pull/930) binds private worker bootstrap
to the selected executable inode, child PID and nonce at `2141458a72cc722b59e75b73d048941eca191e43`.
All 87 owner checks and both exact-head CI runs passed. `.20` SHA-256:
`4e973db05b23afb58953bcc2e1b8cc8f2d5a238df4264d8a23c808ba189b2b63`.
Immutable launch records fence interrupted, malformed or mismatched handoffs; only the selected
child can acquire the existing writer after parent release. This fixture deliberately uses a
copied Node interpreter and does not qualify the production compiled worker. That next program
test has already caught a bundled initialization cycle before argument parsing; its fix and
genuine Docker-only standalone qualification remain in progress. No Task 3C completion is claimed.

[Deployment #931](https://github.com/treeseed-ai/deployment/pull/931) qualifies the genuine standalone
worker at `d727c49ad45908378637ec4509bd85fac3bacd87`: 88 owner checks and both exact-head CI runs
green. `.21` SHA-256:
`4cbe0bc56e44b751d19267f1d3ea089871da3b37a4e2ee8874170b50c80f91f6`.
The actual binary starts five disposable native services with Docker-only PATH, recovers same-key
read-back without the original bundle, and drains the writer/listeners while preserving containers.
Executable write/replacement canaries pass. Only the verified current executable inode can reuse
its digest under Linux executable write protection; external readers retain full hashing.
An independent consumer installs the exact SDK/Deployment archives and invokes the public build
producer from an unrelated directory, then executes the result without Node/Bun on PATH.
The default public host launcher is now in progress. API/Keycloak assembly, retained active
transitions/migration and plugin source acquisition/registration remain required before Task 3C handoff.

[Deployment #932](https://github.com/treeseed-ai/deployment/pull/932) wires format-3 apply/status/
application into the default public host at `5bf4afab4fa89eda35ceb1854924c7a1f3c22c97`. All 89 owner
checks and both exact-head CI runs passed. `.22` SHA-256:
`c82f0c81691dc1d09fdfa062ad1943c4d6122b4b029d4d07b6ab3e5eba02c658`.
A compiled Docker-only caller launches the pinned native worker and exits; a later caller recovers
the same application and source-free observations. A stopped worker requires repair, and a script
worker canary is refused before launch publication. The initial host is qualified, with no claim
that active composition transitions, implicit restarts or recovery have been implemented.

[SDK #470](https://github.com/treeseed-ai/sdk/pull/470) defines accepted observation metadata and
measured runtime content at `55d79a33f6513cddb787f6cfadaadb1afdfa4b2d`: 69 checks and all exact-head
CI green. `.11` SHA-256:
`21f3a77d1e9364e1896f58642ae3b3e17c2bf80db1cefc3f71a6e94a4ac64fd7`.
[SDK #471](https://github.com/treeseed-ai/sdk/pull/471) adds optional saved-plan runtime bindings at
`4a0b12ca45478f58d92a02de4a7c144ed94c7417`: 71 checks and all exact-head CI green. One prerequisite
download hit the runner timeout; the targeted job retry passed without source/workflow changes.
`.12` SHA-256: `9652a1e1f830eb85c41b2d9ea207782ffdf291db2ef97331e338775dadf62fd4`.
Bindings must match selected service/recipe/image artifacts; earlier format-3 payloads retain field
absence. The operation count stays seven. Deployment is now qualifying map derivation, persistence
and fresh comparison before exposing readonly observation metadata to native probes and the API.

[Deployment #933](https://github.com/treeseed-ai/deployment/pull/933) persists verified runtime
bindings at `5946d7b8061ba29e7a831ac28ae060107c234a19`: 91 checks and both exact-head CI runs green.
`.23` SHA-256: `2892dad2458e1506664e3aed0e98ac19007b188bbf1404eef972aaaaf2111516`.
Its built non-activating planner verifies all five instance bindings, source-free read-back and
unchanged resources/listeners. A forged content binding fails fresh validation before staging.
Readonly observation IPC and native probe injection remain subsequent bounded slices.

[UI #94](https://github.com/treeseed-ai/ui/pull/94) qualifies SDK .12 at
`a0f28a2d4a3285cbb5203a97c2cdb620517871ae`: 28 checks and both exact-head CI runs green.
`.14` SHA-256: `6c1032996990178f7a76d5cbde2e15a4b6467941159d6d6013a33526e799e7ad`.
All required responsive widths, keyboard/forms/text resizing, native lifecycle and packed Astro
hydration remain qualified. Current SDK adoption documentation now agrees with the exact archive.

## Current owner adoption and observation checkpoints

[Deployment #934](https://github.com/treeseed-ai/deployment/pull/934), head
`d8dfc56254012d515c33e5f17aec1d218b8f5eca`, exposes accepted service/dependency/runtime
metadata through observer-only IPC without source access or health inference. The default installed
worker verifies every service view and rejects unknown instances without journal changes. All 93
local checks and both exact-head CI checks passed; `.24` archive SHA-256
`40871fcefcfa7604e2e17279b9ba15c1da497ca985db463119ebe7c92190a98b`.
[Deployment #935](https://github.com/treeseed-ai/deployment/pull/935), head
`517fffafaf7f0ffcf9c60fab62f51a9b32110b55`, injects this same frozen view into actual native
probe contexts. All 93 local checks and both exact-head CI checks passed; `.25` SHA-256
`0bf04cd3ea86eb9e35a529edad5606a5799f6d4cc510d428bc9ff921b24c03ca`.
Bounded public-CA archive transport and later grant/receipt custody remain in progress.

[Identity #48](https://github.com/treeseed-ai/identity/pull/48), head
`9ca694c38593184357cd8537ddca7912677efbf6`, consumes SDK .12 with six owner checks and exact-head
CI green; `.3` SHA-256 `2931e0cd948299566ff5d8224545e287143df06de7ac7b25a568da52599f4dab`.
[Admin #140](https://github.com/treeseed-ai/admin/pull/140), head
`439d638a4c2f09424685073dc72bd2b6a9353254`, consumes SDK .12/UI .14/Identity .3 with six checks
and exact-head CI green; `.4` SHA-256
`5aee82cfeb00f18f8bed00a445fc59d1bfb02eb53e3961ced2cfe9559ff17c31`.
The Admin browser qualification still uses explicit authority fixtures; genuine Keycloak assembly
remains required.

[CLI #320](https://github.com/treeseed-ai/cli/pull/320), head
`9a273ebd60bf7b91f7da35e9395328efa8bec517`, consumes SDK .12/UI .14/Deployment .24. All 16 serial
local checks and exact-head verify/description checks passed. Its private Linux x64 executable
SHA-256 is `a5274a7dc871116e6a9b92433110fe0c33580336be3ec7fd4a944ae406507efa`.
The first concurrent run observed another disposable suite's containers; an unchanged serial rerun
passed. [Platform #739](https://github.com/treeseed-ai/platform/issues/739) proposes checked shared
Docker qualification coordination; no workflow policy was changed. Actual format-3 CLI activation
program qualification and source-management commands remain subsequent work.

## Public authority custody and compiled CLI installed operations

[Deployment #936](https://github.com/treeseed-ai/deployment/pull/936), head
`e7bcb22684740be59b32859856bf9f92f367fba0`, qualifies bounded raw Docker-copy tar transport and
strict single-file public CA inspection without extraction. All 96 local checks and both exact-head
Ubuntu 26.04 CI checks passed. `.26` SHA-256:
`5e901f041cb998c441f7deca2af6a50183e61f99d93fcec06ef67dda2c73e7f1`.
The genuine named-volume program compares stable resource IDs rather than elapsed-time strings.

[Deployment #937](https://github.com/treeseed-ai/deployment/pull/937), head
`8b19bd21d30bfecbbe4a8f3ff292455c47fc3781`, adds grant-scoped authority references to actual native
probe contexts and private immutable CA/volume-identity receipts. Its 98 local checks pass
(check/build, 27 unit, 41 integration, 30 smoke); both exact-head Ubuntu 26.04 CI checks passed.
`.27` SHA-256: `3d2a7b22f0f4b629000a0a0db054d4c5b7964ebac4b9148481a2f60cfed767f9`.
Qualification includes genuine own/cross-service authority grants, ordinary-credential and foreign
reference denial, cancellation after Docker copy before publication, concurrent first exports,
actual volume mount checks, private modes, unknown/missing files, symlinks and source-free cached
read-back. A projection regression caught the missing declared-authority grant case before delivery.
These remain fixture CAs; default Caddy/API/Keycloak and active-generation retention remain pending.

[CLI #321](https://github.com/treeseed-ai/cli/pull/321), head
`672f76b4b3cdde41d0e45390d81c6918617f99bb`, qualifies existing format-3 runtime behavior through
actual compiled `trsd`. All 17 serial local checks pass (check/build, 1 unit, 1 integration, 15 smoke);
both exact-head Ubuntu 26.04 verify checks and description validation passed. The unchanged `.6` executable SHA-256 remains
`a5274a7dc871116e6a9b92433110fe0c33580336be3ec7fd4a944ae406507efa`.
The scene runs symlinked from foreign cwd with closed stdin and Docker-only PATH, recovers accepted
work after the caller exits, observes five services through JSON and UI human output, removes the
bundle then repeats read-back, and refuses implicit restart after exact-worker graceful disposal.
No CLI coordinator, ambient compiler during apply, version or machine-envelope change was added.

All candidates remain unmerged drafts. Every issue remains open; Task 3C continues and Task 3D
remains gated. Default providers/API runtime evidence, retained transitions/migration, source/build/
registry management and complete exact assembled acceptance are still required.

## Native Postgres provider checkpoint

[Deployment #938](https://github.com/treeseed-ai/deployment/pull/938), head
`798b2a85b276be055572c8d52c2f20305f3bb53c`, adds Deployment-owned native Postgres container/probe
classes and checked package metadata. All 100 local checks passed (check/build, 27 unit,
41 integration, 32 smoke), and both exact-head Ubuntu 26.04 verify runs are green.
`.28` archive SHA-256: `803b72071b947a0873d96b6c4dfc42c4582d6a808cbc1667aa7cd67b9ef0e7e8`.

The default application root loads genuinely archived production classes under an explicit fixture
package identity and runs two renamed Postgres 17.11 instances with independent passwords/volumes.
Readiness uses pinned `postgres@3.4.9`, direct TCP and fixed read-only SQL, with no Docker exec.
Wrong-password rejection, pre-cancel credential denial, in-flight cancellation/connection drain and
source-free status pass. The stalled-handshake fixture must consume its readable side to observe
peer closure; its corrected assertion remains strict. Prepared native manifest:
`e4cb93687b062cd25a0e8f672d85a7708235009d70d31f8a7698d9370092a9c4`; normalized index SHA-256:
`d538f74d92b3b72ecfd667bc56b81c48695a819ba0b74526a9580657cec26acd`.

Bounded HTTP/TLS helper qualification is in progress before default Caddy and API adoption.
API health/asset semantics remain API-owned. This checkpoint does not complete Task 3C or qualify
assembled API/Keycloak, retained active transitions, explicit migration or source/plugin management.

## Bounded HTTP/TLS and API contract continuation

[Deployment #939](https://github.com/treeseed-ai/deployment/pull/939), head
`acf4c109dbe2a8ab7d42e21b136ed4ebc597b0d4`, adds the public typed HTTP/TLS byte-transport helper
beneath native owner probes. All 102 local checks passed (check/build, 27 unit, 41 integration,
34 smoke); both exact-head Ubuntu 26.04 verify checks passed. `.29` archive SHA-256:
`0ea092352087eb8996de7dcf2385046766c0bdafe8045f838084e82db23aa5c6`.
Built Node fixtures verify private-CA chain/accepted-origin hostname checks while dialing an IP,
wrong CA/hostname, redirects, header/body/truncation/encoding/path limits, cancellation/socket drain
and ignored ambient proxy settings. API health/asset semantics remain in the API owner.

API #624 now has committed native-root/runtime-evidence documentation at
`79b3bc0406` on `feature/624-task3c-native-root`; runtime implementation remains pending. The
restored #620 policy remains exact blob `b1a687db754ee2fac141919e6c63052d12bf2812`.
Deployment's Caddy slice has committed documentation and failing public-export/selected-image-catalog
tests. An unselected package catalog image must not require an unused release inventory image.
No new Caddy implementation or assembled API/Keycloak success is claimed at this checkpoint.
