# Task 3A native composition delivery

Status: explicitly authorized; implementation in progress, not yet qualified. Parent architecture
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

- [ ] Commit owner documentation/guidance and exact legacy mapping before tests.
- [ ] Write intended-red native default and externally prepared provider program tests.
- [ ] Implement SDK typed native composition/locator/leases and constrained verified import.
- [ ] Mount real Deployment I/O/host providers and CLI command/configuration/output providers.
- [ ] Verify same-contract alternatives, ownership/byte/dependency/config/injection blockers,
  generation/lifetime fencing, captured lifecycle failures and no secret output.
- [ ] Run complete owner checks/build/unit/integration/smoke; preserve Task 1–2 program checks.
- [ ] Pin new exact owner artifacts in composition/task3a.json without rewriting historical pins.
- [ ] Run strict assembled/native positive CI and hand back review candidates targeting cordis.

Task 3A ends at review handoff. No later slice is authorized by its tests or completion.
