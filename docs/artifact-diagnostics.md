# Artifact difference diagnostics

Run `bun tests/support/assembly/artifact-inventory.mts <owner> <archive>` from the
Platform repository root after installing the locked assembly support dependencies.
The supported file-inventory owners are `admin` and `api`; `cli` reports archive
identity only. Unknown owners or inconsistent selected baseline evidence fail with
`ARTIFACT_SELECTION_REQUIRED`.

The JSON result includes owner, expected and actual archive SHA-256 identities and
file changes with `path`, `before` and `after` inventory entries. Each change also
has a `kind`: `added` when `before` is null, `removed` when `after` is null, and
`modified` when both entries are present. The `changes` array is ordered by `path`
using code-point lexical ordering. Entries contain public archive metadata, not file
contents. Archive validation uses Deployment's public `PackageArchiveInspector`.
This diagnostic does not activate packages or change the accepted selection.
Historical composition evidence remains immutable.
