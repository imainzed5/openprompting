---
id: anthropic-claude-opus-5
display_name: Claude Opus 5
type: model
provider: anthropic
status: active
last_verified: 2026-09-17
evidence:
  - class: official
    claim: Claude Opus 5 is an active Anthropic model with API model ID claude-opus-5.
    source: anthropic-opus-5-status
  - class: official
    claim: Claude Opus 5 is documented for complex agentic coding and long-horizon work, with adaptive thinking enabled by default.
    source: anthropic-opus-5-overview
  - class: official
    claim: Claude Opus 5 tends to verify its own work and can expand narrow tasks unless the requested scope is stated explicitly.
    source: anthropic-opus-5-prompting
  - class: official
    claim: Claude Opus 5's effort setting controls thinking depth rather than reliably controlling visible response length, so response length should be prompted explicitly when it matters.
    source: anthropic-opus-5-prompting
sources:
  - id: anthropic-opus-5-status
    title: Model deprecations and current status
    url: https://platform.claude.com/docs/en/about-claude/model-deprecations
    last_checked: 2026-09-17
  - id: anthropic-opus-5-overview
    title: What's new in Claude Opus 5
    url: https://platform.claude.com/docs/en/models/opus-5/whats-new-opus-5
    last_checked: 2026-09-17
  - id: anthropic-opus-5-prompting
    title: Prompting Claude Opus 5
    url: https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-5
    last_checked: 2026-09-17
---

# Claude Opus 5

## Summary

Anthropic's model for complex agentic coding and long-horizon work. These notes describe model behavior, not Claude Code behavior.

## Recommended

- Give difficult multi-file or end-to-end work a complete specification up front, including scope, constraints, and the intended stopping point.
- Use effort deliberately: start with the default and evaluate lower effort for cost- or latency-sensitive work; use `xhigh` for demanding coding or agentic tasks when the calling surface supports it.
- Prompt for the response length, tone, and written-deliverable density you need; lowering effort changes thinking more reliably than visible response length.
- In code review, state whether the first pass should maximize finding coverage or filter to a severity bar; Opus 5 may follow a narrow reporting instruction literally.
- Keep validation instructions proportional to the task. The model already self-checks, so add targeted checks when they protect a concrete requirement.

## Avoid

- Leaving a narrow task's scope implicit when extra analysis or cleanup would be costly.
- Repeating generic "double-check" or mandatory subagent-verification instructions without a specific risk to cover.
- Assuming model-level self-correction replaces the tests, tools, or approvals supplied by the harness.

## Context and tool-use notes

Claude Opus 5 is documented with a 1M-token context window and adaptive thinking on by default. Tool access, subagent orchestration, and approval behavior still come from the harness and its configuration.

## Known limitations

When thinking is disabled, Anthropic documents additional constraints: disabling thinking at `xhigh` or `max` returns an error, and visible output can occasionally contain a tool call or internal XML tags. Keep thinking enabled where practical and validate API-specific behavior in the integration being used.

## Sources

See the source records in frontmatter.
