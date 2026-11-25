import type { AstroIntegration } from 'astro';

/**
 * Card Maker (/og/maker/): a local tool for making custom social cards.
 * Injected only under `astro dev`, so it is never built or deployed: no
 * public page, bundle, sitemap or search entry.
 * https://docs.astro.build/en/reference/integrations-reference/#injectroute-option
 */
export default function ogMaker(): AstroIntegration {
	return {
		name: 'bread:og-maker',
		hooks: {
			'astro:config:setup': ({ command, injectRoute, logger }) => {
				if (command !== 'dev') return;
				injectRoute({ pattern: '/og/maker', entrypoint: './src/tools/og-maker.astro', prerender: true });
				logger.info('Card Maker: /og/maker/');
			},
		},
	};
}
