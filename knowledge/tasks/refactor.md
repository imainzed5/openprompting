---
id: refactor
type: task
status: active
last_verified: 2026-09-07
evidence:
  - class: community
    claim: Refactoring changes internal structure while preserving externally observable behavior and is safer in small, validated steps.
    source: refactoring-catalog
sources:
  - id: refactoring-catalog
    title: Refactoring
    url: https://refactoring.com/
    last_checked: 2026-09-07
---

# Refactor

## Summary

Improve internal structure while preserving observable behavior.

## Recommended

- State the structural goal and behavior that must remain unchanged.
- Work in small transformations and validate after meaningful steps.
- Keep behavior changes in separately reviewed work.

## Avoid

- Combining an unbounded redesign with feature work.
- Claiming behavior preservation without relevant tests.

## Sources

See the source records in frontmatter.
