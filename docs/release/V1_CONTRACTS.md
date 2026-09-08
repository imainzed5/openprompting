# Frozen V1 contracts

These contracts are stable at `v1.0.0`. Changing one incompatibly requires a new major release.

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

Knowledge entries may be added compatibly without changing resolver code or migrating config. Unsupported future config versions are rejected explicitly.
