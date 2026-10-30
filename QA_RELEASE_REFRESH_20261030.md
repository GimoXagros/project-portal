# 2026-10-30 release refresh verification

## Changes

- Narikiri 2: v1.1c default, v1.1b also selectable; existing versions preserved.
- Narikiri 3: v1.3b default, v1.3a also selectable; existing versions preserved.
- Both current releases are **prereleases**, as confirmed from the official tag metadata after their channel flags changed during this refresh. Current policy is `latest-prerelease`; the selector explicitly labels all prereleases.
- Four new BPS assets were downloaded from official releases and matched their published byte sizes and SHA-256 digests. Source/output hashes and sizes are recorded in `projects.json`.
- GameYob v0.5.11, GBARunner3 custom-v0.1.5, NitroSwan v0.7.7-custom.r10 and AI Work Skills v2026.10.25.2 remain current.
- Lockfile updates: lucide-react 1.64.0, oxlint 1.90.0 and Vite 8.3.5. No new dependencies.
- Korean-patch pages retain browser-only delivery and hide patch download links. Translation progress remains hidden; original credits and historical verification limitations are preserved.

## Local verification

- Static data validation, 63 tests, official remote release verification for all six projects and their selectable releases, lint, production build: passed. npm audit: zero vulnerabilities.
- Production build in Chromium at 1440px and 390px: search/reset, theme, mobile menu/Escape, six project details, version selectors, update timeline, old Narikiri 2 route alias, no horizontal overflow or page errors.
- Real, hash-verified Japanese source files: source selection → BPS application → actual download saved to disk → independent size/SHA-256 comparison passed for **11 versions**:
  - Narikiri 2: v1.1c, v1.1b, v1.1a, v1.1, v1.0, v0.9d.
  - Narikiri 3: v1.3b, v1.3a, v1.3, v1.2, v1.1a.
- Both current versions also passed application on a 390px mobile viewport. Browser requests contained no ROM uploads. Original files were read only; output files remain outside the repository.
- Real BrowserPatcher component with synthetic data: successful download matches expected bytes; wrong source size/hash, HTTP failure, patch size/hash mismatch, output size/hash mismatch, missing engine, and changing versions while the patch request is pending all prevent stale or invalid downloads. Version changes clear the selected source and previous output.
- All 15 registered BPS files parse with their declared source/output sizes and pass static integrity checks.

## Limits

The four older Narikiri 2 versions requiring FFR BETA2/BETA3 inputs (v0.9, v0.9a, v0.9b, v0.9c) were not reapplied to those original inputs in this run. Their BPS structure, local integrity and official release metadata were checked. These checks verify web patching and downloads, not gameplay, save compatibility, hardware or every browser. Current upstream game-validation limitations remain visible in the project details. Deployment and live-site results are recorded in the accompanying pull request.
