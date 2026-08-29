# Kata assignment security

TreeSeed capacity providers use one Kata runtime-rs QEMU/KVM microVM for each assignment attempt. The provider container receives only the root-owned broker socket. It does not receive Docker, containerd, KVM, host filesystem, or upstream model credentials.

## Trust boundary

The provider signs a `treeseed.sandbox-assignment/v1` manifest. The broker validates its schema, provider signing key, immutable guest digest, limits, exact identity/context digests, network policy, and lease expiry before invoking containerd in the `treeseed-sandboxes` namespace. Guest input and output use separate mounts: verified input is read-only and the bounded output directory is writable. CPU, memory, wall-time, process, disk, and output limits are carried into the guest contract; the broker enforces the host-visible limits and the guest entrypoint enforces in-VM limits.

The broker reports unavailable unless KVM, containerd, Kata, trusted provider keys, the guest entrypoint, and the model gateway are all healthy. A v4 provider returns assignments when exact repository/TreeDX inputs have not been materialized. There is no fallback to process execution or copying Codex authentication into a guest.

## Host commands

Read-only operations never require confirmation:

```text
trsd host security plan
trsd host security status
trsd host security verify
trsd host sandbox status
trsd host sandbox doctor
trsd host security recovery verify --bundle /absolute/path/recovery.bundle
```

Initialization and rotation require explicit confirmation and hidden passphrase input:

```text
trsd host security initialize --recovery-bundle /absolute/path/recovery.bundle --confirm
trsd host security rotate credentials --recovery-bundle /absolute/path/current.bundle --new-recovery-bundle /absolute/path/next.bundle --confirm
```

The initialization operation first explains and requests a hidden model-provider service API key; subscription login state is never copied into a guest. It refuses an existing or partial volume, creates a LUKS2/Argon2id sparse image, adds independent runtime and recovery slots, uses TPM2 in production or an encrypted systemd credential on development hosts, formats ext4, copies state with metadata, retains the former plaintext directory as an offline rollback generation, and mounts with `nodev,nosuid,noexec`. The recovery bundle uses scrypt and AES-256-GCM, is written once with mode `0600`, and is only inventoried after authentication.

## Application encryption

`treeseed.encrypted-envelope/v1` uses a random 256-bit DEK for each record, AES-256-GCM for payload and DEK wrapping, independent nonces, canonical AAD, key generation metadata, and ciphertext digests. Provider `data://` credentials are encrypted at rest and legacy plaintext values are atomically migrated after a successful read. Protected communication trace payloads are stored only as envelopes for new writes; normal receipts never decrypt them, while authorized full diagnostics do. The database migration rejects new protected plaintext while a restartable, row-locked backfill encrypts historical rows. Manager generation backups use a separate authenticated backup KEK and persist only as `treeseed.encrypted-backup/v1`; their temporary plaintext tar exists only under `/run` and is removed before the operation returns.

## Cutover gate

Production capacity must remain unavailable until the security receipt is known-good, the v4 manifest contains only `microvm` adapters, exact input materialization and the model gateway are healthy, protected-diagnostic backfill is complete, and the encrypted restore drill passes. The encrypted volume and envelope formats are never rolled back to plaintext.
