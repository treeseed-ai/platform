# Qualified Fixture Lock Implementation Plan

> **For implementing agents:** Use the actual available workflow/testing tools, preserve the user's execution method, and deliver one bounded task at a time. Checkboxes record verified results, not intentions. Retain child-repository setup pauses.

**Goal:** Resolve #840 without changing historical artifacts or weakening equality checks.

**Architecture:** A shared class derives exact registry overrides from the qualified
lock. Installed preparation consumes it, and migration copies it into its isolated fixture.

**Tech Stack:** Strict TypeScript classes, Bun 1.4.4, existing JSONC parser and Bun tests.

**Spec:** [Qualified installed fixtures](../../qualified-installed-fixtures.md).

## Global Constraints

Preserve owner repositories, composition pins, archives, root lock and immutable
readability baseline. Target `cordis`; keep #840 open. Changed methods have at most
20 canonical body lines.

## Review Focus

- A newer patch must not alter qualified identities or SRI.
- Scoped names and archive entries must not be mistaken for registry identities.
- Nested resolutions cannot be flattened into one override.
- Migration must carry every new shared support file.
- Root overrides must not install unrelated development dependencies.

## Bounded delivery

1. Commit documentation, retaining the existing failing assembled acceptance checks.
2. Add a registry-drift regression using real Bun resolution and fresh caches;
   observe failure before adding qualified overrides. Add malformed/nested input cases.
3. Implement the shared lock helper, refactor changed installed preparation into
   concise methods, and include the helper in migration sandbox preparation.
4. Wire regression discovery and CI; run type, readability and layout checks,
   fresh-cache installs, focused regression and both assembled journeys.
5. Record evidence, add changelog, commit and push; open a PR targeting `cordis`
   using `Part of #840`. Do not claim CI or review gates before observing them.
