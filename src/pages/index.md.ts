import type { APIRoute } from 'astro';
import { buildDocsIndex } from '../lib/docsIndex';

export const prerender = true;

export const GET: APIRoute = async () =>
	new Response(await buildDocsIndex(), {
		headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
	});
