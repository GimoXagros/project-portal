# Project registration and delivery policy

- Korean translation patches (`type: korean-patch`) must have a verified browser patcher. Do not add patch ZIP/BPS download buttons, download tabs, or direct release-asset links to their page.
- Keep `downloadEnabled: false` and `downloads: []` for Korean patches. Register BPS files in `webPatcher.versions`, including source, patch, and output sizes and SHA-256. Publish only the patch, never ROMs. Retain upstream notices.
- Non-patch downloadable projects must expose `downloadVersions` through the shared version selector. Preserve selectable public stable and prerelease assets, clearly label the channel, and default to the project's current version.
- Verify every selectable release against the repository's official public release metadata. Do not assume prereleases are stable or older builds include current fixes.
- Use canonical repository slugs for project IDs, hash routes, changelogs, and assets. Retain explicit old-route aliases when renaming.
- Credits must identify the actual original translation contributors, follow-up author, font license, and separate game-asset rights.
- Before publishing, run data validation, tests, remote release verification, lint, build, and rendered desktop/mobile interaction checks. Follow these rules for future projects as well as updates.
