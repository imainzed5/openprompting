# Phase 5 Goal — Expand Task Recipes

## Objective

Add four task types:

- planning
- research
- testing
- migration

## Required files

For each task:

```text
knowledge/tasks/<id>.md
templates/<id>.md
```

## Requirements

- make each task meaningfully distinct,
- source claims honestly,
- use `community` or `tested` when official evidence is not appropriate,
- ensure templates expose clear placeholders,
- ensure all active tasks render deterministically,
- update setup task routing automatically through catalog loading.

## Stop condition

`openprompting new planning|research|testing|migration` all work through the same data-driven path as the original V1 tasks.
