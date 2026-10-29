# Supporting record formats

The normative blueprint, workspace, findings and exception schemas are alongside this document.
The remaining files are frozen survey/provenance records, not alternate architectural object models.
They use their own format version and do not contribute implicit object IDs to blueprint resolution.

| Record | Contents |
| --- | --- |
| architecture-baseline/0.1 | id, date, repositories and documentation provenance; each repository has project, repository URL, revision, relative checkout and verbatim manifest. |
| architecture-compositions/0.1 | Platform revision plus map from historical composition path to its verbatim JSON; qualification statement is explicit. |
| architecture-inventory/0.1 | project/revision, parser name/version, limitations, files. |
| Inventory file | exact path, Git mode/blob ID, category, assignment; parsed source adds declarations/imports/exports/compositionSites/parseDiagnostics. |
| Declaration | kind, qualified syntax symbol, start/end, fingerprint, exported flag; optional parameters/type/modifiers/heritage and declarationExpression. |
| Import/export | source module or original export statement plus one-based line. |
| Composition site | source expression, line, enclosing syntax scope and unresolved-resolution statement. |
| Public surfaces | per-project exact revision, original export/bin/script maps, Cordis metadata/provider entries, source exports and construction sites. |
| Coverage | per-project counts, unclassified paths and parse diagnostics; excludes architecture draft additions from the frozen Platform source baseline. |
| Validation | tool versions, actual shape outcomes, audit coverage, errors and explicit limitations. |

Inventory symbol names (especially anonymous location-qualified names) are not stable architectural
identities. Source fingerprints cover exact syntax-node text; file blob IDs are Git identities.
The reader must not compare them as the same hash or treat a source span as permanent identity.

`historical-exception.yaml` is illustrative and not approved. Real accepted exceptions require a
sourceBinding, matching fingerprint and reviewed issue/provenance; these are semantic obligations.
Imported readability baseline records retain their original owner format, revision and reason rather
than pretending they are newly accepted language exceptions. Extraction findings are an audit ledger
with resolution descriptions, separate from normative architectural comparison dispositions.

A future importer may add format schemas for its output after its extraction contract is implemented.
This draft freezes the survey data and documents its limits without shipping that importer.
