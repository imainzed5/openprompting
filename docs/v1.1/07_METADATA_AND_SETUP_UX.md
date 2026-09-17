# Metadata and Setup UX Plan

## Problem

The current setup wizard displays raw knowledge IDs because it builds choices from map keys.

This is manageable with three models/harnesses but becomes harder to scan as the catalog grows.

## Goal

Keep stable machine IDs while optionally exposing human-readable labels.

## Proposed metadata

Add optional:

```yaml
display_name: GPT-6 Astra
```

to model/harness/task metadata where useful.

Examples:

```yaml
id: openai-gpt-6-astra
display_name: GPT-6 Astra
```

```yaml
id: github-copilot-cli
display_name: GitHub Copilot CLI
```

```yaml
id: planning
display_name: Planning
```

## Compatibility

`display_name` must be additive and optional.

Do not change:

- knowledge IDs,
- config values,
- resolution semantics,
- schema version 1.

Existing entries without `display_name` should fall back to `metadata.id`.

## Setup wizard behavior

Interactive choices should ideally show readable labels while still writing stable IDs to YAML.

For clarity, the UI may show both:

```text
GPT-6 Astra (openai-gpt-6-astra)
```

if ambiguity is possible.

## Guide/compare output

Use display names where they improve readability, but preserve IDs where users need to copy/reference them.

Recommended presentation:

```text
GPT-6 Astra
ID: openai-gpt-6-astra
```

Do not make display names part of identity resolution.

## Schema impact

This is an additive metadata change.

Update:

- model schema,
- harness schema,
- task schema if used,
- TypeScript metadata types,
- renderer/setup choice labels,
- tests.

## Non-goal

Do not build aliases, fuzzy ID resolution, localization, or a new metadata registry in V1.1.
