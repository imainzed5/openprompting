---
id: codex
type: harness
provider: openai
instruction_files:
  - AGENTS.md
status: active
last_verified: 2026-09-07
evidence:
  - class: official
    claim: Codex reads AGENTS.md instruction files and applies scoped project guidance before work begins.
    source: codex-agents-md
sources:
  - id: codex-agents-md
    title: Custom instructions with AGENTS.md
    url: https://learn.chatgpt.com/docs/agent-configuration/agents-md
    last_checked: 2026-09-07
---

# Codex

## Summary

Codex is OpenAI's coding-agent harness. This entry covers harness behavior rather than behavior of any underlying model.

## Recommended

- Put durable repository instructions in a scoped `AGENTS.md`.
- Keep project instructions concrete, current, and compatible with repository tooling.
- Include actual validation commands and boundaries the agent must preserve.

## Avoid

- Attributing instruction-file discovery to the model itself.
- Storing stale or mutually conflicting rules in nested instruction files.

## Context and tool-use notes

Codex constructs an instruction chain from global and project-scoped files. More local project guidance can refine broader guidance.

## Sources

See the source records in frontmatter.
