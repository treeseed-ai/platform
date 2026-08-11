# TreeSeed Platform

Public Apache-2.0 installer and integration workspace for customer-centric TreeSeed deployments. Platform manages Admin, an optional sovereign Admin API control plane, Core, CLI, capacity providers, TreeDX, and AI services.

Market is external and immutable at `https://api.treeseed.dev`. This repository cannot provision, deploy, or check out Market or Market API.

## Workspace

`treeseed.portfolio.json` binds independent project repositories to exact refs. `trsd platform workset --plan --json` previews local materialization and `trsd platform workset --apply --yes --json` assembles an ephemeral workset under `packages/`, `templates/`, and `.fixtures/`. Add `--branch feature/name` for cross-project development. The Platform Git repository contains no project gitlinks, and replay never resets dirty or divergent checkouts. Paired content repositories are logical TreeDX/R2 bindings and are never workset checkouts.
