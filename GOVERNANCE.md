# Governance

This document covers how the bread-docs repository is maintained: who can merge changes, what review is required, and how decisions get made.

## Maintainers

Members of the [BreadchainCoop](https://github.com/BreadchainCoop) organization with `write` access to `bread-docs` are maintainers. They can review pull requests, merge approved changes, and manage branch protection settings.

## Merge policy

| Change type | Review required | Who merges |
|-------------|-----------------|------------|
| Content-only (markdown in `src/content/docs/`) | One maintainer approval | Any maintainer |
| Code or config (Astro config, plugins, styles, `package.json`, etc.) | One maintainer approval + passing build | Any maintainer |
| Dependencies or build tooling | One maintainer approval + passing build | Any maintainer |

**Before any merge:**

- The branch must pass `npm run build` with zero errors.
- If conflicts exist, they must be resolved on the branch before review is requested.
- Failing checks block the merge — fix them on the branch, don't merge around them.

## How decisions get made

- **Small changes** (typos, wording, new pages, bug fixes): a maintainer reviews and merges. No formal process needed.
- **Larger changes** (new sections, structural reorganization, design system updates, dependency upgrades): open an issue first and discuss the approach before opening a PR. A maintainer will summarize the consensus and the PR can proceed.
- **Disagreements:** if a contributor and reviewer can't resolve a disagreement, open an issue and tag a maintainer. We prefer discussion over blocked PRs.

## Branch protection

The `main` branch is protected: direct pushes are blocked, and all changes go through pull requests. This applies to everyone, including maintainers.
