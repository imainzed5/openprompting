# Knowledge and evidence

Knowledge lives in three data directories: `knowledge/models`, `knowledge/harnesses`, and `knowledge/tasks`. Markdown frontmatter is validated by the matching JSON Schema in `schemas/`; prose provides the displayed guidance. IDs are globally unique lowercase kebab-case values.

The V1 evidence vocabulary is frozen:

- `official`: directly supported by first-party provider or harness documentation.
- `tested`: reproduced by maintainers with the procedure recorded in frontmatter.
- `community`: useful practice without first-party confirmation.
- `legacy`: historical or migration advice that is not a current default.

Every non-tested claim references a source declared in the same entry. Every source records an HTTPS URL and the date it was last checked. Models and harnesses always record `last_verified`; tasks do as well under the shipped schema.

Freshness is a maintenance signal, not a correctness verdict. `doctor` reports entries verified within 60 days as current, 61–120 days as review suggested, and 121 days or more as stale.

The ownership test is simple: if advice remains true when the same model is used through another harness, it belongs to the model. Otherwise it belongs to the harness. See the [contribution guide](../../CONTRIBUTING.md) for the authoring workflow.
