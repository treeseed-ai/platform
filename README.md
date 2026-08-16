# TreeSeed Platform

Public Apache-2.0 installer and integration workspace for customer-centric TreeSeed deployments. Platform manages Admin, an optional sovereign Admin API control plane, Core, CLI, capacity providers, TreeDX, and AI services.

Market is external and immutable at `https://api.treeseed.dev`. This repository cannot provision, deploy, or check out Market or Market API.

## Workspace

`trsd platform workset --plan --json` reads the authenticated live team project inventory, observes exact repository refs, and previews assignment-owned custody. `trsd platform workset --apply --yes --json` materializes that disposable custody under `packages/`, `templates/`, and `.fixtures/`. The Platform Git repository contains no portfolio manifest or project gitlinks. Paired content repositories are logical TreeDX/R2 bindings and are never software workset checkouts.
