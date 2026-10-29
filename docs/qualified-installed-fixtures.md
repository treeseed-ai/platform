# Qualified installed fixture dependencies

The installed-composition acceptance fixture and the format-2 migration journey use
Platform's committed `bun.lock` as their registry qualification boundary. Owner
archives and composition revisions remain immutable. A fresh registry patch must
not silently change this historical assembly.

Before creating the fixture lock, derive exact root `overrides` for registry
packages from the qualified lock. Local owner archives remain `file:` dependencies;
registry overrides do not promote development packages into runtime dependencies.
Reject nested or ambiguous registry resolutions instead of flattening them. Keep
the existing post-resolution identity and SRI comparisons and archive-byte checks.
The historical Deployment release reader rejects manifest overrides. They are
preparation-only constraints: after resolution remove the override metadata from
both temporary package manifest and lock, retain all resolved package records,
and verify the resulting pair with a frozen lockfile operation before publication.
Hash only the final manifest and lock. Scripts remain disabled during preparation,
and the script canary remains checked.

Both journeys must copy and invoke the same fixture preparation helper. The
migration sandbox must include its support files explicitly. Refactor only the
changed preparation boundary into named class methods under the existing
readability limit; do not expand the historical readability baseline.

## Verification

A focused regression uses the real Bun resolver against an isolated registry
fixture advertising both the qualified version and a newer patch. Unconstrained
resolution must select the newer patch; qualified preparation must retain the old
identity and integrity. Also reject nested resolutions and malformed identities.
The existing installed scene verifies archive bytes, script suppression, real
installation, browser authentication and cleanup. The migration scene repeats
that installation before checking explicit format-2 migration custody.

Run the regression in the normal root regression command and CI before expensive
assembled checks. Run both assembled journeys on their pinned Ubuntu/Bun/Node
configuration. Record unavailable prerequisites as gaps, never as passing evidence.

Bun's [root overrides](https://bun.sh/docs/pm/overrides) constrain transitive
resolution; [lockfile-only](https://bun.sh/docs/pm/lockfile) still resolves registry
metadata. This repair pins the inputs rather than relaxing the qualification checks.
