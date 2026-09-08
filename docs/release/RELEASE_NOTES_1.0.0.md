# openPrompting 1.0.0

The first stable release delivers a local, deterministic CLI for source-backed model, harness, and task guidance.

## Highlights

- Configure one or more model/harness setups, named profiles, defaults, and task routes.
- Resolve guidance and generate structured prompt skeletons for five recurring task types.
- Diagnose local configuration, routing, instruction files, declared scripts, and guidance freshness without executing project code.
- Compare profiles, setups, models, and harnesses without inventing a universal ranking.
- Ship verified initial coverage for OpenAI/Codex, Anthropic/Claude Code, and Google/Gemini CLI.
- Validate knowledge, schemas, mixed-model routing, package contents, and packed-artifact execution in release gates.

## Stable contracts

The executable, six command names, config schema v1, evidence vocabulary, and key data directories are frozen. See [V1 contracts](V1_CONTRACTS.md) and [migration notes](MIGRATION.md).

## Privacy and operation

Normal operation requires no account, hosted service, API key, model call, telemetry, or network connection. Setup writes only its project-local config; doctor is read-only.

## Deferred beyond V1

Hosted documentation, native harness adapters, handoffs/workflows, prompt optimization, remote knowledge updates, broader harness coverage, and benchmarking remain in the post-V1 backlog.
