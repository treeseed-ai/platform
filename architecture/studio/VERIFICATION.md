# Architecture Studio verification — 2026-10-29

Delivery: #839. Language dependency: #838 at `94135bcddc23de0f566f0679629646369b7193b7`.
Branch started from fetched/verified `origin/cordis` at
`df3ea72d48d45517d98075439c6cf1e1e315144f`, then explicitly adopted that language commit.
No integration merge was performed. Existing assembled fixture resolution failures are tracked
separately in #840; Studio does not change historical composition pins or dependency archives.

## Local results

Environment: Node 22.22.1, npm 9.2.0; dependencies locked in `architecture/studio/package-lock.json`.

- `npm --prefix architecture/studio run check`: passed strict TypeScript, class-based source policy,
  test placement and shared canonical 20-line readability measurement. No exceptions added.
- `npm --prefix architecture/studio run build`: passed frontend and Node companion builds.
- `npm --prefix architecture/studio test`: 14 passed (8 unit, 5 integration, 1 browser acceptance).
  The regression tier is explicitly empty, not silently skipped.
- Shared Platform test-layout inspection: passed, including explicit Studio CI discovery inventory.
- `git diff --check`: passed.
- `npm --prefix architecture/studio audit --omit=dev --audit-level=moderate`: zero vulnerabilities.
- Every independent package checkout remained clean; root manifest, lockfile and composition
  declarations remained unchanged.

The built-program browser journey uses production Cordis construction. It loads the actual
portfolio into an isolated workspace, validates, creates and edits a component, connects it,
undoes/redoes, saves/reloads and opens migration export. Assertions check retained stable identity,
retained connection and byte-for-byte unchanged implementation documents. A full desktop screenshot
was inspected for layout; the narrow embedded browser panel uses horizontal scrolling.

Engine coverage includes restricted YAML and original conformance examples; explicit connections
and unspecified intent; schema-valid creation of every object kind; acceptance invalidation;
accepted/proposed migration separation and owner grouping; real Git source measurement, missing
bindings, stale fingerprints, symlinks, unsupported native extraction and uncommitted-file exclusion;
recoverable journals; deterministic refresh with accepted mappings, ambiguous rename review,
immutable snapshots and concurrent publication conflicts; session and read-only boundaries.

## Real portfolio extraction

Two complete reads of the nine exact source pins produced identical normalized inventory hashes.
The inventory covers 1,072 tracked files, 28,962 declarations and 144 registration call expressions.
There are 235 unresolved plugin/registration expressions. An identifier reference is syntax evidence,
not provider readiness or proof of resolved runtime composition. Counts differ from the initial
survey because Studio also inventories interface members and uses its own documented AST records.
No source scripts executed, and these verification runs did not publish a new active baseline.

| Project | Commit | Files | Declarations | Registrations | Unresolved expressions |
|---|---|---:|---:|---:|---:|
| project.platform | `df3ea72d48d45517d98075439c6cf1e1e315144f` | 118 | 1546 | 2 | 2 |
| project.admin | `6e35ae8e663d5aa8edd9def342880bc511eaa3f5` | 53 | 789 | 10 | 30 |
| project.agent | `8c64ec213fc732023e677900afdb36f4d8b76a4f` | 118 | 3310 | 41 | 39 |
| project.api | `92331d397e8c813de8b834ac54b134adba450ba0` | 77 | 1379 | 10 | 18 |
| project.cli | `26efbdea603a8cc27783742ad309924cd420709b` | 50 | 1044 | 5 | 13 |
| project.deployment | `deb0f4b88d58823437ad4d8ce9a1c58036e0856f` | 350 | 14303 | 45 | 88 |
| project.identity | `6758afba8115413a0558155826587172f37e9ebb` | 54 | 668 | 6 | 14 |
| project.sdk | `519611d2496fa6e8a7d6aa29d7585a487c0bfb07` | 173 | 4165 | 16 | 24 |
| project.ui | `4823e73fd9e56f18ef3fd3ae8d2c32e3ed0217ae` | 79 | 1758 | 9 | 7 |

## Review boundaries and remaining limitations

- Structural validity and static model checks do not certify runtime conformance, cleanup safety,
  live replacement, architectural cohesion or compatibility. Qualification records can resolve
  structurally while runtime obligations remain unknown. Unknown evidence keeps exports draft.
- Source projection refreshes facts and reviewed source bindings. Authored architectural meaning
  retains explicit provenance and requires review; dynamic behavior and ambiguous renames are
  never silently promoted into intent or fresh observations.
- Flows render modeled steps; nested node fields are edited in the reusable inspector/YAML editor.
  Cleanup analysis is conservative for parallel paths and does not execute flows.
- Feedback review uses the versioned ledger editor. Its accepted status remains advisory, never
  an automatic mandatory rule. Binding checks and exports inspect revision/fingerprint freshness.
- The journal provides recoverable roll-forward, not a filesystem-wide atomic transaction or
  multi-process editing lock. Use one companion per workspace.
- Monaco's eager client bundle produces the build's large-chunk advisory (roughly 3.3 MB before gzip).
  React Flow also emits a nonfatal `use client` bundler advisory. This standalone SPA has no SSR.
- Elixir/Rust symbol extraction, Python, source generation, agent dispatch and deployment are
  deliberately outside this delivery.

The dedicated Studio workflow runs its isolated install/check/build/browser tests. Remote CI and
review remain separate gates; this local report does not mark historical assembly CI green.
