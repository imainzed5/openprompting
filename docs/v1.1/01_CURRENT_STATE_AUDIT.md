# Current State Audit

This audit is based on the released `v1.0.0` repository state.

## Existing catalog

### Models

- `openai-gpt-6-astra`
- `anthropic-claude-sonnet-5`
- `google-gemini-3-8-flash`

### Harnesses

- `codex`
- `claude-code`
- `gemini-cli`

### Tasks

- `feature`
- `bug`
- `review`
- `refactor`
- `ui`

### Templates

One template currently exists for each of the five task IDs.

## What is already working well

The current architecture is properly data-driven:

- setup choices are derived from loaded knowledge,
- task routing is derived from loaded task IDs,
- `resolveTask()` accepts task IDs from the knowledge index,
- `loadTemplate(taskId)` resolves templates by task ID,
- models/harnesses/tasks can be added without editing the CLI router,
- config validation checks model/harness/task references against the knowledge index.

This means V1.1 does **not** need a new resolver architecture.

## Audit findings to fix before catalog expansion

### 1. Frozen V1 tests over-assert the seed catalog

`tests/release/contracts.test.ts` currently checks equality against exactly:

```text
3 models
3 harnesses
5 tasks
```

That was useful for V1 release freezing, but it will incorrectly fail when compatible new knowledge is added.

V1.1 should preserve the original V1 entries while allowing additive catalog growth.

Replace exact-catalog equality with invariants such as:

- all original V1 IDs are still present,
- stable command/config/evidence contracts remain unchanged,
- all active entries satisfy required sections and metadata,
- no universal-winner claims are introduced.

### 2. Task contributions require more than one file

`CONTRIBUTING.md` currently says that adding a model, harness, or task normally requires one knowledge file.

For tasks, this is incomplete.

An active task used by `openprompting new <task>` requires:

```text
knowledge/tasks/<task>.md
templates/<task>.md
```

Contributor guidance must state this explicitly.

### 3. Task ↔ template completeness is not validated centrally

`validate:knowledge` validates knowledge metadata, but does not guarantee that:

- every active task has a matching template,
- every task template maps to a valid task.

V1.1 should add a catalog-integrity check for this relationship.

### 4. Prompt tests enumerate V1 task IDs manually

`tests/resolver/prompt.test.ts` currently loops over the five V1 tasks explicitly.

V1.1 should dynamically verify that every active task:

- resolves,
- has a loadable template,
- renders a prompt,
- exposes obvious placeholders,
- remains deterministic.

### 5. Package verification uses representative catalog files

`scripts/verify-package.ts` currently checks a representative set of knowledge/template files.

That is sufficient for the frozen V1 package, but V1.1 should make catalog packaging checks more systematic where practical.

At minimum, verify that all active task templates and all catalog directories ship in the packed artifact.

## Existing guide depth

The three model guides are valid but intentionally compact.

V1.1 should deepen them before or alongside adding more models.

The goal is not more prose for its own sake. Add only model-specific guidance that is:

- sourceable,
- practically useful,
- meaningfully different from generic prompting advice.

## Conclusion

The engine is healthy.

The next release should focus on:

```text
catalog integrity first
→ deepen current entries
→ add sourced catalog entries
→ add new task recipes
→ documentation/release polish
```
