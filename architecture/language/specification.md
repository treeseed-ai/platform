# Architectural language 0.1

Status: first draft. The maintainer approved the delivery scope, not every inferred observation
or proposed decomposition. The language preserves intent, implementation and evidence independently.

## Serialization and workspace

Author YAML 1.2 using only JSON-compatible values and string keys. Reject duplicate keys,
anchors, aliases, tags, merge keys, multiple documents, non-finite numbers and non-string keys.
No interpolation, executable expressions, implicit includes or network-loaded schema references.
The JSON Schema 2020-12 in `architecture.schema.json` checks shape, not these lexical restrictions
or graph semantics. JSON is an accepted interchange serialization, not a second model.

A workspace declares `schemaVersion`, document membership, baseline and profiles. Paths are
relative to the architecture directory. A blueprint has `schemaVersion: architecture/0.1`,
`view` (implementation, intent or example), `project`, `objects` and `metadata`. Object IDs are
stable namespaced strings. Duplicate IDs across a view are errors. The same ID in implementation
and intent intentionally denotes the same architectural object. Example workspaces are isolated.

Unknown core fields are errors. `extensions` permits only namespaced keys and JSON values.
All references resolve within the same view, except explicit evidence/source references; an
implementation object cannot silently satisfy a missing intent object. Referenced external
systems must have explicit external project/component records. Schema versions are exact;
unsupported versions fail, never silently upgrade.

Canonical comparison recursively sorts mapping keys, preserves scalar types and array order,
and excludes comments. Objects are matched by ID rather than array position. Authors sort
object lists by ID; named set-like arrays are sorted for readable diffs. Flow order is semantic.
Canonical bytes use UTF-8 compact JSON without a trailing newline. Do not use YAML spelling,
source paths, display names or line numbers as architectural identity.

## Objects and glossary

Every object has `id`, `kind`, `name` and `purpose`. Optional fields are unspecified unless a
kind's required fields say otherwise. The schema defines each kind's allowed fields.

| Kind | Meaning and principal fields |
| --- | --- |
| project | Ownership boundary: repository, revision, language, external flag. |
| component | Cohesive architectural unit: project, componentKind (object/plugin), capabilities, contracts, dependencies, sourceBindings. |
| capability | Named service: contract, cardinality (singleton/collection), owner component. |
| contract | Versioned public boundary: operations, input/output/error/event schema references. |
| provider | Implementation supplied by a plugin component: capabilities, contractVersion, nativeId, configurationSchema, artifact, replacement. |
| composition | Process/runtime target: scopes, registrations, selections and readiness evidence. |
| flow | Participants, entry node, named predicates, nodes, outcomes and required cleanup. |
| resource | State/infrastructure: owner, lifecycle, identity and cleanup obligations. |
| placement | Source role: project, subject, explicit path or convention plus template inputs. |
| rule | Applicable obligation: subjects, ruleType, parameters, verification method, severity. |
| decision | Rationale: subjects, proposed/accepted/rejected/superseded status and provenance. |

Components do not correspond one-to-one to files/classes. Contracts, data records and private
helpers need not become plugins. A provider may implement multiple capabilities. Its architectural
ID is separate from a native provider ID, which may be reused across distinct targets or scopes.
The domain term Capacity Provider describes an installed service system, not a single language Provider.

Relationships are explicit records with `kind`, `from`, `to`:
- provides: component/provider → capability; requires: component → capability.
- implements: provider/component → contract; owns: project/component → component/resource.
- calls: component → contract; emits: component → contract describing an event.
- depends-on: component → component, or project → project.
References use IDs, not filesystem paths. Unresolved references and invalid endpoint kinds fail
semantic validation. Cycles are rejected only where an explicit rule or flow dependency requires
acyclicity; not every architectural relationship graph is a DAG.

## Source bindings, inventory and evidence

A source binding records project ID, full revision, exact repository-relative path, optional
symbol, one-based start/end lines and optional SHA-256 source fingerprint. A binding may locate
a class, method, module, trait, function or declaration. Multiple bindings per object are allowed.
A path exists at a revision, not merely in the current working directory. Missing targets fail;
renames do not silently retarget. Generated output paths and public export paths are distinct.

Inventory records all tracked files and available declaration locations. Each source is assigned
to a component, a supporting role, or an explicitly unresolved classification. Inventory is
observed data, not an endorsement of boundaries. Public exports and scripts retain their original
manifest values; static registration observations retain source evidence and extraction limitations.

Evidence records carry ID, subject, method (source/schema/runtime/review), status
(satisfied/violated/unknown), project/revision, source bindings and a statement of scope.
Runtime evidence additionally needs an exact assertion/result and artifact identity; a test
filename alone proves nothing ran. Staleness is independent of status. An exception records the
rule, subject, fingerprint, reason, owning issue and review condition. A historical baseline is debt,
not evidence that a rule is satisfied. Changed symbols lose their historical exemption.

