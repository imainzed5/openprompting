# M004 — Guide Resolution

**Target:** `v0.4.0`

## Goal

Resolve and display the correct model + harness guidance for a configured user.

## Deliverables

- profile/setup resolver
- `openprompting guide`
- selectors for profile/model/harness
- combined output renderer
- evidence labels
- last-verified metadata
- source rendering
- actionable errors for ambiguity

## Resolution examples

```text
openprompting guide
```

uses the configured default profile.

```text
openprompting guide --profile reviewer
```

uses that profile.

```text
openprompting guide --harness codex
```

shows harness guidance directly.

## Output sections

```text
Resolved setup
Summary
Recommended
Avoid
Harness notes
Sources
Freshness
```

Do not merge model and harness claims so aggressively that their ownership becomes unclear.

## Tests

- default profile
- explicit profile
- explicit model
- explicit harness
- unknown identifier
- ambiguous no-default config
- source/evidence rendering

## Acceptance criteria

The same model paired with two harnesses can produce different harness guidance while preserving the same model guidance.
