/**
 * Bread social card (Open Graph image) template.
 *
 * Pure layout: takes card content + loaded fonts and returns a Satori element
 * tree. Rendering (Satori → SVG → PNG) lives in ./render.ts so the same
 * template can be reused by the build, tests and the off-site card maker.
 *
 * Geometry reproduces the original "BREAD WIKI" card (3840×2160) measured and
 * re-expressed on a 1200px-wide canvas. Heights other than 675 (16:9) shift
 * the type block up proportionally so 1200×630 (the 1.91:1 size Facebook,
 * LinkedIn, Slack and Discord display uncropped) keeps the same margins.
 */
import * as opentype from 'opentype.js';
import type { Font } from 'opentype.js';
import { outlineDataUri } from './outline';

export const BRAND = {
	paper: '#F6F3EB',
	ink: '#1B201A',
	orange: '#EA6023',
	// Outline = orange at 50% over paper, flattened so it never stacks darker
	outline: '#F0AA87',
	// Orange at 25% over paper: the underlay behind custom-card art
	outlineSoft: '#F3CEB9',
	tagline: '#808080',
	meta: '#595959',
} as const;

export type CardFonts = {
	display: ArrayBuffer; // Pogaca Display Black
	bodyBold: ArrayBuffer; // Pogaca Body Bold
	bodyRegular: ArrayBuffer; // Pogaca Body Regular
};

export type CardContent = {
	/**
	 * The card headline, usually the page title, in orange. A leading "Bread"
	 * prints in ink on its own line: "Bread Docs" → BREAD / DOCS.
	 */
	title: string;
	/** Right-aligned grey line under the headline: one short sentence. Wraps to 2 lines at most, then ends in "…". */
	tagline?: string;
	/** Used only when `tagline` is unset and this fits on one line uncut (e.g. a page's meta description). */
	taglineFallback?: string;
	/**
	 * Custom cards: a cut-out image (transparent PNG/SVG data URI or URL)
	 * anchored bottom-right. The loaf outline becomes a pale underlay behind it.
	 */
	art?: { src: string; width: number; height: number };
	/** Metadata variant only. */
	meta?: {
		/** Sections above the page, e.g. ["Solidarity Tools", "Stacks"]. Empty for top-level pages. */
		trail?: string[];
	};
};

export type CardOptions = { width?: number; height?: number; /** Pixel density multiplier for the PNG (2 = retina proof). */ scale?: number };

const W = 1200;
const REF_H = 675; // reference artboard height (16:9) at W
const PAD_X = 36;
const TITLE_MAX = 193; // px, Display Black — cap height 136px as on the original
const TITLE_PITCH = 0.794; // line pitch / font size, measured
const DISPLAY = { ascent: 0.75, descent: 0.25, cap: 0.706 };

type El = { type: string; props: Record<string, unknown> };
const h = (type: string, style: Record<string, unknown>, children?: unknown, extra: Record<string, unknown> = {}): El => ({
	type,
	props: { style, children, ...extra },
});

// opentype.js is CommonJS under Node (only a default export) and ESM with
// named exports in the browser bundle; take `parse` from whichever exists.
const parseFont: typeof opentype.parse =
	(opentype as unknown as { default?: typeof opentype }).default?.parse ?? opentype.parse;
const fontCache = new WeakMap<ArrayBuffer, Font>();
const parse = (buf: ArrayBuffer) => {
	let f = fontCache.get(buf);
	if (!f) fontCache.set(buf, (f = parseFont(buf)));
	return f;
};

const TRACKING = -0.025; // em, Display title
const measure = (font: Font, text: string, size: number) =>
	font.getAdvanceWidth(text, size, { kerning: true }) + TRACKING * size * (text.length - 1);

const TAG = { size: 40, lh: 1.15, width: 820 }; // tagline: Body Bold

