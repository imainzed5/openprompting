# M006 — Local Doctor

**Target:** `v0.6.0`

## Goal

Give users a read-only health check for their openPrompting and agent setup.

## Deliverables

- `openprompting doctor`
- PASS / INFO / WARN / FAIL result model
- config checks
- knowledge reference checks
- profile/task routing checks
- freshness checks
- optional local project inspection:
  - package.json presence
  - known validation script names
  - known harness instruction files

## V1 doctor behavior

Doctor may inspect metadata and file presence.

It should **not execute** arbitrary project scripts in V1.

Example:

```text
PASS config valid
PASS builder resolves to GPT + Codex
INFO AGENTS.md detected
WARN no typecheck script detected
WARN model guidance last verified 95 days ago
```

## Tests

- healthy fixture
- broken config
- missing knowledge
- stale knowledge
- missing profile target
- repo without package.json
- no writes occur

## Acceptance criteria

Running doctor cannot mutate project files and returns a meaningful non-zero status only for genuine failures, not ordinary warnings.
