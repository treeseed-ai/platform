# TreeSeed Cluster Architecture and Cutover

## Status and purpose

This document integrates the standards-based development migration, the current Platform handoff state, and the target QEMU/KVM and host-integrated AI architecture into one implementation and cutover plan.

It defines one TreeSeed architecture that can run as:

- a collapsed single-machine development appliance;
- a two-machine application/accelerator deployment; or
- a three-machine appliance with independent application, inference, and learning capacity.

These are deployment profiles of the same system. They are not separate products or code paths.

This document is architectural direction, not deployment authorization. Hosted deployment, `trsd release`, and production promotion remain fail-closed until the reviewed OpenTofu topology restores them. Platform must never add Market or Market API as a checkout, submodule, provisionable project, or deployment resource.

## Integrated objective

TreeSeed is moving toward a governed, independently versioned, continuously learning system in which:

1. Platform composes 31 independently operable projects through published standards and immutable artifacts.
2. The API control plane owns durable governance, assignments, capacity leases, receipts, evidence, settlement, and promotion authority.
3. Agent runtimes execute governed work in isolated capacity, including a QEMU/KVM guest where appropriate.
4. Application and simulation workloads use CPU and RAM capacity without needing to know where model inference or training runs.
5. Inference serves the current accepted model and adapter release through a logical service.
6. Learning freezes an experience generation, curates it, simulates and evaluates behavior, trains a candidate, and proposes promotion without mutating the serving release.
7. Git identifies source; OCI and artifact digests identify executable and ML artifacts; a composition identifies the exact integrated system.
8. Trusted reconcilers turn desired state into host operations. Agents never administer a host directly.

The central topology invariant is:

> Applications do not know where inference runs. Agents do not know where training runs. Training does not know where production inference runs. Nodes advertise capabilities; controllers schedule desired work.

The central release invariant is:

> No source commit, image, dataset, adapter, evaluation, or deployment is accepted merely because a process completed. The exact artifact must be independently verified, promoted by policy, read back from its authority, and retained in a reversible composition.

## One architecture, three planes

### Governance and application plane

This plane contains:

- the API control plane and PostgreSQL;
- Admin, Core, CLI, and other application services;
- agent provider managers, runners, and AgentKernel execution;
- project workspaces and assignment-scoped repository custody;
- CPU-oriented simulations, teacher/reviewer orchestration, builds, and tests;
- TreeDX-mediated knowledge access; and
- SDK-owned desired-state compilation and reconciliation.

The API remains the authoritative scheduler for governed workdays, assignments, leases, usage, settlement, and promotion decisions. `@treeseed/agent` owns agent execution and provider runtimes. The SDK owns portable contracts, desired-state graphs, reconciliation, package workflows, worksets, and receipts. Platform is the composition laboratory and operator workbench; it is not the implementation owner of member projects.

### Awake inference plane

This plane contains:

- an authenticated inference gateway;
- vLLM or a contract-compatible inference runtime;
- an immutable base-model revision;
- the currently promoted agent adapters;
- health, readiness, load, cancellation, accounting, and observability interfaces; and
- a trusted inference reconciler that alone may use model-management operations.

Agents use a stable inference contract such as `inference.default`. They do not call vLLM adapter administration endpoints, select a physical GPU, or receive device access. A logical adapter name such as `agent/backend-engineer/current` resolves to an immutable accepted release.

### Learning plane

“Sleep” is a lifecycle, not necessarily a machine state. It has distinct stages:

1. **Freeze:** close an immutable experience epoch and record its generation.
2. **Curate and simulate:** use CPU-oriented workers plus inference to review traces, generate scenarios, reject invalid experience, and construct a provenance-bearing dataset.
3. **Train:** lease suitable accelerator capacity and run Axolotl/PEFT or a contract-compatible trainer to produce candidate adapters.
4. **Evaluate:** run deterministic, behavioral, safety, regression, and comparative evaluation against the incumbent.
5. **Publish:** store the candidate, dataset, configuration, and evaluation as immutable artifacts.
6. **Promote or reject:** let the trusted release controller apply policy and, where required, human approval.

