# TreeSeed seed bundle

`treeseed.yaml` is the only canonical Platform seed. It is a portable,
digest-bound `treeseed.seed-bundle/v2` document; the CLI reads it and sends the
bundle to the control-plane API. The API never reads this repository path.

Use the human command surface:

```text
trsd seeds validate seeds/treeseed.yaml
trsd seeds plan seeds/treeseed.yaml
trsd seeds apply seeds/treeseed.yaml
trsd seeds verify treeseed
```

The seed declares one local `treeseed.capacity-provider/v3` battery with
communication, platform, and workday lanes. Enrollment and owner approval are
runtime operations; no token, key, membership credential, or interactive
service-principal credential belongs in either YAML file.
