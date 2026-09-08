# M002 — Knowledge Contract and Validation

**Target:** `v0.2.0`

## Goal

Make knowledge files machine-readable, validated, and discoverable.

## Deliverables

- JSON schemas for model, harness, and task entries
- Markdown frontmatter parser
- knowledge loader/index
- duplicate ID detection
- evidence vocabulary
- source metadata rules
- initial fixture entries
- initial real task entries
- validation command/helper used by tests/build

## Initial knowledge

At minimum:

- one model entry
- one harness entry
- five task entries:
  - feature
  - bug
  - review
  - refactor
  - ui

Broader provider coverage can arrive in later milestones as long as V1 has the intended three ecosystems.

## Tests

- valid knowledge loads
- malformed frontmatter fails
- duplicate ID fails
- unknown type fails
- invalid evidence class fails
- missing required metadata fails

## Acceptance criteria

A build can programmatically enumerate:

```text
models
harnesses
tasks
```

without hard-coded command changes.

## Design gate

Adding a new valid model/harness file must not require editing the CLI router.
