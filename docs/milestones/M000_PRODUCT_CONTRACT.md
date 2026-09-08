# M000 — Product Contract

**Target:** planning baseline
**Release:** none

## Goal

Lock the product boundaries before code exists.

## Deliverables

- README-level product definition
- V1 principles
- V1/non-V1 scope
- core terminology
- command names
- initial model/harness/task coverage
- repository architecture
- config contract
- knowledge/evidence contract
- test/release philosophy

## Required decisions

- project brand is `openPrompting`
- repository/package/CLI convention uses `openprompting`
- CLI is local-first and does not require an LLM
- terminal commands use normal subcommands, not literal slash commands
- mixed-model setups and profiles are V1
- automated multi-harness workflows are not V1

## Acceptance criteria

- no major concept is represented by two competing terms
- V1 command surface is fixed enough to scaffold
- model vs harness separation is explicit
- post-V1 features are listed separately
- implementation can proceed without another architecture pass

## Exit gate

Proceed to M001 only when the planning docs are treated as the working contract.
