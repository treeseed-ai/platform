# Hosted deployment

Platform declares portable staging and production topology templates. Deployment owns the pinned OpenTofu modules and Cloudflare/Railway provider behavior; the API authorizes plans and mutations; `trsd` is the operator surface. Platform contains no provider account IDs, team IDs, credentials, host identities, or state.

OpenTofu state is isolated by team, deployment, environment, and stack at:

```text
teams/<teamId>/opentofu/v1/deployments/<deploymentId>/environments/<environment>/stacks/<stackId>/terraform.tfstate
```

The R2 bucket and endpoint come from the active team's Cloudflare storage connection. State access uses a short-lived, team-scoped storage session and an independently scoped state-encryption key. Provider and state credentials are released only to the operations runner for one exact operation and never enter Platform Git, API records, plans, receipts, logs, or evidence.

## Credential bootstrap

Core OpenBao is a required private service alongside the control-plane API. Deployment owns its immutable image, TLS, persistent Raft storage, initialization, bounded AppRole sessions and OS-backed seal/recovery custody. It is not an optional external provider. API readiness fails closed when OpenBao is unavailable.

A credential administrator creates a team service connection and enters its credential profiles in Admin or through `trsd services credentials`. The authenticated API authorizes the team, enabled capability, profile and environment before writing to OpenBao with an exact expected version. Only non-secret descriptors and authority versions enter PostgreSQL. There is no personal vault passphrase, browser key/grant/envelope, interactive runner delivery or environment-reference authority.

The operations runner obtains a short-lived OpenBao session, reads only the operation's authorized scope, and revokes the session on completion or failure. State/backend/profile authority and current secret version are rechecked before use. An outage blocks credential-dependent work; it never enables a fallback vault. See [Secret custody](secret-custody.md) for bootstrap and recovery boundaries.

Each `connectionRef` is a portable, provider-scoped reference. In Admin, set the service connection's **Connection reference** to that exact value; the API resolves it to the team-local immutable connection ID. Database IDs, account IDs, and credential material never belong in a Platform topology template.

The staging topology requires these active, team-scoped connections:

- `cloudflare-hosting-staging` for Pages, Workers, DNS, and TLS.
- `cloudflare-state-staging` for the R2 state bucket and endpoint, storage session, and separately authorized state-encryption key.
- `railway-hosting-staging` for the Railway workspace and staging project/environment.

Their bootstrap profiles are exact:

| Connection | Non-secret configuration | OpenBao profile and fields | Approved capabilities |
|---|---|---|---|
| `cloudflare-hosting-staging` | `deploymentEnvironment=staging`, account ID, zone ID | `cloudflare-runtime.apiToken`; `cloudflare-dns.apiToken` | `frontend-hosting`, `dns-management` |
| `cloudflare-state-staging` | `deploymentEnvironment=staging`, account ID, state bucket, HTTPS state endpoint, optional region, state-encryption key reference | `s3-state-session.accessKeyId`, `secretAccessKey`, optional `sessionToken`; `opentofu-state-encryption.stateEncryptionKey` | `object-storage`, `state-encryption` |
| `railway-hosting-staging` | `deploymentEnvironment=staging`, workspace ID, project ID, environment ID | `railway-workspace.apiToken` | `backend-hosting`, `database-hosting`, `private-knowledge-index-hosting` |

Account, zone, workspace, project, environment, bucket, endpoint, and key references are installation-time connection metadata. Credential values remain in OpenBao and must not be committed here. Authorized agents can use the same capability-scoped connections without a separate human approval or personal unlock session.

## Plan an environment

Release automation produces an ignored `treeseed.hosted-topology-artifacts/v1` document containing exactly the Admin Pages archive, API-proxy Worker file, and immutable Railway OCI image identities required by the selected template. From a clean Platform commit:

```text
trsd platform topology plan config/topologies/staging.yaml --artifacts .treeseed/topology-artifacts/staging.json --json
trsd platform topology plan config/topologies/production.yaml --artifacts .treeseed/topology-artifacts/production.json --json
```

The CLI binds the active authenticated team and exact current Platform commit. Credential resolution is server-side through core OpenBao; planning does not prompt for a personal vault passphrase. Template changes, extra or missing artifacts, mutable images, wrong artifact kinds, incomplete connection profiles, unavailable service connections, provider drift, expired custody sessions or stale credential versions, and cross-team state custody all fail closed. Apply requires authenticated `infrastructure.write` authority, the exact reviewed plan, its digest precondition, and `--yes`; no separate environment approval exists. Production is authorized only by human review of the exact Platform pull request targeting `main`, then proceeds through automated reconciliation without a second approval gate.

Cloudflare owns the Admin Pages project, API-proxy Worker, DNS, and TLS policy. The target Railway composition must include PostgreSQL, core OpenBao, the control-plane API, operations runner, and TreeDX service. Cloud rollout remains blocked until Deployment has provisioned and accepted an independent cloud seal authority, private TLS, persistent storage and recovery; the older topology templates must not be applied without that closure. The three production capacity providers use the generic Debian installer on Ubuntu 26.04, generate identities locally, and require admin approval after registration; OpenTofu does not manage those physical hosts.
