/**
 * Turns a Paragraph post's `staticHtml` into clean, safe HTML for our pages.
 *
 * - Sanitised with hast-util-sanitize (GitHub's schema plus figures and
 *   tables): no scripts, styles, classes, inline SVG or event handlers.
 * - Paragraph widgets become plain links, so a page makes no third-party
 *   requests: YouTube and X embeds, link previews (embedly), post embeds.
 *   Subscribe, share and paywall (x402) buttons are dropped; each page has
 *   its own link to Paragraph.
 * - Links to other @breadcoop posts point at our /updates/ pages.
 * - Images keep their intrinsic size (from Paragraph's `nextwidth` /
 *   `nextheight`) so pages can request sized copies without layout shift.
 *   See ./images.ts.
 * - h1 inside a post becomes h2 (the page title is the only h1), and
 *   headings are collected for Starlight's table of contents.
 */
import type { Element, Root } from 'hast';
import { fromHtml } from 'hast-util-from-html';
import { defaultSchema, sanitize, type Schema } from 'hast-util-sanitize';
import { selectAll } from 'hast-util-select';
import { toHtml } from 'hast-util-to-html';
import { toString } from 'hast-util-to-string';
import { h } from 'hastscript';

export type Heading = { depth: number; slug: string; text: string };
export type PostImage = { src: string; width?: number; height?: number; alt: string };

const schema: Schema = {
	...defaultSchema,
	// Keep Paragraph's heading ids (h-what-happened) so in-page links work
	clobberPrefix: '',
	tagNames: [...(defaultSchema.tagNames ?? []), 'figure', 'figcaption'],
	attributes: {
		...defaultSchema.attributes,
		a: ['href', 'title'],
		img: ['src', 'alt', 'title', 'width', 'height'],
		'*': ['id'],
	},
	protocols: { ...defaultSchema.protocols, href: ['http', 'https', 'mailto'], src: ['https'] },
};

const attr = (el: Element, name: string) => {
	const v = el.properties?.[name];
	return typeof v === 'string' ? v : Array.isArray(v) ? v.join(' ') : v == null ? undefined : String(v);
};
const json = (value: string | undefined) => {
	try {
		return value ? JSON.parse(value) : undefined;
	} catch {
		return undefined;
	}
};

/** Replaces Paragraph widgets (by data-type) with plain HTML. `undefined` drops the node. */
function widget(el: Element, internal: (url: string) => string): Element | null | undefined {
	const type = attr(el, 'dataType');
	const link = (href: string, label: string) =>
		h('p', [h('a', { href }, label)]);
	switch (type) {
		case 'youtube': {
			const id = attr(el, 'videoid');
			return id ? link(`https://www.youtube.com/watch?v=${encodeURIComponent(id)}`, 'Watch the video on YouTube') : undefined;
		}
		case 'twitter': {
			// Keep the post's words and author; drop the widget chrome
			const id = attr(el, 'tweetid');
			if (!id) return undefined;
			// Line breaks would otherwise run words together
			for (const br of selectAll('.twitter-body br', el)) Object.assign(br, { type: 'text', value: ' ' });
			const body = selectAll('.twitter-body', el).map((n) => toString(n).replace(/\s+/g, ' ').trim())[0];
			const name = selectAll('.twitter-displayname', el).map((n) => toString(n).trim())[0];
			const handle = selectAll('.twitter-username', el).map((n) => toString(n).trim())[0];
			const by = [name, handle && `(${handle})`].filter(Boolean).join(' ');
			return h('blockquote', [
				body ? h('p', body) : null,
				h('p', [by ? `${by} on ` : '', h('a', { href: `https://x.com/i/status/${encodeURIComponent(id)}` }, 'X')]),
			]);
		}
		case 'embedly': {
			const data = json(attr(el, 'data'));
			const href = data?.url ?? attr(el, 'src');
			return href ? link(href, data?.title ?? href) : undefined;
		}
		case 'paragraphEmbed': {
			const post = json(attr(el, 'data'))?.post;
			return post?.slug ? link(internal(post.slug), post.title ?? 'Read the update') : undefined;
		}
		case 'subscribeButton':
		case 'shareButton':
		case 'x402Embed':
			return undefined;
		default:
			return null; // not a widget: keep walking
	}
}

export function cleanPostHtml(
	html: string,
	opts: { publicationSlug: string; internalPath: (slug: string) => string }
) {
	const tree = fromHtml(html, { fragment: true });
	const own = new RegExp(`^https://paragraph\\.(?:com|xyz)/@${opts.publicationSlug}/([^/?#]+)/?$`);

	const walk = (parent: Root | Element) => {
		const next: (Root | Element)['children'] = [];
		for (const child of parent.children) {
			if (child.type !== 'element') {
				if (child.type !== 'comment') next.push(child);
				continue;
			}
			const replaced = attr(child, 'dataType') ? widget(child, opts.internalPath) : null;
			if (replaced === undefined) continue;
			const el = replaced ?? child;
			if (el.tagName === 'svg') continue;
			// Images: carry Paragraph's intrinsic size into width/height
			if (el.tagName === 'img') {
				const w = Number(attr(el, 'nextwidth')), hgt = Number(attr(el, 'nextheight'));
				if (w > 0 && hgt > 0) Object.assign(el.properties, { width: w, height: hgt });
			}
			// Empty captions are hidden on Paragraph; drop them
			if (el.tagName === 'figcaption' && !toString(el).trim()) continue;
			if (el.tagName === 'h1') el.tagName = 'h2';
			if (el.tagName === 'a') {
				const m = attr(el, 'href')?.match(own);
				if (m) el.properties.href = opts.internalPath(m[1]);
			}
			if (el !== child) {
				next.push(el);
			} else {
				walk(el);
				next.push(el);
			}
		}
		parent.children = next as typeof parent.children;
	};
	walk(tree);

	const clean = sanitize(tree, schema) as Root;

	const headings: Heading[] = [];
	const images: PostImage[] = [];
	const used = new Set<string>();
	for (const el of selectAll('h2, h3, h4', clean)) {
		const label = toString(el).trim();
		if (!label) continue;
		let slug = attr(el, 'id') || label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
		while (used.has(slug)) slug += '-1';
		used.add(slug);
		el.properties.id = slug;
		headings.push({ depth: Number(el.tagName[1]), slug, text: label });
	}
	for (const el of selectAll('img', clean)) {
		const src = attr(el, 'src');
		if (!src) continue;
		el.properties.loading = 'lazy';
		el.properties.decoding = 'async';
		el.properties.alt ??= '';
		images.push({
			src,
			width: Number(attr(el, 'width')) || undefined,
			height: Number(attr(el, 'height')) || undefined,
			alt: attr(el, 'alt') ?? '',
		});
	}

	const out = toHtml(clean).replace(/<p>\s*<\/p>/g, '');
	return { html: out, headings, images, text: toString(clean) };
}

/** First sentence-ish of the post body, for posts without a subtitle. */
export function excerpt(text: string, max = 160) {
	const flat = text.replace(/\s+/g, ' ').trim();
	if (flat.length <= max) return flat;
	const cut = flat.slice(0, max);
	return `${cut.slice(0, cut.lastIndexOf(' '))}…`;
}
