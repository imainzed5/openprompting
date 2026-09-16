---
id: openai-gpt-6-astra
type: model
provider: openai
status: active
last_verified: 2026-09-17
evidence:
  - class: official
    claim: GPT-6 Astra is the current OpenAI model documented for complex multistep professional and software-engineering work, with model ID gpt-6-astra.
    source: openai-model-guidance
  - class: official
    claim: Prompts can improve control by naming the outcome, success criteria, constraints, and relevant context.
    source: openai-model-guidance
  - class: official
    claim: GPT-6 Astra is more likely to ask focused questions when missing input could change the outcome and can incorporate changed requirements during ongoing work.
    source: openai-model-guidance
  - class: official
    claim: GPT-6 Astra tends toward detailed formatted responses, may delegate less often than desired, and can test more broadly than a small task requires.
    source: openai-model-guidance
sources:
  - id: openai-model-guidance
    title: Model guidance — GPT-6 Astra
    url: https://developers.openai.com/api/docs/guides/latest-model
    last_checked: 2026-09-17
---

# GPT-6 Astra

## Summary

OpenAI's current model for demanding multistep work, including software engineering and tool-supported tasks. These notes describe model behavior, not Codex behavior.

## Recommended

- State the target outcome, acceptance criteria, constraints, and relevant context.
- Specify required output structure and genuine invariants.
- Define when to ask for missing evidence, when a reasonable assumption is allowed, and when the task is complete.
- If requirements change during a long task, state the new requirement directly and name any invariant that must remain unchanged.
- Define the validation scope explicitly for small tasks; Astra may test more broadly than the task requires.

## Avoid

- Prescribing every procedural step when only the result is constrained.
- Leaving success conditions implicit for long-running work.
- Assuming the model will infer a preferred response style when formatting or verbosity matters.

## Known limitations

Model behavior is nondeterministic. GPT-6 Astra does not support the `none` reasoning effort, and supported effort choices depend on the calling API. Evaluate guidance against representative work and update it when the official model guidance changes.

## Sources

See the source records in frontmatter.
