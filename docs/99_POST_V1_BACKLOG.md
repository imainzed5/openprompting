# Post-V1 Backlog

These are intentionally excluded from V1.

## Native harness adapters

Expose conceptual commands as native slash commands where a harness supports them.

Potential examples:

```text
/setup
/guide
/new
/doctor
```

This should adapt to each harness instead of pretending all harnesses implement commands identically.

## Handoffs

```text
openprompting handoff --from reviewer --to builder
```

Create a structured transfer package between profiles.

## Workflows

Represent sequences such as:

```text
designer -> builder -> reviewer -> builder
```

V1 may document this pattern but should not execute it.

## Prompt explain/optimize

Potential commands:

```text
openprompting explain prompt.md
openprompting optimize prompt.md
```

These may optionally use an LLM in the future, but deterministic lint rules should be explored first.

## Remote knowledge updates

Optional mechanism for checking or pulling newer guidance without requiring a full package upgrade.

Must preserve inspectability and source provenance.

## Website

A generated documentation site could eventually provide:

```text
choose model
choose harness
choose task
view resolved guidance
```

The repository remains canonical.

## Broader ecosystem

Possible additions:

- Cursor
- Windsurf
- Aider
- Cline
- Roo Code
- GitHub Copilot
- additional model families

Add only when maintainers can support source quality.

## Benchmarking

If openPrompting ever compares performance, benchmarks must be:

- scoped
- reproducible
- versioned
- separated from subjective prompting guidance

Do not build a generic model leaderboard by accident.
