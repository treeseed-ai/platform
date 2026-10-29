# Conformance examples

cases.yaml explicitly lists the 40 standalone lexical, structural and semantic examples.
Each blueprint example resolves in its own isolated workspace. No example is real TreeDX evidence.

- valid: schema must accept; semantic requirements still need the later reader.
- schema: schema must reject; the report records the observed rejection.
- semantic: schema accepts, but the specified diagnostic belongs to a later semantic/source/evidence engine.
- lexical: invalid restricted YAML; specified diagnostic only, not sent to the schema as parsed data.

reconciliation.yaml demonstrates reviewed intent/implementation reconciliation without automatic
merging. historical-exception.yaml records the fingerprint/issue/review-condition shape and remains
illustrative debt, not an approved waiver. Expected diagnostic names are normative example labels;
no executable CLI exit-code contract ships in this draft.

See ../comparisons/validation.json for actual structural validation results and limitations.
