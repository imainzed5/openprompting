# Harness Catalog Plan

## Why harness expansion matters

V1 currently covers:

```text
Codex
Claude Code
Gemini CLI
```

Adding independent harnesses strengthens openPrompting's central distinction:

> **model behavior and harness behavior are not the same thing.**

Harness entries should focus on behavior introduced by the tool:

- instruction files,
- context discovery,
- repository inspection,
- permissions,
- tool execution,
- plan/review modes,
- memory/context systems,
- repo maps,
- workflow conventions.

## V1.1 harness targets

### 1. Cursor

Priority: very high.

Research current first-party documentation for:

- `.cursor/rules`,
- project/workspace rules,
- user/team rules,
- `AGENTS.md` support,
- nested/scoped instructions,
- CLI-specific context behavior when applicable.

Do not claim model behavior belongs to Cursor.

Suggested ID:

```text
cursor
```

or a narrower ID if current documentation makes editor/CLI behavior meaningfully different.

### 2. GitHub Copilot CLI

Priority: very high.

Prefer a narrow harness entry:

```text
github-copilot-cli
```

rather than one generic `github-copilot` entry.

Research current GitHub documentation for:

- custom instructions,
- repository instruction files,
- path-specific instructions,
- supported instruction filenames,
- CLI behavior,
- differences from other Copilot surfaces.

Do not combine GitHub.com, IDE, cloud agent, code review, and CLI behavior unless the source explicitly establishes parity.

### 3. OpenCode

Priority: very high.

Research current first-party docs for:

- `AGENTS.md`,
- scoped/project instructions,
- primary agents,
- subagents,
- permissions,
- project agent definitions.

Suggested ID:

```text
opencode
```

This is a particularly good OSS-fit entry.

### 4. Aider

Priority: high.

Research first-party Aider documentation for:

- repository map behavior,
- context/file selection,
- edit formats,
- model interaction constraints,
- validation/lint/test integrations where documented.

Suggested ID:

```text
aider
```

Aider is valuable because its repo-map/context model creates genuinely harness-specific prompting implications.

## Deferred harnesses

Potential V1.2 candidates:

- Cline
- Windsurf
- Roo Code

Do not add them to V1.1 merely to increase catalog size.

## Entry requirements

Every new harness entry should include:

```text
Summary
Recommended
Avoid
Context and tool-use notes
Known limitations (when relevant)
Sources
```

Frontmatter must include:

- stable ID,
- provider/maintainer,
- active/legacy status,
- verification date,
- evidence,
- sources,
- instruction filenames where the schema supports them.

## Harness ownership test

Before adding any claim, ask:

> Would this remain true if the same model were used in a different harness?

If **yes**, it probably belongs to the model.

If **no**, it probably belongs to the harness.

## Source discipline

Prefer:

1. official product docs,
2. official GitHub repository docs,
3. reproducible maintainer testing,
4. community evidence only when clearly labeled.

Do not derive current behavior solely from blog posts, Reddit comments, or stale third-party tutorials.
