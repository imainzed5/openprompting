# Versioning, Contribution, and Governance

## Versioning

Use semantic versioning.

Before V1:

```text
v0.1.0 ... v0.9.0
v1.0.0-rc.1
v1.0.0
```

Breaking CLI/config changes are acceptable before `v1.0.0`, but should still be documented.

At V1, stabilize:

- executable name
- core command names
- config version 1
- knowledge evidence vocabulary
- primary directory contracts

## Changelog

Start `CHANGELOG.md` no later than M009.

Each release should note:

- added
- changed
- fixed
- deprecated
- knowledge updates

Knowledge-only releases are valid.

## Contribution types

Encourage focused PRs:

- model guide update
- harness guide update
- task recipe
- source correction
- CLI bug
- schema/test improvement

## Pull request expectations

Knowledge PRs should answer:

```text
What changed?
Why?
What is the evidence?
When was it verified?
Does this replace older guidance?
```

Code PRs should include tests where behavior changes.

## Governance for disputed advice

When maintainers disagree:

1. prefer official evidence
2. narrow the claim
3. downgrade evidence classification if necessary
4. document uncertainty
5. avoid presenting preference as fact

## Security

V1 reads local project files and writes only its own config during setup.

Security expectations:

- do not execute project scripts in `doctor` by default
- inspect script names/text only
- never transmit local file contents
- do not collect telemetry by default
- validate paths before writes
- avoid following unsafe symlink paths when creating config
