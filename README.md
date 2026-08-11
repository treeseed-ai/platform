# TreeSeed Platform

Public Apache-2.0 installer and integration workspace for customer-centric TreeSeed deployments. Platform manages Admin, an optional sovereign Admin API control plane, Core, CLI, capacity providers, TreeDX, and AI services.

Market is external and immutable at `https://api.treeseed.dev`. This repository cannot provision, deploy, or check out Market or Market API.

## Workspace

`treeseed.portfolio.json` binds independent project repositories to exact refs. `trsd` materializes an ephemeral workset under `packages/`, `templates/`, and `.fixtures/` for integrated development; the Platform Git repository contains no project gitlinks. Paired content repositories are logical TreeDX/R2 bindings and are never workset checkouts.
