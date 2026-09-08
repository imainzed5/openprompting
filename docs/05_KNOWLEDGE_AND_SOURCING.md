# Knowledge and Sourcing Contract

The quality of openPrompting depends more on its knowledge discipline than its CLI code.

## Knowledge entry types

```text
knowledge/models/
knowledge/harnesses/
knowledge/tasks/
```

## Recommended frontmatter

### Model

```yaml
---
id: provider-model-id
type: model
provider: provider
status: active
last_verified: YYYY-MM-DD
---
```

### Harness

```yaml
---
id: codex
type: harness
provider: openai
status: active
last_verified: YYYY-MM-DD
---
```

### Task

```yaml
---
id: feature
type: task
status: active
last_verified: YYYY-MM-DD
---
```

## Standard sections

Use predictable headings:

```text
Summary
Recommended
Avoid
Context and tool-use notes
Known limitations
Examples
Sources
```

Not every entry must use every section, but core sections should be consistent.

## Evidence classes

Every meaningful recommendation should be classifiable as:

```text
official
tested
community
legacy
```

### `official`

Directly supported by provider/harness documentation.

### `tested`

Observed by openPrompting maintainers through documented, reproducible testing.

### `community`

Useful community practice without first-party confirmation.

### `legacy`

Advice retained for historical/migration context and not recommended as current default behavior.

## Source rules

- Prefer first-party documentation.
- Link to the original source, not a secondary summary when possible.
- Record when a source was last checked.
- Do not copy large sections of provider documentation.
- Paraphrase and explain the practical implication.
- Clearly mark inference.
- Remove or downgrade guidance when it can no longer be verified.
- Avoid universal claims such as “best model” unless backed by an explicitly scoped benchmark.

## Freshness

Every model and harness entry must have `last_verified`.

V1 doctor may surface age-based warnings. A reasonable initial policy:

```text
0–60 days    current
61–120 days  review suggested
121+ days    stale
```

This is a maintenance signal, not proof that the guidance is wrong.

## Model vs harness ownership

Before adding guidance, ask:

> Would this still be true if I used the same model through another harness?

If yes, it probably belongs under the model.

If no, it probably belongs under the harness.

Example:

```text
"reads AGENTS.md"
```

belongs to a harness that implements that behavior, not the underlying model.

## Contribution expectation

A contributor adding a recommendation should provide:

- the claim/recommendation
- evidence classification
- source or reproduction basis
- verification date
- scope/limitations when necessary
