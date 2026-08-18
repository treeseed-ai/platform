# TreeSeed Platform

Public Apache-2.0 installer and integration workspace for customer-centric TreeSeed deployments. Platform manages Admin, an optional sovereign Admin API control plane, Core, CLI, capacity providers, TreeDX, and AI services.

Market is external and immutable at `https://api.treeseed.dev`. This repository cannot provision, deploy, or check out Market or Market API.

The active migration is tracked in [SDK-First Standards, GitHub, and Cluster Cutover Ledger](./docs/sdk-first-cutover-implementation-plan.md). The integrated single-machine and multi-node target is defined in [Cluster Architecture and Cutover](./docs/cluster-architecture-cutover.md), cross-project compatibility in [Standards-Based Independent Development](./docs/standards-dev.md), and provider-neutral GitHub Issues and pull-request synchronization in [GitHub Issues and Pull Request Integration](./docs/github-work-integration.md).

## Workspace

`trsd platform workset --plan --json` reads the authenticated live team project inventory, observes exact repository refs, and previews assignment-owned custody. `trsd platform workset --apply --yes --json` materializes that disposable custody under `packages/`, `templates/`, and `.fixtures/`. The Platform Git repository contains no portfolio manifest or project gitlinks. Paired content repositories are logical TreeDX/R2 bindings and are never software workset checkouts.
