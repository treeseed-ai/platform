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

All CI above uses Ubuntu 26.04. The candidates remain drafts pending complete Task 3C integration/review. Merge in order only after the maintainer's eventual review and refreshed gates. The original complete `feature/80-task3c` branch is retained as an unmerged split-source snapshot; do not delete it merely by branch ancestry.

UI archive for subsequent owner consumption: source `c146508bb0dc85b3f8cf834970350977232427fd`, SHA-256 `7bda2e95205e848838a784ce147e2ff12176f2563dae5330442a63cf56b05729`. The temporary development artifact is `/tmp/cordis-task3c-artifacts/treeseed-cordis-ui-0.0.0-cordis.3.tgz`; this path alone is not a reproducible pin. Later owner commits must vendor/verify the exact public archive and record its source/digest.

Six React class components (text/status/table/form/navigation/feedback) have real browser proof at 320/375/768/1024/1440/1920/2560, actual 16px/32px text measurement, long content, 44px targets and bounded semantic-table overflow. Native component/theme/server/terminal alternatives share a contract suite; browser replacement/read-back/cleanup is exercised. A genuine packed archive is consumed by Astro SSR/interactive hydration and a standalone React browser root. No hydration mismatch or server-renderer code remains in Astro browser assets. Contribution identity binds selected provider/model-schema/style alongside presentation/asset/action admission. No Astro implementation ships in UI; native mobile/Electron remain future qualification.

## SDK and remaining implementation

SDK issue #460 / `feature/460-task3c` has portable composition, explicit v4 declarations/manifest-2 exports and format-3 service graph schemas at `4bb8f089a2c9cd9604f4b02e9fc27816f547eef2`. Local owner verification passed 23 tests. Its private `0.0.0-cordis.5` archive SHA-256 is `9e94261c6b05654bf5bbd74b822e3cb9bc6b24a99976201a3a81fe0700882617`; UI consumes this exact archive. SDK contracts still need the remaining Task 3C management/transition data and owner/runtime qualification; no complete SDK delivery is claimed.

Deployment #910, CLI #317, API #624, Identity #46, Admin #137 and Platform #726 have issue-linked branches from verified `origin/cordis` and documentation commits. Their runtime changes remain outstanding. Continue SDK contracts, generic container/probe graph and durable retention/transition authority, Identity/API metadata, Admin/CLI UI adoption, pinned source/helper acquisition and plugin registry, then exact Platform assembly. Mandatory genuine fifth-service/two-instance/readiness, NPM/HTTPS-Git retry, safe activation, old-format migration/refusal, resource/credential/TLS preservation and Ubuntu 26.04 assembled gates remain unchecked.

No new installer endpoint, production channel, user-installation activation or Agent initialization is authorized by these candidate results. All issues, including Platform #678, remain open. The [approved implementation plan](superpowers/plans/2026-10-24-task3c-extensible-plugins-ui.md) remains the acceptance authority.
