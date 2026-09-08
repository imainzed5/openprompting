# V1 Command Contract

The public CLI executable is:

```text
openprompting
```

## `openprompting help`

Purpose: discover commands and common examples.

Requirements:

- available without config
- exits successfully
- includes examples
- does not perform network access

## `openprompting setup`

Purpose: create or update `.openprompting/config.yml`.

V1 responsibilities:

- configure one or more model/harness setups
- optionally create named profiles
- choose default profile
- map supported tasks to profiles
- show planned file changes before writing in interactive mode
- preserve valid unrelated config fields when editing

Suggested forms:

```text
openprompting setup
openprompting setup models
openprompting setup profiles
```

Do not implement a massive subcommand hierarchy unless actual UX requires it.

## `openprompting guide`

Purpose: display resolved knowledge.

Examples:

```text
openprompting guide
openprompting guide --profile builder
openprompting guide --model <id>
openprompting guide --harness <id>
openprompting guide <knowledge-id>
```

Resolution priority when no explicit selector is given:

1. explicit profile flag
2. configured default profile
3. only configured setup if exactly one exists
4. otherwise ask interactively or fail with actionable choices in non-interactive mode

Output should identify:

- resolved model
- resolved harness
- recommendations
- avoid/cautions
- evidence level
- last verified date
- source references

## `openprompting new <task>`

Purpose: render a task prompt skeleton with setup-aware notes.

Supported V1 tasks:

```text
feature
bug
review
refactor
ui
```

Examples:

```text
openprompting new feature
openprompting new review --profile reviewer
```

Resolution:

```text
task
  -> task-specific configured profile, if present
  -> configured default profile
  -> resolved model + harness
  -> task knowledge
  -> task template
  -> rendered output
```

V1 should not fabricate project facts. It may provide placeholders and optional detected local context.

## `openprompting doctor`

Purpose: perform read-only local checks.

Suggested checks:

- config exists and validates
- referenced model/harness IDs exist
- profile references exist
- task routing resolves
- instruction file presence where relevant
- package scripts such as test/lint/build/typecheck if a package.json exists
- current knowledge metadata is valid
- last-verified dates can be surfaced as stale according to a documented policy

Doctor should categorize:

```text
PASS
INFO
WARN
FAIL
```

V1 doctor must never silently modify files.

## `openprompting compare <a> <b>`

Purpose: compare two models, harnesses, setups, or profiles using only structured/documented knowledge.

Rules:

- never invent benchmark superiority
- distinguish incomparable fields
- show evidence level
- show user-defined role/default information separately from project-maintained facts
- support profiles as the best mixed-model comparison UX

## Exit codes

Suggested contract:

```text
0 success
1 command or validation failure
2 invalid user input/config
3 internal/unexpected error
```

Keep exit codes stable once V1 ships.
