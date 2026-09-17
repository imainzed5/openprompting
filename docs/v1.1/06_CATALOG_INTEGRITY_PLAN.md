# Catalog Integrity Plan

The purpose of this work is to make additive knowledge growth safe.

## 1. Preserve V1 seed entries without freezing catalog size

Update release-contract tests so they no longer require exact catalog equality.

The original V1 entries must remain available.

### Models

```text
openai-gpt-6-astra
anthropic-claude-sonnet-5
google-gemini-3-8-flash
```

### Harnesses

```text
codex
claude-code
gemini-cli
```

### Tasks

```text
feature
bug
review
refactor
ui
```

Additional compatible entries must be allowed.

## 2. Validate task ↔ template completeness

Add validation ensuring:

```text
every active task -> templates/<task>.md exists
every task template -> corresponding known task exists
```

Decide explicitly how `legacy` tasks should behave.

Default recommendation:

- active tasks require templates,
- orphan templates are invalid,
- legacy tasks may retain templates only when intentionally supported.

## 3. Dynamic prompt-render tests

Replace manually enumerated task render tests with iteration over the loaded active task catalog.

For every active task:

- `resolveTask()` succeeds for a valid config,
- `loadTemplate()` succeeds,
- `renderTaskPrompt()` succeeds,
- output identifies the task,
- output contains visible placeholders,
- repeated rendering is deterministic.

## 4. Package completeness

Strengthen package verification so catalog additions cannot be accidentally omitted.

At minimum verify that packed output includes:

```text
knowledge/models/
knowledge/harnesses/
knowledge/tasks/
templates/
schemas/
```

Prefer checking all active task templates.

Avoid making package tests brittle to every new model filename unless the invariant can be expressed cleanly.

## 5. Contributor correctness

Update contribution docs.

### Model/harness

Normally:

```text
one knowledge entry
```

### Task

Normally:

```text
one knowledge entry
+ one matching template
```

## 6. Preserve source integrity

Continue validating:

- globally unique IDs,
- valid frontmatter,
- valid source references,
- supported evidence classes,
- source requirement for non-tested evidence,
- reproduction procedure for tested evidence.

## 7. No catalog-size assertions

Do not add tests like:

```text
expect(models.size).toBe(5)
```

Prefer invariants such as:

```text
required seed entries exist
all active entries validate
all active tasks render
```

## Acceptance criteria

Catalog integrity is ready when a contributor can add a valid new:

- model,
- harness,
- task + template,

and the system automatically includes it without router/resolver edits or manual test-list updates.
