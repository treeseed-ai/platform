# MCP connection behavior

The accepted server speaks stateless Streamable HTTP MCP `2026-07-28`. Begin with server discovery, then list the capabilities relevant to the task. Runtime discovery is authoritative over the pinned receipt when the server presents a newer compatible catalog.

- Use advertised input/output schemas, semantic annotations, and OAuth scope challenges.
- Follow `treeseed://` resources and templates instead of inventing REST paths. Use completion for resource or prompt arguments when available.
- Use resource subscriptions/listen for durable changes and honor cancellation and progress notifications.
- An `input_required` response contains signed, expiring, single-use state bound to the principal, OAuth client, operation, and exact arguments. Never decode it into authority, replay it, or transplant it between clients.
- Treat RFC 9457 problems and TreeSeed blockers as typed outcomes. Preserve request and trace identifiers when reporting failures.
- Do not request legacy initialization, session, roots, sampling, or MCP logging behavior. Do not expose credentials in prompts, content, resources, logs, or tool results.
