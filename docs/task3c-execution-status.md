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
