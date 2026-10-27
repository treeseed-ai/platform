# Seed-driven Agent Capacity Provider: Task 3D amendment

Status: maintainer approved and implementation explicitly resumed. Tracking: Platform #773,
Agent #525, SDK #482 and Deployment #1011. This replaces the earlier proposal to embed the
Agent root inside Deployment's durable worker and defer all sandbox infrastructure to Task 10.

The normative architecture is now maintained in [Agent architecture](../../agent-architecture.md)
and [seed architecture](../../seed-architecture.md). The [delivery plan](../plans/2026-10-27-agent-composition.md)
records owner slices, tests, source/artifact evidence and outstanding gates.

## Approved choices

- Agent is the Capacity Provider: separate manager, worker and Kata workloads on one qualified host.
- Manager, worker and TreeSeed guest runner own process-local native Cordis roots. Deployment only installs/supervises and supplies bounded host infrastructure through an explicit private service grant.
- Agent owns kernel orchestration, extensible definition-owned activity profiles, workers/pool policy, runners, environment preparation, execution/handler/tool/context/reporting and team connection providers.
- Real virgin warm Kata infrastructure and harmless probes are Task 3D. Real Work/models/productive handlers/accounting remain Task 10.
- API owns seed coordination through a headless public module; SDK owns portable contracts; Deployment owns common artifact/custody primitives; resource owners reconcile through public interfaces. Platform contains no owner runtime.
- Seeds integrate host composition, plugins, Agent definitions/profiles/environments and capacity requirements. Missing plugins install/activate when policy/grants qualify, otherwise explicit pending/blockers. Production team/project/resource migration stays deferred.
- Existing teams connect through the existing control plane's public team/enrollment API adapter, preserving Keycloak-governed approval and signed provider credentials. No new Team authority, issuer, legacy source/service mutation or production enrollment during tests.
- Setup runs inside claimed sandboxes using exact declared entrypoints. Offline default; declared destinations require host policy and grants. No ambient host lifecycle scripts or used-sandbox recycling.
- Native provider instances are generation-pinned through verified cleanup. Affected old warm bases are discarded; worker/sandbox replacement requires restart unless an exact transition qualifies.
- Small cohesive classes and twenty-line changed methods with reviewed exact exceptions are critical across all nine Cordis owners, enforced by a shared development-only checker and contextual refactoring obligations.
- Dedicated isolated self-hosted Ubuntu 26.04 x64 KVM runner labelled cordis-kata is required. Provisioning is outstanding; no implicit workstation registration.
- Preserve owner repositories, licenses, API committer policy, original checkouts, long-lived branches and every issue including #678. Hand review candidates back; no merges, production release or cutover.

## Evidence limits

The existing SDK #483 contracts and Agent root/child draft remain useful infrastructure, not a
working Capacity Provider. Package installation, separate services, warm pooling, environment
preparation, seed reconciliation and real connection adapter all require their recorded owner
and assembled gates before completion. Historical exact archives are not rewritten.
