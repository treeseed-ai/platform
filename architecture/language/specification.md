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
`view` (implementation, intent, example or profile), `project`, `objects` and `metadata`. Object IDs are
stable namespaced strings. Duplicate IDs across a view are errors. The same ID in implementation
and intent intentionally denotes the same architectural object. Example workspaces are isolated.

Unknown core fields are errors. `extensions` permits only namespaced keys and JSON values.
All references resolve within the same view, except explicit evidence/source references; an
implementation object cannot silently satisfy a missing intent object. Referenced external
systems must have explicit external project/component records. Schema versions are exact;
unsupported versions fail, never silently upgrade.

Canonical comparison recursively sorts mapping keys, preserves scalar types and array order,
and excludes comments. Objects are matched by ID rather than array position. Authors sort
object lists by ID; named set-like arrays are sorted for readable diffs. Flow edge order is semantic; node-list layout is not execution order.
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
Exactly one compatible binding is required per required singleton capability/scope: a provider
selection for selectable capabilities, or a fixed binding for fixed capabilities.
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

## Resolver and comparison decisions

`view: profile` is a reusable requirement overlay. Evaluate it separately against the selected
implementation or intent workspace. Its project/subject references resolve in that target view.
Missing subjects are unresolved-reference errors; an accepted profile does not approve observations.
The workspace's document list contains both views, but resolution indexes them independently.

Composition `components` identifies active consumer component IDs. Each scope may state
`requiredCapabilities`; these and active consumers' `requires` relationships determine obligations.
If membership or requirements are omitted in an observed partial composition, report unknown
coverage rather than claiming all required selections exist. Registration/selection omission is
unknown; explicit empty arrays mean no recorded registrations/selections, not a complete-coverage claim.
Selections must reference a registration in the same composition. In v0.1 selections never inherit
implicitly: a child lists its effective selection, including intentional reuse of a parent's provider.
Child overrides are explicit child selections; duplicate singleton capability/scope selections fail.
Collections reject duplicate capability/scope/provider tuples, while permitting distinct providers. A scope
ID is local to its composition. A process ID is a symbolic identity owned by that composition,
not an architectural object reference; sharing processes between composition records is not inferred.

A provider's contractVersion applies to every supplied capability contract. Mixed versions require
separate provider records (which may bind the same implementation class). An optional provider
`contract` must equal the contract of every supplied capability; otherwise omit it. `unresolved`
versions/native IDs in the source survey are extraction markers and never evidence of compatibility.

Component capabilities imply provides edges; component contracts imply implements edges;
component dependencies imply component-to-component depends-on edges; capability owner implies
component-to-capability provides. Provider capabilities imply provides. Explicit relationships are
unioned with these implied edges, deduplicated by kind/from/to; they do not replace fields. A closed
boundary rule constrains the union. IDs must have the permitted endpoint kinds. No ordering priority
allows contradictory records or ownership claims to overwrite one another.

Reference fields: project/component/capability/contract/subject/participants/relationship endpoints
refer to object IDs. Evidence qualification/readiness references refer to evidence IDs in the selected
view's metadata. Flow entry/next/outcomes/branches/join/body/exhausted/requiredCleanup refer to local
node IDs; predicates refer to local predicate IDs. Flow outcomes is a set of terminal node IDs,
not labels. Scope selection scope/parent refer to local scope IDs. Baseline is a baseline document ID.
Operation input/output/errors/events are descriptive type strings in v0.1, not resolvable object IDs;
use explicit contract references on calls/messages for typed architectural edges. Schema references
are owner-relative file plus optional JSON Pointer, resolved using the object's source binding
project/revision; absent/ambiguous owner provenance is unknown. Artifact strings are immutable
identifiers/claims, not fetch instructions or qualification. General references and provenance lists
are informational document links. Extensions never supply implicit core reference targets.

