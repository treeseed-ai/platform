# Architectural Language v0.1 Implementation Plan

> **For implementing agents:** Use the available workflow/testing tools, preserve the user's execution method, and deliver bounded reviewable changes. Checkboxes record evidence, not intentions. No child implementation is authorized by this plan.

**Goal:** Deliver the first language draft and faithful Cordis implementation/intent blueprints.
**Architecture:** Restricted YAML with JSON Schema; independently pinned observations and intended requirements share stable IDs. Inventory and evidence remain separate from architectural approval.
**Tech stack:** YAML 1.2 JSON-compatible subset, JSON Schema 2020-12, existing static-inspection tools.
**Spec:** [Approved design](../specs/2026-10-29-architectural-language-design.md).

## Global constraints

Keep all owner source, legacy branches and composition pins unchanged. Preserve separate repositories.
No application, executable importer/validator, generator, new runtime dependencies or permanent tests.
Keep implementation and intent in separate files after reconciliation. Unknown is not satisfied.

## Delivery tasks

1. Issue and verified Cordis feature branch; freeze nine source revisions and historical assembly provenance.
2. Document directory roles, glossary, authoring workflow and semantic rules; commit documentation first.
3. Define strict schema and multi-file workspace with stable IDs and namespaced extensions.
4. Define project/component/capability/contract/provider/composition/flow/resource/placement/rule/decision objects.
5. Define comparison statuses, explicit prohibitions, omission semantics and reviewed reconciliation.
6. Define Cordis registration/selection/readiness, process scopes and replacement evidence.
7. Define calls, messages, branches, parallel/join, bounded repeat, cancellation and cleanup flow semantics.
8. Encode Agent's 20-line canonical method and class behavior rules; preserve debt and review criteria.
9. Support explicit observed paths and desired conventions with deterministic precedence and collision rules.
10. Inventory all tracked files and handwritten declarations; map exports/programs/registrations with gaps explicit.
11. Curate Agent lifecycle and five detailed flow examples, with observed/intent differences.
12. Complete all nine project models and historical shared-composition counterparts.
13. Validate positive/negative shape examples; review semantic examples as specified, not executable.
14. Record coverage, evidence and limitations; open Platform PR targeting cordis, Part of #836.

## Review focus and acceptance

Check stale bindings, native provider IDs reused across targets, dynamic registrations, proposed paths
that differ from observations, and older docs that disagree with source. Each gets an explicit
example or comparison finding. Do not flatten them into passing source conformity.

Completion requires exact baseline provenance; file/declaration inventory or explicit gaps; every public
surface and provider declaration accounted for; Agent detail; separate diffable views; structural
validation results; semantic limitations; unchanged owners and historical pins. Existing checker/CI
results are reported independently. Runtime build/smoke is not applicable to this data-only change.
