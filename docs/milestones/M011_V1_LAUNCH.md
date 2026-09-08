# M011 — V1 Launch

**Target:** `v1.0.0`

## Goal

Publish the first stable release of openPrompting.

## V1 required capabilities

- installable `openprompting` CLI
- local/offline normal operation
- source-backed model/harness/task knowledge
- schema-validated knowledge
- one or more setups
- mixed-model profiles
- task routing
- `help`
- `setup`
- `guide`
- `new`
- `doctor`
- `compare`
- contributor documentation
- stable config schema v1
- release-tested package

## Final gates

```text
lint         PASS
typecheck    PASS
tests        PASS
build        PASS
package      PASS
clean install PASS
knowledge validation PASS
README examples PASS
```

All shipped model/harness guidance must meet the source-quality contract.

## Launch checklist

- tag `v1.0.0`
- publish release notes
- publish package if a package registry is part of distribution
- create GitHub release
- verify README installation instructions
- verify license
- verify issue/PR templates
- verify repository topics/description
- create first post-V1 tracking issue

## Definition of done

V1 is done when a user can:

1. install openPrompting
2. configure a mixed-model stack
3. learn how a selected model/harness setup should be approached
4. generate a task-appropriate prompt skeleton
5. inspect setup health
6. compare configured profiles
7. understand the evidence behind guidance

without an account, hosted service, API key, or model call.