Flows: a nonterminal node uses either next or a nonempty outcomes map, never both. Branch maps
name predicate results; call maps name success/error/cancellation outcomes. Complete and terminal
failure/cancel nodes have no outgoing edges and must be declared in the flow's outcomes. Failure
or cancellation nodes may instead route to cleanup. Parallel uses branches plus join; join lists
its required branch endpoints and has a next edge. Repeat has body, bound, exhausted; body paths
return to that repeat or exit, and exhaustion must reach a terminal node. All reachable executions
must terminate within declared repetition bounds. requiredCleanup lists cleanup node IDs which
must occur on every relevant terminal path; partial observations remain unknown. No implicit
exception edge is assumed. Missing modeled exceptions are a coverage gap, not proof of safety.

Acceptance is per decision subject. A document marked accepted covers all its objects only when
provenance explicitly authorizes that scope. Mixed documents require `metadata.acceptedSubjects`
listing accepted IDs and decisions explaining that acceptance; unlisted objects remain proposed.
Imported candidate identity maps are always proposed, even when their source names are retained.

Canonical data serialization preserves arrays as stated above. Architectural comparison applies
an additional field-aware projection: objects by ID; operations by name; scopes and flow nodes by
local ID; selections by scope/capability/provider tuple; relationships by kind/from/to; predicates
by ID. capabilities/contracts/dependencies/participants/registrations/requiredCapabilities/
requiredCleanup/flow outcomes and branches are sets of IDs (duplicates fail). Other arrays remain
ordered, including descriptive errors/events. Node edges, not YAML list position, establish flow
execution order. A future ordered-step syntax must lower to these explicit edges.

Architectural diff excludes metadata, sourceBindings, extensions, project revision, and observed
component ownedFiles; source/path drift is reported separately by binding/placement comparisons.
It includes names, purposes and all normative properties. Extensions are compared separately as
opaque data, never interpreted as requirements. Canonical serialization and architectural projection
are different operations and must not share an unexplained digest.

## Fixed versus selectable capabilities

A plugin need not offer provider choice. Capability `implementationMode` distinguishes fixed from
selectable. Omission in a partial source model means unknown selection semantics. Fixed capabilities
require a coherentInvariant describing why independent replacement is inappropriate; their scope
`fixedBindings` maps capability to the supplying component. Selectable capabilities use registered
Providers and selections. A capability cannot be both fixed-bound and provider-selected in a scope.
A fixed binding must reference a component that provides that capability. These bindings are explicit
per scope, with no implicit inheritance. A required capability must resolve through exactly one of
these mechanisms; its cardinality controls provider count. This makes Cordis's intrinsic composition handle explicit without inventing a
swappable provider for its resolver. Neither fixedBinding nor provider selection proves readiness.

The ruleType vocabulary is closed in v0.1 and listed in the schema. Profile rules supply their
parameters. A forbidden-dependency parameter `target` is an architectural object ID; a closed-boundary
parameter `allowed` is a set of allowed target IDs. Unsupported parameter semantics are errors, not
ignored rules. Review rules demand recorded human/agent review evidence rather than numeric proxies.

## Scope membership and role precision

Component `componentRole` is a core field: runtime (default when omitted), logical-area, contract,
data, internal-helper or development-policy. The TreeSeed plugin requirement applies to runtime
components; its exemptions use this field, never opaque extensions. Consumer plugins which only
inject capabilities are Components even though they supply no Provider. Inventory separately keeps
implementation classes that do not form architectural runtime units.

Composition components is shorthand for consumer membership of its single parentless scope.
Multiple parentless scopes require per-scope components and prohibit this shorthand. Scope components
is explicit local membership; it never inherits. Agent's child execution consumer has its own
membership and explicit effective selections reusing root registrations. This describes resolution,
not mounting new copies. Missing observed membership keeps completeness unknown.

For a singleton reject duplicate capability/scope pairs. Collections permit multiple distinct
providers and reject duplicate capability/scope/provider tuples; the collection contract defines
aggregation and ordering (v0.1 does not infer it from registration order). The earlier duplicate
selection rule is restricted to singleton capabilities.

Parallel and repeat nodes are exceptions to the next/outcomes edge form: their branches/join and
body/exhausted edges define their control flow respectively. Termination requirements still apply.