## Intent and implementation comparison

Implementation and intent stay in separate corresponding files even after reconciliation.
`objects` carries architecture; `metadata` carries view-specific provenance, evidence and acceptance.
An absent intent property means unspecified. An empty required-provider list explicitly requires
none only when the relevant rule closes that set. Use explicit forbidden-dependency or
closed-boundary rules to prohibit undeclared edges. Never infer a prohibition from omission.

Findings carry subject, category, expected, observed, evidence and disposition. Categories:
missing-implementation, unclassified, contract-mismatch, dependency-mismatch,
provider-mismatch, scope-mismatch, lifecycle-mismatch, placement-mismatch,
insufficient-evidence, stale-evidence, accepted-exception. Dispositions: open,
proposed-change, accepted-intent, accepted-exception, reconciled. A disposition is not evidence.

Reconciliation: compare IDs/properties → inspect source/evidence → propose a decision → obtain
architectural acceptance → implement separately in the owner → update observations at new pins
→ mark only proven findings reconciled. Preserve both files and history. Never copy observations
over intent to remove a failure. Approved architectural documents and observed source can disagree;
record both instead of deciding that either automatically overrides the other.

## Composition and providers

A composition owns a target and process identity. Scopes have IDs, optional parent, and lifetime.
Parent scopes must belong to the same process. Registrations reference providers; selections bind
a capability and scope to a provider. Registration is not selection; selection is not readiness.
Exactly one selected compatible provider is required per required singleton capability/scope.
Collections require an explicit collection contract. Missing, duplicate or incompatible selection
is an error. Contract versions are exact in v0.1; no implicit semver compatibility inference.

TreeSeed roots use native Cordis injection/effects/disposal. The locator is a typed facade, not
another cache/container/scheduler. Contexts never cross process boundaries or imply sandboxing.
Replacement declares live, restart or migration and optional qualification evidence. A live label
without scoped evidence remains unknown. Accepted artifacts, generations, grants, resource custody,
admission/drain/fencing, native cleanup and read-back must be preserved by qualified replacement.
No language declaration activates a plugin or authorizes a deployment.

## Flows

Nodes have stable local IDs and kinds: entry, call, message, branch, parallel, join, repeat,
cancel, failure, cleanup, complete. Edges name next nodes or branch outcomes. Calls reference
components and contracts. Predicates are named prose with optional source bindings, never code.
Parallel nodes name branches and a join; joins name all required branches. Repeat nodes require
a positive bound and exhaustion outcome. Explicit repeat nodes are the only allowed flow cycles.
Every reachable path must reach a declared outcome or a bounded repeat. Required cleanup must
be represented on success, failure and cancellation paths. Cross-process edges are messages or
contract calls, not shared contexts. Every referenced participant/contract must resolve.

Observed control flow is a source claim. Runtime ordering, all-path invariants, retries and
cleanup require scoped execution/model evidence; static call order cannot establish them.
Partial observed flows declare unresolved branches in metadata and cannot receive satisfied status.

## Placement

Observed bindings and desired placement are independent. Placement has a subject, project and
role, and either `path` or `convention` plus `inputs`. Both may be present: explicit path wins
naming, but never bypasses ownership/allowed-root rules. Missing template inputs, ambiguous
conventions, conflicting requirements, case-folding collisions and escaping paths are errors.

Use POSIX repository-relative paths. Reject absolute paths, drive prefixes, backslashes,
empty/dot/parent segments and resolved symlinks escaping the owner. A future reader checks
real paths; schema can only reject lexical violations. New paths are checked through their
nearest existing ancestor. Never derive slugs from names. Renames preserve IDs. Multiple units
may share a source file; collision means competing incompatible claims, not every repeated path.

See profiles for defaults. Placement mismatch is a finding, not a file move. Source, generated
artifact, public export, test and configuration roles remain distinct. Elixir modules/functions
and Rust modules/traits/impl methods use native bindings, not forced TypeScript classes.

## Validation boundary and evolution

Layer 1 lexical/shape; layer 2 references and semantic rules; layer 3 source conformance;
layer 4 behavioral evidence and architectural review. This delivery validates shape examples
with an existing validator; other layers are specified, not shipped as an executable engine.
Do not call the draft a proof that TreeSeed conforms. No adapters for Python yet. Namespace
extensions are opaque to v0.1 and cannot silently satisfy a core obligation. Schema evolution
requires an explicit version and migration decision; preserve original baselines.

Standards: [YAML 1.2](https://yaml.org/spec/1.2/),
[JSON Schema 2020-12](https://json-schema.org/draft/2020-12/json-schema-core).
