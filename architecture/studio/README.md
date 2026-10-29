# Architecture Studio

Local architectural design, source review, validation and migration handoff. This application
edits intent; implementation observations come from explicit Git snapshots and reviewed mappings.

From this directory: `npm ci`, `npm run build`, then `npm start`. `npm run dev` starts the
development build. Open the printed loopback URL. `npm run check` checks types and development
policy; `npm test` runs Studio tests in Platform's test tiers.

The default workspace is the parent architecture directory. `STUDIO_WORKSPACE` selects another
architecture directory. `STUDIO_REPOSITORIES` is an optional JSON map of project IDs to absolute
local repository paths; defaults use the baseline's checkout paths relative to Platform.
`PORT` selects the loopback port (default 4317). No database or external service is required.

Use Design to edit intent, Compare to inspect stable-ID differences, Source review to inspect
revision-bound declarations, and Migration package to export reviewed requirements. Validate
reports violations and unknown evidence separately. Schema-valid incomplete drafts can save.
Accept intent is an explicit architectural decision, separate from Save.

Refresh reads committed Git objects only. Review the preview before publication. Historical
snapshots remain available. New or ambiguous symbols require mappings; naming is not evidence.
Elixir/Rust source bindings are readable, but their extraction is unsupported in this delivery.

Runtime qualification, class cohesion and architectural judgments require scoped evidence;
static validation does not certify them. Migration export never modifies source or starts an agent.

## Working in Studio

1. Start in Portfolio, then enter a project and choose Integration seams, Components or Flows.
   Boundary connectors retain their original subjects. Focus selection, fit, minimap and zoom
   controls navigate larger diagrams; search reveals internal subjects in their owning project.
2. Use Inspect implementation for pinned, read-only architecture. Switch to Edit intent before
   creating from the palette, connecting typed handles or editing properties. Dragging changes
   presentation only and is also available while inspecting implementation.
   The Connect dialog and Remove connection controls also work entirely from the keyboard.
3. Edit YAML applies only schema-valid documents. Unresolved relationships remain diagnostics;
   invalid text remains in the editor. Undo/redo includes structured edits, connections and
   applied YAML. Moving nodes and the last viewport are separate layout preferences.
4. Save intent persists with expected-content hashes. A conflict requires reopening the workspace
   and reconciling external changes. Accept intent records a decision and accepted subject in
   the draft; modifying an accepted object revokes its acceptance. Save itself never accepts.
5. Compare aligns stable object IDs and shows field values in Monaco's diff editor. Omitted
   properties impose no absence constraint. Contract mismatches need compatibility review;
   known downstream impact is advisory because dynamic consumers may be absent from the model.
6. Source review loads tracked files from exact Git commits. Select a declaration to attach
   useful/avoid feedback to its fingerprint. Review guidance exposes the versioned feedback
   ledger; Check bindings reports stale guidance. Guidance remains advisory even when accepted.
7. Mappings starts from existing source bindings. Review entries before setting `review` to
   `accepted`. Refresh sources accepts full commits, previews observations and gaps, then
   publishes the active baseline, implementation documents and inventory as one recoverable
   journal. Save draft intent before refreshing.
8. Migration package exports the selected object's differences plus known consumer/dependency
   closure. Manifest and instructions separate accepted repository tasks from proposals.
   Validation failures or unaccepted requirements yield draft guidance. Export does not launch agents.

## Persistence and observation boundaries

The explicit workspace manifest is authoritative. Layout, mappings and feedback live under
`architecture/.studio/` with separate versioned schemas in `studio/schemas/`. They are suitable
for review in Git. Local content-addressed snapshots, active extracted inventory and the recovery
journal are ignored. Preserve `.studio/snapshots/` when moving a workspace if local observation
history is needed. Git remains the durable review history; no database is involved.

Publication is recoverable roll-forward, not a filesystem-wide atomic swap. On startup the
companion completes an interrupted journal only when every destination still has its expected
or already-published content hash. External conflicts stop recovery without overwriting them.
Do not run multiple companions against the same workspace. Source reads reject symlinks and
path escapes and never execute repository scripts. The companion binds to loopback, checks
Host/Origin and requires its same-origin session token for API writes and reads.

Extraction inventories tracked files, TypeScript declarations (including interface members),
imports, exports, plugin metadata and syntactically resolvable registration arguments. Identifiers
are symbolic references, not proof of loaded providers. Dynamic expressions are explicitly
unresolved. Canonical inventories have no timestamps and identical source pins/extractor versions
produce identical observations. Preview envelopes additionally include expected workspace hashes.
Approved mappings refresh source bindings while retaining authored architectural meaning with
explicit provenance; extraction does not infer business intent or establish runtime behavior.
Old evidence retains its original revision and becomes stale against a changed active baseline.

Source quality measures class method bodies with pinned Prettier and TypeScript token counting.
Historical readability debt remains a violation; exact exceptions are reported separately.
Runtime qualification and parallel-flow synchronization require additional evidence; modeled
cleanup paths are checked conservatively, without claiming execution proof. Elixir/Rust are
readable but unsupported for extraction. Python and code generation remain deferred.

## Verification

Install Chromium for acceptance: `npx playwright install chromium` from this directory. Build
before `npm test`. Unit cases exercise language examples, authoring, comparisons and migration;
integration cases exercise real Git snapshots, recovery, refresh and conflicts; acceptance
launches the built Node companion through its production Cordis composition and a real browser.
There are no Studio regression specifications yet. `npm run check` enforces strict TypeScript,
class-based behavior, test placement and the shared 20-line readability policy.

The dedicated Architecture Studio CI job installs only this lockfile. Platform's historical
assembly dependencies and all owner package checkouts remain independent.

## Digital cell map

The map starts with nine collapsed project cells. Use **Enter project** to inspect
plugins and neighboring repository boundaries, then **Expand plugin** to inspect
its explicitly owned providers. Choose a composition and scope to distinguish
registration and selection; readiness remains unknown without runtime evidence.
Boundary buttons and connection bundles expose original relationships and source
subjects. Use search to reveal a contract or provider in its owning project.

**Arrange by connections** runs deterministic layered ELK routing in a worker.
Dependency diagrams describe topology; **Flows** uses modeled transitions. Zoom
changes label detail without entering a project. Glow and counts indicate distinct
connected peers; separate badges identify architectural differences and contract
impact. Unresolved endpoints remain visible. Diagram containment never changes
repository ownership or implies a shared runtime context.

Drag cells to position them, or use React Flow keyboard navigation. **Undo layout**
undoes presentation changes independently from intent commands. **Save layout**
writes only `.studio/layout.json` with expected-content-hash protection. The new
`studio-layout/0.2` format stores each view's positions, viewport, selection and
expansion. Imported 0.1 coordinates remain under `legacy`; they are not applied to
the nested map. Saving intent no longer saves diagram positions implicitly.

Keyboard: focus a cell, press Enter to select it, then use arrow keys to move it.
Enter-project and expand-provider buttons are keyboard accessible. The inspector
Connect dialog supplies keyboard endpoint selection and validation.
