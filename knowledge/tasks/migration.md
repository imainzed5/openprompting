---
id: migration
type: task
status: active
last_verified: 2026-09-17
evidence:
  - class: official
    claim: A migration rollback plan should define checkpoints, a rollback strategy, data handling, and the person who decides whether to fix forward or roll back.
    source: aws-migration-cutover
  - class: official
    claim: Safe decomposition guidance calls for backward compatibility, a coexistence period, incremental validation, and explicit rollback controls before retiring legacy paths.
    source: aws-migration-logic
sources:
  - id: aws-migration-cutover
    title: Cutover stage
    url: https://docs.aws.amazon.com/prescriptive-guidance/latest/best-practices-migration-cutover/cutover-stage.html
    last_checked: 2026-09-17
  - id: aws-migration-logic
    title: Migrating business logic from the database to the application layer
    url: https://docs.aws.amazon.com/prescriptive-guidance/latest/database-decomposition/logic.html
    last_checked: 2026-09-17
---

# Migration

## Summary

Move a system safely from a documented current state to a defined target state.

## Recommended

- Describe the current and target states, compatibility requirements, dependencies, and the observable completion conditions.
- Identify data, schema, API, configuration, operational, and user-facing impacts before choosing a sequence.
- Make the migration incremental where practical, validate intermediate states, and define what can coexist during the transition.
- Design rollback before execution: checkpoints, triggers, owner, data handling, recovery time, and the difference between rollback and fix-forward.
- Make destructive steps, deprecations, cleanup, and irreversible decisions explicit and separately reviewable.
- Define validation for the source, transition, target, and post-cutover state before retiring old paths or data.

## Avoid

- Treating a successful copy or deploy as proof that the migration is complete.
- Removing compatibility or legacy data before the target path and rollback evidence are established.
- Leaving rollback as an emergency slogan without a trigger, procedure, decision owner, and data plan.
- Combining unrelated cleanup or redesign with a migration that already carries transition risk.

## Sources

See the source records in frontmatter.
