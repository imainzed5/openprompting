---
id: review
type: task
status: active
last_verified: 2026-09-07
evidence:
  - class: official
    claim: Pull request reviews support line-specific feedback, suggested improvements, approval, and requests for changes before merge.
    source: github-pr-reviews
sources:
  - id: github-pr-reviews
    title: Pull request reviews
    url: https://docs.github.com/en/pull-requests/reference/pull-request-reviews
    last_checked: 2026-09-07
---

# Review

## Summary

Inspect a change against its intended contract and report actionable findings.

## Recommended

- Prioritize correctness, regressions, security, and missing tests.
- Tie each finding to a precise location and concrete impact.
- Separate blocking defects from optional improvements.

## Avoid

- Summarizing the patch without evaluating it.
- Reporting style preferences as correctness defects.

## Sources

See the source records in frontmatter.
