# Phase A — Foundation Goal Prompt

## Covers

- `M000_PRODUCT_CONTRACT.md`
- `M001_REPOSITORY_FOUNDATION.md`
- `M002_KNOWLEDGE_CONTRACT.md`

## Goal

Establish the smallest correct foundation for **openPrompting** before building user-facing behavior.

By the end of this phase, the repository must be installable, testable, structurally sound, and capable of loading and validating machine-readable knowledge entries without hard-coding models, harnesses, or tasks into the CLI.

## Canonical specifications

Read and obey these before implementation:

- `../00_START_HERE.md`
- `../01_V1_PRODUCT_SPEC.md`
- `../02_REPOSITORY_ARCHITECTURE.md`
- `../03_COMMAND_CONTRACT.md`
- `../04_CONFIG_AND_DATA_SCHEMA.md`
- `../05_KNOWLEDGE_AND_SOURCING.md`
- `../06_TESTING_AND_RELEASE_GATES.md`
- `../07_VERSIONING_CONTRIBUTION_AND_GOVERNANCE.md`

Then implement the three Phase A milestones in order.

## Implementation prompt

Implement **Phase A — Foundation** for openPrompting.

Treat the planning files above as the product contract. Do not redesign the product unless implementation reveals a direct contradiction or an impossible requirement. If a small implementation detail is unspecified, choose the simplest option consistent with the V1 principles.

### Required outcomes

1. Create the minimal TypeScript/Node repository and package structure.
2. Expose a working `openprompting` CLI executable.
3. Implement a stable command router for:
   - `help`
   - `setup`
   - `guide`
   - `new`
   - `doctor`
   - `compare`
4. Only `help` needs full product behavior in the first foundation milestone; unfinished commands must fail or report clearly rather than pretending to work.
5. Add the initial repository architecture:
   - `knowledge/`
   - `templates/`
   - `schemas/`
   - `src/`
   - `tests/`
   - relevant docs/examples
6. Define and implement the machine-readable knowledge contract.
7. Add JSON Schema validation for model, harness, and task entries.
8. Parse Markdown frontmatter and build a reusable knowledge index.
9. Detect malformed metadata, duplicate IDs, unsupported evidence classes, and invalid knowledge types.
10. Add at least the minimum knowledge fixtures/entries required by M002.
11. Ensure new models, harnesses, or tasks can normally be added without editing the CLI router.
12. Add focused tests and CI for the foundation.

### Architectural constraints

Keep the dependency direction clean:

```text
commands
   |
   v
resolver --------> config
   |
   +-------------> knowledge
   |
   +-------------> templates
```

Do not put model/harness-specific rules inside command implementations.

Do not add:

- a backend
- auth
- database
- LLM/API calls
- website
- telemetry
- workflow execution
- native harness slash-command adapters

### Quality bar

The repository should remain intentionally small.

Prefer boring, standard dependencies and clear modules over framework-heavy abstractions.

Knowledge is data/content. CLI commands are thin controllers. Shared behavior belongs in reusable core modules.

### Validation

At minimum, all of the following must pass from a clean checkout:

```text
install
lint
typecheck
test
build
package dry-run or equivalent
```

Also verify:

- `openprompting help` runs successfully
- an unknown command fails clearly
- valid knowledge files load
- invalid knowledge files fail validation
- duplicate IDs fail
- adding a new valid knowledge entry does not require command-router changes

## Stop condition

Stop Phase A when:

- M000, M001, and M002 acceptance criteria are satisfied;
- the repo is runnable and testable;
- the knowledge system is validated and extensible;
- no Phase B user workflow has been prematurely implemented beyond harmless scaffolding.

Do not continue into setup/config behavior until the Phase A gates are green.

## Deliverable summary

At completion, report:

- files/modules added
- important architectural decisions
- validation results
- known limitations
- any contract ambiguities discovered
- exact readiness for Phase B
