# openPrompting v1.1 — Start Here

This folder is the implementation contract for the first post-V1 catalog expansion of **openPrompting**.

## Release intent

`v1.1.0` is a **catalog-quality release**, not a new-engine release.

The goal is to make openPrompting more useful by:

1. deepening the existing model guidance,
2. adding carefully sourced model entries,
3. adding carefully sourced harness entries,
4. adding four genuinely distinct task types,
5. hardening catalog integrity so future contributions scale safely,
6. making model/harness choices easier to read in the setup UX.

The V1 product architecture remains intact.

## V1.1 principles

- Preserve all stable V1 contracts.
- Keep runtime behavior local, deterministic, and offline.
- Do not add LLM/API calls.
- Do not add a backend, account system, telemetry, or remote catalog dependency.
- Do not add new top-level CLI commands.
- Do not turn openPrompting into a generic model database.
- Do not add an entry merely because a model or harness exists.
- Prefer first-party sources.
- Narrow claims to what sources actually establish.
- Keep model behavior separate from harness behavior.
- Treat `official`, `tested`, `community`, and `legacy` honestly.
- New catalog content should normally require data/docs changes, not resolver rewrites.

## Read order

1. `01_CURRENT_STATE_AUDIT.md`
2. `02_V1_1_SCOPE.md`
3. `03_MODEL_CATALOG_PLAN.md`
4. `04_HARNESS_CATALOG_PLAN.md`
5. `05_TASK_CATALOG_PLAN.md`
6. `06_CATALOG_INTEGRITY_PLAN.md`
7. `07_METADATA_AND_SETUP_UX.md`
8. `08_TESTING_AND_RELEASE_GATES.md`
9. `09_IMPLEMENTATION_SEQUENCE.md`
10. `10_GOAL_MODE_OPERATING_CONTRACT.md`
11. `phases/`

## Target shape

The intended V1.1 catalog is approximately:

```text
Models:    5
Harnesses: 7
Tasks:     9
```

This is a target, not a quota. If a candidate cannot be supported with good current sources, do not ship it just to hit the count.

## No architecture rewrite

The current architecture already supports dynamic model/harness/task knowledge.

V1.1 should preserve:

```text
knowledge/
templates/
schemas/
src/config/
src/knowledge/
src/resolver/
src/commands/
```

The work is primarily:

```text
knowledge depth
+ catalog breadth
+ validation integrity
+ setup display polish
+ tests/docs/release
```
