# TreeSeed/Cordis profile

The profile is explicit development data. Tools must not read private target AGENTS.md files to
understand it. Provenance is recorded in the baseline; these obligations stand on their own.

Runtime architectural components are Cordis plugins. Plain contracts, schemas, records and
internal helpers are not architectural plugins. Each meaningful seam has a typed public contract
and selectable provider, or a documented coherent invariant explaining why independent swapping
would break authority, transactions or resource ownership. Use exact owner package interfaces.

Hard requirements: strict TS/TSX classes for handwritten TreeSeed behavior; no standalone exported
functions, function factories, functional components/hooks or anonymous application behavior;
framework callbacks bind class methods. Required singleton selection is unambiguous. Native Cordis
owns lifecycle and dependency resolution. Each process owns a root; contexts are not security boundaries.

Methods, constructors and accessors: at most 20 body lines after canonical formatting with
prettier@3.6.2, excluding blanks, comment-only lines and outer delimiters. Reject compressed
behavioral statements. Data/schema declarations are exempt, not behavior embedded in data.
Unchanged historical violations retain exact baseline provenance; changed symbols lose it.
Exceptions identify symbol, fingerprint, reason, owning issue and review condition. Do not widen
baselines to accept new debt. This draft imports baseline records, not fresh checker outcomes.

Review criteria: cohesion; short readable capability sequences; useful abstractions; no trivial
wrappers, needless splitting or complexity displaced to pass metrics. No class/file size threshold.

Tests belong in tests/acceptance, tests/regression, tests/integration, tests/unit by purpose;
tests/support has fixture code/data but no registrations. Provider substitutability needs shared
contract evidence, default production construction and assembled replacement/read-back/cleanup.
No permanent tests are added for this specification-only prototype, as explicitly requested.

Replacement remains restart/migration-required unless scoped live qualification proves admission,
drain, fencing, lifecycle cleanup and generation read-back. Unknown or failed cleanup is not success.
