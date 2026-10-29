# Architecture Studio implementation plan

Issue #839; approved design: ../specs/2026-10-29-architecture-studio-design.md.

1. Document interfaces and acceptance before implementation. Create standalone npm package,
   loopback companion and workspace reader, preserving Platform's lock.
2. Write outside-in acceptance and engine fixtures. Implement lexical/schema/semantic checks,
   Git extraction, mapping ledger and journaled snapshot publication.
3. Implement controlled React Flow class UI, reusable inspectors, YAML adapter, shared draft
   commands, undo/redo, acceptance and safe persistence.
4. Implement ID-aware comparison, conservative seam impact and pinned source-pattern review.
5. Implement migration preview/export, run built-program browser acceptance, source checks,
   production build and CI. Open PR Part of #839 targeting cordis; no issue closure.

Public API uses JSON operations: workspace, validate, save, source, inventory, refresh-preview,
refresh-publish, patterns, mappings, layout and migration. Writes carry expected hashes; refresh
publication carries preview identity. All errors return structured code/message, not stack traces.

Review focus: invalid YAML must not replace a draft; omitted intent is unspecified; changed
source invalidates feedback; filesystem traversal/symlink escape is rejected; interrupted writes
recover without overwriting external edits. Real fixtures exercise each boundary.

Deliverable includes source and workflow documentation, versioned companion schemas, focused
tests under Platform test tiers, standalone lockfile and CI evidence. Empty regression tier is
reported rather than populated with redundant tests. Language dependency stays explicit.
