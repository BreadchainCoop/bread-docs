import type { APIRoute } from 'astro';
import { buildDocsIndex } from '../lib/docsIndex';

// The docs index in the llms.txt format (https://llmstxt.org/), same content as /index.md.
// https://docs.astro.build/en/guides/endpoints/#static-file-endpoints
export const GET = (async () => new Response(await buildDocsIndex())) satisfies APIRoute;
