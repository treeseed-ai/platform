# Hosted deployment

Platform declares portable staging and production topology templates. Deployment owns the pinned OpenTofu modules and Cloudflare/Railway provider behavior; the API authorizes plans and mutations; `trsd` is the operator surface. Platform contains no provider account IDs, team IDs, credentials, host identities, or state.

OpenTofu state is isolated by team, deployment, environment, and stack at:

```text
teams/<teamId>/opentofu/v1/deployments/<deploymentId>/environments/<environment>/stacks/<stackId>/terraform.tfstate
```

The R2 bucket and endpoint come from the active team's Cloudflare storage connection. State access uses a short-lived, team-scoped storage session and an independently scoped state-encryption key. Provider and state credentials are released only to the operations runner for one exact operation and never enter Platform Git, API records, plans, receipts, logs, or evidence.

## Credential bootstrap

The bootstrap authority is TreeSeed's client-encrypted team service vault. A team owner initializes the vault in Admin or `trsd`; the client encrypts every value before sending it to the API, and the personal unlock material remains with the user. Planning, apply, and rollback state the exact team, environment, subject digest, purpose, required fields, connection profile, and expiry before the user approves access.

For an approved operation, the operations runner creates an ephemeral public key. The client decrypts only the requested fields locally, seals them to that key, and submits a short-lived single-use delivery. The runner consumes the delivery in memory and destroys the ciphertext and ephemeral private key after use. Reuse, expiry, a changed plan digest, a different purpose, a different profile, extra fields, or a cross-team request fails closed.

OpenBao is an optional authority for a team that later enables unattended reconciliation. It is not required to install TreeSeed, initialize a team, configure Cloudflare or Railway, create the first plan, or provision OpenBao itself. An OpenBao outage therefore blocks only operations explicitly configured for unattended external-vault authority; interactive client-vault operations continue to use the bootstrap path. If a team deploys OpenBao on Railway or another target, that service and its dependencies are reconciled by Deployment like any other explicitly selected hosted resource—Platform does not bundle or assume it.

Each `connectionRef` is a portable, provider-scoped reference. In Admin, set the service connection's **Connection reference** to that exact value; the API resolves it to the team-local immutable connection ID. Database IDs, account IDs, and credential material never belong in a Platform topology template.

The staging topology requires these active, team-scoped connections:

- `cloudflare-hosting-staging` for Pages, Workers, DNS, and TLS.
- `cloudflare-state-staging` for the R2 state bucket and endpoint, storage session, and separately authorized state-encryption key.
- `railway-hosting-staging` for the Railway workspace and staging project/environment.

Their bootstrap profiles are exact:

| Connection | Non-secret configuration | Client-encrypted profile and fields | Approved capabilities |
|---|---|---|---|
| `cloudflare-hosting-staging` | `deploymentEnvironment=staging`, account ID, zone ID | `cloudflare-runtime.apiToken`; `cloudflare-dns.apiToken` | `frontend-hosting`, `dns-management` |
| `cloudflare-state-staging` | `deploymentEnvironment=staging`, account ID, state bucket, HTTPS state endpoint, optional region, state-encryption key reference | `s3-state-session.accessKeyId`, `secretAccessKey`, optional `sessionToken`; `opentofu-state-encryption.stateEncryptionKey` | `object-storage`, `state-encryption` |
| `railway-hosting-staging` | `deploymentEnvironment=staging`, workspace ID, project ID, environment ID | `railway-workspace.apiToken` | `backend-hosting`, `database-hosting`, `private-knowledge-index-hosting` |

Account, zone, workspace, project, environment, bucket, endpoint, and key references are connection metadata supplied at installation time. Credential values remain encrypted in the team service vault and must not be committed to this repository. Connections intended for bootstrap are `interactive-only`; changing one to unattended authority is a separate reviewed team decision.

## Plan an environment

Release automation produces an ignored `treeseed.hosted-topology-artifacts/v1` document containing exactly the Admin Pages archive, API-proxy Worker file, and immutable Railway OCI image identities required by the selected template. From a clean Platform commit:

```text
trsd platform topology plan config/topologies/staging.yaml --artifacts .treeseed/topology-artifacts/staging.json --json
trsd platform topology plan config/topologies/production.yaml --artifacts .treeseed/topology-artifacts/production.json --json
```

The CLI binds the active authenticated team and exact current Platform commit. In an interactive terminal it displays the bounded credential request and prompts for the personal vault passphrase without echo; headless execution accepts the passphrase only from standard input. Template changes, extra or missing artifacts, mutable images, wrong artifact kinds, incomplete connection profiles, unavailable service connections, provider drift, expired or replayed credential delivery, and cross-team state custody all fail closed. Apply requires the exact reviewed plan, an environment approval bound to its digest, and `--yes`. Production remains blocked at the Platform promotion boundary until the full stable release gates pass.

Cloudflare owns the Admin Pages project, API-proxy Worker, DNS, and TLS policy. Railway owns PostgreSQL, the control-plane API, operations runner, and TreeDX service. The three production capacity providers use the generic Debian installer on Ubuntu 26.04, generate identities locally, and require admin approval after registration; OpenTofu does not manage those physical hosts.
