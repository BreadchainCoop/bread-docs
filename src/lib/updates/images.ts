/**
 * Points a post's images at the site's image service. On Netlify that is the
 * Netlify Image CDN (/.netlify/images?url=…), which resizes and converts on
 * first request and caches at the edge: no build-time image work, and
 * readers' browsers never contact Paragraph's storage directly.
 * Remote sources must be allowed by `image.remotePatterns` in astro.config.mjs
 * (the Netlify adapter turns that into the CDN's allowlist).
 * https://docs.astro.build/en/guides/integrations-guide/netlify/#netlify-image-cdn-support
 */
import { getImage } from 'astro:assets';
import type { Update } from './loader';

/** Content column is 45rem; 2× for dense screens. */
const MAX = 1440;
const WIDTHS = [480, 960, MAX];
const SIZES = '(min-width: 50rem) 45rem, 100vw';

const escapeAttr = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');

export async function withOptimisedImages(html: string, images: Update['images']) {
	let out = html;
	for (const img of new Map(images.map((i) => [i.src, i])).values()) {
		// Without a known size we can't reserve space or pick widths; leave as is
		if (!img.width || !img.height) continue;
		const width = Math.min(img.width, MAX);
		const height = Math.round((img.height * width) / img.width);
		const result = await getImage({
			src: img.src,
			width,
			height,
			widths: WIDTHS.filter((w) => w < width).concat(width),
			sizes: SIZES,
		});
		const from = `src="${escapeAttr(img.src)}"`;
		const to = `src="${escapeAttr(result.src)}" srcset="${escapeAttr(result.srcSet.attribute)}" sizes="${SIZES}" width="${width}" height="${height}"`;
		// The cleaner wrote width/height from the original size; drop them so the scaled ones apply
		const strip = (s: string) => s.replace(/\s(width|height)="\d+"/g, '');
		out = out.replace(
			new RegExp(`<img\\b([^>]*?)\\s${from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^>]*)>`, 'g'),
			(_, before: string, after: string) => `<img ${to}${strip(before)}${strip(after)}>`
		);
	}
	return out;
}

/** Cover cropped to fill a box; `widths` adds a srcset for responsive use. */
export async function coverImage(
	src: string,
	width: number,
	height: number,
	opts: { format?: 'jpg' | 'webp' | 'avif'; widths?: number[] } = {}
) {
	return getImage({ src, width, height, fit: 'cover', format: opts.format, widths: opts.widths });
}
