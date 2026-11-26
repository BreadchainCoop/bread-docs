/**
 * Build-time content loader for the Updates section: imports every published
 * post of a Paragraph publication into the `updates` collection.
 * https://docs.astro.build/en/reference/content-loader-reference/
 *
 * - One API call per 100 posts; no key needed.
 * - Each entry stores cleaned HTML in `rendered` (so `render()` and the
 *   table of contents work) and a digest, so unchanged posts are skipped.
 * - If Paragraph can't be reached, the build keeps the posts from the last
 *   successful load (the content layer's data store persists in the build
 *   cache) and logs a warning instead of failing the docs deploy.
 */
import type { Loader } from 'astro/loaders';
import { z } from 'astro/zod';
import { cleanPostHtml, excerpt } from './html';
import { getPublication, listPosts, postUrl } from './paragraph';

/** Bump when ./html.ts output changes, so cached posts are cleaned again. */
const CLEANER_VERSION = 3;

export const updateSchema = z.object({
	title: z.string(),
	/** Paragraph subtitle, or the opening of the post when there is none */
	description: z.string(),
	date: z.coerce.date(),
	updated: z.coerce.date().optional(),
	/** Cover image (Paragraph's post image) */
	cover: z.string().url().optional(),
	categories: z.array(z.string()),
	authors: z.array(z.string()),
	/** The post on Paragraph: canonical URL and subscribe target */
	url: z.string().url(),
	images: z.array(
		z.object({ src: z.string(), width: z.number().optional(), height: z.number().optional(), alt: z.string() })
	),
});
export type Update = z.infer<typeof updateSchema>;

export function paragraphLoader(opts: { publication: string; basePath: string }): Loader {
	const internalPath = (slug: string) => `${opts.basePath}${slug}/`;
	return {
		name: 'paragraph-loader',
		schema: updateSchema,
		async load({ store, logger, parseData, generateDigest, meta }) {
			const signal = AbortSignal.timeout(30_000);
			let posts;
			try {
				const pub = await getPublication(opts.publication, signal);
				const result = await listPosts(pub.id, signal);
				posts = result.posts.filter((p) => p.publishOnline !== false);
				if (result.skipped.length) logger.warn(`Skipped posts that didn't match the schema: ${result.skipped.join(', ')}`);
			} catch (err) {
				const kept = store.keys().length;
				logger.warn(
					`Couldn't load @${opts.publication} from Paragraph (${(err as Error).message}). ` +
						(kept ? `Keeping ${kept} posts from the last load.` : 'The Updates section will be empty.')
				);
				return;
			}

			const seen = new Set<string>();
			for (const post of posts) {
				seen.add(post.slug);
				const digest = generateDigest({ v: CLEANER_VERSION, u: post.updatedAt, t: post.title, h: post.staticHtml, i: post.imageUrl });
				if (store.get(post.slug)?.digest === digest) continue;

				const clean = cleanPostHtml(post.staticHtml, { publicationSlug: opts.publication, internalPath });
				const data = await parseData({
					id: post.slug,
					data: {
						title: post.title,
						description: post.subtitle?.trim() || excerpt(clean.text),
						date: new Date(Number(post.publishedAt)),
						updated: post.updatedAt ? new Date(Number(post.updatedAt)) : undefined,
						cover: post.imageUrl,
						categories: post.categories,
						authors: post.authors.map((a) => a.name),
						url: postUrl(opts.publication, post.slug),
						images: clean.images,
					},
				});
				store.set({
					id: post.slug,
					data,
					digest,
					rendered: { html: clean.html, metadata: { headings: clean.headings } },
				});
			}
			// Remove posts that were deleted or unpublished on Paragraph
			for (const id of store.keys()) if (!seen.has(id)) store.delete(id);
			meta.set('lastLoaded', new Date().toISOString());
			logger.info(`Loaded ${posts.length} posts from @${opts.publication}.`);
		},
	};
}
