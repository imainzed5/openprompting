---
id: claude-code
type: harness
provider: anthropic
instruction_files:
  - CLAUDE.md
status: active
last_verified: 2026-09-07
evidence:
  - class: official
    claim: Claude Code supports project instruction and memory files through CLAUDE.md.
    source: claude-code-memory
  - class: official
    claim: Claude Code provides interactive and non-interactive CLI modes with tool permission controls.
    source: claude-code-cli
sources:
  - id: claude-code-memory
    title: How Claude remembers your project
    url: https://code.claude.com/docs/en/memory
    last_checked: 2026-09-07
  - id: claude-code-cli
    title: Claude Code CLI reference
    url: https://docs.anthropic.com/en/docs/claude-code/cli-usage
    last_checked: 2026-09-07
---

# Claude Code

## Summary

Claude Code is Anthropic's coding-agent harness. These notes describe the tool environment, not the underlying Claude model.

## Recommended

- Put durable project-specific instructions in the repository's supported `CLAUDE.md` scope.
- Choose permission settings deliberately for the work being performed.
- Use non-interactive output modes only when their structured behavior fits the workflow.

## Avoid

- Attributing `CLAUDE.md` discovery or CLI permission behavior to the model.
- Skipping permission checks without understanding the consequences.

## Context and tool-use notes

Claude Code exposes interactive and print modes, configurable tool permissions, and project-scoped memory behavior.

## Sources

See the source records in frontmatter.
