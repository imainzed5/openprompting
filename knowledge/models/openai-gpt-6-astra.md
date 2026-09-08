---
id: openai-gpt-6-astra
type: model
provider: openai
status: active
last_verified: 2026-09-07
evidence:
  - class: official
    claim: GPT-6 Astra is an OpenAI frontier model intended for complex multistep professional and software-engineering work.
    source: openai-model-guidance
  - class: official
    claim: Prompts can improve control by naming the outcome, success criteria, constraints, and relevant context.
    source: openai-model-guidance
sources:
  - id: openai-model-guidance
    title: Model guidance — GPT-6 Astra
    url: https://developers.openai.com/api/docs/guides/latest-model
    last_checked: 2026-09-07
---

# GPT-6 Astra

## Summary

OpenAI's frontier model for demanding multistep work, including software engineering and tool-supported tasks.

## Recommended

- State the target outcome, acceptance criteria, constraints, and relevant context.
- Specify required output structure and genuine invariants.
- Define when to ask for missing evidence and when the task is complete.

## Avoid

- Prescribing every procedural step when only the result is constrained.
- Leaving success conditions implicit for long-running work.

## Known limitations

Model behavior is nondeterministic. Evaluate guidance against representative work and update it when the official model guidance changes.

## Sources

See the source records in frontmatter.
