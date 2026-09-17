# V1.1 Scope

## Release theme

> **Broader ecosystem coverage, deeper guidance, and safer catalog growth.**

## In scope

### Existing knowledge

Deepen:

- OpenAI GPT-6 Astra
- Anthropic Claude Sonnet 5
- Google Gemini 3.8 Flash

### New model candidates

Primary candidates:

- OpenAI GPT-5.3-Codex
- Anthropic Claude Opus 5

Secondary candidate for a later release unless scope remains very small:

- Anthropic Claude Fable 5.1

Every candidate must be re-verified against first-party documentation at implementation time.

If a candidate is no longer active, documented, or materially distinct, skip it.

### New harness candidates

Primary V1.1 candidates:

- Cursor
- GitHub Copilot CLI
- OpenCode
- Aider

Later candidates, intentionally deferred unless V1.1 stays comfortably small:

- Cline
- Windsurf
- Roo Code

### New tasks

Add:

- `planning`
- `research`
- `testing`
- `migration`

### Catalog integrity

Add:

- task ↔ template completeness validation,
- dynamic task render tests,
- additive V1 contract tests,
- stronger package catalog checks where useful.

### UX metadata

Add an optional human-readable metadata field such as:

```yaml
display_name: GPT-6 Astra
```

Use machine-stable IDs in config and human-friendly labels in interactive setup/output where appropriate.

## Out of scope

Do not add:

- new top-level CLI commands,
- remote knowledge updates,
- LLM-powered prompt rewriting,
- prompt optimization,
- handoff execution,
- workflow execution,
- website/hosted app,
- telemetry,
- accounts,
- backend/database,
- benchmark leaderboard,
- native slash-command adapters,
- automatic internet access during normal CLI operation.

## Compatibility target

V1.1 must remain compatible with V1 config schema:

```yaml
version: 1
```

Existing V1 configs must continue to work unchanged.

Existing V1 IDs must remain valid.

The stable command surface remains:

```text
help
setup
guide
new
doctor
compare
```

The frozen evidence vocabulary remains:

```text
official
tested
community
legacy
```

## Release success

V1.1 is successful when:

- the original V1 user journey still works,
- new entries are source-backed,
- new tasks work through `openprompting new`,
- the catalog can grow without hard-coded test maintenance,
- setup choices are easier to read,
- all package/release gates pass.
