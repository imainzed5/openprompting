# openPrompting — V1 Roadmap

This roadmap takes **openPrompting** from an empty repository to `v1.0.0`.

## Product definition

> **openPrompting is a source-backed, open-source field guide and lightweight CLI for working with AI models, harnesses, and recurring task types.**

The project separates:

- **Model guidance** — behavior and prompting recommendations that belong to a model/model family.
- **Harness guidance** — behavior that belongs to a tool such as Codex, Claude Code, or Gemini CLI.
- **Task guidance** — reusable structure for common jobs such as feature work, debugging, review, refactoring, and UI work.
- **Profiles** — user-defined combinations of a model and harness, optionally used as defaults for particular tasks.

The core mental model is:

```text
MODEL + HARNESS = SETUP
SETUP + ROLE = PROFILE
PROFILE + TASK = RESOLVED GUIDANCE
```

## V1 principles

1. **Docs-first.** Most value lives in Markdown/YAML knowledge, not application code.
2. **Local-first and offline-capable.** No account, backend, API key, or model call is required.
3. **Source-backed.** Guidance should distinguish official, tested, community, and legacy evidence.
4. **Harness-aware.** Never attribute harness behavior to the underlying model.
5. **Multi-model by default.** Users may configure several model + harness combinations.
6. **Deterministic core.** The CLI resolves known content; it does not secretly call an LLM.
7. **Easy to contribute.** Adding a model, harness, or task should normally mean adding data/docs, not changing CLI code.
8. **Small surface area.** V1 ships only commands that directly support the core experience.

## V1 command surface

```text
openprompting help
openprompting setup
openprompting guide
openprompting new <task>
openprompting doctor
openprompting compare
```

Slash-style forms such as `/setup` and `/guide` are a conceptual UX used in documentation. The terminal CLI uses normal subcommands. Native slash-command adapters for individual harnesses are post-V1 work.

## V1 non-goals

V1 does **not** include:

- a website or web dashboard
- authentication
- database/storage service
- API keys
- hosted prompt generation
- built-in LLM calls
- automatic agent execution
- automatic editing of arbitrary repository code
- telemetry by default
- workflow orchestration across multiple harnesses
- `/optimize`, `/explain`, or `/handoff`
- a plugin marketplace
- model benchmarking or unsupported “best model” rankings

## Milestone order

| Milestone | Target | Outcome |
|---|---|---|
| M000 | Planning | Product and contracts locked |
| M001 | v0.1.0 | Runnable CLI + repository skeleton |
| M002 | v0.2.0 | Validated knowledge system |
| M003 | v0.3.0 | Multi-model setup/configuration |
| M004 | v0.4.0 | Model + harness guide resolution |
| M005 | v0.5.0 | Task prompt/template generation |
| M006 | v0.6.0 | Local setup doctor |
| M007 | v0.7.0 | Evidence-aware comparison |
| M008 | v0.8.0 | Profiles/default task routing hardened |
| M009 | v0.9.0 | Contributor/source-quality system |
| M010 | v1.0.0-rc.1 | Release candidate and packaging |
| M011 | v1.0.0 | Stable V1 release |

Read the specification files in numeric order, then implement milestones sequentially.
