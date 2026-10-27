# Hosted Kata qualification

Task 3D first qualifies GitHub-hosted `ubuntu-26.04` x64. A dedicated `cordis-kata`
self-hosted runner is a fallback if the selected hosted configuration cannot pass the real
runtime gate. No workstation registration is authorized or needed for this experiment.

GitHub [provides Linux KVM acceleration for Android tests](https://github.blog/changelog/2024-04-02-github-actions-hardware-accelerated-android-virtualization-now-available/).
Its [general runner policy](https://github.com/github/docs/blob/main/content/actions/concepts/runners/github-hosted-runners.md)
still describes nested virtual machines as technically possible and unsupported. That policy
caveat does not prove Kata cannot run. The previous mandatory self-hosted requirement was an
untested inference; this qualification replaces it with executable evidence.

## Gate and boundaries

The exact trusted PR head runs a permanent acceptance specification on a fresh hosted VM.
It records the runner image, host kernel, CPU architecture, containerd version, Kata archive
digest, exact Linux/amd64 BusyBox manifest, guest kernel and cleanup outcome. It requires:

1. Linux x64, Ubuntu 26.04, an accessible character-device `/dev/kvm`, KVM API version 12 and
   successful `KVM_CREATE_VM`. Closing that VM descriptor releases the preflight resource.
2. The pinned Kata 4.1.0 archive, checked by size and SHA-256 before extraction on the
   disposable runner. This is a qualification fixture, not a production runtime selection.
3. A separate containerd daemon with private root, state, socket and namespace. The existing
   Docker/containerd services are not reconfigured or stopped.
4. A real Kata guest that prints its kernel and a fixed harmless marker. The guest kernel
   must differ from the host kernel. No software-emulation or ordinary-container fallback.
5. Successful task/container deletion and an empty private namespace, including after guest
   failure. Cleanup failure fails the gate and is reported alongside the original failure.

The fixture uses the upstream [Kata containerd procedure](https://github.com/kata-containers/kata-containers/blob/4.1.0/docs/install/container-manager/containerd/containerd-install.md),
adapted to the [4.1.0 Rust-runtime archive split](https://kata-containers.github.io/kata-containers/releases/4.1.0/).
The selected archive contains `runtime-rs/bin/containerd-shim-kata-v2` and the
`runtime-rs/configuration-qemu-runtime-rs.toml` configuration, rather than the Go `kata-runtime`
CLI. Preflight uses KVM ioctls directly, and the runtime version comes from the selected Rust shim.
The first hosted run verified Ubuntu 26.04, `/dev/kvm` and the exact archive but failed at the
obsolete Go executable path before the KVM/guest program ran. This was a fixture configuration
error, not a runtime compatibility finding.
The corrected Rust-shim run passed KVM creation and reached the private containerd 2.4.1 image
pull. Its default transfer-service unpacker rejected the requested `native` snapshotter. The
fixture therefore uses containerd's explicit `images pull --local` client path, retaining native
snapshots and the same pinned image. This changes image acquisition, not the Kata/KVM requirement.

Use immutable artifacts and isolated daemon state. Host package installation is confined to
the disposable GitHub runner. Download or prerequisite failure is a visible failure, never a
skip. Fork PRs do not receive this privileged fixture; there are no deployment credentials.

Passing proves that exact hosted configuration can boot and clean up Kata. It does not prove
the Agent warm pool, environment egress, manager/worker protocols, seed reconciliation or
replacement safety. Those remain separate assembled acceptance requirements. A saved successful
run cannot replace fresh runtime qualification on subsequent jobs.

## Current evidence

Qualification is pending until an exact-head Actions run passes. No hosted Kata success,
self-hosted provisioning, production deployment or Task 3D completion is claimed. Every issue,
including #678 and #791, remains open under release policy.
