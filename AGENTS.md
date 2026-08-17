# bread-docs — Agent Instructions

> **This file is the single source of truth for all AI agents working on this project.** It applies to OpenCode, Claude Code, Cursor, GitHub Copilot, and any other AI coding tool.

Documentation website for Bread Cooperative. Built with **Astro + Starlight**, deployed to `docs.bread.coop` via Netlify with static pre-rendering and on-demand SSR for CMS API routes.

---

## Lifecycle: End-to-End Workflow

> **Follow this recipe from clone to post-merge cleanup.** Each step is explicit — don't skip ahead.

### 1. Clone & install

```bash
git clone https://github.com/BreadchainCoop/bread-docs.git
cd bread-docs
npm install
```

Requires Node 24.14.0+ (see `.nvmrc`).

### 2. Verify prerequisites

For content edits via Keystatic, all four secrets must exist in `.env` (gitignored — ask a maintainer for the values):

```
KEYSTATIC_GITHUB_CLIENT_ID, KEYSTATIC_GITHUB_CLIENT_SECRET,
KEYSTATIC_SECRET, PUBLIC_KEYSTATIC_GITHUB_APP_SLUG
```

Also verify the "Bread Docs Editor" GitHub App is installed on `BreadchainCoop/bread-docs`, and that the `gh` CLI is authenticated (`gh auth status`).

For code/config-only edits (no Keystatic), `.env` is not required.

### 3. Create a branch

Always branch before starting work. The `main` branch is protected — direct pushes are blocked.

- **Content edits** (via Keystatic): use the `keystatic/` prefix so Keystatic's branch dropdown recognizes it:
  ```bash
  git checkout -b keystatic/<username>/<description>
  ```
- **Code/config edits**: use a conventional prefix:
  ```bash
  git checkout -b <type>/<description>   # e.g. fix/sidebar-order, feat/new-plugin
  ```

### 4. Start the dev server

```bash
npm run dev    # http://127.0.0.1:4321
```

Keystatic reads the current git branch, so be on the correct branch **before** starting the server.

### 5. Edit

- **Content via Keystatic:** Direct the user to `http://127.0.0.1:4321/keystatic`. They log in with GitHub; the current `keystatic/*` branch is selected in the dropdown. They edit and save — Keystatic commits to the branch.
- **Content via direct file edit (agent):** Only when explicitly instructed by the user. Edit files in `src/content/docs/` and commit normally. Do **not** bypass the PR requirement.
- **Code/config:** Edit source files directly.

### 6. Run checks before requesting review

```bash
npm run build     # must pass with zero errors
```

Fix any build or type errors on the branch **before** opening a PR or requesting review. If the build is already failing on `main` for unrelated reasons, note it in the PR description.

### 7. Open a pull request

```bash
gh pr create --base main --head <branch> \
  --title "<type>: <description>" \
  --body "Closes #<issue>. <Summary of changes>."
```

Optionally add reviewers: `gh pr create --reviewer <handle>`.

### 8. Resolve conflicts if needed

If `main` advances while the PR is open:

```bash
git fetch origin
git merge origin/main          # or: git rebase origin/main
# resolve conflicts, then:
git push
```

Re-run `npm run build` after resolving to confirm the branch is still green.

### 9. Stop the dev server

When editing is done, stop the server with `Ctrl+C` in the terminal running `npm run dev`. Don't leave it running across sessions.

### 10. Post-merge cleanup

After the PR is merged:

```bash
git checkout main && git pull && git branch -d <branch>
```

---

## What agents must NEVER do

- Edit files directly in `src/content/docs/` without an explicit user instruction — changes must go through Keystatic or a PR
- Push directly to `main` — it's protected
- Commit `.env` or any secrets
- Modify `node_modules/`, `dist/`, or `.astro/`
- Leave the dev server running when work is complete

---

## PR Instructions

- **Title format:** Conventional commits — `docs:`, `feat:`, `fix:`, `chore:` (Keystatic auto-generates its own messages like `Update src/content/docs/about/index`, which are fine as-is)
- **Always run `npm run build` before opening a PR or requesting review.** Fix failures on the branch first.
- **PR body:** Reference the issue (`Closes #N`), summarize changes, and note anything reviewers should pay attention to.
- **Merge policy:** See [GOVERNANCE.md](./GOVERNANCE.md) for who can merge and what review is required.

---

## Security Considerations

- **Never commit `.env`** — it contains OAuth client secrets and session keys. It is gitignored; verify with `git status` before committing if you're unsure.
- **Never modify `node_modules/`, `dist/`, or `.astro/`** — these are generated directories.
- **Branch protection on `main`** is enforced server-side. Don't attempt force-pushes or direct commits.
- **Keystatic GitHub App** grants contents read & write to `BreadchainCoop/bread-docs`. Only users with `write` access to the repo can authenticate through it.

