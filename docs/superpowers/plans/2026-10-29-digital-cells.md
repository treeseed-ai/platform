# Digital Cells Implementation Plan

> **For implementing agents:** Use available tools, retain the approved execution method, and deliver bounded increments. Checkboxes are evidence, not intentions.

**Goal:** Replace fixed grid placement with traceable digital project/plugin cells.
**Architecture:** Projection and navigation services produce a renderer-independent
scene; a worker-backed ELK service supplies geometry and routes; class components
render cells, ports and connectors. Auxiliary layout custody stays independent.
**Tech Stack:** Strict TypeScript, React class components, React Flow, ELK, Cordis,
existing Node companion and Playwright.
**Spec:** ../specs/2026-10-29-digital-cells-design.md

## Constraints

Integrate #843, #838, #842 only after their exact-head gates pass. New work begins
from verified origin/cordis on feature/844-digital-cells. Preserve owner repositories,
core schema, archives and historical composition pins. Methods <=20 canonical lines.

## Review focus

- Projection cannot erase real provider endpoints or infer runtime ordering.
- Same capability across projects does not transfer contract/provider ownership.
- Selection requires composition/scope context; unknowns remain visible.
- Layout-only save cannot mutate architecture or acceptance.
- Stale worker answers and restored old grid data cannot overwrite newer views.

## Sequence

1. Documentation commit before code; adopt issue #844.
2. Add built-browser acceptance for overview/drill-in/expansion/navigation/layout-only
   save; add regression for existing grid behavior and integration/unit scene tests.
3. Implement typed cell/port/connector contracts, normalization, projection,
   provider-state evidence, scoped navigation and comparison union.
4. Implement deterministic worker ELK geometry, routed edge components and layout
   result freshness checks. Add measured cell boundaries and explicit arrange/undo.
5. Replace canvas internals with reusable renderers, breadcrumbs, context selector,
   search reveal, boundary inspector and explicit connection editor.
6. Implement layout 0.2 schema and legacy recovery, expected-hash layout-only saves,
   viewport/selection/expansion restoration and architecturally inert dragging.
7. Run Studio check/build/tests and shared gates; inspect real portfolio, Agent,
   provider and change overlay screens. Record limitations honestly, add changelog,
   push and open PR targeting cordis with Part of #844. Keep issue open.

## Service interfaces

Scene projection consumes blueprint documents and view/navigation/comparison
context; produces cells, ports, provenance-bearing connectors and diagnostics.
Layout consumes a scene plus measured dimensions; returns cells/ports/routes and
engine identity. Navigation owns per-view selection/expansion/viewport/positions
and undoable layout commands. All services are supplied through Cordis bindings.

## Observed red acceptance

2026-10-29: ran the new `cells.test.ts` through the existing Studio fixture and
built companion on Studio head e2ee173. The program loaded successfully; the test
failed at its first behavioral assertion waiting for `Enter project Agent` after
15 seconds (1 fail, 0 pass, no skips). This establishes the missing navigation
surface before implementation. The temporary test copy in that prerequisite
checkout was removed; the permanent case remains in #844's branch.

## Delivery evidence

Prerequisites #843, #838 and #842 were integrated after their exact heads passed
CI and the maintainer authorized integration. The digital-cells branch incorporates
`e7d9e5df5c128aa1397ea5b5e875f53dbc3e3823`. The prerequisite task branches were
removed only after verifying their merged heads; the existing Studio checkout and
its running service were retained at the same detached commit.

See [verification and screenshots](../evidence/digital-cells/README.md). Runtime
readiness and dynamic dependency completeness remain explicitly unknown. Layout
custody is auxiliary; layout saves never accept or persist architecture edits.
