---
id: cursor
display_name: Cursor
type: harness
provider: cursor
instruction_files:
  - AGENTS.md
  - CLAUDE.md
  - .cursorrules
status: active
last_verified: 2026-09-17
evidence:
  - class: official
    claim: Cursor project rules are version-controlled .mdc files under .cursor/rules and can be applied always, by file pattern, intelligently, or manually.
    source: cursor-rules
  - class: official
    claim: Cursor supports AGENTS.md project instructions, including more specific instructions in nested directories.
    source: cursor-rules
  - class: official
    claim: Cursor CLI uses the IDE rules system and reads AGENTS.md and CLAUDE.md at the project root when present.
    source: cursor-cli
  - class: official
    claim: Cursor CLI permissions can separately control shell commands and file reads through global or project configuration.
    source: cursor-permissions
sources:
  - id: cursor-rules
    title: Rules
    url: https://prod.cursor.com/docs/rules
    last_checked: 2026-09-17
  - id: cursor-cli
    title: Using Agent in CLI
    url: https://docs.cursor.com/en/cli/using
    last_checked: 2026-09-17
  - id: cursor-permissions
    title: Permissions
    url: https://docs.cursor.com/cli/reference/permissions
    last_checked: 2026-09-17
---

# Cursor

## Summary

Cursor is an editor and CLI coding-agent harness. These notes cover its rules, context, and permission behavior rather than the underlying model.

## Recommended

- Put simple project-wide instructions in `AGENTS.md`; use `.cursor/rules/*.mdc` when the guidance needs file scoping, intelligent attachment, or manual invocation.
- Use the `.mdc` extension and explicit rule frontmatter (`description`, `globs`, and `alwaysApply`) for project rules; keep rules focused and version-controlled.
- Use nested `AGENTS.md` files or scoped rules for genuinely local conventions, and review the resulting instruction set when a task crosses directories.
- Treat CLI shell and file-read permissions as part of the setup. Grant only the command and path access the workflow needs, especially before using non-interactive mode.

## Avoid

- Dropping plain `.md` files into `.cursor/rules` and assuming Cursor will load them as project rules.
- Treating the deprecated `.cursorrules` format as the preferred long-term convention.
- Assuming user or team rules are repository-local, or that an instruction is applied identically across every Cursor surface.
- Attributing rule discovery, context assembly, or permission prompts to the model.

## Context and tool-use notes

Cursor project rules are inserted as persistent context according to their scope. Cursor CLI supports the IDE rules system and can also read root `AGENTS.md` and `CLAUDE.md` files. CLI permissions use separate tokens for shell commands and file reads, and project-specific settings can live in `.cursor/cli.json`.

## Known limitations

Rule scope and available controls vary by Cursor surface and configuration. Confirm the CLI behavior and effective permissions for the version and project being used before relying on a rule or automating writes.

## Sources

See the source records in frontmatter.
