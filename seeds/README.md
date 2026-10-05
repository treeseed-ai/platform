# TreeSeed seed bundle

`treeseed.yaml` is the only canonical Platform seed. It is a portable,
digest-bound `treeseed.seed-bundle/v3` document; the CLI reads it and sends the
bundle to the control-plane API. The API never reads this repository path.

Use the human command surface:

```text
trsd seeds validate seeds/treeseed.yaml
trsd seeds plan seeds/treeseed.yaml
trsd seeds apply seeds/treeseed.yaml
trsd seeds verify treeseed
```

The authenticated user applying a local seed becomes an owner of every team
created by that seed. The bundle therefore contains no personal membership or
email bootstrap.

Capacity-provider identity, capacity, enrollment, environment grants, and
owner approval are runtime operations. No token, key, host capacity, provider
identity, membership credential, or interactive service-principal credential
belongs in the portable seed.
