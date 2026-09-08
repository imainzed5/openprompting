# M009 — Contributor and Source Quality

**Target:** `v0.9.0`

## Goal

Make the repository trustworthy and easy to contribute to before public V1.

## Deliverables

- complete CONTRIBUTING.md
- knowledge contribution template
- pull request template
- issue templates
- source verification checklist
- knowledge lint/validation in CI
- stale guidance reporting
- CHANGELOG.md
- all intended V1 model/harness entries
- docs for:
  - models
  - harnesses
  - profiles
  - evidence levels
  - commands

## Knowledge quality gate

Every shipped model/harness entry must have:

- valid ID/type/provider
- verification date
- at least one source where applicable
- scoped recommendations
- no unsupported universal ranking claim

## Contributor UX gate

A contributor should be able to add a new harness by:

1. copying a documented example
2. writing one knowledge file
3. running validation/tests
4. opening a PR

without changing core resolver code.

## Acceptance criteria

No undocumented knowledge format exists only in maintainer memory.
