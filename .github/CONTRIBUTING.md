# Contributing to bread-docs

Thanks for helping improve the Bread Cooperative docs. Start by deciding whether you're **requesting** a change or **making** one.

## Requesting a change (you don't need to touch the repo)

If you want something changed but aren't going to implement it yourself, open a **[docs change issue](https://github.com/BreadchainCoop/bread-docs/issues/new/choose)** and fill in the form. Describe what you need in plain terms — you don't need to know the website or the repo internals. A Helper (including the Breadrich assistant) will research it and turn it into a fully-specified issue, and the change is implemented from there. **Requested changes are coordinated on the issue before any code.**

## Making a change yourself

Two paths, depending on what you're editing.

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

If you fully understand your own change, you can open the PR directly — you don't need to open an issue first.

## Branch convention

| Edit type | Branch prefix | Example |
|-----------|---------------|---------|
| Content (Keystatic) | `keystatic/` | `keystatic/rathermercurial/add-token-page` |
| Code or config | `<type>/` | `fix/sidebar-order` |

The `main` branch is **protected** — direct pushes are blocked, and no one merges their own PR. Every change goes through a pull request reviewed and merged by the **Approver** (see [GOVERNANCE.md](./GOVERNANCE.md)).

## Opening a good PR

The PR template loads automatically. It asks for:

- a **linked issue** (`Closes #N`) for requested changes — independent contributions can note "independent";
- what changed, the URLs affected and any redirects, and Keystatic / content-collection impact;
- confirmation that `npm run build` passes.

Keep the writing clear and conventional — no jargon theater, no filler.

## Roles

Who reviews, merges, and decides is described by role (not person) in [GOVERNANCE.md](./GOVERNANCE.md). In short: the **Approver** merges; **Helpers** (including the assistant) open issues and PRs but never merge.

## Getting help

- **Technical reference** (build, config, plugins, design system): see [AGENTS.md](../AGENTS.md).
- **Content or process questions:** open a [GitHub issue](https://github.com/BreadchainCoop/bread-docs/issues) and a maintainer will respond.
