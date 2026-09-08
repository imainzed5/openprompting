# M010 — V1 Release Candidate

**Target:** `v1.0.0-rc.1`

## Goal

Freeze the intended V1 contracts and validate the package as users will install it.

## Deliverables

- CLI contract freeze
- config schema v1 freeze
- evidence vocabulary freeze
- package metadata finalized
- package contents audited
- clean-install testing
- Windows/Linux validation
- macOS validation when available
- README rewritten around real V1 UX
- migration notes from pre-V1 versions
- release notes draft

## Required end-to-end scenarios

### Scenario A — beginner

```text
install
openprompting setup
openprompting guide
openprompting new feature
openprompting doctor
```

### Scenario B — mixed-model

```text
setup builder
setup reviewer
route review -> reviewer
new feature
new review
compare builder reviewer
doctor
```

### Scenario C — contributor

```text
add knowledge entry
validate
test
build
```

## Release gate

No new feature work after RC unless required to fix a release-blocking issue.

Non-blocking ideas move to post-V1 backlog.
