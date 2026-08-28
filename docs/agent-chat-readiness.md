# Authenticated agent-chat readiness

This handoff records the platform boundary proven before agent-chat UI work begins. It does not add a chat route, placeholder, or new authority.

## Browser identity and credential custody

- Admin is an OAuth browser BFF. PKCE verifier and state are short-lived sealed HttpOnly cookies; access and rotating refresh tokens remain HttpOnly and are never exposed to browser JavaScript.
- API remains the issuer and owns credentials, authorization decisions, revocation, audit, and durable identity state.
- Browser mutations require same-origin CSRF protection and safe return paths. Session responses are `no-store`; logout revokes and clears both token classes.
- The generation-85 immutable Reviewer runs proved registration, email confirmation, sign-in, consent, refresh, logout, password reset, account, and team guarantees across desktop, tablet, and mobile: 66 active guarantees with no failures or blocked cases.

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

- Reviewer remains loopback-only and consumes immutable run evidence. The generation-85 desktop run was independently discovered by Reviewer `0.1.0-rc.13`, annotated with a local note, read back, and copied into local workplan `2026-08-28T07-37-04-870Z-generation-85-authenticated-platform-baseline` with its evidence manifest.
- Device profiles have distinct run identities; desktop evidence cannot satisfy tablet or mobile requirements.
- Transport diagnostics may include method, origin, pathname, and nested TLS/network cause. Query strings, bodies, credentials, and tokens are excluded.
- Admin displays a Reviewer handoff only when an explicit local capability URL is configured; it never hosts or remotely starts Reviewer.

## First chat project gate

The first authenticated chat implementation may build on these invariants, but it must separately prove: authorized recipient resolution, one committed source message, observable assignment/provider state, one durable response, exact settlement, browser-safe rendering, audit evidence, and zero residue. Planned MFA/provider linking and advanced Agent Lab projections remain outside this claim.

## Generation 85 closeout certification

- Exact composition: Platform generation 85 / Deployment `0.1.0-rc.115`, restored receipt `receipt-1787903649377`, catalog digest `sha256:270b7cb7af0608abe24971a1ab3d88bd2525f3dc3eb971f64e310e766e1f17b0`.
- Guarantee runs: `gen85-desktop-chromium-20260828-r3`, `gen85-tablet-chromium-20260828`, and `gen85-mobile-chromium-20260828`; each passed 22 of 22 active authentication, account, and team guarantees with a distinct evidence identity.
- Reviewer copied both browser and direct API evidence into the workplan manifest. Exact copied evidence SHA-256 values are `6e3f70b3418f8958e1d6594dd4174419ad26ab462502954066ce25e758f218e0` and `94cdfa92ec4d21df7240116214149e6376cb1178b166649c782c37918020e777`.
- Real communication monitoring used SDK project `0f9d94ba-ed45-4078-baf6-c85f97e0044d`, technical-writer assignment `assignment_WXj8uUgIIazqzLcYVksuGcMoz2AB-PT7`, and workday `workday-conversation-invocation-e991785bcad120935e791f4c46034d37-sdk`. Catalog reads proved provider `codex-local` available, assignment returned, lease released, six active/elapsed seconds, and a matching `task_completed_actual_settlement` ledger entry releasing 894 reserved seconds. Native usage remained an explicit empty object; it was not presented as zero.
- The exact generation-73 baseline was restored as receipt `receipt-1787903533155`; Admin, API, Agent, TreeDX, and Mailpit readiness all returned HTTP 200. Generation 85 was then restored, and two consecutive reconciliations retained `receipt-1787903649377`, proving no-op behavior.
- Historical APT payload drift encountered during rollback is tracked in [Deployment #233](https://github.com/treeseed-ai/deployment/issues/233). Recovery used the immutable Deployment rc103 GitHub release asset, whose SHA-256 matched its release custody record.
- Final closeout state has no development session, Reviewer server, forwarding process, test account, assignment lease, or unrevoked test token. Development updates are resumed.