/** Wraps body text into at most `max` lines, ending on a whole word + "…" if it overflows. */
function clampLines(font: Font, text: string, size: number, maxWidth: number, max: number) {
	const fits = (t: string) => font.getAdvanceWidth(t, size, { kerning: true }) <= maxWidth;
	const lines: string[] = [];
	let line = '';
	const words = text.trim().split(/\s+/);
	for (let i = 0; i < words.length; i++) {
		const next = line ? `${line} ${words[i]}` : words[i];
		if (fits(next)) {
			line = next;
			continue;
		}
		lines.push(line);
		line = words[i];
		if (lines.length === max) {
			let last = lines[max - 1].replace(/[\s,;:—–-]+$/, '');
			while (!fits(`${last}…`) && last.includes(' ')) last = last.slice(0, last.lastIndexOf(' ')).replace(/[\s,;:—–-]+$/, '');
			lines[max - 1] = `${last}…`;
			return lines;
		}
	}
	if (line) lines.push(line);
	return lines;
}

/** Lines the tagline will take on the card; [] when there is none to show. */
export function taglineLines(fonts: CardFonts, content: Pick<CardContent, 'tagline' | 'taglineFallback'>, width = TAG.width) {
	const font = parse(fonts.bodyBold);
	if (content.tagline) return clampLines(font, content.tagline, TAG.size, width, 2);
	const fallback = content.taglineFallback?.trim();
	return fallback && font.getAdvanceWidth(fallback, TAG.size, { kerning: true }) <= width ? [fallback] : [];
}

/** Greedy word wrap at `size`; returns null if a single word overflows. */
function wrap(font: Font, text: string, size: number, maxWidth: number): string[] | null {
	const words = text.split(/\s+/).filter(Boolean);
	const lines: string[] = [];
	let line = '';
	for (const word of words) {
		const next = line ? `${line} ${word}` : word;
		if (measure(font, next, size) <= maxWidth) line = next;
		else {
			if (!line) return null;
			lines.push(line);
			line = word;
			if (measure(font, word, size) > maxWidth) return null;
		}
	}
	if (line) lines.push(line);
	return lines;
}

const TWO_LINE_MIN = 112; // below this, a third line reads better than smaller type

/**
 * Largest size ≤ TITLE_MAX at which the headline fits the column, with first
 * cap top to last baseline ≤ budgetPx. Two lines are preferred: a third line
 * is used only when two would need type smaller than TWO_LINE_MIN.
 */
export function fitTitle(fonts: CardFonts, lead: string, title: string, budgetPx: number, maxWidth = W - PAD_X * 2) {
	const font = parse(fonts.display);
	for (const [maxLines, minSize] of [
		[2, TWO_LINE_MIN],
		[3, 72],
	]) {
		for (let size = TITLE_MAX; size >= minSize; size -= 1) {
			const leadLines = wrap(font, lead, size, maxWidth);
			const titleLines = wrap(font, title, size, maxWidth);
			if (!leadLines || !titleLines) continue;
			const n = leadLines.length + titleLines.length;
			if (n > maxLines) continue;
			if (blockHeight(n, size) <= budgetPx) return { size, leadLines, titleLines };
		}
	}
	return { size: 72, leadLines: lead ? [lead] : [], titleLines: [title] };
}

/** First cap top to last baseline of an n-line headline. */
const blockHeight = (n: number, size: number) => (n - 1) * size * TITLE_PITCH + DISPLAY.cap * size;

/** Satori font list for the loaded faces. */
export const satoriFonts = (fonts: CardFonts) => [
	{ name: 'Bread Display', data: fonts.display, weight: 900 as const, style: 'normal' as const },
	{ name: 'Bread Body', data: fonts.bodyBold, weight: 700 as const, style: 'normal' as const },
	{ name: 'Bread Body', data: fonts.bodyRegular, weight: 400 as const, style: 'normal' as const },
];

