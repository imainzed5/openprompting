---
id: openai-gpt-5-3-codex
type: model
provider: openai
status: active
last_verified: 2026-09-17
evidence:
  - class: official
    claim: GPT-5.3-Codex is an OpenAI model optimized for agentic coding in Codex or similar environments, with API model ID gpt-5.3-codex.
    source: openai-gpt-5-3-codex-model
  - class: official
    claim: GPT-5.3-Codex supports low, medium, high, and xhigh reasoning effort settings.
    source: openai-gpt-5-3-codex-model
  - class: official
    claim: OpenAI's Codex prompting guidance recommends medium reasoning effort for interactive coding and high or xhigh for the hardest long-running work.
    source: openai-codex-prompting
sources:
  - id: openai-gpt-5-3-codex-model
    title: GPT-5.3-Codex Model
    url: https://developers.openai.com/api/docs/models/gpt-5.3-codex
    last_checked: 2026-09-17
  - id: openai-codex-prompting
    title: Codex Prompting Guide
    url: https://developers.openai.com/cookbook/examples/gpt-5/codex_prompting_guide
    last_checked: 2026-09-17
---

# GPT-5.3-Codex

## Summary

OpenAI's agentic coding model for Codex or similar environments. These notes cover model-level behavior; instruction files, permissions, and context discovery belong to the harness using it.

## Recommended

- Provide the complete task specification up front: outcome, constraints, relevant context, and completion conditions.
- Use `medium` reasoning effort for interactive coding when it provides enough quality; reserve `high` or `xhigh` for difficult, long-running work and validate the trade-off on representative tasks.
- Make persistence and the intended end state explicit for multi-step work so the model can distinguish a finished result from an intermediate artifact.
- State the required validation and tool outcomes rather than assuming that a plausible patch is sufficient.

## Avoid

- Copying Codex-specific system prompts or harness instructions into a model-neutral setup.
- Using the highest reasoning effort for every task without checking latency, token use, and quality.
- Treating the model's agentic coding orientation as a guarantee that the current harness exposes the required tools or permissions.

## Context and tool-use notes

OpenAI documents GPT-5.3-Codex for agentic coding in Codex or similar environments. The model can be paired with other harnesses, but the available tools, context assembly, and approval behavior remain harness-specific.

## Known limitations

The model page documents a 400,000-token context window, 128,000-token maximum output, and image input without audio or video support. Behavior and the useful reasoning-effort setting still depend on the workload and the surrounding harness.

## Sources

See the source records in frontmatter.
