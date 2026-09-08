# Knowledge entry template

Copy this file to the matching `knowledge/<type>/` directory, remove the comments, and replace every placeholder. A harness entry may add `instruction_files`; a task entry omits `provider`.

```markdown
---
id: provider-entry-id
type: model
provider: provider
status: active
last_verified: YYYY-MM-DD
evidence:
  - class: official
    claim: A narrow claim supported by the source.
    source: provider-doc
  - class: tested
    claim: A behavior reproduced by maintainers.
    reproduction: Exact versions, fixture, command, and expected observation.
sources:
  - id: provider-doc
    title: Original documentation title
    url: https://example.com/original-documentation
    last_checked: YYYY-MM-DD
---

# Human-readable title

## Summary

What this entry covers and, where useful, what it does not cover.

## Recommended

- Scoped, actionable guidance.

## Avoid

- A documented failure mode or common category mistake.

## Context and tool-use notes

Relevant context behavior. Harness mechanics belong in harness entries.

## Known limitations

Access, version, scope, or uncertainty boundaries.

## Sources

See the source records in frontmatter.
```

Run `pnpm validate:knowledge`. A valid entry is discovered automatically; adding one must not require resolver or command-router changes.
