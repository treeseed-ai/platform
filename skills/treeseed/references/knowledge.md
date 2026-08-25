# Knowledge work

Start by discovering the connected server's current knowledge and question resources. Prefer resource reads and search over broad mutation tools, and preserve project/team scope in every request.

- Questions drive research; knowledge records and TreeDX projections hold the durable result.
- Fetch the current record and its revision before updating it. Preserve citations, provenance, project scope, and returned concurrency evidence.
- Use subscriptions for changing discussions or knowledge projections when advertised.
- TreeDX remains canonical for content. A control-plane projection or receipt is not permission to bypass TreeDX custody or write directly to its storage.
- If research should become governed work, hand it into the proposal/decision lifecycle described in [governance.md](governance.md).

## Query a project library with `trsd`

Resolve the project binding before relying on results:

```sh
trsd library show <project> --json
trsd library status <project> --json
```

`<project>` may be an unambiguous project slug or UUID. Status must report a bound repository and healthy search index. Treat missing bindings, unavailable indexes, moved refs, and empty error responses as failures.

Discover and read repository-root collections:

```sh
trsd library paths <project> --prefix agents --ref <commit-or-protected-ref> --json
trsd library search <project> "release policy" --path knowledge --ref <exact-commit> --json
trsd library read <project> agents/engineer.mdx --ref <exact-commit> --json
trsd library query <project> "active agents" --model agent --ref <exact-commit> --json
trsd library context <project> "what governs this change?" --ref <exact-commit> --max-items 20 --max-tokens 8000 --json
```

Prefer the exact `resolvedRef` returned by TreeDX for subsequent calls. Libraries use top-level paths such as `agents/`, `books/`, `knowledge/`, `notes/`, and `questions/`; never prepend `src/content`.

## Organize and save knowledge

All changes use governed TreeDX workspaces:

```sh
trsd library workspace create <project> --json
trsd library workspace read <workspace> <path> --json
trsd library workspace write <workspace> --input draft.yaml --json
trsd library workspace diff <workspace> --json
trsd library workspace submit <workspace> --version <version> --message "Describe the knowledge change" --json
trsd library reviews list --team <team> --json
trsd library reviews decide <review> --input decision.yaml --json
trsd library reviews publish <review> --input publication.yaml --json
```

Use `workspace abandon <workspace> --version <version>` only for an unsubmitted draft. Mutation input belongs in files or stdin-capable clients, never in arguments when it contains document bodies or sensitive material. Publication must verify the reviewed commit at the upstream exact ref.

## Local diagnosis

Development state is mounted beneath the Platform workspace at `.treeseed/data`. It is visible for diagnostics only. Use TreeDX, control-plane, MCP, or `trsd` APIs for every read that informs work and every mutation; never repair repositories, refs, indexes, databases, or credentials by editing mounted files.
