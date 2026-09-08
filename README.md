# openPrompting

openPrompting is a source-backed, local-first CLI for understanding AI models, coding harnesses, and recurring task types. It runs deterministically without an account, API key, hosted service, telemetry, or model call.

## Install

Node.js 20 or newer is required.

```sh
npm install --global openprompting
openprompting --version
```

The package is npm-compatible; pnpm users may use `pnpm add --global openprompting`.

## Start here

In a project directory, run the interactive setup wizard. It previews the exact YAML and destination before writing `.openprompting/config.yml`.

```sh
openprompting setup
openprompting guide
openprompting new feature
openprompting doctor
openprompting compare builder reviewer
```

The compare example assumes profiles named `builder` and `reviewer`; the configuration below creates them. Normal commands do not access the network. Setup is the only V1 command that writes project state, and `doctor` is read-only.

## Configure mixed-model work

The wizard supports multiple model/harness setups, named profiles, a default profile, and task routes. The resulting config schema is version 1:

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

Validate a hand-edited config without changing it:

```sh
openprompting setup --check
```

Task selection uses explicit `--profile`, then a task route, then the default profile, then the sole configured setup when exactly one exists.

## Learn and create

View guidance for the configured default, a profile, or a specific knowledge entry:

```sh
openprompting guide
openprompting guide --profile reviewer
openprompting guide --model google-gemini-3-8-flash
openprompting guide --harness gemini-cli
openprompting guide codex
```

Guides identify the resolved model and harness and show recommendations, cautions, evidence class, verification date, and sources.

Generate a copyable prompt skeleton:

```sh
openprompting new feature
openprompting new review --profile reviewer
```

The five V1 tasks are `feature`, `bug`, `review`, `refactor`, and `ui`. Output contains visible placeholders and never fabricates project facts.

## Diagnose and compare

Inspect config, routing, known instruction files, declared package scripts, knowledge validity, and freshness:

```sh
openprompting doctor
openprompting doctor --profile reviewer
```

Doctor reports `PASS`, `INFO`, `WARN`, and `FAIL`. It reads script declarations but never executes project scripts. Warnings alone do not fail the check.

Compare profiles, setups, models, or harnesses:

```sh
openprompting compare builder reviewer
openprompting compare gpt-codex claude-review
openprompting compare openai-gpt-6-astra anthropic-claude-sonnet-5
openprompting compare codex gemini-cli
```

Compare separates user-defined roles and routing from sourced project knowledge, identifies unavailable fields, shows provenance, and never infers a universal winner.

## Supported V1 knowledge

- Models: OpenAI GPT-6 Astra, Anthropic Claude Sonnet 5, Google Gemini 3.8 Flash
- Harnesses: Codex, Claude Code, Gemini CLI
- Tasks: feature, bug, review, refactor, UI

Knowledge is shipped with the package and validated locally. Each model and harness records evidence, sources, and a verification date. Freshness thresholds are 0–60 days current, 61–120 days review suggested, and 121+ days stale.

## Documentation

- [Command reference](docs/commands/README.md)
- [Models, harnesses, setups, and profiles](docs/concepts/models-harnesses-and-profiles.md)
- [Knowledge and evidence](docs/concepts/knowledge-and-evidence.md)
- [Frozen V1 contracts](docs/release/V1_CONTRACTS.md)
- [Pre-V1 migration](docs/release/MIGRATION.md)
- [Contributing](CONTRIBUTING.md)
- [Changelog](CHANGELOG.md)

## Development and release checks

This repository uses pnpm 11:

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

`verify:package` audits the tarball, installs it into an isolated temporary consumer project, and runs the V1 command journey through the installed artifact. See the [release notes](docs/release/RELEASE_NOTES_1.0.0.md) and [MIT License](LICENSE).
