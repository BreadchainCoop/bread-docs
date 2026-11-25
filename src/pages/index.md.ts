import type { APIRoute } from 'astro';
import { buildDocsIndex } from '../lib/docsIndex';

// Static file endpoint: built to a file at this route during `astro build`.
// https://docs.astro.build/en/guides/endpoints/#static-file-endpoints
export const GET = (async () => new Response(await buildDocsIndex())) satisfies APIRoute;
