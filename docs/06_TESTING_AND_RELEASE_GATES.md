# Testing Strategy and Release Gates

openPrompting is small enough that tests should remain focused.

## Unit tests

### Config

- valid config parses
- invalid schema fails
- unknown config version fails
- missing setup/profile references fail
- task profile overrides resolve correctly

### Knowledge

- frontmatter parses
- required metadata is enforced
- invalid evidence values fail
- duplicate IDs fail
- missing referenced knowledge fails clearly

### Resolver

- default profile resolution
- explicit profile override
- single-setup fallback
- task-specific profile routing
- model + harness + task composition
- unknown task error
- deterministic output

## CLI tests

At minimum:

```text
openprompting help
openprompting setup --help
openprompting guide --help
openprompting new --help
openprompting doctor --help
openprompting compare --help
```

Add smoke/integration fixtures for:

- fresh repo with no config
- single-model config
- mixed-model config
- broken config
- missing knowledge
- stale knowledge

## Snapshot tests

Use snapshots sparingly.

Good candidates:

- deterministic rendered prompt skeletons
- concise command output sections

Avoid snapshotting entire long knowledge documents.

## Static gates

Before release:

```text
lint
typecheck
test
build
package dry-run
```

## Knowledge gates

Before release:

- every shipped model/harness entry validates
- no duplicate IDs
- all required sources are present
- no `last_verified` field is missing
- no V1 knowledge file uses unsupported evidence classes

## Package gates

Before stable release:

- executable works after packed installation
- package contains knowledge/templates/schemas
- package excludes repository-only junk
- README quickstart matches real CLI syntax
- Node engine requirement is accurate
- clean install works on at least Linux and Windows; macOS where available

## Release policy

No milestone is complete just because code exists.

A milestone completes only when:

1. acceptance criteria pass
2. tests for the new behavior exist
3. docs reflect the actual behavior
4. no planned V1 contract is knowingly contradicted
