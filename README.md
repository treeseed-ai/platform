# TreeSeed Platform

TreeSeed Platform is the public, portable configuration and documentation workspace for installing, composing, developing, and releasing the TreeSeed ecosystem. It owns no application runtime or service implementation. SDK operations reconcile its declarations; `trsd` is the operator surface; the host manager owns installed services.

## Start developing

Install a released CLI, clone this repository, and plan the desired source workset before any local API exists:

```text
trsd platform verify . --json
trsd platform workset --profile core --plan --json
trsd platform workset --profile core --apply --yes --json
```

Primary source repositories are materialized beneath `packages/<project-slug>`. Platform remains at the workspace root, knowledge libraries are never software checkouts, and `.treeseed/worksets` contains ignored exact-ref receipts. Existing checkouts are never reset, deleted, or overwritten.

Install the governed TreeSeed skill at the exact release recorded in `config/skills/treeseed.lock.yaml`. Platform tracks the project lock but ignores installed skill files; skill updates are explicit lock-update pull requests.

Profiles are composable:

```text
trsd platform workset --profile control-plane --apply --yes --json
trsd platform workset --profile capacity-provider --apply --yes --json
trsd platform workset --profile control-plane --profile treeai --apply --yes --json
```

`core` contains every first-party source project. Runtime selection is independent: any target may remain released while selected targets run live or as candidates.

## Installation and production

One generic Debian bootstrap installs only the manager foundation. `trsd host initialize --profile <profile>` selects the role after installation. A capacity provider needs only the control-plane URL and a prompted team registration code; approval binds its generated local identity and replaces the code with short-lived sessions.

Production topology is declared under `config/topologies/` and remains fail-closed. Cloudflare hosts Admin, Railway hosts the control plane, and bare-metal providers run Agent. Market and Market API participate in development worksets but retain independent hosted-deployment authority.

Staging and production use portable templates plus separately generated immutable artifact inputs. See [hosted deployment](docs/hosted-deployment.md) for state isolation, credential custody, planning, and the Ubuntu 26.04 capacity-provider fleet boundary.

Current delivery work and evidence are tracked in [Platform issue #280](https://github.com/treeseed-ai/platform/issues/280). GitHub Issues are status authority and Actions are verification authority.
