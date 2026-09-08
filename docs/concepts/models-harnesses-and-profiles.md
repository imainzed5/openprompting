# Models, harnesses, setups, and profiles

A **model** is the provider model whose prompting behavior is being described. A **harness** is the tool around a model: for example, Codex, Claude Code, or Gemini CLI. Instruction-file discovery, tool approval, and project traversal are harness behavior, not model behavior.

A **setup** pairs exactly one model with one harness in `.openprompting/config.yml`. A **profile** gives a setup a user-facing role such as `builder`, `reviewer`, or `designer`. Several profiles may reuse one setup.

For `new <task>`, resolution is deterministic:

1. explicit `--profile`
2. task route in `defaults.tasks`
3. `defaults.profile`
4. the sole configured setup, when exactly one exists

For `guide` without a selector, explicit profile and task routing do not apply: it uses `--profile`, then the default profile, then a sole setup. Ambiguous configuration fails with available choices.

Profile roles and routes are user preferences. Model and harness facts come from project-maintained knowledge and retain evidence and source metadata. `compare` deliberately shows these categories separately.
