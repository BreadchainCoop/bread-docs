/**
 * Starlight route middleware: points each page's Open Graph / Twitter image at
 * its generated card (src/pages/og/[...slug].png.ts), or at the custom image a
 * page sets with `og.image` in frontmatter.
 * https://starlight.astro.build/guides/route-data/
 */
import { defineRouteMiddleware } from '@astrojs/starlight/route-data';
import type { CollectionEntry } from 'astro:content';
import { cardFor, cardPath, homeCard } from './lib/og/content';
import { loadFonts } from './lib/og/render';
import { taglineLines, type CardContent } from './lib/og/template';

export const onRequest = defineRouteMiddleware(async (context) => {
	const route = context.locals.starlightRoute;
	const og = route.entry.data.og;
	const image = new URL(og?.image || cardPath(route.id), context.site);
	const alt = og?.alt || (await cardAlt(route.id ? await cardFor(route.entry as CollectionEntry<'docs'>) : homeCard()));

	route.head.push(
		{ tag: 'meta', attrs: { property: 'og:image', content: image.href } },
		{ tag: 'meta', attrs: { property: 'og:image:type', content: 'image/png' } },
		{ tag: 'meta', attrs: { property: 'og:image:width', content: '1200' } },
		{ tag: 'meta', attrs: { property: 'og:image:height', content: '630' } },
		{ tag: 'meta', attrs: { property: 'og:image:alt', content: alt } },
		{ tag: 'meta', attrs: { name: 'twitter:image', content: image.href } },
		{ tag: 'meta', attrs: { name: 'twitter:image:alt', content: alt } }
	);
});

/** Alt text that reads the card as rendered, e.g. "Our Manifesto. What drives our Cooperative." */
async function cardAlt(card: CardContent) {
	const shownLine = taglineLines(await loadFonts(), card).join(' ');
	return [card.title, shownLine].filter(Boolean).join('. ');
}
