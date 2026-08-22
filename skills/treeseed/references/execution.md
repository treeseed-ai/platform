# Execution work

Use execution resources to understand agents, provider connections, capacity, API-derived plans, time-based workdays, assignments, and durable operation status. External assistants remain external principals.

- Inspect capacity and plan explanations; do not author derived capacity plans, reservations, leases, or settlements.
- Plan a workday from high-level intent. Start only the exact fresh preflight receipt returned by the API, and accept stale-plan rejection rather than silently recalculating.
- Follow assignment and workday resource links for progress, cancellation, interruption, return, and settlement.
- Invoke project-agent chat only through the explicit governed chat capability. The returned actor chain and invocation record determine whether delegation occurred.
- Never pass provider credentials, GitHub credentials, host authority, repository write credentials, or TreeDX secrets into an agent workspace.
- If the server does not advertise an operation, it is unavailable. Do not emulate it with raw REST, Git, database, or provider calls.
