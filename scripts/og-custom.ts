/**
 * Makes a custom social card for an existing docs page from a picture, the
 * same way the Card Maker does, for use by agents and in CI-less sessions.
 *
 *   npm run og:custom -- --page tools/solidarity-fund/how-it-works --image ~/fist.png
 *
 * The words always come from the page's frontmatter (title, og.title,
 * og.description); this script takes no text. It writes
 * public/og/custom/<page-id>.png and prints the frontmatter to add.
 *
 * Options:
 *   --page <id>          Page id as in the URL, e.g. "manifesto" or "tools/stacks". Not the home page.
 *   --image <path>       Picture: PNG, JPEG, WebP, AVIF, GIF or TIFF. Not SVG.
 *   --keep-background    Don't remove a plain background from an opaque picture.
 */
import { readFile, readdir, mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, relative, resolve, sep } from 'node:path';
import { parseArgs } from 'node:util';
import sharp from 'sharp';
import { parse as parseYaml } from 'yaml';
import { ART_SCALE, ART_WORKING, normaliseArt, slotSize } from '../src/lib/og/art';
import { cardFromPage, customCardPaths, type CardPage, type SectionLabels } from '../src/lib/og/card';
import { renderCard } from '../src/lib/og/render';

const DOCS = resolve('src/content/docs');

const { values } = parseArgs({
	options: {
		page: { type: 'string' },
		image: { type: 'string' },
		'keep-background': { type: 'boolean', default: false },
	},
});
if (!values.page || !values.image) {
	console.error('Usage: npm run og:custom -- --page <page-id> --image <path> [--keep-background]');
	process.exit(1);
}
if (/\.svgz?$/i.test(values.image)) fail('SVG files aren’t supported. Export the picture as PNG or WebP.');

function fail(message: string): never {
	console.error(`og:custom: ${message}`);
	process.exit(1);
}

const frontmatter = (source: string) => {
	const m = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
	return (m ? parseYaml(m[1]) : {}) as CardPage['data'] & { draft?: boolean };
};

async function sectionLabels(): Promise<SectionLabels> {
	const labels: SectionLabels = new Map();
	for (const file of await readdir(DOCS, { recursive: true })) {
		if (!file.endsWith('_meta.yml')) continue;
		const dir = file.slice(0, -'/_meta.yml'.length).split(sep).join('/');
		labels.set(dir, parseYaml(await readFile(join(DOCS, file), 'utf8'))?.label);
	}
	return labels;
}

async function loadPage(id: string): Promise<{ page: CardPage; file: string } | undefined> {
	for (const candidate of [`${id}.md`, `${id}.mdx`, `${id}/index.md`, `${id}/index.mdx`]) {
		const file = join(DOCS, candidate);
		if (!existsSync(file)) continue;
		const data = frontmatter(await readFile(file, 'utf8'));
		if (data.draft) fail(`"${id}" is a draft page.`);
		return { page: { id, filePath: relative(process.cwd(), file), data }, file };
	}
}

const id = values.page.replace(/^\/+|\/+$/g, '').replace(/\.mdx?$/, '');
if (id === 'index' || id === '') fail('The home page card is fixed (src/lib/og/card.ts) and has no custom image.');
const found = await loadPage(id);
if (!found) fail(`No docs page with id "${id}" under src/content/docs/.`);
const card = cardFromPage(found.page, await sectionLabels());
const pageFile = relative(process.cwd(), found.file);

// Decode (EXIF rotation applied), scale to the working size, get raw RGBA
const { data, info } = await sharp(resolve(values.image))
	.rotate()
	.resize({ width: ART_WORKING.width, height: ART_WORKING.height, fit: 'inside', withoutEnlargement: true })
	.ensureAlpha()
	.raw()
	.toBuffer({ resolveWithObject: true })
	.catch(() => fail(`Couldn't read ${values.image} as an image.`));

const img = { data, width: info.width, height: info.height };
const report = normaliseArt(img, { removeBackground: !values['keep-background'] });
if (!report.transparent) console.warn('og:custom: the picture has no transparent background; a cut-out works best.');

const { box } = report;
const size = slotSize(box.width, box.height);
const store = Math.min(ART_SCALE, box.width / size.width);
const art = await sharp(img.data, { raw: { width: img.width, height: img.height, channels: 4 } })
	.extract(box)
	.resize(Math.round(size.width * store), Math.round(size.height * store))
	.png()
	.toBuffer();

const png = await renderCard({ ...card, art: { src: `data:image/png;base64,${art.toString('base64')}`, ...size } });
const paths = customCardPaths(id);
await mkdir(resolve('public/og/custom'), { recursive: true });
await writeFile(resolve(paths.file), png);

const alt = [card.title, card.tagline].filter(Boolean).join('. ');
console.log(`Wrote ${paths.file}${report.backgroundRemoved ? ' (plain background removed)' : ''}.`);
console.log(
	`\nIn ${pageFile}, add these under the existing \`og:\` key (keep its description), then describe the picture in alt:\n\n  image: "${paths.url}"\n  alt: "${alt} <What the picture shows.>"\n`
);