---

## Stack

| Layer | Tool |
|-------|------|
| Framework | Astro (`astro.config.mjs`) |
| Docs theme | `@astrojs/starlight` |
| CMS | Keystatic (`@keystatic/astro`) |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`) + `@astrojs/starlight-tailwind` |
| Content | Astro Content Collections (`src/content/docs/`) |
| Plugins | `starlight-page-actions`, `starlight-markdown-blocks`, `starlight-auto-sidebar` |

---

## Project Layout

```
bread-docs/
├── astro.config.mjs              # Starlight config, sidebar, plugins, component overrides
├── keystatic.config.tsx          # CMS collections, schema, storage (GitHub mode)
├── src/
│   ├── content.config.ts         # Astro content collection (docsLoader + docsSchema)
│   ├── content/docs/             # All markdown content — one file = one page
│   │   ├── index.md              # Home page
│   │   ├── token/
│   │   ├── tools/
│   │   └── organization/
│   ├── content/member-projects/  # Member project profiles (MDX, separate collection)
│   ├── overrides/
│   │   └── SiteTitle.astro       # Replaces Starlight header title with Bread logo
│   ├── plugins/
│   │   ├── starlightFilesBeforeFolders.ts  # Sidebar ordering plugin
│   │   └── filesBeforeFolders.ts           # Shared utility
│   └── styles/
│       └── global.css            # Full design system: fonts, tokens, Starlight overrides
├── public/
│   ├── fonts/                    # Pogaca woff2 files (Bread Display, Bread Body)
│   └── images/                   # Static images referenced in markdown
```

---

## Adding & Editing Content

**All content lives in `src/content/docs/`.** Files map directly to URL routes. Directory structure drives both routing and the autogenerated sidebar.

### Frontmatter

```yaml
---
title: Page Title           # required
slug: "custom-slug"         # optional: overrides path-based slug
sidebar:
  order: 0                  # optional: controls ordering within section
---
```

### Admonitions (custom blocks)

```markdown
:::note[Title]
Content here
:::

:::caution[Title]
Content here
:::

:::draft
Work-in-progress content (uses starlight-markdown-blocks Draft block — hidden in production)
:::
```

### Images

Place images in `public/images/` and reference them with absolute paths:

```markdown
![alt text](/images/filename.webp)
```

### Links

Use slug-based absolute paths. Custom slugs take precedence over directory paths:

```markdown
[BREAD Token](/token/)
[Crowdstaking](/solidarity-fund/)
[Member Projects](/member-projects/)
```

---

## Sidebar Structure

Defined in `astro.config.mjs` via `autogenerate`. Adding a directory under one of these roots automatically includes it:

| Sidebar Section | Directory |
|----------------|-----------|
| $BREAD Community Currency | `src/content/docs/token/` |
| Bread Tools and Mechanisms | `src/content/docs/tools/` |
| Bread Cooperative | `src/content/docs/organization/` |

To add a new top-level section, add an entry to the `sidebar` array in `astro.config.mjs`.

---

## Component Overrides

Starlight components are overridden via the `components` key in `astro.config.mjs`:

```js
components: {
  SiteTitle: './src/overrides/SiteTitle.astro',
}
```

To override additional Starlight components, create a `.astro` file in `src/overrides/` and register it here. See the [Starlight component override docs](https://starlight.astro.build/guides/overriding-components/) for the full list of overrideable components.

---

## Design System

### Fonts

- **Bread Display** (`PogacaDisplay*.woff2`) — headings, h1–h3, site title
- **Bread Body** (`PogacaBody*.woff2`) — body text, navigation, h4–h6

CSS variables: `--font-breadDisplay`, `--font-breadBody`

### Color Tokens

| Token | Value | Use |
|-------|-------|-----|
| `--color-primary-orange` | `#ea6023` | Brand primary, links, accent |
| `--color-paper-main` | `#f6f3eb` | Page/nav background (light mode) |
| `--color-paper-0` | `#fdfcf9` | Lightest background |
| `--color-surface-ink` | `#1b201a` | Primary text, dark background |

### Dark Mode

Starlight's dark mode is driven by `[data-theme='dark']` on the `<html>` element. Override dark-mode colors by targeting this selector in `global.css`.

### CSS Layers

`global.css` declares explicit layer order: `base → starlight → theme → components → utilities`. Custom component styles go in `@layer components {}`.

---

## Plugins

### `starlight-page-actions`

Adds share/AI-prompt buttons to each page. Config in `astro.config.mjs`:
- Base URL: `https://docs.bread.coop/`
- Enabled actions: ChatGPT, Claude, T3Chat, v0, raw Markdown
- Prompt template: `Please read and summarize the following documentation page: {url}`

### `starlight-markdown-blocks`

