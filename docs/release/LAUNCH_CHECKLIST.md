# V1.1 launch checklist

## Proven by `pnpm release:check`

- [x] Version and executable metadata are `1.1.0` and `openprompting`.
- [x] Lint, typecheck, tests, build, knowledge validation, README verification, package dry-run, and package verification pass.
- [x] README contains the exact required command journey.
- [x] Package allowlist contains runtime resources and user docs but excludes source, tests, CI, and planning files.
- [x] Packed artifact installs into an isolated consumer and runs the original and expanded catalog journeys.
- [x] The package contains 5 models, 7 harnesses, 9 tasks, and a matching template for every active task.
- [x] Config schema v1, evidence vocabulary, executable, command names, and V1 seed IDs remain stable.
- [x] License, contributor guide, issue templates, PR template, changelog, migration notes, and 1.1.0 release notes exist.
- [x] The repository preserves the Windows, Ubuntu, and macOS CI matrix on Node 20 and 22.

## External publication — not performed by this task

- [ ] Create and push the annotated `v1.1.0` tag after CI passes.
- [ ] Publish `openprompting@1.1.0` to npm.
- [ ] Create the GitHub release using `RELEASE_NOTES_1.1.0.md`.

## Local platform evidence

| Platform | Evidence | Status |
| --- | --- | --- |
| Windows | Local Node environment; CI matrix configured for Node 20 and 22 | PASS locally / CI pending |
| Linux | CI matrix configured for Node 20 and 22 | CI pending |
| macOS | CI matrix configured for Node 20 and 22 | CI pending |

Cross-platform CI remains a required external release gate; this local task does not claim to have run or published it.
