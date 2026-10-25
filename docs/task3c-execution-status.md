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

## Remaining authorized Task 3C work

CLI #317, API #624, Identity #46 and Admin #137 still have documentation-first branches with
runtime changes outstanding. Platform #726 still needs exact final artifact/composition pins
and assembled acceptance. Continue UI installable native package metadata and reusable host
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

Process gaps remain tracked separately in Platform #724 (copied authorization text) and #729
(normalized native defaults). No opportunistic process-policy edits accompany these features.
API's restored committer policy per #620 remains untouched. On this checkpoint the owning
issues, UI setup #79 and Platform #678 were read back as open. No integration merges, tags,
production channels or original services were changed.

The [approved implementation plan](superpowers/plans/2026-10-24-task3c-extensible-plugins-ui.md)
remains the acceptance authority. Task 3C implementation and isolated acceptance are authorized;
none of these candidate results authorize production cutover or changes to legacy installations.
