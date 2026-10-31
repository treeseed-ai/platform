# Artifact difference diagnostics

Run `bun tests/support/assembly/artifact-inventory.mts <owner> <archive>` from the
Platform repository root after installing the locked assembly support dependencies.
The supported file-inventory owners are `admin` and `api`; `cli` reports archive
identity only. Unknown owners or inconsistent selected baseline evidence fail with
`ARTIFACT_SELECTION_REQUIRED`.

The JSON result includes owner, expected and actual archive SHA-256 identities and
file changes with `path`, `before` and `after` inventory entries. Entries contain
public archive metadata, not file contents. Archive validation uses Deployment's
public `PackageArchiveInspector`. This diagnostic does not activate packages or
change the accepted selection. Historical composition evidence remains immutable.

The ArcNexus qualification assignment will extend these diagnostics with explicit
change kinds and deterministic ordering, with independent acceptance before integration.
