# Managed host canary and cutover

TreeSeed Deployment is the only target host runtime for the local API, Agent capacity provider, TreeDX, optional AI services, and development lab. Project repositories remain development and release inputs; they are not a boot or service-launch dependency. Market and Market API remain portfolio-only and are not deployment inputs.

The first canary uses `deployment/host-configs/workstation-canary.json`. Its stable default checks metadata daily and activates during the Sunday 03:00 local window with jitter. Agent, API, TreeDX, and lab are explicit development overlays polled every 60 seconds. The development Agent is the normal provider component, not a second lab scheduler.

## Preserved source environment

Until final drain approval, preserve these existing paths without mutation:

- source-launched API Node process;
- source-launched Agent manager and runner;
- source-mounted TreeDX container;
- PostgreSQL listening on the existing alternate host port;
- API PostgreSQL and TreeDX volumes;
- Agent provider identity, connections, runtime state, and credential custody.

The canary uses `manager-canary.treeseed.localhost`, `api-canary.treeseed.localhost`, `treedx-canary.treeseed.localhost`, `mail-canary.treeseed.localhost`, and `lab-canary.treeseed.localhost`. No canonical alias changes during parallel validation.

## Human checkpoints

1. Deployment supplies an exact configured bootstrap `.deb` and SHA-256. The operator runs `sudo apt install ./<package>` and retains the installer until status inspection succeeds.
2. After non-secret APT, systemd, journal, manager, and plan inspection, the operator trusts the generated local CA and runs the non-echoing `trsd host enroll` flow.
3. After component-owned snapshot/restore operations, the operator validates API data and authentication/email, an Agent assignment, TreeDX repository read-back, and optional AI behavior through canary aliases.
4. Deployment produces an exact services, volumes, ports, aliases, drains, and rollback map. Canonical drain and alias switch requires explicit operator approval.
5. After normal development and reboot/no-checkout validation, the operator approves retirement of legacy launch instructions.

Failures are corrected as new signed RC packages or immutable images. Installed files are not hand-patched. Repositories, legacy volumes, and stopped legacy services remain recoverable and read-only through the rollback window.

## State transition order

1. Install and enroll the parallel manager and edge.
2. Restore a consistent PostgreSQL dump into manager-owned API state with no concurrent writers to the copied database.
3. Export, restore, and verify TreeDX state through its component migration operation.
4. Stop the old Agent provider, then migrate its identity, connection, runtime, and credential custody before registering the managed provider. Never run both identities concurrently.
5. Exercise canary application paths and publish corrected RC generations until healthy.
6. With explicit drain approval, take final incremental backups, stop repository-launched writers, activate manager-owned services, and switch canonical aliases.
7. Prove reboot recovery and updates while every application checkout is unavailable to launch tooling.

Success means `trsd host doctor` is healthy and the manager restores and converges API, development Agent, TreeDX, lab, edge, and selected AI services using only signed Debian payloads and immutable registry images—without Git fetch, npm build, local Docker build, or source-mounted Compose.

## Live canary ledger

- RC6 installed the signed host payloads but exposed the bootstrap dpkg-lock, local socket ownership, and pre-install Compose validation defects. Deployment RC7 corrected those defects without editing installed files.
- RC7 upgraded the host asynchronously, enrolled the configured operator, installed the exact Agent RC13, API RC9, TreeDX RC5, and Lab RC7 component packages, and preserved the legacy TreeDX and PostgreSQL containers.
- The first RC7 activation correctly entered rollback when the API migration rejected the generation-1 `DATABASE_URL` mapping. Generation 2 uses the API's authoritative `TREESEED_DATABASE_URL` contract. No legacy writer or volume was stopped or removed.
- RC8 proved the generation-2 environment contract, then rejected the API migration because its unaccepted RC7 canary PostgreSQL state retained the earlier bootstrap password. Generation 3 is paired with an explicit one-time reset of only the unaccepted manager-owned API canary state; legacy PostgreSQL and TreeDX state remain untouched. RC9 also serializes reconciliation and starts the edge on its first accepted configuration.
- RC9 installed generation 3 and all core packages, and brought the manager-owned Caddy edge up healthy. Its one-time reset remained unconsumed when a stale supervisor socket pathname raced the first request; the automatic retry then found the already-consumed configuration seed. Generation 4 uses an idempotent bootstrap and a real supervisor request/response readiness gate before the same scoped API recovery.
