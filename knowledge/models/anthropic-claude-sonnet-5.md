---
id: anthropic-claude-sonnet-5
type: model
provider: anthropic
status: active
last_verified: 2026-09-07
evidence:
  - class: official
    claim: Claude Sonnet 5 is an active Anthropic model with model-specific prompting guidance.
    source: anthropic-model-status
  - class: official
    claim: Current Claude models respond best to clear, explicit instructions with desired output and constraints.
    source: anthropic-prompting
sources:
  - id: anthropic-model-status
    title: Model deprecations and current status
    url: https://docs.anthropic.com/en/docs/about-claude/model-deprecations
    last_checked: 2026-09-07
  - id: anthropic-prompting
    title: Prompting best practices
    url: https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices
    last_checked: 2026-09-07
---

# Claude Sonnet 5

## Summary

Anthropic's active Sonnet model for general reasoning, coding, and agentic tasks.

## Recommended

- Give clear, direct instructions and specify the desired output and constraints.
- Explain relevant context and motivation rather than expecting unstated conventions.
- Use representative examples when exact format or tone matters.

## Avoid

- Relying on vague requests when completeness or output structure matters.
- Applying behavior observed in another Claude generation without re-evaluation.

## Known limitations

Model behavior is nondeterministic. Validate guidance with representative evaluations and revisit it when the model-specific documentation changes.

## Sources

See the source records in frontmatter.
