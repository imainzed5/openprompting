# Command reference

The V1 executable is `openprompting`. Normal command execution is local and offline.

## `openprompting help`

Shows commands and examples without requiring config.

## `openprompting setup`

Interactively creates or updates `.openprompting/config.yml`. The wizard supports multiple setups and profiles, a default profile, and task routes. It previews the exact path and YAML before writing. `openprompting setup --check` validates an existing config without changing it.

## `openprompting guide`

Shows resolved model and harness recommendations, cautions, evidence, freshness, and sources.

```sh
openprompting guide
openprompting guide --profile reviewer
openprompting guide --model google-gemini-3-8-flash
openprompting guide --harness gemini-cli
openprompting guide codex
```

## `openprompting new <task>`

Renders a deterministic prompt skeleton for `feature`, `bug`, `review`, `refactor`, or `ui`. It does not invent project facts or call a model.

```sh
openprompting new feature
openprompting new review --profile reviewer
```

## `openprompting doctor`

Performs read-only checks of config, references, routing, instruction files, declared package scripts, knowledge validity, and knowledge freshness. It never executes project scripts. Results are `PASS`, `INFO`, `WARN`, or `FAIL`; only failures produce an unsuccessful diagnostic result.

```sh
openprompting doctor
openprompting doctor --profile reviewer
```

## `openprompting compare <a> <b>`

Compares profiles, setups, models, or harnesses using configured preferences and structured knowledge. Profiles take precedence over same-named setups. Missing or incomparable values are identified, evidence remains visible, and no universal winner is inferred.

```sh
openprompting compare builder reviewer
openprompting compare codex gemini-cli
```

## Exit behavior

Successful commands exit `0`; command or validation failures exit nonzero. The V1 categories reserved by the command contract are `1` for command/validation failure, `2` for invalid input/config, and `3` for unexpected internal failure. Callers should not rely on finer distinctions that a specific command does not yet emit.
