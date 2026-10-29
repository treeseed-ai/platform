# Architecture Studio: digital cells

Approved delivery: Platform #844. Projects form cell boundaries, plugins form
nested cells, and providers live within their explicitly bound plugins. The
portfolio starts with all nine project cells. Enter a project to see plugins and
neighboring project references; expand plugins to inspect providers. Breadcrumbs
restore earlier selection, viewport and arrangement.

## Meaning and projection

Keep the core language unchanged. Introduce a renderer-independent scene with
cells, named ports, connectors, diagnostics and navigation context. Deterministic
visual IDs derive from architectural IDs. Each connector retains every original
relationship, endpoint and explicit/inferred provenance. Deduplicate facts without
inflating connectivity. Contract ownership is distinct from implementation ownership.

Use provider.component for containment, never name guesses. Missing or cross-owner
bindings remain visible diagnostics. Composition/scope choice determines selection;
without it selection is unknown or varies by scope. Registration, declaration,
selection and evidenced readiness remain separate. Ordinary components are not plugins.

Boundary ports represent actual cross-boundary connections and named interfaces.
Declared unused interfaces remain available without invented consumers. Group only
connections sharing boundary endpoints, interface, direction and category. Calls,
events, dependencies and implementation relationships have distinct labels/styles.
Dependency direction is not execution order. Unresolved endpoints and unknown
direction remain visible. Project containment does not imply process isolation.

## Interaction and presentation

Use a dark drafting grid, rounded project membranes, nested plugin boundaries,
provider cards and restrained connectivity glow with numeric distinct-peer counts.
Size follows contents and ports, not degree. Keep diagnostics, change indicators,
selection and integration impact independent. Keyboard controls and reduced motion
are required. Cell selection does not navigate; explicit Enter/Expand actions do.
Zoom never changes navigation. Inspecting and filtering do not shuffle the map.

Maintain original endpoints behind projected connections. A boundary inspector
shows subjects, contract/version/operations, bindings, provenance, composition,
known impact and unresolved evidence. Connecting projected ports opens an endpoint
and relationship chooser; never silently write a project-to-project relationship.
Dragging changes layout only, not ownership. Implementation stays read-only.

## Layout and persistence

Use controlled React Flow with an ELK layered layout adapter in a web worker.
Measure contents, constrain ports, route orthogonally, preserve feedback cycles and
separate disconnected groups. Render returned segments. Use stable input ordering
and a fixed seed. Discard outdated worker responses and retain the last good scene
on failure. Selection/search does not trigger layout. Arrange by connections is
explicit, scoped to the current navigation level, fits the result and is undoable.

Store view-specific positions, viewport, selection and expansion separately from
architecture in studio-layout/0.2. Read 0.1 and retain it as recoverable legacy data;
do not reinterpret grid coordinates as nested cells. Persist 0.2 only on explicit
layout save through the existing expected-hash companion API. Layout-only save
must not save or approve intent. Derived ports/routes are regenerated.

Comparison uses the union of implementation and intent subjects and one layout.
Removed elements are read-only ghosts; added/changed ports and paths remain visible
when cells are collapsed. Selecting findings links to existing diff/migration UI.
Layout changes never generate semantic findings or migration tasks.

## Delivery boundaries

Strict TypeScript classes, concise methods, native Cordis service seams, reusable
React class components. No owner-code changes, database, importer expansion, runtime
instrumentation, provider-selection mutation, core-schema changes or historical pin
changes. ELK is a Studio-only pinned dependency. Preserve all existing workflows.

## Acceptance

Actual nine-project portfolio; trace a project boundary to a plugin/provider and
into its neighbor; restore navigation; arrange/undo/save/reload without architecture
byte changes. Tests cover containment, unresolved facts, scopes, deduplication,
cycles, long labels, disconnected groups, deterministic geometry, stale worker
results, routing, legacy persistence, conflicts, connection editing, comparisons,
keyboard controls and existing validator/source/migration journeys. Inspect real
Agent and cross-project seams at desktop and smaller widths. Screenshots accompany
review. Required checks, build, tier tests and CI must pass before completion.
