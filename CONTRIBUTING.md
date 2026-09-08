# Contributing to openPrompting

Thank you for helping keep openPrompting useful, inspectable, and current. Focused pull requests are easiest to review: one model or harness update, one source correction, or one behavior change with its tests.

## Development setup

Requirements are Node.js 20 or newer and pnpm 11.

```sh
pnpm install --frozen-lockfile
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm verify:package
```

Normal CLI operation must remain local and offline. Do not add telemetry, model calls, or a network dependency to command execution.

## Knowledge contributions

Knowledge is data, not resolver code. To add a harness or model:

1. Copy [`docs/contributing/knowledge-entry-template.md`](docs/contributing/knowledge-entry-template.md) into the appropriate `knowledge/models`, `knowledge/harnesses`, or `knowledge/tasks` directory.
2. Use a globally unique lowercase kebab-case `id`.
3. Write scoped recommendations and separate model behavior from harness behavior.
4. Classify every frontmatter claim using the frozen V1 vocabulary: `official`, `tested`, `community`, or `legacy`.
5. Add an original source for every non-tested claim. For `tested` evidence, add a reproducible procedure instead.
6. Record `last_verified` and each source's `last_checked` as `YYYY-MM-DD`.
7. Run `pnpm validate:knowledge`, then the full gates above.

Adding a model, harness, or task normally requires only one knowledge file. Do not edit the command router or resolver. Harness-specific instruction filenames belong in the harness frontmatter `instruction_files` list; this lets `doctor` discover them without core changes.

Read the [knowledge format and evidence guide](docs/concepts/knowledge-and-evidence.md) and complete the [source verification checklist](docs/contributing/source-verification-checklist.md). The schema files in `schemas/` are authoritative for machine-readable metadata.

## Evidence and sources

- Prefer first-party documentation and link the original page.
- Paraphrase practical implications; do not copy large passages.
- Narrow claims to what the source actually establishes and state limitations.
- Mark inference clearly. Never present preference or an unscoped ranking as fact.
- If a claim is no longer verifiable, remove it or downgrade it to `legacy` with migration context.
- Keep model properties in model entries. Behavior such as reading an instruction file belongs to the harness implementing it.

Disputes are resolved by preferring official evidence, narrowing the claim, downgrading its classification when needed, and documenting uncertainty.

## Code and schema changes

Behavior changes need focused tests. Changes to the V1 executable, command names, config schema version, evidence vocabulary, or primary directories are breaking contract changes and require explicit maintainer discussion. Setup is the only V1 command that writes project state; `doctor` must remain read-only and must never execute project scripts.

## Pull requests

Use the pull request template. Explain what changed, why, how it was verified, and whether older guidance is replaced. Keep generated output, packed archives, credentials, and unrelated formatting out of the change.

By contributing, you agree that your contribution is licensed under the repository's MIT License.
