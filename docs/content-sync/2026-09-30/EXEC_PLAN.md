# 2026-09-30 portal release refresh

## Scope
Check all six registered public repositories; refresh released metadata, download selectors, changelogs and user-facing limitations. Preserve Korean patcher-only delivery, old selectable versions, reports, branding and intentionally hidden translation progress. No blog publication or upstream repository changes.

## Confirmed state
Started from clean main d0af208, including the 2026-09-29 portal changes. Public GitHub release metadata reports new GameYob v0.5.11 and GBARunner3 custom-v0.1.5. NitroSwan r10, Narikiri2 v1.0, Narikiri3 v1.2 and AI Work Skills v2026.09.19.2 remain current. Release dates retain the existing UTC-date schema, rather than silently changing historical date semantics.

## Plan and acceptance
- [x] Inspect current repository policy and all six release listings.
- [x] Update two projects and changelogs using release metadata and disclosures.
- [x] Verify public asset SHA-256, data, tests, all selectable releases, lint and build.
- [x] Check desktop/mobile defaults and historical version selection, then publish and verify live.

## Recovery
Changes are isolated on codex/refresh-releases-20260930. Preserve historical records and upstream assets; use a follow-up revert if deployment requires recovery. Never publish game ROMs or treat software tests as hardware validation.

## Sources
- https://github.com/GimoXagros/GameYob/releases/tag/v0.5.11
- https://github.com/GimoXagros/GBARunner3/releases/tag/custom-v0.1.5

## UI validation route
Browser plugin/skill not available; use installed Playwright if present. Flow: project details → download tab → latest default and older version selection → matching release URL, asset size and SHA-256. Also check home project count and mobile layout.

## Local results
Data validation, 62 tests, authenticated remote release verification of all six projects and historical selectors, lint and production build passed. npm was absent from PATH; equivalent installed Node entrypoints ran directly. Build retains the existing warnings for intentionally unbundled classic RomPatcher.js scripts; rendered patcher is present.

Public ZIP bytes independently matched registered sizes and GitHub SHA-256 digests: GameYob 845733 bytes / a51e5abba03d117251b0846a78b450f752dbfd8d96833b2ee405d4aab882f69a; GBARunner3 165568 bytes / bdc5cecdd166d2ebe0ada3f5e7479da7081c01f534a7f8607a82d428694df1c0.

Playwright with installed Chrome at 1440×1000 and 390×844 passed identity, nonblank content, no framework overlay, image loading, no horizontal overflow, latest→previous→latest download URL transitions, six-project count and Narikiri3 patcher-only controls. No browser console/runtime errors. Screenshots reviewed; temporary QA scripts/screenshots are outside the repository. No game ROM or actual emulator/device execution was performed. Root logo.png histories in GameYob and GBARunner3 are unchanged since August, so branding was preserved.

## Outcome
PR #26 merged as afae3dd0cff1ab135ead56fde9b274bd677d29f6. Pages run 36596966043 passed build and deployment. The same desktop/mobile interaction checks passed against https://gimoxagros.github.io/project-portal/ after deployment, including image loading, latest/previous asset links and absence of console/runtime errors. Remaining scope excludes real ROM execution, emulator hardware tests and other browsers. GitHub reports existing action-runtime deprecation annotations, not build failures. No blog or upstream repository was modified.