On constrained hardware, inference, training, and some evaluation stages serialize through an exclusive accelerator lease. With separate inference and learning accelerators, the serving generation remains awake while its successor moves through sleep. Awake/sleep therefore belongs to an agent release generation, not to a physical node.

## Trust and communication boundaries

### QEMU/KVM guest

The guest is an agent and development sandbox. It may:

- receive assignment-scoped repository authority;
- edit, build, and test source;
- create commits and candidate artifacts;
- call inference and governed job APIs;
- submit datasets, simulations, evaluations, and desired-state proposals; and
- read only the capacity and artifact metadata permitted by its assignment.

It must not receive:

- host root or general SSH administration;
- the host Docker socket;
- host filesystem access or a writable shared source tree;
- direct GPU devices merely to invoke remote capacity;
- vLLM adapter-management authority;
- production credentials or promoted-artifact write authority; or
- permission to alter controller, release, network, or host policy.

There is no routine VirtioFS exchange. The guest keeps its own checkout and crosses the trust boundary through authenticated, versioned interfaces.

### Host-integrated capacity

The trusted host side may run native drivers and tightly controlled services or containers for:

- the inference gateway and vLLM;
- training and evaluation launchers;
- capacity, cycle, and lease reconcilers;
- artifact verification and release promotion;
- registry and artifact-store access; and
- hardware observation and recovery.

Agent-developed native/GPU work executes only as a declared job from a verified artifact under a constrained runtime. The request describes required capability and desired outcome, not an arbitrary privileged shell command.

### Network boundary

On a combined QEMU/KVM machine, the guest communicates with the host over a dedicated host-only network. Host-enforced policy exposes only authenticated logical services required by the profile. Normal guest internet access, when authorized, uses a separate interface.

Moving a logical service from the host to another physical machine changes service discovery and placement data only. It does not change the agent, application, training, or artifact contract.

## Stable interfaces

The cluster is joined by published standards rather than a shared filesystem or sibling source imports.

| Interface | Purpose | Direction | Authoritative identity |
| --- | --- | --- | --- |
| Git | Source, review, repository outcome, and provenance | Agent/workbench to governed repository flow | Repository plus exact commit |
| OCI distribution | Images, contract bundles, adapters, and other content-addressed release artifacts | Builders to registry to reconcilers | Repository plus digest |
| Artifact service | Large datasets, evaluations, traces, and model assets when OCI is unsuitable | Producers and authorized consumers | Typed artifact plus digest |
| Inference API | Model requests, streaming, cancellation, usage, health, and capabilities | Applications and agents to inference | Contract version plus serving release |
| Capacity API | Node registration, capability discovery, leases, jobs, status, and accounting | Nodes and clients through the control plane | Assignment, node, lease, and generation |
| Training/evaluation API | Declarative train, merge, and evaluate jobs | Learning controller to capacity | Job spec plus exact input digests |
| Release API | Candidate registration, policy evaluation, promotion, rollback, and read-back | Trusted release controller | Immutable release manifest |
| TreeDX contracts | Governed knowledge and content operations | Agents and services through TreeDX/API | Definition revision, source ref, and receipt |

These interfaces become contract families under `treeseed.contract-bundle/v1`. Their structural, behavioral, consumer-driven, and integrated compatibility is verified as required by `standards-dev.md`.

## Capacity model and scheduling

A capacity node registers an observed, signed description that includes:

- node identity, architecture, operating-system/runtime support, and trust class;
- CPU, RAM, storage, accelerators, accelerator memory, and native limits;
- supported roles such as `application`, `agent`, `simulation`, `inference`, `training`, and `evaluation`;
- supported runtimes and version ranges;
- isolation, network, locality, and data-residency properties;
- concurrency, budget, preemption, drain, readiness, and shutdown behavior; and
- the immutable runtime artifact and source-closure identity.

