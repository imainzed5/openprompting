# openPrompting 1.1.0

openPrompting 1.1.0 expands the source-backed catalog while keeping the V1 local CLI and configuration contracts stable.

## Highlights

- Added sourced model guidance for OpenAI GPT-5.3-Codex and Anthropic Claude Opus 5.
- Added harness guidance for Cursor, GitHub Copilot CLI, OpenCode, and Aider, with model behavior kept separate from harness behavior.
- Added planning, research, testing, and migration task recipes with matching deterministic templates.
- Added task/template integrity validation, dynamic catalog checks, and packed-package journeys for every active task.
- Added optional `display_name` metadata so setup, guide, and compare output can be easier to scan without changing stable IDs.
- Deepened current GPT-6 Astra, Claude Sonnet 5, and Gemini 3.8 Flash guidance from first-party documentation.

## Compatibility

The executable remains `openprompting`, and the command surface remains `help`, `setup`, `guide`, `new`, `doctor`, and `compare`. Configuration continues to use `version: 1`; existing V1 configuration values and IDs resolve unchanged. The evidence vocabulary remains `official`, `tested`, `community`, and `legacy`.

## Validation

The release gate covers lint, type checking, the full test suite, build, knowledge validation, README verification, package dry-run, and installation of the packed artifact into an isolated consumer. The packed consumer exercises the original V1 journey, new model and harness selectors, and both default and explicit-profile rendering for every active task.

## Operation and privacy

Normal CLI operation remains local and deterministic. This release adds no runtime model calls, telemetry, hosted backend, workflow execution, or automatic network access.

## Deferred

Remote knowledge updates, native harness adapters, handoffs and workflows, prompt optimization, hosted documentation, benchmarking, and additional harnesses remain outside this release.
