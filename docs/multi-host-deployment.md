# Unified multi-host deployment

TreeSeed Deployment is the only host runtime for API, Agent capacity providers, TreeDX, AI, edge, and Lab. Project repositories publish immutable images and signed production Compose bundles. Platform reviews their exact assets into stable and development integration locks. Deployment verifies those locks and publishes the corresponding Debian packages and catalogs.

Every Debian or Ubuntu server and VM has one lightweight local manager with authority limited to that host. A configuration assigns only the required components and explicit local or remote connections. The same release lock therefore supports an integrated workstation, an Agent-only capacity provider, split control-plane and knowledge hosts, AI/GPU hosts, edge hosts, and custom combinations.

The tracked workstation configuration is `deployment/host-configs/development-workstation.json`. It uses the canonical manager, API, TreeDX, mail, and Lab `.treeseed.localhost` aliases and the development update track. Adopt it explicitly with:

```sh
trsd host config plan deployment/host-configs/development-workstation.json
trsd host config adopt deployment/host-configs/development-workstation.json --confirm
```

Agent-only providers declare a remote HTTPS control-plane connection and install no API, PostgreSQL, TreeDX, AI, Lab, or edge service. Adding a provider requires only the configured package, its checksum, installation, and control-plane approval. Pending approval is a healthy lifecycle state.

Production Compose files are immutable component artifacts installed below `/usr/share/treeseed/components`. A Compose-only change is a new component Debian revision and catalog generation even when image digests are unchanged. The manager never edits installed definitions or builds source. It drains affected services, backs up state, installs the new package, activates Compose with health gates, records exact digests, and reinstalls the prior package and Compose bundle on failure.

Development hosts poll signed metadata every 60 seconds. Stable hosts poll metadata independently and activate in their configured maintenance window with deterministic per-host jitter. An unchanged catalog performs no package download, image pull, Compose invocation, or restart.

Project checkouts are used only for coding, tests, and release work. They are not supported service-launch inputs.
