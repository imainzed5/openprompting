# openPrompting

openPrompting helps developers work more effectively with AI coding agents by providing source-backed guidance for the model, harness, and task they are actually using.

It is a local, deterministic CLI for configuring setups and profiles, generating task-specific prompt skeletons, checking local setup health, and comparing documented model and harness choices. It is for developers using one coding-agent stack, switching among several, or contributing practical knowledge.

Current stable release: [`openprompting@1.0.0`](https://www.npmjs.com/package/openprompting)

> openPrompting is not a collection of “1,000 awesome prompts.” It is a source-backed guidance/configuration layer built around **MODEL + HARNESS + TASK**.

## Quick install

Node.js 20 or newer is required.

```sh
npm install --global openprompting
openprompting --version
```

## Quick start

Run this in a project directory:

```sh
openprompting setup
openprompting guide
openprompting new feature
openprompting doctor
```

- `setup` opens a wizard for model/harness setups, profiles, defaults, and task routes. It previews the YAML and writes `.openprompting/config.yml` only after confirmation.
- `guide` displays guidance for the resolved model and harness, including recommendations, cautions, evidence, and sources.
- `new feature` renders an editable, structured prompt skeleton for feature work.
- `doctor` runs read-only checks for configuration, routing, instruction files, package scripts, knowledge validity, and freshness.

## New to agentic coding?

Traditional AI coding often looks like this:

```text
ask -> receive code -> manually apply
```

In agentic coding, a harness may inspect the repository, read project instructions, modify files, run commands, validate work, and iterate. The exact behavior depends on the harness and its permissions.

A model performs reasoning and generation. A harness provides the environment around that model: repository access, shell tools, instruction files, permissions, and context handling.

```text
MODEL + HARNESS = SETUP
```

Prompting is not about magic words. Useful prompting gives the agent a clear goal, relevant context, requirements, constraints, acceptance criteria, and validation steps.

| Term | Practical meaning |
| --- | --- |
| Model | The provider model whose reasoning and generation you are using. |
| Harness | The coding-agent tool and environment around the model. |
| Setup | One model paired with one harness. |
| Profile | A user-defined name and optional role that points to a setup, such as `builder` or `reviewer`. |
| Task | A recurring job type with its own guidance and template, such as `feature` or `review`. |

openPrompting helps you keep these layers separate, then composes the relevant pieces for a real task.

## The core idea

The same task can need different guidance depending on the model and harness around it:

```text
MODEL
  +
HARNESS
  +
 TASK
  ↓
RELEVANT GUIDANCE
```

For a mixed-model workflow, user-defined profiles might look like this:

```text
builder  -> OpenAI GPT-6 Astra + Codex
reviewer -> Anthropic Claude Sonnet 5 + Claude Code
designer -> Google Gemini 3.8 Flash + Gemini CLI
```

These are routing labels chosen by the user. They do not imply that one model is objectively best for a particular role.

## Mixed-model configuration

The following is a valid V1 `.openprompting/config.yml`:

```yaml
version: 1

setups:
  gpt-codex:
    model: openai-gpt-6-astra
    harness: codex
  claude-review:
    model: anthropic-claude-sonnet-5
    harness: claude-code
  gemini-design:
    model: google-gemini-3-8-flash
    harness: gemini-cli

profiles:
  builder:
    uses: gpt-codex
    role: implementation
  reviewer:
    uses: claude-review
    role: review
  designer:
    uses: gemini-design
    role: user-interface design

defaults:
  profile: builder
  tasks:
    review: reviewer
    ui: designer
```

- `setups` pair exactly one model with exactly one harness.
- `profiles` give setups user-facing names and optional descriptive roles.
- `defaults.profile` is the fallback profile.
- `defaults.tasks` routes particular task types to profiles. In this example, `review` uses `reviewer`, `ui` uses `designer`, and other tasks fall back to `builder`.

For `new <task>`, selection is deterministic: explicit `--profile`, then the task route, then the default profile, then the sole configured setup when exactly one exists.

After hand-editing the file, validate it without changing it:

```sh
openprompting setup --check
```

## Commands

V1 ships six commands:

| Command | Purpose | Example |
| --- | --- | --- |
| `help` | Show the command list and common examples. | `openprompting help` |
| `setup` | Create or update `.openprompting/config.yml`; `--check` validates it. | `openprompting setup` |
| `guide` | Display resolved model and harness guidance. | `openprompting guide --profile reviewer` |
| `new` | Render a deterministic prompt skeleton for a task. | `openprompting new review --profile reviewer` |
| `doctor` | Run read-only local diagnostics. | `openprompting doctor --profile reviewer` |
| `compare` | Compare two profiles, setups, models, or harnesses using documented evidence. | `openprompting compare builder reviewer` |

See the [full command reference](docs/commands/README.md) for selectors, resolution rules, output, and exit behavior.

## Prompt generation

```sh
openprompting new feature
```

This command generates a structured starting point from the task guidance, the resolved model and harness recommendations, and the matching V1 template. It does not ask a model to write the final prompt. The output is editable: add the project context, requirements, constraints, acceptance criteria, and validation steps that are specific to your work.

Supported V1 tasks:

- `feature`
- `bug`
- `review`
- `refactor`
- `ui`

Generated output uses placeholders rather than inventing project facts.

## Source-backed guidance and trust

Every model, harness, and task entry carries evidence and source metadata. The V1 evidence classes are:

| Class | Meaning |
| --- | --- |
| `official` | Directly supported by first-party provider or harness documentation. |
| `tested` | Reproduced by maintainers with a procedure recorded in the entry. |
| `community` | Useful practice without first-party confirmation. |
| `legacy` | Historical or migration advice that is not a current default. |

Sources record an HTTPS URL and when it was last checked. Entries also record `last_verified`; `doctor` uses it as a maintenance signal:

- 0–60 days: current
- 61–120 days: review suggested
- 121+ days: stale

Freshness is a prompt to review an entry, not a correctness verdict. Guidance also keeps model behavior separate from harness behavior—for example, instruction-file discovery belongs to the harness that implements it.

## Local-first / privacy

After installation, normal V1 command execution is local and deterministic. It requires:

- no account
- no API key
- no model call
- no hosted backend or service
- no telemetry
- no network connection

`setup` is the only V1 command that writes project state, and it writes the project-local `.openprompting/config.yml`. `doctor` is read-only and does not execute project scripts.

## Supported V1 knowledge

The package currently bundles 3 model entries, 3 harness entries, and 5 task entries.

### Models

| Provider | ID | Display name |
| --- | --- | --- |
| OpenAI | `openai-gpt-6-astra` | GPT-6 Astra |
| Anthropic | `anthropic-claude-sonnet-5` | Claude Sonnet 5 |
| Google | `google-gemini-3-8-flash` | Gemini 3.8 Flash |

### Harnesses

| Harness | ID |
| --- | --- |
| Codex | `codex` |
| Claude Code | `claude-code` |
| Gemini CLI | `gemini-cli` |

### Tasks

`feature`, `bug`, `review`, `refactor`, and `ui`.

## Contributing knowledge

Adding and updating knowledge is intentionally accessible. Contributors can usually add or update a Markdown entry in one of these directories without modifying CLI routing:

- `knowledge/models/`
- `knowledge/harnesses/`
- `knowledge/tasks/`

Use the repository's source and evidence rules, record verification dates, and run `pnpm validate:knowledge`. The [contributing guide](CONTRIBUTING.md) explains the entry template, source checks, and pull request expectations.

## Documentation

- [Command reference](docs/commands/README.md)
- [Models, harnesses, setups, and profiles](docs/concepts/models-harnesses-and-profiles.md)
- [Knowledge and evidence](docs/concepts/knowledge-and-evidence.md)
- [V1 contracts](docs/release/V1_CONTRACTS.md)
- [Migration from pre-V1 builds](docs/release/MIGRATION.md)
- [v1.0.0 release notes](docs/release/RELEASE_NOTES_1.0.0.md)
- [Changelog](CHANGELOG.md)
- [Contributing](CONTRIBUTING.md)

## Development

Development requires Node.js 20 or newer and pnpm 10.34.5, or a compatible pnpm 10 release.

```sh
pnpm install --frozen-lockfile
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm validate:knowledge
pnpm verify:readme
pnpm verify:package
```

Run `pnpm release:check` for the full V1 release gate.

## Release

openPrompting v1.0.0 is the first stable release, published as [`openprompting@1.0.0`](https://www.npmjs.com/package/openprompting) on npm. The [V1 contracts](docs/release/V1_CONTRACTS.md) document the stable executable, command surface, config schema, evidence vocabulary, and data directories.

openPrompting is available under the [MIT License](LICENSE).
