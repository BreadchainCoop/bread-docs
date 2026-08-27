# bread-docs

Documentation website for [Bread Cooperative](https://bread.coop), built with [Astro Starlight](https://starlight.astro.build). Deployed at **docs.bread.coop**.

## Stack

- [Astro](https://astro.build) — static site framework
- [Starlight](https://starlight.astro.build) — documentation theme
- [Keystatic](https://keystatic.com) — admin CMS
- [Tailwind CSS v4](https://tailwindcss.com) — utility-first styling
- Content via Astro Content Collections (`src/content/docs/`)

## Requirements

- Node 24.14.0 or higher (see `.nvmrc`)

## Dev Commands

```bash
npm install       # install dependencies
npm run dev       # dev server at 127.0.0.1:4321
npm run build     # build to ./dist/
npm run preview   # preview production build
```

## Project Structure

```
src/
├── content/docs/           # Markdown documentation (one file = one page)
├── content/member-projects/ # Member project profiles (MDX)
├── overrides/              # Custom Starlight component overrides
├── plugins/                # Custom Starlight plugins
├── styles/global.css       # Bread design system + Starlight theme overrides
└── content.config.ts       # Content collection schema
astro.config.mjs            # Starlight config: sidebar, plugins, overrides
keystatic.config.tsx        # CMS collections, schema, storage
```

Content is organized into two standalone pages and three sidebar sections:

| Sidebar Entry | Source |
|---------|--------|
| Our Manifesto (page) | `src/content/docs/manifesto.md` |
| Bread Cooperative | `src/content/docs/cooperative/` |
| Get Involved | `src/content/docs/get-involved/` |
| Tools and Mechanisms | `src/content/docs/tools/` |
| Contact & Links (page) | `src/content/docs/contact.md` |

## Customizations

This project uses several custom plugins and configurations beyond standard Starlight:

### Sidebar Configuration (`_meta.yml`)

Sidebar labels, ordering, and collapsed states are controlled via `_meta.yml` files in each directory (powered by [`starlight-auto-sidebar`](https://github.com/HiDeoo/starlight-auto-sidebar)):

```yaml
# src/content/docs/cooperative/currency/_meta.yml
label: Community Currency  # Sidebar label
order: 0              # Position in parent
collapsed: true       # Collapse by default (subdirs only)
```

**Key behaviors:**
- Top-level sections (Bread Cooperative, Get Involved, Tools and Mechanisms) are **expanded** by default
- Sub-sections set `collapsed: false` so their pages stay visible
- Files appear **before** folders in the sidebar (via custom plugin)

### Custom Plugins

**`starlightFilesBeforeFolders`** (`src/plugins/`)
- Custom Starlight plugin that reorders sidebar entries
- Ensures files (links) appear before folders (groups) at all nesting levels
- Uses route data middleware with `await next()` to run after `starlight-auto-sidebar`

**`starlight-page-actions`**
- Adds share buttons (LinkedIn, X, Threads, Bluesky, etc.) and AI prompt buttons to each page
- Configured in `astro.config.mjs`

**`starlight-markdown-blocks`**
- Enables custom admonition blocks like `:::draft`

### URL Redirects

`public/_redirects` maintains backward compatibility with every previous generation of the site's URLs, plus a set of root-level short aliases:

| Old URL | Redirects To |
|---------|--------------|
| `/bread-token` | `/cooperative/currency/bread-token/` |
| `/marketplace` | `/cooperative/friends-of-bread/where-to-spend-bread/` |
| `/solidarity-fund` | `/tools/solidarity-fund/how-it-works/` |
| `/angel-minters` | `/cooperative/currency/angel-minter-program/` |
| `/member-projects` | `/tools/solidarity-fund/member-projects/` |

Rules are ordered most-specific-first (Netlify takes the first match). When you move a page, add a rule for its old path **and** retarget any existing rule that pointed there — otherwise old links land on a redirect that itself 404s.

### Design System

- **Fonts**: Pogaca (Bread Display & Bread Body) — custom WOFF2 files in `public/fonts/`
- **Colors**: Defined in `src/styles/global.css` with CSS custom properties
- **Dark mode**: Fully supported via `[data-theme='dark']` selectors

## Deployment

Deployed to Netlify.

| Setting | Value |
|---------|-------|
| Build command | `npm run build` |
| Publish directory | `dist` |
| Node version | 24 |

## Editing Content

Content is managed through [Keystatic CMS](https://keystatic.com), which provides a web-based editing interface.

### Local Development

1. **Set up environment** — Copy the Keystatic secrets to `.env` (contact a maintainer for the values):
   ```
   KEYSTATIC_GITHUB_CLIENT_ID, KEYSTATIC_GITHUB_CLIENT_SECRET,
   KEYSTATIC_SECRET, PUBLIC_KEYSTATIC_GITHUB_APP_SLUG
   ```

2. **Create a branch** — The `main` branch is protected; all edits go through pull requests:
   ```bash
   git checkout -b keystatic/<username>/<description>
   ```

3. **Start the editor**:
   ```bash
   npm run dev
   ```

4. **Open** `http://127.0.0.1:4321/keystatic` and log in with your GitHub account.

5. **Save your changes** — Keystatic commits to your branch, then create a pull request:
   ```bash
   gh pr create --base main --head keystatic/<branch> --title "Content update: <description>"
   ```

### How the Workflow Works

- The `main` branch is **protected** — saving on main prompts Keystatic to create a new branch.
- All `keystatic/*` branches appear in Keystatic's branch dropdown.
- After review and merge, Netlify deploys the updated site.

## Contributing

Content edits go through Keystatic (see [Editing Content](#editing-content) above). Code and configuration changes follow the standard fork-and-PR workflow.

For detailed technical reference — project layout, design system conventions, frontmatter schema, plugin documentation, and agent instructions — see [AGENTS.md](./AGENTS.md).
