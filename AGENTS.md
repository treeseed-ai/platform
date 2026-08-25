# Platform workspace guidance

This is the public TreeSeed installer and integration workspace. Preserve independent package builds and route infrastructure changes through SDK reconciliation and `trsd`. Market and Market API are first-party portfolio projects governed through the same seed, reconciliation, and exact-ref custody model as the other TreeSeed repositories. Their hosted deployment remains fail-closed until the reviewed OpenTofu topology restores it.

## Project library

The Platform library is `treeseed-ai/platform-library`; its TreeDX binding is authoritative. Start with `trsd library show platform` and `trsd library status platform`. Discover with `paths`, `search`, `query`, or `context`, and read a known file with `trsd library read platform <path> --ref <exact-commit>`. Use exact commits for reproducible work and protected `main` or `staging` only for deliberate moving-head inspection.

Collections live at library repository root, never under `src/content`. Save knowledge through `trsd library workspace create platform`, then `workspace read`, `write --input <yaml-or-json>`, `diff`, and `submit`; complete governance through `trsd library reviews`. Never edit `.treeseed/data` directly, expose provider credentials, bypass review by pushing TreeDX refs, or interpret an empty response from an unhealthy binding as authoritative.
