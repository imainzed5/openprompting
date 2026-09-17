# Phase 6 Goal — Human-readable Catalog Labels

## Objective

Make an expanded catalog easier to use interactively without changing stable IDs.

## Work

- add optional `display_name` metadata,
- update schemas/types,
- use display labels in setup selections,
- preserve IDs in config,
- use readable names in guide/compare output where useful,
- test fallback to ID when display name is absent.

## Compatibility

Do not change config schema version, introduce aliases, or rename existing IDs.

## Stop condition

Users can scan the larger setup catalog without having to parse long machine IDs, while all V1 configs continue to resolve identically.
