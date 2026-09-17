# V1.1 Testing and Release Gates

## Core regression gates

Before release:

```text
lint
typecheck
test
build
knowledge validation
README verification
package verification
release check
```

## Required V1 compatibility tests

Verify:

- executable remains `openprompting`,
- command names remain unchanged,
- config schema remains `version: 1`,
- existing V1 configs remain valid,
- evidence vocabulary remains unchanged,
- original V1 model/harness/task IDs remain available,
- runtime source remains free of network clients for normal CLI operation.

## Catalog tests

Verify:

- all knowledge metadata validates,
- all source references resolve,
- all active tasks have templates,
- no orphan task templates exist,
- all active tasks render deterministically,
- new models/harnesses appear in setup choices,
- new tasks appear in task routing,
- display-name fallback works.

## New task journey

For each of:

```text
planning
research
testing
migration
```

verify:

```text
openprompting new <task>
openprompting new <task> --profile <valid-profile>
```

## Package verification

Packed artifact must contain:

- dist,
- knowledge,
- templates,
- schemas,
- required docs.

Install the tarball into an isolated consumer directory and run representative commands.

## Cross-platform CI

Preserve:

- Windows
- Ubuntu
- macOS

and supported Node versions already present in CI.

## Release version

Target:

```text
1.1.0
```

## Release blockers

Block release for:

- invalid source claims discovered during implementation,
- broken V1 config compatibility,
- missing task templates,
- hard-coded catalog assumptions,
- package omissions,
- cross-platform failures,
- README claiming unsupported catalog content.

Do not block release for deferred post-V1 features.
