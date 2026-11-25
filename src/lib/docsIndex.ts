import { getCollection } from 'astro:content';

const SITE = 'https://docs.bread.coop';

/** Top-level sections in sidebar order, keyed by their directory. */
const SECTIONS: { dir: string; label: string }[] = [
	{ dir: 'cooperative', label: 'Bread Cooperative' },
	{ dir: 'get-involved', label: 'Get Involved' },
	{ dir: 'tools', label: 'Solidarity Tools' },
];

/**
 * A Markdown index of every docs page (title, URL, description), grouped like
 * the sidebar. Served at /index.md (the home page's "Copy Markdown" / "View in
 * Markdown" target) and /llms.txt (the conventional location for AI tools).
 */
export async function buildDocsIndex(): Promise<string> {
	const docs = (await getCollection('docs')).filter((d) => !d.data.draft);
	const url = (id: string) => `${SITE}/${id === 'index' ? '' : `${id}/`}`;
	type Doc = (typeof docs)[number];
	const isIndex = (d: Doc) => /(^|\/)index\.mdx?$/.test(d.filePath ?? '');
	const humanize = (seg: string) => seg.replace(/-/g, ' ').replace(/^./, (c) => c.toUpperCase());
	// "Overview" pages are named after their folder, e.g. "Governance overview"
	const titleOf = (d: Doc) => {
		if (d.data.title !== 'Overview') return d.data.title;
		const top = SECTIONS.find((s) => s.dir === d.id);
		return `${top ? top.label : humanize(d.id.split('/').pop() ?? '')} overview`;
	};
	const line = (d: Doc) =>
		`- [${titleOf(d)}](${url(d.id)})${d.data.description ? `: ${d.data.description}` : ''}`;
	// Group by folder, folder overview first, then sidebar order
	const order = (d: Doc) => {
		const dir = isIndex(d) ? d.id : d.id.split('/').slice(0, -1).join('/');
		const n = isIndex(d) ? 0 : (d.data.sidebar?.order ?? 98) + 1;
		return `${dir} ${String(n).padStart(3, '0')} ${d.id}`;
	};

	const topLevel = docs.filter((d) => !d.id.includes('/') && !SECTIONS.some((s) => s.dir === d.id));
	const out: string[] = [
		'# Bread Docs',
		'',
		'> Documentation for Bread Cooperative, a worker-owned collective building financial tools for cooperatives and solidarity-focused communities: the BREAD community currency, the Solidarity Fund, Stacks savings circles, and how the cooperative is governed.',
		'',
		'Every page is also available as Markdown by adding `.md` to its path, for example https://docs.bread.coop/manifesto.md',
		'',
		'## Start here',
		'',
		...topLevel.map(line),
	];

	for (const s of SECTIONS) {
		const pages = docs
			.filter((d) => d.id === s.dir || d.id.startsWith(`${s.dir}/`))
			.sort((a, b) => order(a).localeCompare(order(b)));
		if (!pages.length) continue;
		out.push('', `## ${s.label}`, '', ...pages.map(line));
	}

	out.push(
		'',
		'## Elsewhere',
		'',
		'- [bread.coop](https://bread.coop): Bread Cooperative website',
		'- [Solidarity Fund app](https://fund.bread.coop): bake and burn BREAD, vote on the monthly distribution',
		'- [GitHub](https://github.com/BreadchainCoop): source code for every Bread tool',
		'',
	);
	return out.join('\n');
}
