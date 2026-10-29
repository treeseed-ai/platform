# Coverage and verification boundaries

The source baseline is frozen in baselines/repositories.json. Platform is surveyed before this
architecture draft; package repositories retain the prepared session revisions. Historical
composition manifests are preserved separately in baselines/compositions.json.

The inventory accounts for **1,072 tracked files**, **140 package source files** and **25,678
syntax declarations** across Platform plus Admin, Agent, API, CLI, Deployment, Identity, SDK and UI.
Every package source file is assigned to a logical capability area. Logical areas are organizational
components, not a claim that one runtime object implements the entire area. Counts include tests,
development tooling, local declarations, anonymous functions and property signatures; they are not
counts of public APIs or runtime plugins. See coverage.json for per-project counts.

The public-surface ledger preserves all manifest exports, scripts, other Cordis metadata, all **55
manifest provider entries**, source export statements and composition call sites. Native source
plugin classes outside package manifests also appear in the blueprints. An abstract UI base is kept
as supporting inventory; the intrinsic SDK composition plugin is fixed rather than provider-selected.

## Extraction method

One-time local survey used the existing TypeScript 5.9.3 syntax parser over immutable Git blobs,
not an installed or shipped importer. The temporary TypeScript survey was transpiled with that
compiler and run under Node 22.22.1. The system Node build rejected direct type stripping with
ERR_NO_TYPESCRIPT; compilation of the survey resolved that local configuration issue.

For each repository, git ls-tree supplied tracked paths, modes and blob IDs. git show supplied
revision-specific text. Declaration fingerprints hash the exact syntax-node text using SHA-256;
start/end lines are one-based. Source imports, explicit export statements and selected composition
call sites retain locations. Coverage validation compared every file/blob against the pinned tree.

Reproduction contract: use the recorded compiler version and revisions; visit every TS/TSX/MTS/CTS/
JS/JSX declaration outside vendored/generated directories; retain class/interface/method/constructor/
accessor/function/type/enum/variable/property nodes, signatures, modifiers and locations. Non-source
tracked material is still classified. No permanent extraction program is shipped in this scope.

## Explicit gaps

- Syntax inventory is not a compiler-resolved dependency/call graph. Wildcard exports and aliases
  are retained, not flattened into a proven transitive public API.
- Package scripts are program/build surfaces; computed build entrypoints are not executed.
- Token/declaration literals were reviewed to resolve 25 initial extraction gaps. Parameter-driven
  registrations, overrides, installed packages and runtime configuration remain unknown.
- Source contract operations are provider method observations where interface resolution is absent;
  inherited/imported requirements may add obligations. Unresolved versions do not prove compatibility.
- Shell/native/embedded scripts and generated/vendored internals are not TS declaration analyses.
  Their tracked files remain in the inventory. Elixir/Rust examples are illustrative; no TreeDX
  source or runtime qualification was fabricated. Python is deferred.
- No fresh owner readability, tests, build, live replacement, installed-service smoke or hosted Kata
  run is claimed. Historical checker baselines and assembly records are evidence of their own pins.
- Proposed intent component identities are review candidates. Profile obligations are explicit;
  passing the structural schema does not approve the candidate architecture.

## Validation evidence

validation.json records schema results and case expectations. Shape validation uses existing
python-jsonschema 4.19.2 (Draft 2020-12) and PyYAML 6.0.3 for this authored subset. PyYAML is not
claimed to implement the language's complete lexical restriction layer. Lexical rejection and
semantic cases are **specified, not yet executable** by a shipped engine.

The one-time audit checks workspace membership, graph references, local flow-node references,
source bindings and Git inventory parity. It does not prove flow reachability/cleanup on all paths,
provider substitutability, architectural quality or runtime conformance. No permanent tests or
custom validator were added, as required by the approved scope.

Current/intent differences and readability debt remain open findings. Reconciliation requires a
reviewed decision and new implementation evidence. Preserve both files after reconciliation.
