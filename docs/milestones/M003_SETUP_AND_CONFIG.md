# M003 — Setup and Configuration

**Target:** `v0.3.0`

## Goal

Let users configure one or more model/harness setups locally.

## Deliverables

- config schema v1
- `.openprompting/config.yml`
- config reader/writer
- interactive `openprompting setup`
- non-interactive validation path
- support for:
  - multiple setups
  - profiles
  - default profile
  - task-to-profile mappings
- safe overwrite/update behavior
- example config

## Setup wizard flow

1. detect existing config
2. select/add model
3. select harness
4. name setup
5. optionally create profile
6. choose default profile
7. optionally route tasks
8. preview config
9. write after confirmation

## Tests

- fresh setup
- existing config edit
- mixed-model config
- invalid references
- default profile validation
- task profile routing validation
- cancelled setup makes no changes

## Acceptance criteria

A user can configure:

```text
builder  -> model A + harness A
reviewer -> model B + harness B
```

and the file round-trips without losing information.

## Safety

Setup may write only under the intended `.openprompting` configuration path unless the user explicitly chooses another supported path.
