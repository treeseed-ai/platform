# Authenticated agent-chat readiness

This handoff records the platform boundary proven before agent-chat UI work begins. It does not add a chat route, placeholder, or new authority.

## Browser identity and credential custody

- Admin is an OAuth browser BFF. PKCE verifier and state are short-lived sealed HttpOnly cookies; access and rotating refresh tokens remain HttpOnly and are never exposed to browser JavaScript.
- API remains the issuer and owns credentials, authorization decisions, revocation, audit, and durable identity state.
- Browser mutations require same-origin CSRF protection and safe return paths. Session responses are `no-store`; logout revokes and clears both token classes.
- The generation-78 immutable Reviewer run proved registration, email confirmation, sign-in, consent, refresh, logout, password reset, account, and team guarantees across desktop, tablet, and mobile: 66 active guarantees with no failures or blocked cases.

## User, team, project, and permission boundary

- The current user and active team are resolved through catalog descriptors rather than handwritten route strings.
- Project access is subordinate to API-owned team membership and permission checks. A browser session does not grant access merely because an identifier is known.
- Mutations retain ETag/concurrency checks, signed confirmation for high-risk operations, last-owner protection, audit evidence, redaction, and the standard error envelope.
- Agent chat must carry current team and project context into every catalog operation and render forbidden, missing, or unavailable state truthfully.

## Agent and communication addressing

- Agent identity is the accepted project-scoped definition, not a UI label or provider process. Recipients resolve to frozen team, project, agent, and definition-revision identifiers before a source message is committed.
- Communication status, provider availability, invocation/operation state, and durable responses are read through SDK catalog descriptors.
- API admission and the assignment-scoped TreeDX facade remain authoritative. Admin must not proxy Reviewer evidence or broaden provider authority.

## Workday, assignment, and terminal state

- Monitoring composes catalogued agent, communication, provider, workday, assignment, usage, ledger, and operation reads. Unsupported data is unavailable, never a manufactured zero.
- A terminal communication must have durable response state and exact settlement. Acceptance requires no remaining assignment, lease, reservation, child process, temporary credential custody, usage, or accounting residue attributable to the test.
- Team/project authorization and response redaction apply to monitoring reads as they do to mutations.

## Reviewer evidence boundary

- Reviewer remains loopback-only and consumes immutable run evidence. The generation-78 run was independently discovered by Reviewer, annotated with a local note, and copied into a local workplan with its evidence manifest.
- Device profiles have distinct run identities; desktop evidence cannot satisfy tablet or mobile requirements.
- Transport diagnostics may include method, origin, pathname, and nested TLS/network cause. Query strings, bodies, credentials, and tokens are excluded.
- Admin displays a Reviewer handoff only when an explicit local capability URL is configured; it never hosts or remotely starts Reviewer.

## First chat project gate

The first authenticated chat implementation may build on these invariants, but it must separately prove: authorized recipient resolution, one committed source message, observable assignment/provider state, one durable response, exact settlement, browser-safe rendering, audit evidence, and zero residue. Planned MFA/provider linking and advanced Agent Lab projections remain outside this claim.