export function bakeCard(content: CardContent, fonts: CardFonts, opts: CardOptions = {}) {
	const width = opts.width ?? W;
	const height = opts.height ?? 630;
	const k = (REF_H - height) * 0.6; // vertical shift for non-16:9 artboards
	const meta = content.meta;

	// A leading "Bread" goes in ink on its own line; everything else is orange
	const words = content.title.trim().toUpperCase().split(/\s+/);
	const lead = words.length > 1 && words[0] === 'BREAD' ? words.shift()! : '';
	const title = words.join(' ');
	const capTop = 116 - k + (meta?.trail?.length ? 8 : 0);
	const taglineBaseline = 514.5 - k;
	const art = content.art;
	// With art, text on the right stops short of the picture
	const rightEdge = art ? 34 + art.width + 28 : 29.8;
	const tagWidth = Math.min(TAG.width, W - rightEdge - PAD_X);
	const tagLines = taglineLines(fonts, content, tagWidth);
	// Lowest point the title's last baseline may reach: clear of the tagline's cap height
	const titleFloor = tagLines.length
		? taglineBaseline - (tagLines.length - 1) * TAG.size * TAG.lh - TAG.size * 0.723 - 52
		: height - 110;
	// With art, the title column stops short of the picture
	const fit = fitTitle(fonts, lead, title, titleFloor - capTop, art ? W - art.width - PAD_X - 40 : undefined);
	const S = fit.size;
	// Centre the headline on where the original two-line headline sits, so one
	// line or smaller type doesn't hug the top edge; keep it inside its band.
	const refCentre = capTop + blockHeight(2, TITLE_MAX) / 2;
	const hBlock = blockHeight(fit.leadLines.length + fit.titleLines.length, S);
	const blockTop = Math.max(capTop, Math.min(refCentre - hBlock / 2, titleFloor - hBlock));
	// Cap top of the first line sits (ascent - cap - half-leading) below the box top
	const firstCapOffset = ((TITLE_PITCH - 1) / 2 + DISPLAY.ascent - DISPLAY.cap) * S;

	const titleLine = (text: string, color: string) =>
		h('div', { display: 'flex', color, height: S * TITLE_PITCH, lineHeight: TITLE_PITCH, whiteSpace: 'nowrap' }, text);

	// Loaf outline. Default: large, cropped off the top-right corner (fitted to
	// the original artwork: centred on (1014, 104), rotated −90°). With art: a
	// larger, paler underlay centred behind the top of the picture.
	const ring = art
		? { size: 620, cx: W - 34 - art.width / 2, cy: height - art.height + 20, stroke: 3, rot: -90, color: BRAND.outlineSoft }
		: { size: 604, cx: 1014, cy: 104 - k, stroke: 3.6, rot: -90, color: BRAND.outline };
	const children: El[] = [
		h('img', { position: 'absolute', left: ring.cx - ring.size / 2, top: ring.cy - ring.size / 2, width: ring.size, height: ring.size, transform: `rotate(${ring.rot}deg)` }, undefined, {
			src: outlineDataUri({ color: ring.color, sizePx: ring.size, strokePx: ring.stroke }),
			width: ring.size,
			height: ring.size,
		}),
		...(art
			? [
					h('img', { position: 'absolute', right: 34, bottom: 0, width: art.width, height: art.height, objectFit: 'contain', objectPosition: 'bottom' }, undefined, {
						src: art.src,
						width: art.width,
						height: art.height,
					}),
				]
			: []),
		// Title block
		h(
			'div',
			{
				position: 'absolute',
				left: PAD_X - 6,
				top: blockTop - firstCapOffset,
				display: 'flex',
				flexDirection: 'column',
				fontFamily: 'Bread Display',
				fontWeight: 900,
				fontSize: S,
				letterSpacing: TRACKING * S, // the original is set tight enough for E and A to touch
			},
			[...fit.leadLines.map((l) => titleLine(l, BRAND.ink)), ...fit.titleLines.map((l) => titleLine(l, BRAND.orange))]
		),
	];

	if (tagLines.length) {
		children.push(
			h(
				'div',
				{
					position: 'absolute',
					right: rightEdge,
					// 2-line clamp grows upward from the baseline
					bottom: height - taglineBaseline - ((TAG.lh - 1) / 2 + 0.2) * TAG.size - 2,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'flex-end',
					fontFamily: 'Bread Body',
					fontWeight: 700,
					fontSize: TAG.size,
					lineHeight: TAG.lh,
					letterSpacing: -0.08,
					color: BRAND.tagline,
				},
				tagLines.map((l) => h('div', { display: 'flex', whiteSpace: 'nowrap' }, l))
			)
		);
	}

	if (meta?.trail?.length) {
		children.push(
			h(
				'div',
				{
					position: 'absolute',
					left: PAD_X - 6,
					top: 40 - k * 0.5,
					display: 'flex',
					alignItems: 'center',
					gap: 12,
					fontFamily: 'Bread Body',
					fontWeight: 700,
					fontSize: 20,
					letterSpacing: 1.2,
					textTransform: 'uppercase',
					color: BRAND.meta,
				},
				meta.trail.flatMap((t, i) => [
					...(i ? [h('div', { display: 'flex', width: 18, height: 2, backgroundColor: BRAND.orange })] : []),
					h('div', { display: 'flex', color: i === meta.trail!.length - 1 ? BRAND.ink : BRAND.meta }, t),
				])
			)
		);
	}

	// Lockup: round logomark + BREAD COOPERATIVE (+ DOCS in the metadata variant)
	const lockupCenter = height - 43;
	children.push(
		h(
			'div',
			{
				position: 'absolute',
				left: 28,
				top: lockupCenter - 11,
				height: 26,
				display: 'flex',
				alignItems: 'center',
				fontFamily: 'Bread Body',
				fontWeight: 700,
				fontSize: 25,
				color: BRAND.ink,
			},
			[
				h('img', { width: 24.4, height: 24.4, marginRight: 10 }, undefined, { src: LOGO_URI, width: 24.4, height: 24.4 }),
				h('div', { display: 'flex' }, 'BREAD COOPERATIVE'),
				...(meta
					? [
							h('div', { display: 'flex', width: 1.5, height: 22, backgroundColor: BRAND.ink, opacity: 0.35, margin: '0 12px' }),
							h('div', { display: 'flex', fontWeight: 400 }, 'DOCS'),
						]
					: []),
			]
		)
	);

	return h(
		'div',
		{ display: 'flex', position: 'relative', width, height, backgroundColor: BRAND.paper, overflow: 'hidden' },
		children
	);
}

