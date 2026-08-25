# Project and repository work

Resolve team and project context from visible resources rather than guessing identifiers. When names are ambiguous, fetch the candidates and ask the user to choose.

- Read project access, current revision, repository topology, and provider status before mutation.
- Use catalogued provider and repository operations. Never construct GitHub API calls, raw control-plane URLs, commit-authority fields, or integration receipts on TreeSeed's behalf.
- Git commits remain native Git objects. Issues and pull requests are provider projections bound to governed work; they do not independently grant TreeSeed authority.
- Archive, withdraw, or supersede when the server offers those lifecycle operations. Treat deletion, credential changes, authority expansion, and production changes as confirmation-bearing work.
- Market and Market API are external projects and never Platform-custodied repositories or deployment resources.
