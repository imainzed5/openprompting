# Phase B — Core User Experience Goal Prompt

## Covers

- `M003_SETUP_AND_CONFIG.md`
- `M004_GUIDE_RESOLUTION.md`
- `M005_PROMPT_GENERATION.md`

## Goal

Turn the Phase A foundation into a genuinely useful local tool.

By the end of this phase, a user should be able to configure one or more model/harness setups, resolve source-backed guidance for the selected setup, and generate a deterministic task prompt skeleton.

This is the first phase where openPrompting should feel like a real product.

## Canonical specifications

Read and obey:

- `../01_V1_PRODUCT_SPEC.md`
- `../02_REPOSITORY_ARCHITECTURE.md`
- `../03_COMMAND_CONTRACT.md`
- `../04_CONFIG_AND_DATA_SCHEMA.md`
- `../05_KNOWLEDGE_AND_SOURCING.md`
- `../06_TESTING_AND_RELEASE_GATES.md`
- `../07_VERSIONING_CONTRIBUTION_AND_GOVERNANCE.md`

Assume Phase A is complete and preserve its architecture.

## Implementation prompt

Implement **Phase B — Core User Experience** for openPrompting.

Complete M003, M004, and M005 in order. Keep the implementation local-first, deterministic, and knowledge-driven.

### Required outcomes

#### 1. Setup and configuration

Implement:

```text
openprompting setup
```

Support:

- multiple model/harness setups
- optional named profiles
- one default profile
- task-to-profile mappings
- safe creation/update of `.openprompting/config.yml`
- config schema version 1
- interactive setup
- validation of existing config
- cancellation without file mutation

The setup UX should preview what will be written before mutating the config in interactive mode.

#### 2. Guide resolution

Implement:

```text
openprompting guide
```

Support resolution by:

- explicit profile
- explicit model
- explicit harness
- configured default profile
- single configured setup fallback

When resolution is ambiguous, do not guess. Give actionable valid choices.

Resolved output should preserve ownership boundaries between:

- model guidance
- harness guidance
- evidence/source metadata

Display freshness information and sources.

#### 3. Task prompt generation

Implement:

```text
openprompting new <task>
```

V1 tasks:

- `feature`
- `bug`
- `review`
- `refactor`
- `ui`

The resolver should conceptually combine:

```text
profile/setup
+ model knowledge
+ harness knowledge
+ task knowledge
+ task template
```

The final result must be deterministic and copyable.

Do not fabricate project facts. Use clear placeholders when information is unknown.

### Resolution precedence

For task commands:

```text
explicit CLI profile
    >
task-specific profile mapping
    >
default profile
    >
single configured setup fallback
```

If no choice is unambiguous, fail clearly.

### Architectural constraints

Do not hard-code special cases like:

```text
if model == X ...
if harness == Y ...
```

inside command controllers when the behavior belongs in knowledge or resolver layers.

Do not introduce an LLM to “improve” generated prompts.

Do not require:

- API keys
- network access
- accounts
- remote storage

### User journeys that must work

#### Single setup

```text
openprompting setup
openprompting guide
openprompting new feature
```

#### Mixed model

```text
builder  -> model A + harness A
reviewer -> model B + harness B
```

Then:

```text
openprompting new feature
openprompting new review
openprompting guide --profile reviewer
```

must resolve correctly according to config.

### Validation

Add tests for:

- fresh config creation
- existing config edits
- cancellation safety
- mixed-model config
- invalid references
- profile resolution
- task-specific routing
- explicit override
- ambiguity handling
- unknown identifiers
- all five V1 task templates
- deterministic rendering
- evidence/source output
- no hidden network dependence

Run the full project gates from the canonical testing spec.

## Stop condition

Stop Phase B when a real user can:

1. install/open the project,
2. configure at least one setup,
3. configure multiple setups/profiles,
4. view correct model + harness guidance,
5. generate each supported task template,
6. use task-specific profile routing,

without an API key, model call, backend, or manual source-code edit.

Do not continue into doctor/compare polishing until these core paths are stable.

## Deliverable summary

At completion, report:

- completed commands
- config format actually shipped
- resolution precedence
- supported task templates
- representative CLI examples
- tests/validation results
- any known UX debt for Phase C
