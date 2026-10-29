# Architecture Studio

Approved design, issue #839. Standalone developer application in architecture/studio,
not a TreeSeed runtime. Depends on language PR #838 at
94135bcddc23de0f566f0679629646369b7193b7; integration waits for that PR's gates.

## Interaction contract

Three-column dark drafting workspace: creation/navigation left, controlled graph center,
properties/help right. Portfolio, seams, components and flows share stable selection.
Grid, typed handles, project groups, minimap and zoom support spatial navigation. Semantic
comparison and source review occupy a collapsible bottom panel. Colors supplement labels.
Class React components stay small; no handwritten hooks or function components.

Only intent is edited. Structured commands and YAML share one draft, undo/redo and explicit
save. Shape-valid incomplete drafts may save; invalid YAML cannot replace the model.
Saving never approves. Acceptance explicitly records a decision and accepted subjects.
Implementation is generated from pinned Git source plus reviewed mappings, never edited
by diagram operations. Layout is separate presentation data.

## Service contracts

Local Node companion serves the built client and JSON API on loopback. Session token and
same-origin checks guard mutation; repository roots are explicit configuration. Reads use
Git blobs, never ambient package execution. Save requests carry expected hashes. A journal
permits recovery of interrupted multi-file operations; conflicting edits are never discarded.

Versioned data services: workspace reader/writer, restricted YAML/schema reader, semantic
validator, source extractor, snapshot publisher, comparator/impact index, pattern feedback,
and migration exporter. Native Cordis composes typed services; no second container.

Source mappings retain stable IDs, path/symbol/fingerprint and reviewed architectural meaning.
Refresh extracted facts; mark unsupported observations stale. New declarations stay unclassified.
Preview before publication; keep immutable content-addressed snapshots. Deterministic payloads
exclude timestamps. TypeScript/TSX extraction first; Elixir/Rust binding viewing only.

Validation separates shape, graph, source and runtime/review evidence. Unknown is not satisfied.
Source/readability checks use exact revisions and Prettier 3.6.2 measurement. No static inference
of behavioral conformance. Compare IDs, preserve omission semantics, separate source drift.
Seam impact traverses known dependencies and explicitly reports incomplete graph coverage.

Pattern feedback records rationale, applicability, source fingerprint and review status;
changed source invalidates freshness. Migration export contains deterministic manifest,
architectural before/after, source pins, affected seams, repository tasks, constraints and
acceptance checks. Accepted requirements alone become actionable tasks; proposals remain
review material. Invalid closure produces draft guidance, never an executable-ready package.

## Verification and limits

Focused engine tests plus built-server/browser acceptance; no database or code execution
handoff. No owner code or composition pins change. Root test tiers own permanent tests.
Existing assembled CI is independent: #838 currently fails because a fresh legacy fixture
resolves jose 6.2.14 while its qualified lock expects 6.2.13. Do not change historical pins
or weaken that check to make Studio green.
