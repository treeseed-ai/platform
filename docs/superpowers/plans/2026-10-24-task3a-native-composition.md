# Task 3A native composition delivery

Status: Task 3A implemented and locally verified; exact CI/review evidence belongs to the
linked owner and Platform review candidates in #708. The maintainer has since authorized review, fixes, cordis integration and task-branch cleanup;
final integration evidence is recorded in #708. Parent architecture
8974d196318d542eb795f15eaa54150fbd9e08fd; Platform #708, SDK #455, Deployment #906, CLI #313.

This bounded slice consumes the approved [3A plan](2026-10-24-cordis-composition-providers.md#task-3a-prove-native-composition-in-cli-and-local-deployment).
SDK advances private package 0.0.0-cordis.3 and generated contract 0.3.0-cordis.1; the seven
operations and legacy non-activating format-1 plan semantics remain. Runtime provider metadata
is a separate new declaration. Qualify exact published cordis@4.0.0-rc.12, registry integrity
and gitHead 01b396240ce47cf2779c40af9bc445bb748fe112. Earlier source candidate 35fdc969 is
research, not a false artifact-provenance claim.

Owner READMEs specify the concrete Task 3A interfaces and CLI selection flags. Source files
remain in SDK, CLI and Deployment; Platform only selects exact packages/artifacts and verifies
the assembled executable. No API/Identity/Admin/Agent setup, package installer, apply, worker,
active installation, live swap or container startup belongs to this slice.

- [x] Commit owner documentation/guidance and exact legacy mapping before tests.
- [x] Write intended-red native default and externally prepared provider program tests.
- [x] Implement SDK typed native composition/locator/leases and constrained verified import.
- [x] Mount real Deployment I/O/host providers and CLI command/configuration/output providers.
- [x] Verify same-contract alternatives, ownership/byte/dependency/config/injection blockers,
  generation/lifetime fencing, captured lifecycle failures and no secret output.
- [x] Run complete owner checks/build/unit/integration/smoke; preserve Task 1–2 program checks.
- [x] Pin new exact owner artifacts in composition/task3a.json without rewriting historical pins.
- [x] Run strict assembled/native positive CI and hand back review candidates targeting cordis.

The original Task 3A delivery ended at review handoff; the maintainer subsequently authorized
review, fixes and cordis integration. No later slice is authorized by its tests or completion.


Local evidence: SDK 18, Deployment 24 and CLI 13 tests pass with strict checks/builds;
Platform strict type-check and all 15 policy/assembled tests pass on Ubuntu 26.04 x64,
Docker 29.9.1 / Compose 5.6.0, using Bun 1.4.4 and Node 24.19.0. Exact source/tree/archive
and compiled-binary SHA-256 identities are in [task3a.json](../../../composition/task3a.json).
SDK [#456](https://github.com/treeseed-ai/sdk/pull/456), Deployment
[#907](https://github.com/treeseed-ai/deployment/pull/907) and CLI
[#314](https://github.com/treeseed-ai/cli/pull/314) target cordis. CI must be read back at
those exact heads before claiming its gate passes; #708 carries the final read-back.

The initial program scene returned exit 2 because the old binary lacked provider selection.
Native composition then exposed a pending-fiber wait-order bug, fixed with a reverse-order
native-dependency regression. The external ESM scene under Bun 1.4.4 failed with `Cannot find
package 'cordis'` when the compile option `autoloadPackageJson` was absent. With the documented
option enabled, genuine Cordis/cosmokit/standard-schema and ordinary helper modules load from
the verified tree without Node/Bun on PATH. Dotenv/bunfig/tsconfig autoload stays disabled;
cwd metadata/script canaries pass. These are configuration findings, not runtime limitations.

Negative scenes cover altered bytes, missing/rehashed dependency closures, duplicate/malformed
metadata, immutable path identity, symlinks/extra files, invalid configuration and constructor/
disposal failures. Native error capture prevents failed disposal from emitting success.
Prepared providers are trusted code; this is integrity/ownership verification, not a sandbox
against a malicious owner/root or plugin. No package acquisition/installer is delivered.

Review handoff: Platform [#710](https://github.com/treeseed-ai/platform/pull/710). Owner CI
passed at the pinned SDK/Deployment heads; both Platform runner jobs passed before the final
CLI regression refresh. The PR/issue record carries the final refreshed-head CI evidence.
The dependency pre-import regression was verified red by temporarily bypassing the dependency
validator (exit 0 where 3 was required), then green after restoring the verified SDK bytes.


## Maintainer-requested integration review

Review reproduced two defects before integration: a pass-through provider schema retained a
caller-owned configuration object, and a mismatched package capability was rejected only after
entry module evaluation. Failing native and standalone regressions preceded the fixes. The
SDK now copies accepted JSON configuration before validation/mounting and checks package
capability/contract metadata against the requested token before import. The CLI fixture's
module-evaluation canary proves rejection occurs before entry code runs. These changes retain
native Cordis resolution/lifecycles and all Task 1–2 behavior. Exact reviewed source and rebuilt
artifact identities replace the prior Task 3A candidates in task3a.json; old task records stay
unchanged. Process proposal [#712](https://github.com/treeseed-ai/platform/issues/712) records
the missing effect/alias oracles separately; no process-file changes belong to this delivery.
