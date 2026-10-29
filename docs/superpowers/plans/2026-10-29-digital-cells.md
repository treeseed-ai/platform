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
