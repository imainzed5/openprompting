# Repository Architecture

## Minimal V1 structure

```text
openprompting/
├── README.md
├── LICENSE
├── CONTRIBUTING.md
├── package.json
├── tsconfig.json
├── vitest.config.ts
│
├── docs/
│   ├── concepts/
│   └── commands/
│
├── knowledge/
│   ├── models/
│   ├── harnesses/
│   └── tasks/
│
├── templates/
│   ├── feature.md
│   ├── bug.md
│   ├── review.md
│   ├── refactor.md
│   └── ui.md
│
├── schemas/
│   ├── config.schema.json
│   ├── model.schema.json
│   ├── harness.schema.json
│   └── task.schema.json
│
├── src/
│   ├── cli.ts
│   ├── commands/
│   ├── config/
│   ├── knowledge/
│   ├── resolver/
│   └── utils/
│
├── tests/
│   ├── commands/
│   ├── config/
│   ├── knowledge/
│   ├── resolver/
│   └── fixtures/
│
└── examples/
    └── openprompting.yml
```

## Suggested implementation stack

Keep dependencies boring and replaceable.

- **Runtime:** Node.js 20+
- **Language:** TypeScript
- **Package manager:** pnpm preferred, npm-compatible package metadata
- **CLI routing:** Commander or an equivalently small CLI library
- **Interactive setup:** `@clack/prompts` or equivalent
- **YAML:** `yaml`
- **Markdown frontmatter:** `gray-matter`
- **Schema validation:** AJV using JSON Schema
- **Tests:** Vitest
- **Build:** tsup or plain `tsc` if sufficient

Avoid adding frameworks.

## Architectural boundaries

### `knowledge/`

Canonical project-maintained knowledge.

No CLI implementation logic belongs here.

### `templates/`

Task prompt skeletons. Keep them mostly model-independent.

### `schemas/`

Machine-readable contracts for config and knowledge metadata.

### `src/config/`

Reads, validates, resolves, and writes `.openprompting/config.yml`.

### `src/knowledge/`

Discovers, parses, validates, and indexes knowledge entries.

### `src/resolver/`

Combines config + model + harness + task + template.

This is the heart of the project.

### `src/commands/`

Thin UI/controller layer. Commands should call shared services and render results.

### `tests/`

Test behavior and contracts, not subjective prose.

## Dependency direction

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

Lower layers must not import command code.

## Key extensibility rule

> Adding a new model, harness, or task should normally require zero changes to the command router.

If a new knowledge entry forces changes across several source files, the data model is too coupled.
