# Migration from pre-V1 builds

V1 uses config schema version 1. There is no automatic migration from experimental pre-schema drafts.

1. Back up `.openprompting/config.yml`.
2. Reshape it to the `version`, `setups`, `profiles`, and `defaults` structure shown in the README.
3. Run `openprompting setup --check`.

Alternatively, move the old file aside, run `openprompting setup`, inspect the preview, and carry supported values into the new file. Unknown config versions fail rather than being interpreted silently.

The executable and V1 commands are frozen at `openprompting` with `help`, `setup`, `guide`, `new`, `doctor`, and `compare`. Pre-V1 consumers should update any scripts to that surface before adopting `1.0.0`.
