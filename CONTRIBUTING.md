# Contributing to bread-docs

Thanks for wanting to improve the Bread Cooperative docs! There are two ways to contribute, depending on what you're changing.

## Two paths

### 1. Content edits (via Keystatic — no coding required)

If you're fixing a typo, updating a page, or adding new documentation, use the Keystatic web editor:

1. **Get the secrets.** Ask a maintainer for the four Keystatic values and add them to a local `.env` file. You'll also need the "Bread Docs Editor" GitHub App installed on the repo (it prompts automatically on first login).
2. **Create a branch** with the `keystatic/` prefix (required so Keystatic recognizes it):
   ```
   keystatic/<your-username>/<short-description>
   ```
3. **Start the dev server** (`npm run dev`) and open `http://127.0.0.1:4321/keystatic`.
4. **Log in with GitHub**, pick your branch from the dropdown, edit, and save. Keystatic commits each save to your branch.
5. **Open a pull request** from your branch to `main`. You can do this from Keystatic's header menu or via the GitHub UI.

### 2. Code or config edits (via standard PR)

If you're changing the Astro config, plugins, styles, or anything in the codebase:

1. **Create a branch** with a conventional prefix:
   ```
   <type>/<short-description>
   ```
   Common types: `feat`, `fix`, `chore`, `docs`.
2. **Make your changes** and run `npm run build` to confirm everything compiles.
3. **Open a pull request** from your branch to `main`.

## Branch convention

| Edit type | Branch prefix | Example |
|-----------|---------------|---------|
| Content (Keystatic) | `keystatic/` | `keystatic/rathermercurial/add-token-page` |
| Code or config | `<type>/` | `fix/sidebar-order` |

The `main` branch is **protected** — direct pushes are blocked. All changes go through a pull request.

## Opening a good PR

- **Title:** Use a conventional commit prefix — `docs:`, `feat:`, `fix:`, or `chore:` — followed by a short description. (Keystatic auto-generates its own commit messages like `Update src/content/docs/about/index`; those are fine as-is.)
- **Description:** Reference the issue you're closing (`Closes #N`), summarize what changed and why, and call out anything reviewers should look at closely.
- **Checks:** Run `npm run build` locally before requesting review. If the build fails on your branch, fix it first — see [AGENTS.md](./AGENTS.md) for build and troubleshooting details.
- **Conflicts:** If `main` has moved while your PR was open, resolve conflicts on your branch and re-run the build before pushing again.

## Merge policy

See [GOVERNANCE.md](./GOVERNANCE.md) for who can merge, what review is required, and how decisions get made.

## Getting help

- **Technical questions** (build, config, plugins, design system): see [AGENTS.md](./AGENTS.md) — the full technical reference for the project.
- **Questions about content or process:** open a [GitHub issue](https://github.com/BreadchainCoop/bread-docs/issues) and a maintainer will respond.
