import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';

/**
 * Markdown version of every docs page at `<page>.md`, used by the
 * starlight-page-actions "Copy Markdown" / "View in Markdown" actions and by
 * AI tools (see /llms.txt).
 *
 * The plugin also copies raw .md files, but with the Netlify adapter they land
 * in the server bundle (.netlify/build) rather than the published `dist/`, so
 * they 404 in production. Generating them here puts them in `dist/` and lets
 * us drop draft pages and `:::draft` blocks, which the raw copy would publish.
 */
export const prerender = true;

export const getStaticPaths = (async () => {
	const docs = await getCollection('docs', (d) => !d.data.draft);
	return docs
		.filter((d) => d.id !== 'index')
		.map((entry) => ({ params: { slug: entry.id }, props: { entry } }));
}) satisfies GetStaticPaths;

const stripDrafts = (md: string) => md.replace(/^:::draft\b[\s\S]*?^:::\s*$/gm, '').replace(/\n{3,}/g, '\n\n');

export const GET: APIRoute<{ entry: CollectionEntry<'docs'> }> = ({ props }) => {
	const { title, description } = props.entry.data;
	const body = stripDrafts(props.entry.body ?? '').trim();
	const md = [`# ${title}`, description ? `\n> ${description}` : '', '', body, ''].join('\n');
	return new Response(md, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
};
