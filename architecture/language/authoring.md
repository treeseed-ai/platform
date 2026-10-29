# Authoring and review

1. Select an existing project and stable component ID; use a new ID only for a new identity.
2. State responsibility, contracts and architectural dependencies. Keep private methods in inventory
   unless a method is essential to a flow or invariant.
3. Add exact source bindings to implementation. Add obligations to intent separately.
4. Select the TreeSeed profile; specify placement inputs or an explicit desired path.
5. Record evidence and unknowns. Review the corresponding files with an ordinary diff.
6. Propose a decision for changes to accepted intent. Update observed source only at an explicit new pin.

Use capability names already present in typed tokens, not new aliases for the same service.
Keep names, IDs, package/plugin IDs, domain Capacity Provider IDs and implementation symbol names distinct.
A suggested decomposition is proposed, never automatically approved by extraction.

Example shape (illustrative; see examples for complete documents):

```yaml
schemaVersion: architecture/0.1
view: intent
project: project.agent
objects:
  - id: agent.execution
    kind: component
    name: Execution
    purpose: Coordinate execution through typed capabilities
    project: project.agent
    componentKind: plugin
metadata:
  baseline: cordis-2026-10-29
  status: proposed
  notes: []
```

A future agent context query should return selected objects, inherited profile rules, connected
contracts/flows, source bindings and unresolved findings. It must not return implementation as
architectural approval. This is an interface requirement for the later reader, not an implemented API.
