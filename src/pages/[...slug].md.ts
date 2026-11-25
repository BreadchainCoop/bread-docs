import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';

/**
 * Markdown version of every docs page at `<page>.md`, used by the
 * starlight-page-actions "Copy Markdown" / "View in Markdown" actions and by
 * AI tools (see /llms.txt).
 *
 * The plugin also copies raw .md files, but with the Netlify adapter they land
 * in the server bundle (.netlify/build) rather than the published `dist/`, so
 * they 404 in production. This static file endpoint builds them into `dist/`
 * and leaves out draft pages and `:::draft` blocks, which the raw copy would
 * publish.
 * https://docs.astro.build/en/guides/endpoints/#static-file-endpoints
 */
export const getStaticPaths = (async () => {
	const docs = await getCollection('docs', (d) => !d.data.draft);
	return docs
		.filter((entry) => entry.id !== 'index')
		.map((entry) => ({ params: { slug: entry.id }, props: { entry } }));
}) satisfies GetStaticPaths;

type Props = { entry: CollectionEntry<'docs'> };

const stripDrafts = (md: string) =>
	md.replace(/^:::draft\b[\s\S]*?^:::\s*$/gm, '').replace(/\n{3,}/g, '\n\n');

export const GET = (({ props }) => {
	const { title, description } = props.entry.data;
	const body = stripDrafts(props.entry.body ?? '').trim();
	return new Response(
		[`# ${title}`, description ? `\n> ${description}` : '', '', body, ''].join('\n'),
	);
}) satisfies APIRoute<Props>;
