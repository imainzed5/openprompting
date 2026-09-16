---
id: aider
type: harness
provider: aider
status: active
last_verified: 2026-09-17
evidence:
  - class: official
    claim: Aider builds a concise repository map of files and important symbols, then selects relevant portions for the active context budget.
    source: aider-repository-map
  - class: official
    claim: Aider requires files to be added to the chat for editing, supports read-only context through /read or --read, and can pull related repository context automatically.
    source: aider-usage
  - class: official
    claim: Aider can load repository conventions through a read-only markdown file configured with .aider.conf.yml.
    source: aider-conventions
  - class: official
    claim: Aider supports configurable lint and test commands, including automatic testing after edits, and exposes multiple edit formats selected independently of the model.
    source: aider-lint-test
  - class: official
    claim: Aider searches for .aider.conf.yml in documented home, repository-root, and current-directory locations, with later-loaded files taking priority.
    source: aider-config
sources:
  - id: aider-repository-map
    title: Aider repository map
    url: https://aider.chat/docs/repomap.html
    last_checked: 2026-09-17
  - id: aider-usage
    title: Aider usage
    url: https://aider.chat/docs/usage.html
    last_checked: 2026-09-17
  - id: aider-conventions
    title: Specifying coding conventions
    url: https://aider.chat/docs/usage/conventions.html
    last_checked: 2026-09-17
  - id: aider-lint-test
    title: Linting and testing
    url: https://aider.chat/docs/usage/lint-test.html
    last_checked: 2026-09-17
  - id: aider-config
    title: YAML config file
    url: https://aider.chat/docs/config/aider_conf.html
    last_checked: 2026-09-17
  - id: aider-edit-formats
    title: Edit formats
    url: https://aider.chat/docs/more/edit-formats.html
    last_checked: 2026-09-17
---

# Aider

## Summary

Aider is a terminal-native AI pair-programming harness. This entry covers its repository context, conventions, edit, and verification workflows, not the behavior of the model selected for a session.

## Recommended

- Add only the files that the task needs to edit, and use `/read` or `--read` for conventions and other context that must remain read-only.
- Keep repository guidance in a concise file such as `CONVENTIONS.md`, then load it explicitly or list it under `read` in the repository's `.aider.conf.yml`.
- Let the repository map supply related symbols and dependencies, but inspect and add the concrete files that must be changed when a task crosses module boundaries.
- Configure a project-appropriate `--lint-cmd` and `--test-cmd`; enable `--auto-test` when repeated post-edit verification is worth the runtime.
- Select an edit format that fits the model and file complexity. Prefer the default unless observed edit failures justify an explicit `--edit-format` or architect/editor split.
- Keep project configuration reviewable and avoid placing credentials in committed configuration.

## Avoid

- Assuming Aider automatically loads a conventional instruction filename; conventions are supplied through `/read`, `--read`, or the `read` configuration option.
- Adding the whole repository to the chat when a focused file set and the repository map provide sufficient context.
- Treating the repository map as a substitute for reading the implementation files that will be edited.
- Treating lint or test commands as harmless: they execute project tooling after edits and should be reviewed for side effects.
- Attributing context assembly, edit-format selection, or test-loop behavior to the model.

## Context and tool-use notes

Aider separates editable chat files from read-only context. Its repository map supplies a compact, ranked view of related files and symbols, while `/add` or command-line file arguments make selected files editable. `.aider.conf.yml` can centralize read-only conventions, model-independent edit settings, and lint/test commands; repository-root configuration should be reviewed with the same care as other project automation.

## Known limitations

Repository-map coverage is constrained by the configured token budget, and edit-format reliability varies by model and task. Verify the actual files in context and run the project’s validation commands after changes rather than relying on the map or a successful edit parse alone.

## Sources

See the source records in frontmatter.
