# Hosted deployment

Platform declares portable staging and production topology templates. Deployment owns the pinned OpenTofu modules and Cloudflare/Railway provider behavior; the API authorizes plans and mutations; `trsd` is the operator surface. Platform contains no provider account IDs, team IDs, credentials, host identities, or state.

OpenTofu state is isolated by team, deployment, environment, and stack at:

```text
teams/<teamId>/opentofu/v1/deployments/<deploymentId>/environments/<environment>/stacks/<stackId>/terraform.tfstate
```

The R2 bucket and endpoint come from the active team's Cloudflare storage connection. State access uses a short-lived, team-scoped storage session and state encryption key resolved through the team's OpenBao service credential vault. Provider credentials are resolved only by the operations runner and never enter Platform Git, API records, plans, receipts, logs, or evidence.

Each `connectionRef` is a portable, provider-scoped reference. In Admin, set the service connection's **Connection reference** to that exact value; the API resolves it to the team-local immutable connection ID. Database IDs, account IDs, and credential material never belong in a Platform topology template.

The staging topology requires these active, team-scoped connections:

- `cloudflare-hosting-staging` for Pages, Workers, DNS, and TLS.
- `cloudflare-state-staging` for the R2 state bucket and endpoint, with the state-encryption key reference held by the service credential vault.
- `railway-hosting-staging` for the Railway workspace and staging project/environment.

Account, zone, workspace, project, environment, bucket, endpoint, and key references are connection metadata supplied at installation time. Credential values remain vault-backed and must not be committed to this repository.

## Plan an environment

Release automation produces an ignored `treeseed.hosted-topology-artifacts/v1` document containing exactly the Admin Pages archive, API-proxy Worker file, and immutable Railway OCI image identities required by the selected template. From a clean Platform commit:

```text
trsd platform topology plan config/topologies/staging.yaml --artifacts .treeseed/topology-artifacts/staging.json --json
trsd platform topology plan config/topologies/production.yaml --artifacts .treeseed/topology-artifacts/production.json --json
```

The CLI binds the active authenticated team and exact current Platform commit. Template changes, extra or missing artifacts, mutable images, wrong artifact kinds, unavailable service connections, provider drift, and cross-team state custody all fail closed. Apply requires the exact reviewed plan, an environment approval bound to its digest, and `--yes`. Production remains blocked at the Platform promotion boundary until the full stable release gates pass.

Cloudflare owns the Admin Pages project, API-proxy Worker, DNS, and TLS policy. Railway owns PostgreSQL, the control-plane API, operations runner, and TreeDX service. The three production capacity providers use the generic Debian installer on Ubuntu 26.04, generate identities locally, and require admin approval after registration; OpenTofu does not manage those physical hosts.
