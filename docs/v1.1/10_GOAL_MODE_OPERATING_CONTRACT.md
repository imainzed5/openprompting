# Goal Mode Operating Contract

This document is written for an autonomous coding agent working through V1.1.

## First action

Before changing code:

1. inspect the current working tree,
2. read all files in `docs/v1.1/`,
3. inspect the actual current implementation referenced by the plan,
4. compare the plan against the repository,
5. identify any drift since the plan was authored.

If the repository has changed, preserve the plan's intent rather than blindly forcing outdated file-level instructions.

## Source verification

For model/harness knowledge work:

- use current first-party sources,
- verify exact model/harness names,
- verify support/status,
- record current verification dates,
- do not invent missing documentation,
- do not infer broad claims from marketing copy,
- keep model and harness ownership separate.

If a planned candidate is no longer supportable, report it and skip it instead of lowering the evidence bar.

## Scope control

V1.1 is not a feature-platform release.

Do not add:

- new top-level commands,
- LLM runtime integrations,
- network fetches during normal operation,
- remote knowledge services,
- workflow execution,
- handoff execution,
- website,
- telemetry,
- benchmark leaderboard.

## Implementation style

- make the smallest sound architectural changes,
- preserve existing public contracts,
- keep additions data-driven,
- prefer invariants over hard-coded catalog lists,
- avoid unrelated refactors,
- keep commits/reports phase-scoped.

## Testing

Run focused tests during implementation.

At phase boundaries, run the gates defined in `08_TESTING_AND_RELEASE_GATES.md`.

## Stop behavior

If blocked by unavailable documentation, authentication, publishing credentials, or CI infrastructure:

- complete safe independent work first,
- report the exact blocker,
- do not repeatedly retry the same external failure.

## Reporting

At the end of each phase report:

```text
Scope completed
Files changed
Catalog entries added/updated
Sources verified
Tests run
Validation results
Known limitations
Deferred work
Readiness for next phase
```

## Final goal

Ship a V1.1 release that feels like a **larger and more trustworthy knowledge product**, not a larger application.
