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
	projects: defineCollection({
		loader: glob({
			base: './src/content/projects',
			pattern: '**/*.{md,mdx}',
		}),
		schema: z.object({
			title: z.string(),
			description: z.string().optional(),
			status: z.enum(['active', 'archived']).optional(),
			// Classification booleans — entries can have multiple flags
			isMemberProject: z.boolean().default(false),
			isAngelMinter: z.boolean().default(false),
			isFriendOfBread: z.boolean().default(false),
			isContributingProject: z.boolean().default(false),
			// Shared metadata
			url: z.string().optional(),
			image: z.string().optional(),
			'Project Lead': z.string().optional(),
			Email: z.string().optional(),
			Treasury: z.string().optional(),
		}),
	}),
};
