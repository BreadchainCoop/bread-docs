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
              { label: 'About', items: [{ autogenerate: { directory: 'about' } }] },
              { label: 'Solidarity Primitives', items: [{ autogenerate: { directory: 'solidarity-primitives' } }] },
              { label: 'Bread Cooperative', items: [{ autogenerate: { directory: 'bread-cooperative' } }] },
          ],
      }),
      keystatic(),
      mdx(),
  	],

  vite: {
    plugins: [tailwindcss()],
  },

  redirects: {
    // Permalinks (Root level canonical URLs)
    '/about/manifesto': '/manifesto',
    '/solidarity-primitives/crowdstaking/how-to-become-a-member-project': '/how-to-become-a-member-project',
    '/solidarity-primitives/crowdstaking/yield-governance/voting-power': '/voting-power',
    // Aliases & Legacy short-paths
    '/bread-token': '/about/bread-token',
    '/token': '/about/bread-token',
    '/marketplace': '/about/bread-token/marketplace',
    '/solidarity-fund': '/solidarity-primitives/crowdstaking',
    '/angel-minters': '/solidarity-primitives/crowdstaking/angel-minters',
    '/member-projects': '/solidarity-primitives/crowdstaking/member-projects',
    // Renamed: ReFi DAO → Regen Coordination
    '/solidarity-primitives/crowdstaking/member-projects/refi-dao': '/solidarity-primitives/crowdstaking/member-projects/regen-coordination',
    // Index path handling (for links explicitly including /index)
    '/about/bread-token/index': '/about/bread-token',
    '/about/bread-token/marketplace/index': '/about/bread-token/marketplace',
    '/about/index': '/about',
    '/solidarity-primitives/crowdstaking/yield-governance/index': '/solidarity-primitives/crowdstaking/yield-governance',
    '/solidarity-primitives/crowdstaking/angel-minters/index': '/solidarity-primitives/crowdstaking/angel-minters',
    '/solidarity-primitives/crowdstaking/index': '/solidarity-primitives/crowdstaking',
    '/solidarity-primitives/crowdstaking/member-projects/index': '/solidarity-primitives/crowdstaking/member-projects',
    '/solidarity-primitives/index': '/solidarity-primitives',
    '/bread-cooperative/sourdough-systems/index': '/bread-cooperative/sourdough-systems',
    '/bread-cooperative/governance/index': '/bread-cooperative/governance',
    '/bread-cooperative/contributors/index': '/bread-cooperative/contributors',
    '/bread-cooperative/index': '/bread-cooperative',
  },

  adapter: netlify(),
});