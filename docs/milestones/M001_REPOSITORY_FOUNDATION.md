# M001 — Repository Foundation

**Target:** `v0.1.0`

## Goal

Create the smallest installable, testable openPrompting CLI.

## Deliverables

- repository initialized
- TypeScript configuration
- package metadata
- `openprompting` executable
- command router
- placeholder commands:
  - help
  - setup
  - guide
  - new
  - doctor
  - compare
- base directory structure
- Vitest
- lint/typecheck/build scripts
- initial CI
- MIT or chosen OSS license
- minimal README

## Initial command behavior

Only `help` must be fully functional.

Other commands may return a clear:

```text
Not implemented in v0.1.0
```

rather than pretending to work.

## Tests

- CLI starts
- `openprompting help` exits 0
- unknown command exits non-zero
- package can build
- packaged executable resolves

## Acceptance criteria

```text
pnpm install
pnpm test
pnpm build
```

all pass from a clean checkout.

A locally packed installation can run:

```text
openprompting help
```

## Non-goals

- real knowledge parsing
- setup wizard
- prompt generation
- doctor logic
