---
id: github-copilot-cli
display_name: GitHub Copilot CLI
type: harness
provider: github
instruction_files:
  - AGENTS.md
  - CLAUDE.md
  - GEMINI.md
status: active
last_verified: 2026-09-17
evidence:
  - class: official
    claim: GitHub Copilot CLI discovers repository-wide, path-specific, and agent instruction files from documented repository and user-level locations, with applyTo controlling path-specific instructions.
    source: github-copilot-cli-instructions
  - class: official
    claim: Copilot CLI provides /instructions to inspect and toggle discovered instruction files and supports repository-local @path imports from supported instruction files.
    source: github-copilot-cli-reference
  - class: official
    claim: Copilot CLI asks for approval for potentially destructive tool use and supports separate allow or deny controls for tools, paths, and URLs.
    source: github-copilot-cli-tools
  - class: official
    claim: Copilot CLI's applicable user, repository, and path-specific instructions are combined without a general precedence order, so conflicting instructions should be avoided.
    source: github-copilot-cli-instructions
sources:
  - id: github-copilot-cli-instructions
    title: Adding custom instructions for GitHub Copilot CLI
    url: https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-custom-instructions
    last_checked: 2026-09-17
  - id: github-copilot-cli-reference
    title: GitHub Copilot CLI command reference
    url: https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference
    last_checked: 2026-09-17
  - id: github-copilot-cli-tools
    title: Allowing and denying tool use
    url: https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/allowing-tools
    last_checked: 2026-09-17
---

# GitHub Copilot CLI

## Summary

GitHub Copilot CLI is a terminal-native coding-agent harness. This entry covers its instruction discovery, session controls, and permissions, not the behavior of whichever model it runs.

## Recommended

- Put repository-wide conventions in `.github/copilot-instructions.md`; use `.github/instructions/**/*.instructions.md` with `applyTo` when guidance should follow particular paths or file types.
- Use `AGENTS.md`, `CLAUDE.md`, or `GEMINI.md` where their standard-location discovery is useful, and inspect the effective set with `/instructions`.
- Keep user, repository, and path-specific instructions consistent because Copilot CLI combines applicable files without defining a general precedence order.
- In automation, allow only the tools and URLs the task needs and set an explicit model when reproducibility across environments matters.
- Treat `copilot init` or `/init` as a repository authoring action: review the generated or updated `.github/copilot-instructions.md` before committing it.

## Avoid

- Describing this entry as coverage for Copilot in IDEs, GitHub.com, cloud agent, or code review; those surfaces have different support matrices.
- Assuming a path-specific instruction applies when its `applyTo` pattern does not match the files in the current task.
- Using `--allow-all` or `--yolo` as a routine shortcut outside an isolated environment.
- Attributing instruction merging, permission prompts, or tool availability to the model.

## Context and tool-use notes

Copilot CLI combines applicable personal, repository, agent, and path-specific instructions at session start. Supported instruction files can import repository-local files with `@path`; `/instructions` shows the discovered set. Tool availability and approval are separate controls: `--available-tools` or `--excluded-tools` restrict what the model can see, while `--allow-tool` and `--deny-tool` control approval.

## Known limitations

Instruction changes are not immediately applied to an already-running CLI session; start a new session or resume after exiting. Copilot CLI is evolving, so confirm current behavior with `/help` and the current command reference before depending on an option in automation.

## Sources

See the source records in frontmatter.
