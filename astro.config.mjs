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
              MarkdownContent: './src/overrides/MarkdownContent.astro',
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
              { icon: 'discord', label: 'Discord', href: 'https://discord.com/invite/zmNqsHRHDa' },
          ],
          sidebar: [
              {
                  label: 'Getting Started',
                  items: [{ autogenerate: { directory: 'about' } }],
              },
              {
                  label: 'Solidarity Tools',
                  items: [{ autogenerate: { directory: 'tools' } }],
              },
              {
                  label: 'How We Work',
                  items: [{ autogenerate: { directory: 'organization' } }],
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

  adapter: netlify(),
});
