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

1. Select a project and choose Portfolio, Integration seams, Components or Flows. Integration
   seams initially shows the selected object and its immediate neighbors. Show all objects
   expands the map. Focus selection, fit, minimap and zoom controls navigate larger diagrams.
2. Use Inspect implementation for pinned, read-only architecture. Switch to Edit intent before
   creating from the palette, dragging nodes, connecting typed handles or editing properties.
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
