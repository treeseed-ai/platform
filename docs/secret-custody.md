# Secret custody

TreeSeed has two custody implementations. Platform declares composition and ownership; it does not implement a vault.

| Custody | Owns | Access |
|---|---|---|
| Core OpenBao | Team service/provider credentials and OpenTofu encryption keys | API-authorized team, project, environment and purpose; versioned writes; short-lived trusted-service sessions |
| OS-backed local custody | Host bootstrap/seal/recovery roots, CLI OAuth sessions and provider-owned credentials | Deployment implementation, private OS credentials and scoped authenticated local records; provider environment files remain inside the OS-encrypted provider volume |

Cryptographic envelopes for protected diagnostics, native GitHub App token exchange and GitHub Actions sealed uploads are protocols/data encryption, not additional credential stores. Runtime environment variables are an injection transport, not an alternative team-vault authority. Bootstrap inputs must come from protected installation custody; never commit their values or persist plaintext key fallbacks.

## Team connections

Sign in to Admin, select the team, open Services and configure the connection's non-secret target and enabled capabilities. On that connection, save each required credential profile. Admin sends the value over HTTPS to the authenticated API and clears secret fields. Read-back returns configured field names and version, never values. No personal passphrase or team-vault initialization wizard exists.

The corresponding CLI surface is:

```text
trsd services credentials show <connection> <profile> --team <team> --json
trsd services credentials put <connection> <profile> --team <team> --expected-version <version>
trsd services credentials validate <connection> <profile> --team <team> --expected-version <version> --json
trsd services credentials delete <connection> <profile> --team <team> --expected-version <version> --json
```

Use hidden prompts or `--stdin` for a JSON field object; never place values in arguments or shell history. Version zero creates a new profile. Inspect the current version before replacement or deletion. R2 validation is read-only; encryption-key validation checks key format, not remote resource readiness. Neither substitutes for hosted plan/apply/read-back acceptance.

## Local custody and bootstrap

CLI sessions use OS-sealed local custody. `trsd secrets lock` prevents decryption across CLI invocations; `trsd secrets unlock` asks the OS to unlock the key. There is no plaintext CLI keyring or fake key rotation command. OAuth reauthentication replaces session credentials.

The host manager prepares OpenBao's TLS and static-seal material outside its Raft volume. A one-shot initializer configures KV/AppRole authority and revokes initialization root authority. The API and runner receive only private client identity mounts. Do not mount these into provider assignments or custom applications.

Provider identities and membership credentials use the shared Deployment local store with an OS-injected key. Provider secrets stay on the provider; arbitrary host environment inheritance is denied. Existing retired files, missing keys, unsafe paths and invalid ciphertext fail closed. No plaintext import, compatibility reader or automatic identity regeneration is allowed. An uncertain identity rotation retains its encrypted pending transaction for recovery.

Recovery-bundle passphrases still protect offline host recovery. They are distinct from the removed personal service-vault passphrase. Preserve an independently accessible encrypted recovery bundle and test restoration before replacing OS seal authority.

## Release boundary

The consumer refactor must ship as one exact composition. Do not mix a new Admin/CLI with an old API or activate a new API without its Deployment/OpenBao bootstrap closure. Repository tests and staging PR merges are not evidence of managed-host or Railway acceptance.

Cloud rollout additionally requires an independently provisioned seal authority and private, persistent OpenBao service. Neither its seal key nor its only recovery copy may live in the state it unlocks. Until Deployment's hosted closure and restore tests pass, cloud apply remains fail-closed. Production promotion requires human review of the exact Platform PR to `main`; staging work has no human-only approval gate.
