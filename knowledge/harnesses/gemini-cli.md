---
id: gemini-cli
type: harness
provider: google
instruction_files:
  - GEMINI.md
status: active
last_verified: 2026-09-08
evidence:
  - class: official
    claim: Gemini CLI loads hierarchical instructional context from files named GEMINI.md by default.
    source: gemini-cli-configuration
  - class: official
    claim: Gemini CLI can inspect, refresh, and reload its combined context through memory commands.
    source: gemini-cli-configuration
sources:
  - id: gemini-cli-configuration
    title: Gemini CLI configuration — context files
    url: https://github.com/google-gemini/gemini-cli/blob/main/docs/reference/configuration.md#context-files-hierarchical-instructional-context
    last_checked: 2026-09-08
---

# Gemini CLI

## Summary

Gemini CLI is Google's terminal coding-agent harness. This entry describes its context-file behavior, not behavior inherent to the underlying Gemini model.

## Recommended

- Put durable project guidance in `GEMINI.md` and keep it concise, specific, and current.
- Include real project commands, conventions, and validation expectations.
- Use Gemini CLI's memory inspection commands when debugging which context was loaded.

## Avoid

- Attributing `GEMINI.md` discovery or precedence to the underlying model.
- Repeating conflicting instructions across global, project, and subdirectory context files.

## Context and tool-use notes

The default context filename is configurable. Gemini CLI loads context hierarchically and can combine global, project, ancestor, and subdirectory guidance.

## Known limitations

Context discovery behavior can be changed by Gemini CLI settings. Confirm the configured context filename when a project does not use the default.

## Sources

See the source records in frontmatter.
