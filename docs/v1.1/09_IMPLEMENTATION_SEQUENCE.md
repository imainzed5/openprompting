# V1.1 Implementation Sequence

Implement in this order.

## Phase 1 — Catalog foundation

Make the existing system safe for additive catalog growth.

Work:

- fix exact-catalog V1 contract assertions,
- add task↔template integrity validation,
- make task prompt tests dynamic,
- update contribution rules,
- improve package catalog validation where useful.

No new catalog entries yet.

## Phase 2 — Existing knowledge deepening

Improve the three shipped model entries using current first-party sources.

Targets:

- GPT-6 Astra,
- Claude Sonnet 5,
- Gemini 3.8 Flash.

## Phase 3 — New models

Primary candidates:

- GPT-5.3-Codex,
- Claude Opus 5.

Re-verify exact names/status/docs before implementation.

Skip any candidate that fails the source-quality bar.

## Phase 4 — New harnesses

Primary targets:

- Cursor,
- GitHub Copilot CLI,
- OpenCode,
- Aider.

Implement one at a time with source verification and tests.

## Phase 5 — New tasks

Add:

- planning,
- research,
- testing,
- migration.

Each task requires both a knowledge file and template.

## Phase 6 — Metadata and setup UX

Add optional human-readable display names and use them in interactive UX.

Preserve stable IDs and config schema version.

## Phase 7 — Docs and release

Update:

- README,
- command/contributor docs,
- changelog,
- release notes,
- package version,
- package verification,
- release validation.

Target:

```text
v1.1.0
```

## Checkpoint discipline

After each phase:

1. run relevant focused tests,
2. run knowledge validation,
3. inspect diff,
4. create a coherent checkpoint commit,
5. do not proceed if phase-specific gates are red.

Do not implement multiple catalog categories in one unreviewable change.
