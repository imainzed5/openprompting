# Phase D — Open-source Release Goal Prompt

## Covers

- `M009_CONTRIBUTOR_AND_SOURCE_QUALITY.md`
- `M010_RELEASE_CANDIDATE.md`
- `M011_V1_LAUNCH.md`

## Goal

Turn the working product into a trustworthy, maintainable, publicly releasable `v1.0.0`.

This phase is primarily about source quality, contributor experience, packaging, compatibility, documentation accuracy, and release discipline.

Do not use this phase to sneak in new product features.

## Canonical specifications

Read and obey all canonical specs, especially:

- `../01_V1_PRODUCT_SPEC.md`
- `../03_COMMAND_CONTRACT.md`
- `../05_KNOWLEDGE_AND_SOURCING.md`
- `../06_TESTING_AND_RELEASE_GATES.md`
- `../07_VERSIONING_CONTRIBUTION_AND_GOVERNANCE.md`
- `../99_POST_V1_BACKLOG.md`

The post-V1 backlog is a boundary: attractive ideas listed there must not delay V1.

## Implementation prompt

Implement **Phase D — Open-source Release** for openPrompting.

Complete M009, M010, and M011 in order.

### Required outcomes

#### 1. Contributor and source quality

Finish:

- `CONTRIBUTING.md`
- knowledge contribution instructions
- evidence/source rules
- PR template
- issue templates
- knowledge validation in CI
- stale-guidance reporting
- `CHANGELOG.md`
- command docs
- concept docs
- complete intended V1 model/harness/task knowledge

A contributor should be able to add a new harness or update a model guide without modifying core resolver code.

Every shipped model/harness entry must satisfy the knowledge contract.

#### 2. Release candidate

Create and validate:

```text
v1.0.0-rc.1
```

Freeze:

- CLI executable name
- V1 command names
- config schema v1
- evidence vocabulary
- key directory contracts

Audit package contents.

Verify install/use from the packed artifact rather than relying only on repository execution.

Test at minimum on:

- Windows
- Linux
- macOS where available

#### 3. V1 release

Prepare:

```text
v1.0.0
```

Final public user journey:

```text
install
openprompting setup
openprompting guide
openprompting new feature
openprompting doctor
openprompting compare ...
```

must match the README exactly.

### Required V1 ecosystems

Before release, ensure the intended initial knowledge coverage is present and verified for the current supported ecosystem set defined by the project plan.

Do not invent model IDs or carry stale provider guidance forward without verification.

### Release blockers

Treat these as blockers:

- broken clean install
- invalid package contents
- CLI examples that do not match implementation
- config schema mismatch
- invalid knowledge metadata
- missing source/freshness metadata for required knowledge
- mixed-model routing regressions
- hidden network/API dependency
- platform-breaking path assumptions
- release-critical test failures

### Not blockers unless explicitly promoted

Do not delay V1 for:

- website
- hosted docs
- prompt optimization
- LLM-powered features
- automatic handoff/workflows
- native slash-command adapters
- benchmark leaderboard
- broader harness catalog

Move those to post-V1.

### Validation

Run all canonical gates:

```text
lint
typecheck
test
build
package validation
clean install
knowledge validation
README command verification
```

Exercise the required end-to-end scenarios from M010.

### Stop condition

Phase D is complete only when:

1. contributor documentation is usable;
2. all shipped knowledge meets the evidence/source contract;
3. the packaged CLI works after clean installation;
4. the README describes the real product;
5. release gates are green;
6. `v1.0.0` can be tagged without knowingly violating a V1 contract.

## Deliverable summary

At completion, report:

- final V1 command surface
- final package/config contracts
- supported knowledge coverage
- platform validation
- final test/gate results
- release notes summary
- deferred post-V1 items
