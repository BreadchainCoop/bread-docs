// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightPageActions from 'starlight-page-actions';
import starlightMarkdownBlocks, { Draft } from 'starlight-markdown-blocks';
import starlightAutoSidebar from 'starlight-auto-sidebar';
import starlightFilesBeforeFolders from './src/plugins/starlightFilesBeforeFolders.ts';
import ogMaker from './src/integrations/ogMaker.ts';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';

import tailwindcss from '@tailwindcss/vite';

import netlify from '@astrojs/netlify';
import { unified } from '@astrojs/markdown-remark';

// https://astro.build/config
export default defineConfig({
  site: 'https://docs.bread.coop',
  output: 'static',
  trailingSlash: 'ignore',
  // Astro 7 defaults to the Sätteri Markdown processor; starlight-markdown-blocks
  // only supports unified. https://docs.astro.build/en/guides/upgrade-to/v7/
  markdown: { processor: unified() },

  // Bread typefaces (Pogaca) via the Astro Fonts API: generates @font-face
  // rules, metric-matched fallbacks and preload links. Rendered by
  // src/overrides/Head.astro. https://docs.astro.build/en/guides/fonts/
  fonts: [
      {
          provider: fontProviders.local(),
          name: 'Bread Display',
          cssVariable: '--font-breadDisplay',
          fallbacks: ['sans-serif'],
          options: {
              variants: [
                  { weight: 400, style: 'normal', src: ['./src/assets/fonts/PogacaDisplayRegular.woff2'] },
                  { weight: 700, style: 'normal', src: ['./src/assets/fonts/PogacaDisplayBold.woff2'] },
                  { weight: 900, style: 'normal', src: ['./src/assets/fonts/PogacaDisplayBlack.woff2'] },
              ],
          },
      },
      {
          provider: fontProviders.local(),
          name: 'Bread Body',
          cssVariable: '--font-breadBody',
          fallbacks: ['sans-serif'],
          options: {
              variants: [
                  { weight: 300, style: 'normal', src: ['./src/assets/fonts/PogacaBodyLight.woff2'] },
                  { weight: 400, style: 'normal', src: ['./src/assets/fonts/PogacaBodyRegular.woff2'] },
                  { weight: 700, style: 'normal', src: ['./src/assets/fonts/PogacaBodyBold.woff2'] },
              ],
          },
      },
  ],

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
          // Per-page Open Graph images (src/routeData.ts → src/pages/og/)
          routeMiddleware: './src/routeData.ts',
          // Square code frames to match the design system (0px radius everywhere)
          expressiveCode: {
              styleOverrides: {
                  borderRadius: '0px',
                  borderColor: 'var(--bread-border-strong)',
              },
          },
          customCss: [
              // Path to Tailwind CSS entry with Starlight integration
              './src/styles/global.css',
          ],
          components: {
              // Override SiteTitle with Bread logo
              SiteTitle: './src/overrides/SiteTitle.astro',
              MarkdownContent: './src/overrides/MarkdownContent.astro',
              // Adds the Astro Fonts API <Font /> tags (preload + @font-face)
              Head: './src/overrides/Head.astro',
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
          ],
          social: [
              { icon: 'github', label: 'GitHub', href: 'https://github.com/BreadchainCoop' },
              { icon: 'discord', label: 'Discord', href: 'https://discord.com/invite/zmNqsHRHDa' },
              { icon: 'x.com', label: 'X', href: 'https://x.com/breadcoop' },
          ],
          sidebar: [
              { label: 'Our Manifesto', link: '/manifesto/' },
              {
                  label: 'Bread Cooperative',
                  items: [{ autogenerate: { directory: 'cooperative' } }],
              },
              {
                  label: 'Get Involved',
                  items: [{ autogenerate: { directory: 'get-involved' } }],
              },
              {
                  label: 'Solidarity Tools',
                  items: [{ autogenerate: { directory: 'tools' } }],
              },
              { label: 'Contact & Links', link: '/contact/' },
          ],
          markdown: {
              processedDirs: ['./src/content/projects/'],
          },
      }),
      keystatic(),
      // Card Maker at /og/maker/ — dev server only, never built
      ogMaker(),
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
