// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightPageActions from 'starlight-page-actions';
import starlightMarkdownBlocks, { Draft } from 'starlight-markdown-blocks';
import starlightAutoSidebar from 'starlight-auto-sidebar';
import starlightFilesBeforeFolders from './src/plugins/starlightFilesBeforeFolders.ts';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';

import tailwindcss from '@tailwindcss/vite';

import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
  site: 'https://docs.bread.coop',
  output: 'static',
  trailingSlash: 'ignore',

  integrations: [
      react(),
      markdoc(),
      starlight({
          plugins: [
              starlightAutoSidebar(),
              starlightFilesBeforeFolders(),
              starlightPageActions({
                  baseUrl: 'https://docs.bread.coop/',
                  share: true,
                  prompt: 'Please read and summarize the following documentation page: {url}',
                  actions: {
                      chatgpt: true,
                      claude: true,
                      t3chat: true,
                      v0: true,
                      markdown: true,
                  },
              }),
              starlightMarkdownBlocks({
                  blocks: {
                      draft: Draft(),
                  },
              }),
          ],
          title: 'Bread Docs',
          customCss: [
              // Path to Tailwind CSS entry with Starlight integration
              './src/styles/global.css',
          ],
          components: {
              // Override SiteTitle with Bread logo
              SiteTitle: './src/overrides/SiteTitle.astro',
          },
          // PNG favicon fallback for browsers/rss readers that don't render SVG.
          // SVG favicon is added automatically by Starlight at /favicon.svg.
          head: [
              {
                  tag: 'link',
                  attrs: {
                      rel: 'icon',
                      type: 'image/png',
                      href: '/favicon.png',
                      sizes: '200x200',
                  },
              },
              // Default social/OG image — used when a page doesn't set its own.
              {
                  tag: 'meta',
                  attrs: {
                      property: 'og:image',
                      content: 'https://docs.bread.coop/og-image.png',
                  },
              },
              {
                  tag: 'meta',
                  attrs: {
                      property: 'og:image:url',
                      content: 'https://docs.bread.coop/og-image.png',
                  },
              },
              {
                  tag: 'meta',
                  attrs: {
                      name: 'twitter:image',
                      content: 'https://docs.bread.coop/og-image.png',
                  },
              },
              {
                  tag: 'meta',
                  attrs: {
                      property: 'og:image:type',
                      content: 'image/png',
                  },
              },
              {
                  tag: 'meta',
                  attrs: {
                      property: 'og:image:width',
                      content: '3840',
                  },
              },
              {
                  tag: 'meta',
                  attrs: {
                      property: 'og:image:height',
                      content: '2160',
                  },
              },
          ],
          social: [
              { icon: 'github', label: 'GitHub', href: 'https://github.com/BreadchainCoop' },
              { icon: 'discord', label: 'Discord', href: 'https://discord.gg/bread' },
          ],
          sidebar: [
              {
                  label: '$BREAD Community Currency',
                  items: [{ autogenerate: { directory: 'bread-community-currency' } }],
              },
              {
                  label: 'Bread Tools and Mechanisms',
                  items: [{ autogenerate: { directory: 'bread-tools-and-mechanisms' } }],
              },
              {
                  label: 'Bread Cooperative',
                  items: [{ autogenerate: { directory: 'bread-cooperative' } }],
              },
              // Elevated entries — stock Starlight sidebar items
              {
                  slug: 'manifesto',
                  attrs: { style: 'font-weight: 400; font-size: var(--sl-text-sm); color: inherit' },
              },
              {
                  label: 'Contact',
                  link: '/contact/',
                  attrs: { style: 'font-weight: 400; font-size: var(--sl-text-sm); color: inherit' },
              },
          ],
          markdown: {
              processedDirs: ['./src/content/projects/'],
          },
      }),
      keystatic(),
      mdx(),
  	],

  vite: {
    plugins: [tailwindcss()],
    build: {
      // The Keystatic CMS bundles its entire admin editor (React + Keystatic UI)
      // into a single ~2.6 MB chunk (`_astro/keystatic-page.*.js`). This is
      // intentional and route-isolated: it is only served on-demand to the
      // `/keystatic` admin route via the Netlify SSR function, never on public
      // docs pages (readers load only the ~178 kB Starlight runtime). Raising
      // the limit here documents that size as accepted rather than letting the
      // warning fire on every build and obscure genuinely new regressions.
      chunkSizeWarningLimit: 3000,
    },
  },

  redirects: {
    // Permalinks (Root level canonical URLs)
    '/getting-started/manifesto': '/manifesto',
    '/bread-tools-and-mechanisms/solidarity-fund/how-to-become-a-member-project': '/bread-tools-and-mechanisms/solidarity-fund/member-projects/',

    // Aliases & Legacy short-paths
    '/bread-token': '/bread-community-currency/',
    '/token': '/bread-community-currency/',
    '/marketplace': '/bread-community-currency/friends-of-bread/',
    '/solidarity-fund': '/bread-tools-and-mechanisms/solidarity-fund/',
    '/angel-minters': '/bread-tools-and-mechanisms/solidarity-fund/angel-minter-program/',
    '/member-projects': '/bread-tools-and-mechanisms/solidarity-fund/member-projects/',
    '/how-to-become-a-member-project': '/bread-tools-and-mechanisms/solidarity-fund/member-projects/',

    // Renamed: ReFi DAO → Regen Coordination (new canonical target)
    '/bread-tools-and-mechanisms/solidarity-fund/member-projects/refi-dao': '/projects/regen-coordination/',

    // Shelved content redirects
    '/roadmap': '/bread-cooperative/',
    '/about/roadmap/': '/bread-cooperative/',
    '/solidarity-primitives/stacks': '/bread-tools-and-mechanisms/',
    '/solidarity-primitives/crowdstaking/how-to-become-a-member-project/': '/bread-tools-and-mechanisms/solidarity-fund/member-projects/',

    // Consolidated pages: Old marketplace → Friends of Bread listing
    '/about/bread-token/marketplace/': '/bread-community-currency/friends-of-bread/',
    '/about/bread-token/marketplace/bread-discord/': '/bread-community-currency/friends-of-bread/',
    '/about/bread-token/marketplace/cca-events/': '/bread-community-currency/friends-of-bread/',
    '/about/bread-token/marketplace/dandelion-events/': '/bread-community-currency/friends-of-bread/',
    '/about/bread-token/marketplace/giveth-donations/': '/bread-community-currency/friends-of-bread/',
    '/about/bread-token/marketplace/tbs-dao/': '/bread-community-currency/friends-of-bread/',

    // Consolidated pages: Old angel-minters docs → Angel Minter Program listing
    '/solidarity-primitives/crowdstaking/angel-minters/': '/bread-tools-and-mechanisms/solidarity-fund/angel-minter-program/',
    '/solidarity-primitives/crowdstaking/angel-minters/1hive/': '/bread-tools-and-mechanisms/solidarity-fund/angel-minter-program/',
    '/solidarity-primitives/crowdstaking/angel-minters/commons-hub/': '/bread-tools-and-mechanisms/solidarity-fund/angel-minter-program/',
    '/solidarity-primitives/crowdstaking/angel-minters/gnosis-dao/': '/bread-tools-and-mechanisms/solidarity-fund/angel-minter-program/',
    '/solidarity-primitives/crowdstaking/angel-minters/layer/': '/bread-tools-and-mechanisms/solidarity-fund/angel-minter-program/',
    '/solidarity-primitives/crowdstaking/angel-minters/mask-network/': '/bread-tools-and-mechanisms/solidarity-fund/angel-minter-program/',
    '/solidarity-primitives/crowdstaking/angel-minters/othentic/': '/bread-tools-and-mechanisms/solidarity-fund/angel-minter-program/',
    '/solidarity-primitives/crowdstaking/angel-minters/token-engineering-commons/': '/bread-tools-and-mechanisms/solidarity-fund/angel-minter-program/',
    '/solidarity-primitives/crowdstaking/angel-minters/toucan/': '/bread-tools-and-mechanisms/solidarity-fund/angel-minter-program/',
    '/solidarity-primitives/crowdstaking/angel-minters/yieldnest/': '/bread-tools-and-mechanisms/solidarity-fund/angel-minter-program/',

    // Old member project detail URLs → new /projects/ canonical URLs
    '/solidarity-primitives/crowdstaking/member-projects/bread-co-op/': '/projects/bread-co-op/',
    '/solidarity-primitives/crowdstaking/member-projects/citizen-wallet/': '/projects/citizen-wallet/',
    '/solidarity-primitives/crowdstaking/member-projects/crypto-commons-association/': '/projects/crypto-commons-association/',
    '/solidarity-primitives/crowdstaking/member-projects/gardens/': '/projects/gardens/',
    '/solidarity-primitives/crowdstaking/member-projects/labor-dao/': '/projects/labor-dao/',
    '/solidarity-primitives/crowdstaking/member-projects/refi-dao/': '/projects/regen-coordination/',
    '/solidarity-primitives/crowdstaking/member-projects/regen-coordination/': '/projects/regen-coordination/',
    '/solidarity-primitives/crowdstaking/member-projects/shared-treasury/': '/projects/shared-treasury/',
    '/solidarity-primitives/crowdstaking/member-projects/symbiota-coop/': '/projects/symbiota-coop/',
    '/solidarity-primitives/crowdstaking/member-projects/traditional-dream-factory/': '/projects/traditional-dream-factory/',

    // Sourdough Systems removal → Bread Cooperative landing
    '/bread-cooperative/sourdough-systems/': '/bread-cooperative/',
    '/bread-cooperative/sourdough-systems/gas-killer/': '/bread-cooperative/',

    // Contributor onboarding → absorbed into Contributors index
    '/bread-cooperative/contributors/contributor-onboarding/': '/bread-cooperative/contributors/',

    // Old "Getting Started" section → replaced by $BREAD Community Currency
    '/getting-started/': '/bread-community-currency/',
    '/getting-started/bread-community-currency/': '/bread-community-currency/',
    '/getting-started/bread-community-currency/friends-of-bread/': '/bread-community-currency/friends-of-bread/',
    '/getting-started/bread-community-currency/bread-gardens-pool-setup/': '/bread-community-currency/bread-gardens-pool-setup/',
    '/getting-started/index': '/bread-community-currency/',
    '/getting-started/bread-community-currency/index': '/bread-community-currency/',

    // Index path handling (for links explicitly including /index)
    '/bread-community-currency/index': '/bread-community-currency/',
    '/bread-tools-and-mechanisms/solidarity-fund/yield-governance/index': '/bread-tools-and-mechanisms/solidarity-fund/yield-governance/',
    '/bread-tools-and-mechanisms/solidarity-fund/index': '/bread-tools-and-mechanisms/solidarity-fund/',
    '/bread-tools-and-mechanisms/solidarity-fund/member-projects/index': '/bread-tools-and-mechanisms/solidarity-fund/member-projects/',
    '/bread-tools-and-mechanisms/index': '/bread-tools-and-mechanisms/',
    '/bread-cooperative/governance/index': '/bread-cooperative/governance',
    '/bread-cooperative/contributors/index': '/bread-cooperative/contributors',
    '/bread-cooperative/index': '/bread-cooperative',
  },

  adapter: netlify(),
});