# Language and placement profiles

## TypeScript / TSX

Explicit paths are supported for every role. Defaults for new/changed capabilities:

| Convention | Template |
| --- | --- |
| ts.contract | src/{capability-path}/contracts.ts |
| ts.plugin | src/{capability-path}/{component-slug}.plugin.ts |
| ts.provider | src/{capability-path}/providers/{provider-slug}.ts |
| ts.helper | src/{capability-path}/{unit-slug}.ts |
| ts.composition | src/composition/{runtime-slug}.ts |
| ts.entrypoint | src/entrypoints/{program-slug}.ts |
| ts.test | tests/{tier}/{capability-path}/{behavior-slug}.test.ts |

Use the corresponding `tsx.*` convention (same pattern, .tsx suffix) only when `language: tsx`
is explicit. Inputs are explicit stable kebab-case path segments, except tier which is one of
acceptance/regression/integration/unit. capability-path may contain multiple such segments.
The convention supplies no implicit slug defaults. File layout changes are proposals, not automatic moves.

## Elixir

Explicit repository-relative .ex/.exs path and module plus function/arity binding, for example
`lib/sample/runner.ex`, `Sample.Runner.run/1`. Suggested conventions: elixir.module →
`lib/{capability-path}/{module-slug}.ex`; elixir.test → `test/{capability-path}/{module-slug}_test.exs`.
These are generic-language examples, not instructions to reorganize TreeDX or override owner policy.

## Rust

Explicit .rs path and qualified module/trait/impl/method identity, for example `src/runner.rs`,
`sample::runner::Runner::run`. Suggested rust.module → `src/{capability-path}/{module-slug}.rs`;
rust.integration → `tests/{behavior-slug}.rs`. Preserve native ownership/borrowing contracts;
do not invent class requirements. Generic examples do not assert TreeDX source observations.

Python remains deferred. Extensions may describe other languages but cannot claim a supported
adapter or validated semantics. All three current language profiles support bindings, not shipped analyzers.
