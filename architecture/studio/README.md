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