Enables custom admonition blocks. Currently registers:
- `draft` — marks content as a draft (use `:::draft` in markdown)

### `starlightFilesBeforeFolders`

Custom plugin that reorders sidebar entries so files appear before folders. Ensures links appear before groups at all nesting levels. Uses route data middleware with `await next()` to run after `starlight-auto-sidebar`.

### `starlight-auto-sidebar`

Reads `_meta.yml` files in each directory to configure sidebar labels, ordering, and collapsed states. See [Sidebar Structure](#sidebar-structure) above.

---

## Keystatic CMS

[Keystatic](https://keystatic.com) provides a web-based interface for managing content. It runs in **GitHub mode**, authenticating via a custom [GitHub App](https://keystatic.com/docs/github-mode) so anyone with `write` access to the repo can edit content through the admin UI. No user limits — unlimited team members.

### Prerequisites

A GitHub App named **"Bread Docs Editor"** must be installed on the `BreadchainCoop/bread-docs` repository. This is created automatically by Keystatic's setup wizard on first login. The app grants:
- **Contents:** Read & write
- **Metadata:** Read-only

Required environment variables (stored in `.env`, gitignored) are listed in [Lifecycle step 2](#2-verify-prerequisites) above.

### OAuth Callback URLs

GitHub OAuth requires the "Bread Docs Editor" app to know which URLs may exchange an authorization code for an access token. The dev server is bound to `127.0.0.1` (not `localhost`) because GitHub's OAuth provider treats the two as different hosts. Register both callback URLs on the app at [github.com/organizations/BreadchainCoop/settings/apps/bread-docs-editor](https://github.com/organizations/BreadchainCoop/settings/apps/bread-docs-editor):

| Environment | Callback URL |
|-------------|--------------|
| Development | `http://127.0.0.1:4321/api/keystatic/github/oauth/callback` |
| Production | `https://docs.bread.coop/api/keystatic/github/oauth/callback` |
| Deploy Previews | `https://deploy-preview-N--bread-docs.netlify.app/api/keystatic/github/oauth/callback` |

Deploy preview URLs must be added per-PR (each preview gets its own subdomain `deploy-preview-N`).

Without these, the GitHub login flow returns a `redirect_uri_mismatch` error after the user authorizes the app.

### Documentation Links
- [Keystatic Official Docs](https://keystatic.com/docs)
- [GitHub Mode Guide](https://keystatic.com/docs/github-mode)
- [Collections & Fields](https://keystatic.com/docs/collections)

### Usage

| Environment | CMS Status | URL |
|-------------|------------|-----|
| Development (`npm run dev`) | Enabled (GitHub Mode) | `http://127.0.0.1:4321/keystatic` |
| Production | Enabled (GitHub Mode) | `https://docs.bread.coop/keystatic` |

### Branch & Pull Request Workflow

The `main` branch is **protected** — direct pushes are blocked. All content edits go through pull requests. Keystatic works with `branchPrefix: 'keystatic/'` (set in `keystatic.config.tsx`) to scope its branch dropdown to only show CMS-created branches.

**How saving works:**

1. **On `main`**: Saving is blocked by branch protection. Keystatic shows a dialog: *"Create a new branch to save changes."* Enter a branch name and click **Create branch and save**.
2. **On a `keystatic/*` branch**: Saving commits directly to that branch.
3. **After saving**: Create a pull request (see [Lifecycle step 7](#7-open-a-pull-request)) or use Keystatic's header menu to open a pre-filled PR form.
4. **Review**: Request review, discuss, and merge. Netlify deploys on merge. See [GOVERNANCE.md](./GOVERNANCE.md) for merge policy.

CMS configuration is located in `keystatic.config.tsx`. It is integrated into Astro via `@keystatic/astro` (registered after Starlight in `astro.config.mjs`):

```js
keystatic(),
```

The `@astrojs/netlify` adapter handles SSR for Keystatic API routes (`/api/keystatic/*`) while all docs pages remain statically pre-rendered.

### Fallback to Local Mode

For offline or quick local edits, temporarily switch to local mode in `keystatic.config.tsx`:

```tsx
storage: { kind: 'local' },  // Direct file writes, no GitHub API
```

Remember to switch back to `github` before committing, as GitHub mode is the team standard.

---

## Dev Commands

```bash
npm run dev       # dev server at 127.0.0.1:4321
npm run build     # static build to ./dist/  ← run before opening a PR
npm run preview   # preview production build
```

---

## Conventions

- **TypeScript** for all `.ts` / `.astro` config files
- **Markdown** (not MDX) for all content — `.md` files only
- Conventional commits: `docs:`, `feat:`, `fix:`, `chore:` — applies to manual commits; Keystatic auto-generates its own messages (e.g. `Update src/content/docs/about/index`) which are fine as-is
- Do not modify `node_modules/`, `dist/`, or `.astro/`
