---
id: google-gemini-3-8-flash
display_name: Gemini 3.8 Flash
type: model
provider: google
status: active
last_verified: 2026-09-17
evidence:
  - class: official
    claim: Gemini 3.8 Flash is a stable Google model for long-horizon software engineering, autonomous agents, and complex enterprise workflows, with model ID gemini-3.8-flash.
    source: google-gemini-models
  - class: official
    claim: A specific stable model identifier is preferable when callers need behavior that does not move with a latest alias.
    source: google-gemini-models
  - class: official
    claim: Gemini 3.8 Flash supports low, medium, and high thinking levels, with medium as the default and minimal unsupported.
    source: google-gemini-3-8-flash
  - class: official
    claim: Gemini 3.8 Flash can use iterative tool calls and work verification on longer, more complex tasks, and the model documentation recommends adjusting thinking effort to the workload.
    source: google-gemini-3-8-flash
sources:
  - id: google-gemini-models
    title: Gemini API models
    url: https://ai.google.dev/gemini-api/docs/models
    last_checked: 2026-09-17
  - id: google-gemini-3-8-flash
    title: What's new in Gemini 3.8 Flash
    url: https://ai.google.dev/gemini-api/docs/latest-model
    last_checked: 2026-09-17
---

# Gemini 3.8 Flash

## Summary

Google's stable Gemini 3.8 Flash model for coding, agentic, and complex multistep work. These notes describe model behavior, not Gemini CLI behavior.

## Recommended

- State the outcome, constraints, relevant project context, and completion checks.
- Break long-horizon work into verifiable deliverables and provide the tools or files needed to verify them; the model may take iterative reasoning and verification steps on complex work.
- When the calling surface exposes thinking levels, use medium for most complex coding or agentic work, high for difficult multi-step reasoning, and low for latency-sensitive tasks.
- Use the exact stable model identifier when reproducibility matters more than automatically following a moving alias.

## Avoid

- Assuming a `latest` alias remains pinned to one model version.
- Treating broad model-family claims as guarantees for a particular workload.
- Treating iterative tool use or verification as a substitute for explicit acceptance criteria and validation commands.

## Known limitations

The `minimal` thinking level is unsupported for Gemini 3.8 Flash. Availability, quotas, tool capabilities, and behavior can vary by product and access tier; validate important workflows against the exact endpoint and harness in use.

## Sources

See the source records in frontmatter.
