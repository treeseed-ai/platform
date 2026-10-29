# Architectural language v0.1

A development-only architectural specification for humans and agents. This draft describes
TreeSeed without becoming a TreeSeed runtime dependency. Tracking: [#836](https://github.com/treeseed-ai/platform/issues/836).

Start with [the language reference](language/specification.md), then [authoring](language/authoring.md)
and [the TreeSeed profile](profiles/treeseed.md). The [workspace](workspace.yaml) explicitly lists
blueprints; [baseline](baselines/repositories.json) pins each source repository independently.

- `implementation/`: observed architecture, bindings and source inventory at those revisions.
- `intent/`: separate, corresponding requirements; omission means unspecified.
- `comparisons/`: differences, debt, coverage and validation evidence, never an automatic merge.
- `examples/`: conformance cases, including semantic obligations; Studio executes model cases and uses real source fixtures for source-dependent checks.

Compare corresponding files with `git diff --no-index architecture/implementation/agent.yaml architecture/intent/agent.yaml`.
A diff exit status of 1 means differences exist. Metadata differences are intentional; compare
`objects` by stable IDs for architectural meaning. Profiles add requirements without rewriting observations.

[Architecture Studio](studio/README.md) supplies the standalone designer, restricted-YAML editor,
static validator, pinned TypeScript observation refresh and migration handoff. The language
remains independent of the application. No code generator ships here.
Schema validity is not implementation conformance. Source evidence does not prove runtime behavior.
Read [coverage and limitations](comparisons/coverage.md) before treating this snapshot as complete evidence.

The [design](../docs/superpowers/specs/2026-10-29-architectural-language-design.md) and
[delivery plan](../docs/superpowers/plans/2026-10-29-architectural-language.md) describe this bounded delivery.
