---
id: anthropic-claude-sonnet-5
display_name: Claude Sonnet 5
type: model
provider: anthropic
status: active
last_verified: 2026-09-17
evidence:
  - class: official
    claim: Claude Sonnet 5 is an active Anthropic model with API model ID claude-sonnet-5.
    source: anthropic-model-status
  - class: official
    claim: Current Claude models respond best to clear, explicit instructions with desired output and constraints.
    source: anthropic-prompting
  - class: official
    claim: Claude Sonnet 5 uses adaptive thinking by default, and the effort setting tunes reasoning depth and token use for different workloads.
    source: anthropic-sonnet-5-prompting
  - class: official
    claim: Claude Sonnet 5 follows instructions literally enough that prompts should state the intended scope explicitly, especially at lower effort levels.
    source: anthropic-sonnet-5-prompting
  - class: official
    claim: Structured XML tags, relevant examples, and deliberate placement of long context can improve the handling of mixed or data-rich prompts.
    source: anthropic-prompting
sources:
  - id: anthropic-model-status
    title: Model deprecations and current status
    url: https://platform.claude.com/docs/en/about-claude/model-deprecations
    last_checked: 2026-09-17
  - id: anthropic-prompting
    title: Prompting best practices
    url: https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices
    last_checked: 2026-09-17
  - id: anthropic-sonnet-5-prompting
    title: Prompting Claude Sonnet 5
    url: https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-sonnet-5
    last_checked: 2026-09-17
---

# Claude Sonnet 5

## Summary

Anthropic's active Sonnet model for general reasoning, coding, and agentic tasks. These notes describe model behavior, not Claude Code behavior.

## Recommended

- Give clear, direct instructions and specify the desired output and constraints.
- Explain relevant context and motivation rather than expecting unstated conventions.
- State the scope of each instruction explicitly; do not rely on the model to generalize it from one item to another.
- Choose effort deliberately: lower levels suit short or latency-sensitive work, while high or xhigh effort is more appropriate for difficult coding and agentic tasks.
- For complex prompts, separate instructions, context, inputs, and examples with consistent XML tags; put long documents before the query and ask for relevant evidence when grounding matters.
- Use positive examples and explicit verbosity or tone requirements when output shape matters.

## Avoid

- Relying on vague requests when completeness or output structure matters.
- Applying behavior observed in another Claude generation without re-evaluation.
- Assuming omitted scope will be inferred, especially at low or medium effort.

## Known limitations

Adaptive thinking is enabled by default on Claude Sonnet 5. In API integrations, manual extended-thinking configuration is unsupported, non-default sampling parameters are rejected, and the output budget must leave room for thinking and tool calls. Model behavior is nondeterministic; validate guidance with representative evaluations and revisit it when the model-specific documentation changes.

## Sources

See the source records in frontmatter.
