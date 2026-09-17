# Task Catalog Plan

V1 currently supports:

```text
feature
bug
review
refactor
ui
```

V1.1 should add four task types that are meaningfully distinct from the existing five.

## 1. `planning`

### Purpose

Create an implementation plan without prematurely implementing the work.

### Distinction

```text
planning = decide how
feature  = implement the approved outcome
```

### Suggested prompt skeleton

```text
Objective
Current state
Requirements
Constraints
Unknowns
Investigation needed
Proposed approach
Implementation sequence
Risks
Validation plan
Out of scope
```

### Guidance themes

- inspect the current system before prescribing changes,
- separate known requirements from assumptions,
- identify unknowns explicitly,
- choose the smallest sound implementation path,
- define validation before implementation,
- avoid turning planning into hidden implementation.

## 2. `research`

### Purpose

Investigate a question and produce an evidence-backed synthesis.

### Suggested prompt skeleton

```text
Research question
Scope
Freshness requirements
Known context
Source requirements
Evidence to collect
Competing explanations
Uncertainty
Synthesis
Deliverable
```

### Guidance themes

- prefer primary sources,
- distinguish sourced facts from inference,
- state freshness requirements,
- acknowledge conflicting evidence,
- do not silently fill evidence gaps,
- summarize conclusions with appropriate uncertainty.

## 3. `testing`

### Purpose

Design or implement tests for observable behavior.

### Suggested prompt skeleton

```text
Target behavior
Existing test conventions
Test level
Cases to cover
Boundary cases
Failure cases
Fixtures / mocks
What not to mock
Commands
Expected result
```

### Guidance themes

- test observable behavior,
- preserve existing test conventions,
- cover failure/boundary cases,
- avoid over-mocking,
- require deterministic fixtures where practical,
- separate test failures from implementation assumptions.

## 4. `migration`

### Purpose

Move a system safely from a current state to a target state.

### Suggested prompt skeleton

```text
Current state
Target state
Compatibility requirements
Data/schema impact
Dependencies
Migration sequence
Rollback
Deprecation / cleanup
Validation
Completion conditions
```

### Guidance themes

- preserve compatibility requirements explicitly,
- make destructive steps visible,
- define rollback before execution,
- separate migration from unrelated cleanup,
- validate intermediate states,
- define when old paths/data can be removed.

## Files required per task

Every new active task requires both:

```text
knowledge/tasks/<task>.md
templates/<task>.md
```

For V1.1:

```text
knowledge/tasks/planning.md
templates/planning.md

knowledge/tasks/research.md
templates/research.md

knowledge/tasks/testing.md
templates/testing.md

knowledge/tasks/migration.md
templates/migration.md
```

## Evidence

Do not force weak "official" evidence.

Use:

- official sources when they directly support the recommendation,
- reputable community engineering sources when appropriate,
- `tested` only with reproducible procedures.

The evidence class must reflect the real strength of the claim.

## Deferred task ideas

Potential later additions:

- documentation
- release
- dependency-upgrade
- performance
- security-review
- data-migration

Do not include these in V1.1.
