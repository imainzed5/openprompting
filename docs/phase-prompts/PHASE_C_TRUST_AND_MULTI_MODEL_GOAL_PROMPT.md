# Phase C — Trust and Multi-model UX Goal Prompt

## Covers

- `M006_DOCTOR.md`
- `M007_COMPARE.md`
- `M008_MULTI_MODEL_HARDENING.md`

## Goal

Make openPrompting trustworthy and comfortable for users who work across multiple models and harnesses.

By the end of this phase, users should be able to inspect whether their local setup is healthy, compare configured choices without misleading rankings, and rely on consistent profile/task routing across the CLI.

## Canonical specifications

Read and obey:

- `../01_V1_PRODUCT_SPEC.md`
- `../03_COMMAND_CONTRACT.md`
- `../04_CONFIG_AND_DATA_SCHEMA.md`
- `../05_KNOWLEDGE_AND_SOURCING.md`
- `../06_TESTING_AND_RELEASE_GATES.md`
- `../07_VERSIONING_CONTRIBUTION_AND_GOVERNANCE.md`

Preserve the completed Phase A and B behavior.

## Implementation prompt

Implement **Phase C — Trust and Multi-model UX** for openPrompting.

Complete M006, M007, and M008 in order.

### Required outcomes

#### 1. Local doctor

Implement:

```text
openprompting doctor
```

Use a read-only result model:

```text
PASS
INFO
WARN
FAIL
```

Check at minimum:

- config existence/validity
- setup references
- profile references
- task routing
- knowledge availability
- knowledge freshness
- known harness instruction files where relevant
- package.json presence if applicable
- common validation scripts such as test/lint/build/typecheck

Do not execute arbitrary project scripts in V1.

Doctor must not mutate files.

#### 2. Evidence-aware compare

Implement:

```text
openprompting compare <a> <b>
```

Prioritize profile-vs-profile comparison because that best matches mixed-model usage.

Support documented comparisons where sensible for:

- profiles
- setups
- models
- harnesses

Clearly separate:

- source-backed project knowledge
- user-defined roles/preferences
- unavailable/incomparable fields

Never invent a universal winner.

Do not produce unsupported statements such as:

```text
Model A is 37% better.
```

#### 3. Multi-model hardening

Make profiles and routing consistent across the product.

Finalize precedence:

```text
explicit CLI profile
    >
task-specific profile mapping
    >
default profile
    >
single configured setup fallback
```

Use the same concepts and selector behavior across:

- `guide`
- `new`
- `doctor`
- `compare`

where relevant.

A mixed-model user should normally operate through profile names rather than repeatedly specifying raw model/harness IDs.

### UX requirements

Terminology must remain stable:

```text
model
harness
setup
profile
task
```

Do not use “profile” and “setup” interchangeably.

Ambiguous states should explain exactly how to resolve them.

Warnings must not be presented as failures.

### Validation matrix

Test at least:

- one setup/no profile
- one setup + default profile
- multiple setups + default profile
- multiple profiles + task routing
- explicit profile override
- broken profile reference
- broken setup reference
- stale knowledge
- missing instruction file
- project without package.json
- profile vs profile compare
- harness vs harness compare
- model vs model compare
- incomparable fields
- doctor read-only guarantee

Run all prior milestone tests too.

## Stop condition

Stop Phase C when:

- doctor provides useful read-only diagnostics;
- compare is evidence-aware and non-misleading;
- mixed-model routing is consistent across commands;
- ambiguous selection behavior is predictable;
- no V1 feature depends on hidden assumptions about a single-model user.

Do not begin release-hardening until the mixed-model experience is stable.

## Deliverable summary

At completion, report:

- doctor checks implemented
- compare semantics
- finalized resolution precedence
- mixed-model examples
- warning/failure behavior
- regression results
- known release-readiness gaps for Phase D
