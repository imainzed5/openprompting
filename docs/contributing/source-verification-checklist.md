# Source verification checklist

Use this checklist for every new or changed knowledge claim.

- [ ] The source is first-party where one exists and links to the original page.
- [ ] The source was opened and checked on the recorded `last_checked` date.
- [ ] The exact model ID, product name, lifecycle status, and version scope are current.
- [ ] The claim says no more than the cited source supports.
- [ ] Provider/model behavior is separated from harness behavior.
- [ ] Inference is labeled and universal superiority claims are absent.
- [ ] Each non-tested evidence item references a source ID declared in the same file.
- [ ] Each tested evidence item gives versions, steps, fixture, and expected observation.
- [ ] `last_verified` reflects the date the full entry was reviewed.
- [ ] Stale or replaced guidance was removed, narrowed, or classified as `legacy`.
- [ ] `pnpm validate:knowledge` and `pnpm test` pass.
