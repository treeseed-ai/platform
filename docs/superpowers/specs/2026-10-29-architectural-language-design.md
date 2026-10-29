# Architectural language v0.1 design

Maintainer-approved scope, 2026-10-29. Tracking: [#836](https://github.com/treeseed-ai/platform/issues/836).

Create a development-only, standalone architectural specification under architecture/. Restricted
YAML plus JSON Schema 2020-12 describes components, capabilities, contracts, providers, composition,
flows, resources, placement, rules and decisions. Separate implementation and intent files use
stable identities and comparable fields. Inventory supports the model without endorsing observed code.

Survey Platform and eight prepared Cordis repository snapshots. Preserve historical assembled pins
separately. Agent is the detailed reference for concise class methods, provider composition and
execution lifecycle. Native Elixir/Rust binding examples are illustrative; Python is deferred.

The user selected specification/schema/inventory/examples only: no UI, custom importer/validator,
code generation, permanent tests, runtime dependencies or owner refactors. Explicit paths and
future capability-oriented conventions coexist. Omitted intent is unspecified. Reconciliation
requires review and evidence, never silently copying observations into approved architecture.

The normative draft is [the reference](../../../architecture/language/specification.md).
Quality rules are explicit profile data; tools do not depend on AGENTS.md. Hard requirements and
review criteria are separate. Existing debt remains visible. The delivery records shape validation
and semantic examples without claiming source/runtime conformance.
