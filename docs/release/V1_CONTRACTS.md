# Frozen V1 compatibility contracts

These contracts were established at `v1.0.0` and remain stable in the additive `v1.1.0` release. Changing one incompatibly requires a new major release.

- Executable: `openprompting`
- Commands: `help`, `setup`, `guide`, `new`, `doctor`, `compare`
- Config location: `.openprompting/config.yml`
- Config schema major: `version: 1`
- Config entities: `setups`, `profiles`, `defaults.profile`, `defaults.tasks`
- Evidence values: `official`, `tested`, `community`, `legacy`
- Knowledge directories: `knowledge/models`, `knowledge/harnesses`, `knowledge/tasks`
- Task-template directory: `templates`
- Schema directory: `schemas`
- V1 tasks: `feature`, `bug`, `review`, `refactor`, `ui`

V1.1 adds knowledge entries for two models, four harnesses, and four tasks without renaming or removing the V1 seed entries. An optional `display_name` improves presentation only; IDs remain the values used by configuration and resolution.

Knowledge entries may be added compatibly without changing resolver code or migrating config. Unsupported future config versions are rejected explicitly.
