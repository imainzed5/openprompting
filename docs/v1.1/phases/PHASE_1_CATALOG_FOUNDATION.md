# Phase 1 Goal — Catalog Foundation

## Objective

Prepare openPrompting for additive catalog growth without changing its public V1 behavior.

## Read

- `../00_START_HERE.md`
- `../01_CURRENT_STATE_AUDIT.md`
- `../02_V1_1_SCOPE.md`
- `../06_CATALOG_INTEGRITY_PLAN.md`
- `../08_TESTING_AND_RELEASE_GATES.md`
- `../10_GOAL_MODE_OPERATING_CONTRACT.md`

## Required work

- replace exact catalog-equality assertions with additive V1 invariants,
- add task↔template completeness validation,
- make prompt rendering tests dynamic over active tasks,
- fix CONTRIBUTING task-file guidance,
- improve package catalog checks where useful,
- preserve all stable V1 contracts.

## Do not

- add new models,
- add new harnesses,
- add new tasks,
- add display-name metadata yet,
- add commands or runtime network behavior.

## Stop condition

Phase 1 is complete when a hypothetical new valid task + template can be added without modifying the command router or a hard-coded task test list, and the original V1 seed entries remain contractually protected.