A job declares requirements, not a hostname. Placement matches required capabilities, authority, locality, available budget, and policy. A lease binds the selected job, node, resource slice, time window, and accounting generation.

On a single accelerator, inference and training request mutually exclusive leases. The cycle controller drains active inference work within policy, releases the inference lease, starts training, evaluates the candidate, and restores the accepted inference desired state. On separate accelerators, both leases may remain active concurrently.

No implementation should contain topology branches such as `if laptop` or `if spark`. Differences belong in node advertisements, deployment profiles, placement constraints, and policy.

## Standard deployment profiles

### Collapsed single-machine profile

One physical laptop or workstation contains two logical trust/capacity nodes:

```text
Physical machine
  QEMU/KVM guest: execution node
    application, agent, build, CPU simulation
  trusted host: accelerator node
    inference, training, accelerator evaluation
```

The guest and host remain separate node identities even though they share a chassis. Inference and training serialize on the host GPU. The host-only network and the published contracts make this a collapsed instance of the distributed architecture rather than a special developer implementation.

### Two-machine profile

```text
CPU/RAM node
  application, API, agents, builds, CPU simulation

Accelerator node
  inference, training, accelerator evaluation
```

The accelerator still serializes awake inference and training when one GPU cannot safely serve both. A QEMU/KVM sandbox may run on the CPU node or be represented by another supported isolation provider without changing agent contracts.

### Three-machine appliance profile

```text
CPU/RAM server
  application, API, agents, builds, CPU simulation

Inference accelerator
  inference gateway, vLLM, accepted production adapters

Learning accelerator
  training, adapter compilation, accelerator evaluation
```

The inference node remains continuously available while the learning node creates a candidate. Promotion changes the desired serving release to an already verified digest. Rollback selects the prior manifest; it never rebuilds or overwrites a mutable release.

Additional nodes repeat these same roles and capacity contracts. A larger cluster is an expansion of the profile, not a fourth architecture.

## Repository and artifact architecture

The cluster does not imply a new monorepo or a repository per physical machine. Repository boundaries follow product and contract ownership; deployment placement is composition data.

Current ownership remains:

- `@treeseed/api`: durable control-plane state, assignments, leases, usage, settlement, and promotion authority;
- `@treeseed/agent`: provider manager/runner, AgentKernel, execution adapters, assignment-scoped tools, and runtime images;
- `@treeseed/ai`: independently installable inference appliance, model gateway, hardware diagnostics, and future governed training/adapter lifecycle;
- `@treeseed/sdk`: portable schemas and clients, desired-state graph, reconciliation, package workflows, custody, receipts, and composition contracts;
- `@treeseed/cli`: operator command surface over the same API and SDK operations;
- `packages/treedx`: product-neutral repository, graph, storage, and artifact mechanics;
- Platform: inventory, worksets, integration composition, local runtime reconciliation, and portfolio evidence.

If a portable protocol cannot remain narrow inside an existing project, it may become a separately versioned contract package. That decision is driven by release or runtime coupling, not by node topology.

Every distributable project declares produced and consumed contracts, semantic ranges, artifacts, runtime support, verifiers, guarantees, and rollback operations in `treeseed.package.yaml`. A clean clone must build and test using published dependencies. No cluster component imports a sibling checkout or uses a parent gitlink as its integration contract.

The principal immutable records are:

- `treeseed.contract-bundle/v1` for a project's published interaction surface;
- `treeseed.compatibility-attestation/v1` for contract delta and required semantic bump;
- `treeseed.composition/v1` for an exact integrated software deployment;
- a capacity-node observation and lease record for placement and accounting; and
- an agent/model release manifest for base model, adapter, dataset, training configuration, evaluation, runtime, source, parent, and provenance digests.

