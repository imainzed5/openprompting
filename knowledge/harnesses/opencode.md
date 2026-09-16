---
id: opencode
display_name: OpenCode
type: harness
provider: opencode
instruction_files:
  - AGENTS.md
status: active
last_verified: 2026-09-17
evidence:
  - class: official
    claim: OpenCode discovers AGENTS.md instructions from the global and project scopes, combines applicable files, and uses more specific files closer to the relevant code.
    source: opencode-instructions
  - class: official
    claim: OpenCode provides build and plan agents with different access modes and supports project-local custom agents in .opencode/agent or .opencode/agents.
    source: opencode-agents
  - class: official
    claim: OpenCode supports per-agent allow, ask, and deny permissions for operations including reading, editing, shell commands, subagents, and external directories.
    source: opencode-agents
sources:
  - id: opencode-instructions
    title: OpenCode instructions
    url: https://opencode.ai/docs/instructions
    last_checked: 2026-09-17
  - id: opencode-agents
    title: OpenCode agents
    url: https://opencode.ai/docs/agents
    last_checked: 2026-09-17
---

# OpenCode

## Summary

OpenCode is a terminal-native coding-agent harness. This entry covers its instruction loading, agent modes, and permission boundaries, not the behavior of the model selected for a session.

## Recommended

- Put repository-wide conventions in a root `AGENTS.md`, and add narrower `AGENTS.md` files closer to code that needs scoped guidance.
- Keep personal preferences in the global instruction location and project requirements in the repository so their scopes remain legible.
- Use the read-only `plan` agent for exploration and planning; use `build` when the task is authorized to edit files, and verify the active agent and permissions before execution.
- Define reusable project agents in `.opencode/agent/` or `.opencode/agents/` with an explicit purpose, mode, and permission policy.
- Set per-agent permissions deliberately with `allow`, `ask`, or `deny`, especially for `edit`, `bash`, `task`, and `external_directory` operations. Review broad wildcard rules and their ordering before running an agent.

## Avoid

- Assuming `CLAUDE.md` is an OpenCode V2 instruction-file fallback; use the documented `AGENTS.md` mechanism for OpenCode guidance.
- Treating global and project instructions as a conflict-resolution system. OpenCode combines applicable files, so resolve contradictions in the files themselves.
- Giving an agent broad shell, edit, subagent, or external-directory access when a narrower permission policy is sufficient.
- Attributing agent mode, instruction discovery, or permission behavior to the model.

## Context and tool-use notes

OpenCode's built-in `plan` and `build` agents represent harness modes. Custom agents can be primary or subagents, and their permissions should describe the smallest set of operations required by their role. Keep prompts and permissions aligned: a read-only reviewer should not receive edit or shell access merely because the selected model can use those tools.

## Known limitations

OpenCode instruction discovery is scope-sensitive and does not provide a general precedence rule for resolving contradictory instructions. Confirm the current agent configuration and permissions before relying on behavior in a long-running or automated session.

## Sources

See the source records in frontmatter.
