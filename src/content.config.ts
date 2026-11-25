import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';
import { autoSidebarLoader } from 'starlight-auto-sidebar/loader';
import { autoSidebarSchema } from 'starlight-auto-sidebar/schema';
import { glob } from 'astro/loaders';

export const collections = {
	docs: defineCollection({
		loader: docsLoader(),
		schema: docsSchema({
			extend: z.object({
				gallery: z.string().optional(),
				// starlight-page-actions hides its action bar when this is false
				// (read from entry data in its PageTitle override).
				pageActions: z.boolean().optional(),
				// Social card (Open Graph image) fields. See src/lib/og/.
				og: z
					.object({
						// Card headline when the page title doesn't suit the card.
						title: z.string().optional(),
						// One short sentence printed on the card. Separate from `description`,
						// which is the page lede / meta description and is usually too long.
						description: z.string().optional(),
						// Hand-made card in public/og/custom/ replacing the generated one.
						image: z.string().optional(),
						alt: z.string().optional(),
					})
					.optional(),
			}),
		}),
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
			// Angel minter contribution description (e.g. "~200,000 BREAD minted")
			amountContributed: z.string().optional(),
			// Shared metadata
			url: z.string().optional(),
			image: z.string().optional(),
			'Project Lead': z.string().optional(),
			Email: z.string().optional(),
			Treasury: z.string().optional(),
		}),
	}),
};
