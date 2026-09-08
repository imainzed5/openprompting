# Configuration and Data Schema

## Project-local config

Canonical location:

```text
.openprompting/config.yml
```

Example:

```yaml
version: 1

setups:
  gpt-codex:
    model: openai-example-model
    harness: codex

  claude-code:
    model: anthropic-example-model
    harness: claude-code

profiles:
  builder:
    uses: gpt-codex
    role: implementation

  reviewer:
    uses: claude-code
    role: review

defaults:
  profile: builder

  tasks:
    feature: builder
    bug: builder
    review: reviewer
    refactor: builder
    ui: builder
```

Model IDs above are illustrative placeholders. Knowledge files should use verified current identifiers.

## Configuration rules

- `version` is required.
- setup IDs are user-defined stable keys.
- every setup references exactly one model and one harness.
- profiles reference a setup.
- role is descriptive, not executable logic.
- default task mappings reference profiles.
- duplicate setup/profile IDs are invalid.
- unknown model/harness knowledge IDs are invalid at resolution time.
- config must be forward-compatible through a top-level version.

## Resolution terminology

### Model

Provider/model behavior.

### Harness

Tool/agent environment behavior.

### Setup

A model + harness pair.

### Profile

A named user-facing role pointing to a setup.

### Task

A known task recipe such as `feature` or `review`.

## Schema strategy

Use JSON Schema files in `/schemas`.

V1 schemas:

- `config.schema.json`
- `model.schema.json`
- `harness.schema.json`
- `task.schema.json`

Markdown files may carry frontmatter validated against the corresponding schema.

## Compatibility

V1 should reject unsupported major config versions clearly:

```text
This config uses version 2, but this openPrompting build supports version 1.
```

Minor knowledge additions must not require config migration.

## Global config

Do not require a global user config for V1.

A future release may add a user-level default configuration, but project-local behavior is enough to establish the product.
