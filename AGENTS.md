# Platform workspace guidance

This is the public TreeSeed installer and integration workspace. Preserve independent package builds and route infrastructure changes through SDK reconciliation and `trsd`. Never add Market or Market API as a checkout, submodule, provisionable project, or deployment resource. Hosted deployment remains fail-closed until the reviewed OpenTofu topology restores it.
