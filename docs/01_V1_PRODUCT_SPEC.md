# V1 Product Specification

## Problem

Prompting guidance is fragmented across model-provider documentation, harness documentation, examples, community advice, and outdated prompt-engineering material. Users also frequently mix up what belongs to a **model** with what belongs to the **harness** around it.

openPrompting provides a small, inspectable layer that answers:

- What does this model need from me?
- What does this harness already know or do?
- What information does this task require?
- Which configured model/harness profile should I use?
- Where did this recommendation come from?
- Is my local prompting/agent setup healthy?

## Primary users

### 1. Single-model developer

Uses one primary setup, for example:

```text
GPT model + Codex
```

Wants quick task templates and concise prompting guidance.

### 2. Mixed-model developer

Uses several setups, for example:

```text
builder  -> GPT + Codex
reviewer -> Claude + Claude Code
designer -> Gemini + Gemini CLI
```

Wants profile-based guidance and task routing.

### 3. Contributor

Wants to add or update a model, harness, task guide, source, or template without needing to understand the entire CLI implementation.

## V1 user journeys

### First run

```text
openprompting setup
```

The user selects one or more model/harness setups, names optional profiles, chooses a default, optionally maps tasks to profiles, and receives a local `.openprompting/config.yml`.

### Learn a setup

```text
openprompting guide
openprompting guide --profile reviewer
openprompting guide codex
```

openPrompting resolves and displays relevant model, harness, and task-independent guidance with evidence labels and source references.

### Create a task prompt

```text
openprompting new feature
openprompting new bug --profile builder
openprompting new review --profile reviewer
```

The user receives a structured prompt skeleton appropriate to the task and resolved setup.

V1 generates structured guidance/templates. It does not ask an LLM to invent project details.

### Check the local setup

```text
openprompting doctor
```

openPrompting validates its own config, knowledge compatibility, known instruction files, project scripts, and guidance freshness.

### Compare

```text
openprompting compare builder reviewer
```

openPrompting compares documented characteristics and user-defined roles without declaring an unsupported universal winner.

## V1 initial supported knowledge

V1 should launch with a small set of well-maintained entries rather than broad but shallow coverage.

Suggested initial scope:

### Model families

- one current OpenAI coding/general model entry
- one current Anthropic Claude model/family entry
- one current Google Gemini model/family entry

Exact model IDs must be verified when knowledge is authored.

### Harnesses

- Codex
- Claude Code
- Gemini CLI

### Tasks

- feature
- bug
- review
- refactor
- ui

## UX rules

- Unknown identifiers fail clearly and show nearby valid choices.
- Interactive setup is optional; direct flags/config editing remain possible.
- Every mutating action should state what file it will create or change.
- `doctor` is read-only in V1.
- `compare` should clearly distinguish facts, recommendations, and user preferences.
- No command should require internet access for normal operation.
