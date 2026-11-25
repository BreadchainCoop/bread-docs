/**
 * Page → social-card content. Pure (no `astro:content`), so the build
 * (./content.ts), the Card Maker and the custom-card script
 * (scripts/og-custom.ts) all derive the same card from the same frontmatter.
 */
import type { CardContent } from './template';

/** Card variant shipped site-wide. 'meta' adds the section trail and a DOCS label. */
export const CARD_VARIANT: 'classic' | 'meta' = 'meta';

export type CardPage = {
	/** Starlight entry id, e.g. "tools/stacks/how-stacks-works" (no trailing /index). */
	id: string;
	/** Source path; overview pages are index.md files. */
	filePath?: string;
	data: {
		title: string;
		description?: string;
		og?: { title?: string; description?: string; image?: string; alt?: string };
	};
};

/** Folder id ("tools/stacks") → sidebar label ("Stacks"), from the _meta.yml files. */
export type SectionLabels = Map<string, string | undefined>;

export const homeCard = (): CardContent => ({
	title: 'Bread Docs',
	tagline: 'Everything you need to know in one place.',
	meta: CARD_VARIANT === 'meta' ? { trail: [] } : undefined,
});

/** The Updates index (src/pages/updates/index.astro sets the same og.description). */
export const updatesCard = (): CardContent => ({
	title: 'Updates',
	tagline: 'News from Bread Cooperative.',
	meta: CARD_VARIANT === 'meta' ? { trail: [] } : undefined,
});

const humanise = (s: string) => s.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

export function cardFromPage(page: CardPage, labels: SectionLabels): CardContent {
	// Starlight drops the trailing /index from ids, so check the source file
	const isOverview = /(^|\/)index\.mdx?$/.test(page.filePath ?? '');
	const segments = page.id.split('/');
	const dirs = isOverview ? segments : segments.slice(0, -1);
	const trail = dirs.map((_, i) => labels.get(dirs.slice(0, i + 1).join('/')) ?? humanise(dirs[i]));

	const og = page.data.og ?? {};
	// "Overview" says nothing in a feed; an overview's card uses the section name.
	const title = og.title || (isOverview && trail.length ? trail.at(-1)! : page.data.title);

	return {
		title,
		tagline: og.description,
		taglineFallback: page.data.description,
		meta:
			CARD_VARIANT === 'meta'
				? // An overview's own section is already its headline
					{ trail: isOverview ? trail.slice(0, -1) : trail }
				: undefined,
	};
}

/** Public path of a page's generated card. */
export const cardPath = (id: string) => `/og/${id || 'index'}.png`;

/** File name and public path for a page's custom card. */
export const customCardPaths = (id: string) => {
	const name = `${(id || 'index').replace(/\//g, '-')}.png`;
	return { file: `public/og/custom/${name}`, url: `/og/custom/${name}` };
};