An agent release is promoted by changing an authoritative channel reference from one immutable manifest to another. Production consumes exact versions and digests from an accepted composition. Mutable tags and branch names are discovery conveniences, not production identity.

## Reconciliation and automation

Agents submit desired state and artifacts; trusted controllers continually reconcile actual state.

The controller set may be deployed together or separately, but it must preserve one authority model:

- capacity controller: registers nodes and reconciles leases;
- application/runtime controller: reconciles exact composed services;
- inference controller: reconciles base model, adapters, health, drain, and serving release;
- learning controller: reconciles experience epochs, simulation, datasets, training, and evaluation;
- artifact controller: verifies type, digest, provenance, retention, and availability;
- release controller: evaluates gates, requests approval, promotes, reads back, and rolls back;
- policy engine: determines permitted automation and human approval boundaries; and
- secret broker: gives a job only bounded, short-lived authority without exposing reusable provider credentials.

Routine operations should be closed loops: node restart, service crash, failed adapter load, interrupted job, or stale desired state causes bounded recovery or a durable exception. It must not cause an agent to SSH into a host and repair it manually.

### Human intervention policy

| Level | Default handling | Examples |
| --- | --- | --- |
| 0 | Fully automatic | Branch/worktree preparation, tests, builds, candidate publication, simulation, dataset construction, evaluation, scheduling, retry, evidence capture, and bounded garbage collection |
| 1 | Automatic when policy and guarantees pass | Development deployment, service restart, training launch, accepted adapter promotion, capacity adjustment, and rollback |
| 2 | Explicit approval | Production application release, database or durable-event migration, new network exposure, new credentials or authority, authentication/billing changes, privileged runtime, destructive storage change, or promotion-policy change |
| 3 | Human/root-of-trust operation | Initial host provisioning, firmware, Secure Boot/TPM recovery, physical networking or hardware changes, driver recovery, and control-plane disaster recovery |

Policy may make a particular operation stricter. It may not let an agent expand its own authority or weaken the evidence required by a guarantee.

## Current project state as of 2026-08-18

### Completed and accepted

- The clean public Platform staging clone is the intended future development workbench.
- The `platform-local-managed-codex` template was initialized and its local template state is recorded.
- The staged SDK lock repair and API standalone lock correction passed their recorded verification.
- A freshly built managed agent-runtime image proved the stale-image/source-closure repair in a bounded run.
- `docs/standards-dev.md` is staged as the canonical independent-development migration contract.
- The complete portfolio previously passed independent local package verification with hosted CI disabled.
- No hosted deployment, release, production mutation, or Market/Market API provisioning was authorized.

### Not yet ready

- The 13-repository Platform standing workset has not been materialized.
- Platform staging still records the API ref from before the accepted API standalone correction.
- Managed local services are not declared ready.
- The bounded governed source canary has not passed.
- The canonical agent guarantees remain inactive; the last authoritative state was 0 of 15 active.
- Baseline, clean-repeat, and interruption/resume evidence has not been established on one immutable post-standards generation.
- The Guide golden campaign has not produced its required reviewed, integrated, authoritative repository outcome.
- Contract-bundle, compatibility-attestation, composition, and portfolio-registry tooling described by the standards document has not yet been implemented.
- Training, experience curation, adapter competition, promotion, and full multi-node appliance operation remain target capabilities, not current proof.
- Hosted deployment and production promotion remain fail-closed pending the reviewed OpenTofu topology.

Package tests, an image build, an architecture document, or a running process do not close any of these gaps by themselves.

### Preserved transitional state

- The old Market checkout remains only for bounded recovery or read-only comparison until Platform independently boots and passes its canary. It is not the new development root.
- The unpublished SDK atomic-lockfile experiment is not accepted work.
- The unpublished TreeDX scene change and the preserved pre-migration Platform directory must not be reset or absorbed implicitly.
- The obsolete exact-commit fan-out workflow must not be optimized or restarted portfolio-wide merely to make transitional refs look symmetrical.