const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><path fill="${BRAND.orange}" d="M20 0C31.0457 0 39.9999 8.95421 40 20C40 31.0459 31.0457 40 20 40C8.9543 39.9999 0 31.0458 0 20C8.24632e-05 8.95424 8.95435 5.25753e-05 20 0ZM24.6816 6.58496C20.9513 2.773 14.4934 4.62406 14.0166 10.1357C13.4214 16.4275 8.85619 13.0113 5.46484 16.5107C4.46239 17.6659 3.86527 19.2814 4.06543 20.8008C4.35857 22.914 5.99941 24.7165 8.09277 25.2275C10.4737 25.8629 12.9424 25.5824 13.748 28.5078C14.2079 30.4452 14.0501 32.2355 15.6523 33.7471C18.4496 36.38 23.5172 36.0617 25.332 32.502C25.9642 31.3881 26.0581 30.0724 26.292 28.8398C26.5292 27.5322 27.3122 26.4841 28.543 26.0381C30.2134 25.3804 32.2957 25.4971 33.833 24.417C35.4464 23.3267 36.3142 21.2439 36.0244 19.3301L36.0215 19.3096L36.0225 19.3105C35.7057 17.2422 33.9972 15.5159 32.0381 14.9053C30.8767 14.5176 29.5876 14.545 28.4531 14.0732C27.4295 13.6832 26.7349 12.8319 26.4238 11.791C25.9047 9.94326 26.134 8.10776 24.6816 6.58496ZM19.126 15.4727C23.0544 15.0457 25.7199 17.0824 25.0889 21.1914L25.084 21.2119V21.2109C24.7562 23.108 23.4449 24.3204 21.5674 24.5703C20.4297 24.7495 19.1356 24.7197 18.0146 24.4531C17.4026 24.303 16.8413 24.0578 16.3926 23.6992C14.8397 22.4017 14.5858 19.8311 15.3174 17.999C15.9439 16.4674 17.5071 15.633 19.126 15.4727Z"/></svg>`;
// btoa (not Buffer) so the template also runs in the browser (Card Maker)
const LOGO_URI = `data:image/svg+xml;base64,${btoa(LOGO_SVG)}`;
