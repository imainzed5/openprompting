# V1 launch checklist

## Proven by `pnpm release:check`

- [x] Version and executable metadata are `1.0.0` and `openprompting`.
- [x] Lint, typecheck, tests, build, and knowledge validation pass.
- [x] README contains the exact required command journey.
- [x] Package allowlist contains runtime resources and user docs but excludes source, tests, CI, and planning files.
- [x] Packed artifact installs into an isolated consumer and runs all six commands.
- [x] Initial OpenAI, Anthropic, and Google model/harness coverage validates.
- [x] Config schema v1 and evidence vocabulary are documented as frozen.
- [x] License, contributor guide, issue templates, PR template, changelog, migration notes, and release notes exist.
- [x] `v1.0.0-rc.1` tag and GitHub prerelease were created after green CI.
- [x] The immutable RC tag passed the full six-job matrix (run 34205762271).

## Platform evidence

| Platform | Evidence | Status |
| --- | --- | --- |
| Windows | Local Node 24 plus GitHub Actions on Node 20 and 22 | PASS |
| Linux | GitHub Actions on Node 20 and 22, stable tag run 34206210585 | PASS |
| macOS | GitHub Actions on Node 20 and 22, stable tag run 34206210585 | PASS |

The cross-platform release gate passed for the RC tag, stable commit, and stable tag on 2026-09-08.

## Maintainer publication actions — complete

These external launch actions were verified on 2026-09-08:

- [x] Confirm the public repository description and topics.
- [x] Create and push the annotated `v1.0.0` tag from the approved release commit.
- [x] Publish `openprompting@1.0.0` publicly to npm with the `latest` tag.
- [x] Create the GitHub release using `RELEASE_NOTES_1.0.0.md` and attach the package artifact.
- [x] Run the installed CLI and programmatic API checks against the public npm artifact.
- [x] Open the first tracking issue from the repository's post-V1 backlog.
