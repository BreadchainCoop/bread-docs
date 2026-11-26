/**
 * Normalises a picture for the custom-card art slot. Pure pixel work on an
 * RGBA buffer, shared by the Card Maker (canvas) and scripts/og-custom.ts
 * (sharp), so both produce the same result. Decoding and resizing are left to
 * the platform.
 *
 * Steps: optional plain-background removal → greyscale → trim to content.
 */

/** Slot size on the 1200×630 card, in CSS px. Pictures are stored at 2×. */
export const ART_SLOT = { width: 260, height: 440 } as const;
export const ART_SCALE = 2;
/** Working size: decode large pictures down to this before pixel work. */
export const ART_WORKING = { width: ART_SLOT.width * 4, height: ART_SLOT.height * 4 } as const;

export type Rgba = { data: Uint8ClampedArray | Uint8Array; width: number; height: number };
export type Box = { left: number; top: number; width: number; height: number };

/** Scale factor that fits (w, h) inside (maxW, maxH) without enlarging. */
export const fitScale = (w: number, h: number, maxW: number, maxH: number) => Math.min(1, maxW / w, maxH / h);

export function hasTransparency({ data }: Rgba) {
	for (let i = 3; i < data.length; i += 4) if (data[i] < 250) return true;
	return false;
}

/**
 * Removes a plain background: flood-fills from the edges through pixels close
 * to the median edge colour, with a soft band for anti-aliased outlines.
 * Returns false (and changes nothing) when the edges aren't a plain colour.
 */
export function removePlainBackground(img: Rgba, tolerance = 38): boolean {
	const { data, width: w, height: h } = img;
	const edge: number[][] = [];
	const push = (x: number, y: number) => {
		const i = (y * w + x) * 4;
		edge.push([data[i], data[i + 1], data[i + 2]]);
	};
	for (let x = 0; x < w; x++) push(x, 0), push(x, h - 1);
	for (let y = 0; y < h; y++) push(0, y), push(w - 1, y);
	const median = [0, 1, 2].map((c) => edge.map((p) => p[c]).sort((a, b) => a - b)[edge.length >> 1]);
	const dist = (i: number) =>
		Math.hypot(data[i] - median[0], data[i + 1] - median[1], data[i + 2] - median[2]);
	// Plain background: most edge pixels sit near the median colour
	const near = edge.filter((p) => Math.hypot(p[0] - median[0], p[1] - median[1], p[2] - median[2]) < tolerance).length;
	if (near / edge.length < 0.6) return false;

	const seen = new Uint8Array(w * h);
	const stack: number[] = [];
	for (let x = 0; x < w; x++) stack.push(x, (h - 1) * w + x);
	for (let y = 0; y < h; y++) stack.push(y * w, y * w + w - 1);
	const soft = tolerance * 1.6;
	while (stack.length) {
		const p = stack.pop()!;
		if (seen[p]) continue;
		seen[p] = 1;
		const i = p * 4;
		const d = dist(i);
		if (d >= soft) continue;
		// Inside tolerance: clear; in the soft band: partial alpha, and stop spreading
		data[i + 3] = d < tolerance ? 0 : Math.min(data[i + 3], Math.round(((d - tolerance) / (soft - tolerance)) * 255));
		if (d >= tolerance) continue;
		const x = p % w;
		if (x > 0) stack.push(p - 1);
		if (x < w - 1) stack.push(p + 1);
		if (p >= w) stack.push(p - w);
		if (p < w * (h - 1)) stack.push(p + w);
	}
	return true;
}

export function greyscale({ data }: Rgba) {
	for (let i = 0; i < data.length; i += 4) {
		const y = Math.round(0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]);
		data[i] = data[i + 1] = data[i + 2] = y;
	}
}

/** Bounding box of visible pixels (alpha > 8), or the whole image if none. */
export function contentBox({ data, width: w, height: h }: Rgba): Box {
	let minX = w, minY = h, maxX = -1, maxY = -1;
	for (let y = 0; y < h; y++)
		for (let x = 0; x < w; x++)
			if (data[(y * w + x) * 4 + 3] > 8) {
				if (x < minX) minX = x;
				if (x > maxX) maxX = x;
				if (y < minY) minY = y;
				if (y > maxY) maxY = y;
			}
	return maxX < 0 ? { left: 0, top: 0, width: w, height: h } : { left: minX, top: minY, width: maxX - minX + 1, height: maxY - minY + 1 };
}

export type ArtOptions = { removeBackground?: boolean };
export type ArtReport = { transparent: boolean; backgroundRemoved: boolean; box: Box };

/** Runs the pixel steps in place and reports what happened. */
export function normaliseArt(img: Rgba, opts: ArtOptions = {}): ArtReport {
	let transparent = hasTransparency(img);
	let backgroundRemoved = false;
	if (!transparent && opts.removeBackground !== false) {
		backgroundRemoved = removePlainBackground(img);
		transparent = backgroundRemoved;
	}
	greyscale(img);
	return { transparent, backgroundRemoved, box: contentBox(img) };
}

/** Final slot size (CSS px) for a trimmed picture of (w, h) working px. */
export function slotSize(w: number, h: number) {
	// Fill the slot even if the picture is small; the platform resamples it
	const s = Math.min(ART_SLOT.width / w, ART_SLOT.height / h);
	return { width: Math.round(w * s), height: Math.round(h * s) };
}
