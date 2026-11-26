/**
 * Minimal client for Paragraph's public API (no key needed for published
 * posts). Base URL and endpoints match @paragraph-com/sdk:
 *   GET /v1/publications/slug/{slug}
 *   GET /v1/publications/{id}/posts?includeContent=true&limit=&cursor=
 * https://docs.paragraph.com/developers/api-reference
 */
import { z } from 'astro/zod';

const API = 'https://public.api.paragraph.com/api';

const publication = z.object({
	id: z.string(),
	slug: z.string(),
	name: z.string(),
	summary: z.string().optional(),
	logoUrl: z.string().optional(),
});

export const paragraphPost = z.object({
	id: z.string(),
	slug: z.string(),
	title: z.string(),
	subtitle: z.string().optional(),
	// Milliseconds since the epoch, as a string
	publishedAt: z.string(),
	updatedAt: z.string().optional(),
	imageUrl: z.string().optional(),
	categories: z.array(z.string()).default([]),
	publishOnline: z.boolean().optional(),
	staticHtml: z.string().default(''),
	// Tiptap document as a JSON string; carries image sizes the HTML lacks
	json: z.string().optional(),
	authors: z.array(z.object({ name: z.string() })).default([]),
});
export type ParagraphPost = z.infer<typeof paragraphPost>;

const page = z.object({
	items: z.array(z.unknown()),
	pagination: z.object({ cursor: z.string().optional(), hasMore: z.boolean() }).partial(),
});

async function get(path: string, signal?: AbortSignal) {
	const res = await fetch(`${API}${path}`, { headers: { accept: 'application/json' }, signal });
	if (!res.ok) throw new Error(`Paragraph API ${res.status} for ${path}`);
	return res.json();
}

export async function getPublication(slug: string, signal?: AbortSignal) {
	return publication.parse(await get(`/v1/publications/slug/${encodeURIComponent(slug)}`, signal));
}

/** Every published post, newest first. Invalid items are skipped, not fatal. */
export async function listPosts(publicationId: string, signal?: AbortSignal) {
	const posts: ParagraphPost[] = [];
	const skipped: string[] = [];
	let cursor: string | undefined;
	do {
		const query = new URLSearchParams({ includeContent: 'true', limit: '100' });
		if (cursor) query.set('cursor', cursor);
		const data = page.parse(await get(`/v1/publications/${publicationId}/posts?${query}`, signal));
		for (const item of data.items) {
			const parsed = paragraphPost.safeParse(item);
			if (parsed.success) posts.push(parsed.data);
			else skipped.push((item as { slug?: string })?.slug ?? '(unknown)');
		}
		cursor = data.pagination.hasMore ? data.pagination.cursor : undefined;
	} while (cursor);
	return { posts, skipped };
}

export const postUrl = (publicationSlug: string, postSlug: string) =>
	`https://paragraph.com/@${publicationSlug}/${postSlug}`;
