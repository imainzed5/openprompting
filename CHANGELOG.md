# Changelog

All notable changes are documented here. The project follows Semantic Versioning.

## [1.0.0] - 2026-09-08

### Added

- Stable local CLI with `help`, `setup`, `guide`, `new`, `doctor`, and `compare`.
- Schema-validated setup/profile configuration, deterministic task routing, and five task templates.
- Read-only diagnostics and evidence-aware comparisons.
- Source-backed OpenAI, Anthropic, and Google model/harness knowledge.
- Contributor templates, concept/command documentation, and packed-artifact release verification.

### Changed

- Froze config schema v1, evidence vocabulary, executable name, command names, and primary data directories.
- Rewrote user and contributor documentation around the packaged V1 behavior.

### Fixed

- Hardened config writes, ambiguity handling, package-relative resource loading, and mixed-model resolution.

### Deprecated

- No V1 APIs are deprecated.

### Knowledge updates

- Added current Google Gemini 3.8 Flash and Gemini CLI entries to complete the intended V1 ecosystem set.

## [1.0.0-rc.1] - 2026-09-08

### Added

- Release-candidate package audits, clean-install scenarios, contributor documentation, and source-quality gates.

### Changed

- Declared the V1 public contracts frozen for release validation.

### Fixed

- Aligned examples and documentation with all three initial model/harness ecosystems.

### Deprecated

- None.

### Knowledge updates

- Completed initial OpenAI, Anthropic, and Google coverage with freshness and source metadata.