## Integrated cutover plan

The cutover proceeds by proving contracts and control loops in the smallest profile first, then changing placement without changing semantics.

### Gate 0: preserve boundaries and establish a truthful baseline

1. Audit the clean Platform clone, template state, live inventory, accepted API staging correction, and preserved transitional state.
2. Reconcile Platform's bootstrap API dependency in a bounded way without a portfolio-wide exact-ref fan-out.
3. Make Platform's package-local save and verification contract truthful, including the missing local operator path.
4. Start the managed local runtime and verify exact source closure and image identity.

Exit evidence:

- clean authoritative Platform state;
- bounded API reconciliation receipt;
- package-local verification from the Platform root; and
- ready local services whose artifacts match their recorded source generation.

### Gate 1: establish governed execution on the collapsed profile

1. Materialize the 13 allowed Platform-managed software repositories into the inventory-driven workset.
2. Reject Market, Market API, content repositories, gitlinks, and ungoverned singleton checkouts.
3. Verify template, seed, scene, dynamic TreeDX context-query, custody, and cleanup behavior.
4. Run one source canary through proposal, decision, estimate, capacity planning, execution, independent review, integration, exact-ref read-back, reporting, settlement, staging promotion, and zero-residue cleanup.

Exit evidence:

- an exact workset manifest;
- a complete governed canary receipt;
- the intended repository postcondition on its authoritative ref; and
- no leftover branch, worktree, assignment, lease, or unpublished artifact residue.

### Gate 2: implement the thin standards federation slice

1. Add portable schemas for contract bundles, compatibility attestations, compositions, and portfolio registry entries.
2. Extend `treeseed.package.yaml` with produced and consumed standards, artifacts, ranges, verifiers, and guarantees.
3. Implement TypeScript public-API and OpenAPI normalization and comparison.
4. Publish a narrow SDK candidate and prove that a compatible SDK patch changes no consumer repository.
5. Add one consumer-driven case and one insufficient-version-bump rejection.
6. Resolve and verify the first Platform composition from immutable candidates.

Exit evidence:

- machine-readable contracts and attestations;
- clean-clone candidate verification;
- an exact composition BOM; and
- proof that compatibility, rather than a propagated commit, governs an unchanged consumer.

After this mandatory thin slice, add the provider-neutral work-item and change-request contracts from [GitHub Issues and Pull Request Integration](./github-work-integration.md). Introduce GitHub synchronization through a read-only canary before Issue or PR writes become part of governed execution.

### Gate 3: standardize capacity and appliance interfaces

1. Publish stable contracts for node registration, capability observation, leasing, jobs, inference, artifact exchange, release manifests, drain/shutdown, and accounting.
2. Reconcile the existing `@treeseed/ai` inference foundation through those contracts without making it a second scheduler.
3. Represent the QEMU/KVM guest and host accelerator as distinct logical capacity nodes.
4. Bind guest-to-host communication to the isolated service network; remove any routine shared-filesystem or privileged-host dependency.
5. Prove node restart, service crash, lease expiry, job interruption, and inference rollback as reconciling control loops.

Exit evidence:

- packaged protocol artifacts and consumer tests;
- a registered collapsed profile with exact runtime identities;
- enforced negative tests for forbidden guest authority; and
- recovery evidence with no manual host administration.

### Gate 4: implement the reversible learning loop

1. Define immutable experience-epoch, curated-dataset, training-job, evaluation, adapter, and agent-release contracts.
2. Implement simulation as a schedulable consumer of CPU and inference capacity.
3. Implement exclusive accelerator leasing, graceful inference drain, training, evaluation, and restoration on the single accelerator.
4. Require provenance, comparison with the incumbent, policy decision, authoritative promotion read-back, and automatic rollback.
5. Keep current serving and candidate generations distinct throughout the cycle.

Exit evidence:

