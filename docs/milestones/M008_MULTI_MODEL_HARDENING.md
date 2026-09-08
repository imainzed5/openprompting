# M008 — Multi-model Profiles and Routing Hardening

**Target:** `v0.8.0`

## Goal

Make mixed-model usage feel native rather than bolted on.

## Deliverables

- profile management polish
- task routing precedence finalized
- explicit overrides standardized across commands
- clear setup/profile terminology in all output
- ambiguity handling
- migration path for early config drafts
- richer examples:
  - single setup
  - builder/reviewer
  - builder/reviewer/designer

## Required precedence

For task commands:

```text
explicit CLI profile
    >
task-specific profile mapping
    >
default profile
    >
single configured setup fallback
```

If none resolves unambiguously, fail with actionable choices.

## Cross-command consistency

The same selector semantics should apply to:

```text
guide
new
doctor
compare
```

where relevant.

## Tests

Add a matrix covering:

- one setup/no profile
- multiple setups/default profile
- multiple profiles/task routing
- explicit override
- broken routing
- renamed profile migration behavior if supported

## Acceptance criteria

A mixed-model user should rarely need to type raw model/harness IDs after setup.
