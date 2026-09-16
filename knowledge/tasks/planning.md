---
id: planning
display_name: Planning
type: task
status: active
last_verified: 2026-09-17
evidence:
  - class: official
    claim: A useful project plan covers scope, schedule, resources, deliverables, dependencies, risks, assumptions, and a feedback loop, while reflecting the project's current state.
    source: microsoft-project-plan
sources:
  - id: microsoft-project-plan
    title: Create a project plan
    url: https://learn.microsoft.com/en-us/dynamics365/guidance/implementation-guide/project-governance-project-plan
    last_checked: 2026-09-17
---

# Planning

## Summary

Create an implementation plan without prematurely implementing the work.

## Recommended

- Inspect the current system, relevant files, configuration, tests, and constraints before prescribing a change.
- Separate known requirements and observed facts from assumptions, decisions, and open questions.
- Identify the smallest sound implementation path, its dependencies, owners or handoffs, and the points where the plan should be revisited.
- Sequence the work into concrete steps with risks, compatibility concerns, and checkpoints.
- Define the validation plan before implementation begins, including commands or observations that can prove the intended outcome.
- State what is explicitly out of scope and what decision or evidence is still needed.

## Avoid

- Turning a planning request into an unapproved implementation.
- Hiding unresolved product or technical decisions inside confident-sounding steps.
- Proposing a plan disconnected from the repository's current state or validation conventions.
- Treating a task list as complete without dependencies, risks, assumptions, and completion evidence.

## Sources

See the source records in frontmatter.
