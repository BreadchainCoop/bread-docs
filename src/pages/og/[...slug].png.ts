/**
 * Social card for every docs page, prerendered to /og/<page-id>.png at build
 * time (static output: no runtime function). The home page is /og/index.png.
 * Pages that set `og.image` in frontmatter use that file instead (see
 * src/routeData.ts) and are skipped here.
 */
import type { APIRoute, GetStaticPaths, InferGetStaticPropsType } from 'astro';
import { getCollection } from 'astro:content';
import { cardFor, homeCard } from '../../lib/og/content';
import { renderCard } from '../../lib/og/render';

export const getStaticPaths = (async () => {
	const docs = await getCollection('docs', (e) => !e.data.draft && !e.data.og?.image && e.id !== 'index');
	const missing = docs.filter((e) => !e.data.og?.description).map((e) => e.id);
	if (missing.length)
		console.warn(
			`[og] ${missing.length} page(s) have no "Card line" (og.description); their cards show the page description only if it fits on one line:\n  ${missing.join('\n  ')}`
		);
	return [
		{ params: { slug: 'index' }, props: { card: homeCard() } },
		...(await Promise.all(docs.map(async (entry) => ({ params: { slug: entry.id }, props: { card: await cardFor(entry) } })))),
	];
}) satisfies GetStaticPaths;

type Props = InferGetStaticPropsType<typeof getStaticPaths>;

export const GET = (async ({ props }) =>
	new Response(new Uint8Array(await renderCard(props.card)), {
		headers: { 'Content-Type': 'image/png' },
	})) satisfies APIRoute<Props>;
