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

## Platform evidence

| Platform | Evidence | Status |
| --- | --- | --- |
| Windows | Local Node 24 plus GitHub Actions on Node 20 and 22 | PASS |
| Linux | GitHub Actions on Node 20 and 22, run 34205284548 | PASS |
| macOS | GitHub Actions on Node 20 and 22, run 34205284548 | PASS |

The cross-platform release gate passed on 2026-09-08. Repeat it for the RC commit and stable promotion.

## Maintainer publication actions

These actions require the destination repository and registry credentials and are intentionally not performed by local validation:

- [ ] Confirm the public repository description and topics.
- [ ] Create and push the signed or annotated `v1.0.0` tag from the approved release commit.
- [ ] Publish the npm package if npm is the selected registry.
- [ ] Create the GitHub release using `RELEASE_NOTES_1.0.0.md`.
- [ ] Run the installed quickstart once against the published registry artifact.
- [ ] Open the first tracking issue from the repository's post-V1 backlog.
