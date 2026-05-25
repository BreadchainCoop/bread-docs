import { defineCollection, z } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';
import { autoSidebarLoader } from 'starlight-auto-sidebar/loader';
import { autoSidebarSchema } from 'starlight-auto-sidebar/schema';
import { glob } from 'astro/loaders';

export const collections = {
	docs: defineCollection({
		loader: docsLoader(),
		schema: docsSchema(),
	}),
	autoSidebar: defineCollection({
		loader: autoSidebarLoader(),
		schema: autoSidebarSchema(),
	}),
	memberProjects: defineCollection({
		loader: glob({
			base: './src/content/member-projects',
			pattern: '**/*.{md,mdx}',
		}),
		schema: z.object({
			title: z.string(),
			description: z.string().optional(),
			status: z.enum(['active', 'archived']).optional(),
			url: z.string().optional(),
			image: z.string().optional(),
			'Project Lead': z.string().optional(),
			Email: z.string().optional(),
			Treasury: z.string().optional(),
		}),
	}),
};
