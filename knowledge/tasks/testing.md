---
id: testing
display_name: Testing
type: task
status: active
last_verified: 2026-09-17
evidence:
  - class: community
    claim: A maintainable test portfolio emphasizes observable behavior, uses appropriate test granularity, and avoids coupling tests unnecessarily to implementation details or excessive mocking.
    source: practical-test-pyramid
sources:
  - id: practical-test-pyramid
    title: The Practical Test Pyramid
    url: https://martinfowler.com/articles/practical-test-pyramid.html
    last_checked: 2026-09-17
---

# Testing

## Summary

Design or implement tests for observable behavior, including boundary and failure cases.

## Recommended

- Start from the behavior or contract a user, caller, or dependent system can observe.
- Preserve the repository's existing test structure, naming, fixtures, runners, and command conventions.
- Choose the narrowest test level that gives meaningful confidence, then add broader coverage only for behavior that lower-level tests cannot establish.
- Cover normal, boundary, invalid, failure, and regression cases appropriate to the target behavior.
- Use deterministic fixtures and test doubles where they isolate a real boundary; keep important integration behavior exercised with realistic collaborators.
- Separate a failing test's observed evidence from assumptions about the implementation or root cause.
- Record the exact commands and expected results needed to reproduce and validate the test.

## Avoid

- Testing private implementation details when the public behavior is the contract.
- Over-mocking dependencies so the test passes while the real integration is broken.
- Treating a green happy-path test as coverage of boundaries, failures, or concurrency.
- Changing production behavior merely to satisfy a brittle test without checking the intended contract.

## Sources

See the source records in frontmatter.
