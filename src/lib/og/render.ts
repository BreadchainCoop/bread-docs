/**
 * Satori → SVG → PNG. Runs at build time only (prerendered endpoints), so the
 * deployed site serves plain static PNGs. sharp is already a dependency of
 * Astro's image service, so no extra native renderer is needed.
 */
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import satori from 'satori';
import sharp from 'sharp';
import { bakeCard, satoriFonts, type CardContent, type CardFonts, type CardOptions } from './template';

// Resolved from the project root: this module is bundled into a chunk at build
// time, so paths relative to import.meta.url would point into the build dir.
const fontUrl = (name: string) => resolve('src/lib/og/fonts', `${name}.woff`);
let fontsPromise: Promise<CardFonts> | undefined;

export function loadFonts(): Promise<CardFonts> {
	fontsPromise ??= Promise.all(
		['PogacaDisplayBlack', 'PogacaBodyBold', 'PogacaBodyRegular'].map(async (n) => {
			const buf = await readFile(fontUrl(n));
			return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer;
		})
	).then(([display, bodyBold, bodyRegular]) => ({ display, bodyBold, bodyRegular }));
	return fontsPromise;
}

export async function renderCard(content: CardContent, opts: CardOptions = {}) {
	const fonts = await loadFonts();
	const width = opts.width ?? 1200;
	const height = opts.height ?? 630;
	const svg = await satori(bakeCard(content, fonts, { width, height }) as never, {
		width,
		height,
		fonts: satoriFonts(fonts),
	});
	return sharp(Buffer.from(svg), { density: 72 * (opts.scale ?? 1) })
		.png({ compressionLevel: 9, palette: true, quality: 90 })
		.toBuffer();
}
