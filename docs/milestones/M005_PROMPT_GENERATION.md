# M005 — Task Prompt Generation

**Target:** `v0.5.0`

## Goal

Generate practical task prompt skeletons using task + profile + model/harness guidance.

## Deliverables

- task template loader
- prompt resolver
- `openprompting new <task>`
- V1 templates:
  - feature
  - bug
  - review
  - refactor
  - ui
- placeholder rendering
- optional concise setup-specific notes
- task-specific profile routing

## Important behavior

V1 is deterministic.

The command should generate a structured prompt such as:

```text
Goal
Context
Requirements
Constraints
Acceptance Criteria
Validation
```

It must not invent project-specific details.

## Example

```text
openprompting new review --profile reviewer
```

resolves:

```text
review task
+ reviewer profile
+ profile setup
+ model guidance
+ harness guidance
+ review template
```

## Tests

- each V1 task renders
- profile override works
- task default routing works
- unresolved placeholders remain obvious or are handled consistently
- output is deterministic
- no hidden network access

## Acceptance criteria

A user can run `openprompting new feature` immediately after setup and receive a useful copyable template.
