# Model Catalog Plan

## Rule for adding models

A model should not be added just because it exists.

A V1.1 model candidate should satisfy most or all of these:

```text
current / supported
first-party documentation exists
prompting behavior is meaningfully documentable
guidance is materially distinct enough to justify an entry
the source can be rechecked over time
```

Avoid creating a large collection of nearly identical model files.

## Existing model work

### OpenAI GPT-6 Astra

Current entry is valid but compact.

Deepen only where official documentation supports model-specific guidance around topics such as:

- outcome and completion conditions,
- autonomy,
- tool-supported work,
- long-running tasks,
- reasoning/effort controls when applicable,
- steering and validation behavior.

Do not add claims that belong to Codex.

### Anthropic Claude Sonnet 5

Deepen with current model-specific Anthropic prompting documentation.

Potential areas, only when officially supported:

- explicit/literal instruction following,
- desired output and constraints,
- effort/verbosity behavior,
- examples for exact formatting,
- tool-use prompting,
- migration differences from older Claude generations.

Do not add behavior that belongs to Claude Code.

### Google Gemini 3.8 Flash

Deepen beyond the model catalog.

Prefer current first-party prompt-design/model documentation.

Potential areas:

- clear/direct instructions,
- prompt structure,
- long-context placement,
- verbosity/output controls,
- grounding/verification,
- stable identifier behavior.

Do not add Gemini CLI context-file behavior here.

## New V1.1 model candidates

### Candidate A — OpenAI GPT-5.3-Codex

Why it is useful:

- highly aligned with openPrompting's coding-agent audience,
- likely to have coding-specific guidance,
- provides a model entry that is not simply a general-purpose flagship.

Implementation requirements:

- verify current support status,
- use first-party OpenAI documentation,
- capture only model-level behavior,
- keep Codex harness behavior in `knowledge/harnesses/codex.md`.

### Candidate B — Anthropic Claude Opus 5

Why it is useful:

- provides a second Anthropic model with potentially meaningful model-specific agentic behavior,
- allows users to see why two models from the same provider may still deserve separate guidance.

Implementation requirements:

- verify current support status,
- use first-party Anthropic documentation,
- document only genuinely distinct behavior,
- avoid duplicating Sonnet 5 prose.

## Deferred model candidate

### Claude Fable 5.1

Potentially strong future entry if current documentation remains rich and model-specific.

Defer from V1.1 unless:

- the primary scope finishes cleanly,
- its official guidance is materially distinct,
- adding it does not turn V1.1 into a catalog-size push.

## Source verification requirements

For every model added or deepened:

1. open the first-party source,
2. confirm the exact current model name/ID,
3. confirm support/status,
4. narrow every claim to what the source establishes,
5. record `last_checked`,
6. update `last_verified`,
7. avoid benchmark superiority claims,
8. avoid transferring harness-specific behavior into the model entry.

## Non-goal

Do not create separate model entries for every tier/alias if the prompting guidance would be substantially duplicated.
