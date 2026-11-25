import { readdirSync, rmSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { AstroIntegration } from 'astro';

/**
 * Removes every `.md`/`.mdx` file in the build output that no route wrote.
 *
 * starlight-page-actions copies the raw `src/content/docs` files into `dist/`
 * with no way to turn it off. Our `src/pages/[...slug].md.ts` endpoint then
 * overwrites them, but it skips draft pages and strips `:::draft` blocks, so
 * any file it doesn't write would publish a draft. Astro's `assets` map lists
 * every file each route wrote, so this doesn't depend on write order.
 * https://docs.astro.build/en/reference/integrations-reference/#astrobuilddone
 */
export default function onlyRoutedMarkdown(): AstroIntegration {
	return {
		name: 'only-routed-markdown',
		hooks: {
			'astro:build:done': ({ dir, assets, logger }) => {
				const outDir = fileURLToPath(dir);
				const routed = new Set([...assets.values()].flat().map((url) => fileURLToPath(url)));
				for (const entry of readdirSync(outDir, { recursive: true, withFileTypes: true })) {
					const file = join(entry.parentPath, entry.name);
					if (entry.isFile() && /\.mdx?$/.test(entry.name) && !routed.has(file)) {
						rmSync(file);
						logger.info(`Removed unrouted ${relative(outDir, file)}`);
					}
				}
			},
		},
	};
}
