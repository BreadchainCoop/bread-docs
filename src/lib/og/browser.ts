/**
 * Browser renderer for the Card Maker (src/tools/og-maker.astro). Runs the
 * same template as the build (./template.ts) so a custom card can't drift
 * from the generated ones. Output: 1200×630 PNG via an offscreen canvas.
 */
import satori from 'satori';
import { ART_SCALE, ART_WORKING, fitScale, normaliseArt, slotSize, type ArtOptions } from './art';
import { bakeCard, satoriFonts, type CardContent, type CardFonts } from './template';
import displayUrl from './fonts/PogacaDisplayBlack.woff?url';
import bodyBoldUrl from './fonts/PogacaBodyBold.woff?url';
import bodyRegularUrl from './fonts/PogacaBodyRegular.woff?url';

export const CARD = { width: 1200, height: 630 } as const;

let fontsPromise: Promise<CardFonts> | undefined;
function loadFonts() {
	const get = (url: string) => fetch(url).then((r) => r.arrayBuffer());
	fontsPromise ??= Promise.all([get(displayUrl), get(bodyBoldUrl), get(bodyRegularUrl)]).then(
		([display, bodyBold, bodyRegular]) => ({ display, bodyBold, bodyRegular })
	);
	return fontsPromise;
}

export async function renderSvg(content: CardContent) {
	const fonts = await loadFonts();
	return satori(bakeCard(content, fonts, CARD) as never, { ...CARD, fonts: satoriFonts(fonts) });
}

const loadImage = (src: string) =>
	new Promise<HTMLImageElement>((resolve, reject) => {
		const img = new Image();
		img.onload = () => resolve(img);
		img.onerror = () => reject(new Error('Could not read that image.'));
		img.src = src;
	});

export async function svgToPng(svg: string): Promise<Blob> {
	const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
	try {
		const img = await loadImage(url);
		const canvas = Object.assign(document.createElement('canvas'), CARD);
		canvas.getContext('2d')!.drawImage(img, 0, 0, CARD.width, CARD.height);
		return await new Promise((resolve, reject) =>
			canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Could not export the PNG.'))), 'image/png')
		);
	} finally {
		URL.revokeObjectURL(url);
	}
}

/** Largest file and pixel count the browser is asked to decode. */
export const ART_LIMITS = { bytes: 50 * 1024 * 1024, pixels: 100_000_000 } as const;

export type PreparedArt = {
	src: string;
	width: number;
	height: number;
	transparent: boolean;
	backgroundRemoved: boolean;
	notes: string[];
};

/**
 * Prepares an uploaded picture for the art slot, entirely in this browser:
 * decodes it (any raster format the browser supports, EXIF rotation applied),
 * scales it down to a working size, removes a plain background, turns it
 * greyscale, trims empty edges and fits it to the slot. Re-encoding through a
 * canvas also drops all metadata (camera, location).
 */
export async function prepareArt(file: File, opts: ArtOptions = {}): Promise<PreparedArt> {
	if (file.type === 'image/svg+xml' || /\.svgz?$/i.test(file.name))
		throw new Error('SVG files aren’t supported. Export the picture as PNG or WebP.');
	if (!file.type.startsWith('image/') && file.type !== '')
		throw new Error('That file isn’t an image.');
	if (file.size > ART_LIMITS.bytes) throw new Error('That file is over 50 MB. Export a smaller copy and try again.');

	let bitmap: ImageBitmap;
	try {
		bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
	} catch {
		throw new Error('This browser can’t read that image. Try PNG, JPEG or WebP.');
	}
	const notes: string[] = [];
	try {
		if (bitmap.width * bitmap.height > ART_LIMITS.pixels)
			throw new Error('That image is too large to process here. Export a smaller copy and try again.');
		const s = fitScale(bitmap.width, bitmap.height, ART_WORKING.width, ART_WORKING.height);
		if (s < 1) notes.push(`Scaled down from ${bitmap.width}×${bitmap.height}.`);
		const work = canvas(Math.round(bitmap.width * s), Math.round(bitmap.height * s));
		const ctx = work.getContext('2d', { willReadFrequently: true })!;
		ctx.imageSmoothingQuality = 'high';
		ctx.drawImage(bitmap, 0, 0, work.width, work.height);
		const pixels = ctx.getImageData(0, 0, work.width, work.height);
		const report = normaliseArt(pixels, opts);
		ctx.putImageData(pixels, 0, 0);

		const { box } = report;
		const size = slotSize(box.width, box.height);
		// Store at 2× the slot size, but never upscale beyond the source pixels
		const store = Math.min(ART_SCALE, box.width / size.width);
		const out = canvas(Math.round(size.width * store), Math.round(size.height * store));
		const octx = out.getContext('2d')!;
		octx.imageSmoothingQuality = 'high';
		octx.drawImage(work, box.left, box.top, box.width, box.height, 0, 0, out.width, out.height);
		if (report.backgroundRemoved) notes.push('Removed the plain background.');
		return { src: out.toDataURL('image/png'), ...size, transparent: report.transparent, backgroundRemoved: report.backgroundRemoved, notes };
	} finally {
		bitmap.close();
	}
}

const canvas = (width: number, height: number) => Object.assign(document.createElement('canvas'), { width, height });
