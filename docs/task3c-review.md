# Task 3C review entry points

Task 3C implementation and exact functional acceptance are qualified for maintainer PR review.
This is the review map, not a release or integration claim. Latest-head CI is visible on each PR. Source/archive/image identities are
in [the composition record](../composition/task3c.json); investigation and failure evidence
remain in [the execution ledger](task3c-execution-status.md).

| Owner | Final candidate | Private version | Review focus |
| --- | --- | --- | --- |
| SDK | [#477](https://github.com/treeseed-ai/sdk/pull/477) | 16 | Portable native composition, generic service/provider schemas, safe results; seven operation IDs preserved |
| UI | [#97](https://github.com/treeseed-ai/ui/pull/97) | 16 | Reusable React class components, mobile-first/browser/SSR/terminal/Astro providers and presentation boundary checks |
| Identity | [#51](https://github.com/treeseed-ai/identity/pull/51) | 7 | Instance-neutral Keycloak declarations and OIDC readiness; issuer/session authority retained |
| Admin | [#145](https://github.com/treeseed-ai/admin/pull/145) | 10 | Authorized view models/actions consuming UI; no duplicated renderer or credential authority |
| Deployment | [#1007](https://github.com/treeseed-ai/deployment/pull/1007) | 76 | Generic service graph, exact sources/builds, durable registry, safe activation and scoped asset restart |
| CLI | [#323](https://github.com/treeseed-ai/cli/pull/323) | 9 | Built install/list/inspect/select, explicit scopes, reusable human output and unchanged machine contracts |
| API | [#635](https://github.com/treeseed-ai/api/pull/635) | 6 | Exact runtime/UI image closure, independent default worker and public assembly fixture; #620 policy preserved |
| Platform | [#761](https://github.com/treeseed-ai/platform/pull/761) | integration only | Exact archive pins and genuine installed source/UI/historical migration acceptance |

These entry points include prior unmerged owner prefixes. Their descriptions and the ledger
identify bounded documentation/test/implementation increments; review an increment once.
Deployment's compiler [#1005](https://github.com/treeseed-ai/deployment/pull/1005) and historical
custody [#1006](https://github.com/treeseed-ai/deployment/pull/1006) are independently qualified
parts of #1007. No prefix branch is discarded or merged by this handoff.

## Qualified behavior and limits

Container services/probes are typed Cordis class providers in their capability owners.
The generic host accepts repeated named instances and explicit typed endpoint/secret bindings;
the four-service composition is a default profile. Native Cordis owns resolution, scopes,
effects and disposal; the typed locator is its facade. Deployment remains the single durable
installation/source/registry/application authority. Platform assembles only public artifacts.

Installation from NPM or HTTPS Git uses approved exact source/build policies and private
release-pinned helpers. Acquisition and controlled builds precede accepted planning/apply;
ambient package scripts do not run in a live installation. Safe additive services and the
qualified live readiness provider activate with actual target/resource read-back. Unsafe
state, issuer, grant, TLS or unqualified restart changes stay prepared/action-required.
An ambiguous registered provider is refused; selection never guesses an archive.

The real UI scene changes the UI archive and rebuilds its matching Admin assets, API image
and CLI executable from the same owner sources. It explicitly authorizes the affected restart,
then observes both changed human surfaces, the existing Keycloak session, unchanged private
bytes/resource/TLS identities and unchanged machine JSON/exit behavior. It does not claim a
live browser-image patch. React DOM components support narrow phones through widescreen
browsers; a future native-mobile renderer remains a separately qualified adapter.

Historical format-2 migration is explicitly authorized non-serving custody. It retains old
bytes/resources/TLS and rejects active, foreign, tampered or interrupted state. The result
truthfully reports unverified current runtime and null activeComposition; runtime upgrade
needs its own qualified action. Old plan replay and silent restart remain forbidden.

Native qualification is the existing Ubuntu26.04 Linux/amd64 local Unix-socket Docker boundary.
Broader multi-runtime replacement, remote interface parity, general recovery, removal and
additional native hosts remain Tasks4–9. Agent/Task3D is unstarted and still requires its own
same-repository initialization and explicit setup review before implementation. Preserve
Keycloak identity, every owner boundary, legacy branches/services and all issues including #678.


The final reproducibility correction preserves private fixture file modes across caller umasks
and uses an explicit SDK schema reference in API's declaration artifact. API6 supersedes the
retained API4/API5 candidates, including explicit historical metadata schema references. Two real preparation programme regressions now reject an incorrect
runtime-lock pin before builds/state and verify identical Admin/API/CLI artifacts under a
different caller umask. Hosted browser setup uses Ubuntu's official signed archive mirror
after Azure dependency transfers exhausted the existing job budget; positive gates remain
mandatory. CLI's 24 cases map exactly once across seven required isolated CI partitions.


## Acceptance evidence

All 24 hosted checks at functional Platform prefix eef084f pass, qualifying all six built CLI source/selection/live
scenes, real API6 browser/terminal UI replacement, explicit genuine historical migration,
Task1–3A matrices and the Task3B installed scene on hosted Ubuntu26.04. Owner SDK/UI/Identity/
Admin/Deployment/CLI/API candidates have complete green CI. The final record-only revision
retains the same frozen owner artifacts; its required checks remain on Platform#761.

Local final API6 verification passes five unit, four integration and eight programme smoke
cases (132.00s). Exact API6 UI replacement passes 34 wrapper assertions (208.32s), with its
actual application observations performed inside the programme. Historical migration passes
311 assertions (117.13s); polling makes the count variable. Two archive-selection/reproducibility
programmes pass eight assertions. All 24 CLI cases match exactly one of seven required CI
partitions. Eleven changed Markdown pages/70 local targets and three workflows validate.

Qualified behavior remains bounded as described above. Review proposals
[CLI#324](https://github.com/treeseed-ai/cli/issues/324) and
[API#636](https://github.com/treeseed-ai/api/issues/636) separately; they do not authorize
shared-tooling scope. All task and proposal issues, including Platform#678, remain open.