- a fully digest-bound candidate lineage;
- a rejected-candidate path;
- a successful promotion and rollback path; and
- continued repository, governance, and artifact authority separation.

### Gate 5: reactivate system guarantees

1. Pin one post-standards composition generation.
2. Run baseline, clean repeat, and interruption/resume for each of the fifteen canonical agent guarantees.
3. Activate a guarantee only when its real semantic outcome, review, integration, read-back, settlement, and cleanup pass.
4. Run the Guide golden campaign only after its dependency guarantees are active.

Exit evidence:

- 15 independently active guarantees on one immutable generation; and
- the exact reviewed Guide repository outcome with zero residue.

### Gate 6: expand placement to two and three machines

1. Move combined accelerator capacity to a separate node while retaining the same logical service names and contracts.
2. Re-run contract, failure, lease, security, and composition guarantees in the two-machine profile.
3. Add a dedicated learning accelerator, leaving the accepted inference generation continuously serving.
4. Prove candidate transfer, evaluation, promotion, adapter reload, rollback, node loss, and degraded-capacity behavior by digest.
5. Build and verify architecture-specific images for every supported platform rather than assuming `linux/amd64` artifacts run on `linux/arm64` nodes.

Exit evidence:

- the same application and agent artifacts operate without topology-specific code changes;
- placement changes only node/profile data;
- inference remains available during learning where policy requires it; and
- loss of one node fails closed or degrades exactly as declared.

### Gate 7: portfolio and production cutover

1. Migrate remaining dependency edges one at a time from exact Git refs to semantic ranges and immutable artifacts.
2. Compile and verify the full 31-project compatibility registry and staging composition.
3. Update the architecture migration and production-readiness ledgers with exact evidence.
4. Restore hosted deployment only through the separately reviewed OpenTofu topology.
5. Promote production from an accepted immutable staging composition and verify authoritative read-back.
6. Retire the Market-root compatibility workspace and exact-commit propagation only after all standards acceptance criteria pass.

Exit evidence:

- every project independently installs, builds, tests, verifies contracts, releases, and rolls back;
- production consumes exact accepted versions and digests;
- no unpublished sibling checkout or global commit fan-out is required; and
- hosted deployment is no longer fail-closed only because its reviewed infrastructure and release guarantees actually pass.

## Cutover and rollback rules

- Mixed-version operation is expected during migration. Producers and consumers support declared ranges; they do not assume synchronized rollout.
- A profile is selected in composition and desired state, never by changing application behavior.
- A failed gate leaves the previous accepted composition and serving agent release authoritative.
- Rollback selects retained immutable artifacts and manifests. It never reconstructs a former state from mutable tags.
- Durable database, content, and event changes require verified forward/backward compatibility or an explicit migration and rollback contract.
- Evidence from another artifact, generation, topology, or mock cannot authorize promotion.
- Production authority cannot be inferred from successful local or staging operation.

## Completion criteria

The cluster architecture cutover is complete only when:

- the standards migration acceptance criteria in `standards-dev.md` pass for all 31 projects;
- the collapsed, two-machine, and three-machine profiles consume the same published contracts and differ only in capacity placement;
- the QEMU/KVM guest performs normal work without host filesystem, Docker socket, device, root, or deployment authority;
- node registration and scheduling use observed capabilities and governed leases rather than hostnames embedded in application code;
- application, inference, learning, artifact, and release reconcilers recover tested failure modes or surface durable policy exceptions;
- an entire learning generation can be frozen, curated, trained, evaluated, promoted, read back, and rolled back by immutable identity;
- all canonical agent guarantees and the Guide golden campaign pass on one pinned composition;
- the reviewed OpenTofu topology and production release path pass before hosted deployment is enabled; and
- the transitional Market-root and exact-commit propagation workflows are retired without adding Market or Market API to Platform custody.

Until then, this architecture is the target cutover contract. The current Platform clone remains the migration workbench, not evidence that the cluster, agent system, learning loop, or production path is ready.
