# M007 — Evidence-aware Compare

**Target:** `v0.7.0`

## Goal

Let users compare configured choices without turning openPrompting into an unsupported leaderboard.

## Deliverables

- `openprompting compare <a> <b>`
- support for profiles first
- structured comparable fields
- evidence/source display
- clear handling of unavailable/incomparable data
- user-role metadata separated from factual knowledge

## Comparison rules

Allowed:

```text
instruction file conventions
tool/harness behavior
documented context practices
user-assigned role
task default routing
last verified
```

Avoid unsupported output like:

```text
Model A is 37% better at debugging.
```

unless openPrompting later has a specifically scoped benchmark system.

## Tests

- profile vs profile
- harness vs harness
- model vs model
- incompatible entity types
- missing comparable field
- evidence rendering

## Acceptance criteria

The command is useful for decision support while making uncertainty and provenance obvious.
