import type { SatteriProcessorOptions } from '@astrojs/markdown-satteri';

type MdastPlugin = NonNullable<SatteriProcessorOptions['mdastPlugins']>[number];

/**
 * Sätteri mdast plugin for `:::draft` blocks: work-in-progress content that is
 * shown (with a "Draft" banner) in `astro dev` and left out of production
 * builds. Styled by `.draft-block` in src/styles/global.css.
 * https://satteri.bruits.org/docs/plugins/#mdast-plugins
 */
export default function draftBlocks({ show = false, label = 'Draft' } = {}): MdastPlugin {
	return {
		name: 'draft-blocks',
		containerDirective(node, ctx) {
			if (node.name !== 'draft') return;
			if (!show) return ctx.removeNode(node);
			// `:::draft[Custom label]` arrives as a leading paragraph flagged `directiveLabel`.
			const [first, ...rest] = node.children;
			const hasLabel = first?.type === 'paragraph' && first.data?.directiveLabel;
			// A paragraph with `hName` renders as that element — the technique Starlight
			// uses for asides. Sätteri's mdast types don't model `hName`, hence the cast.
			return {
				type: 'paragraph',
				data: { hName: 'div', hProperties: { class: 'draft-block' } },
				children: [
					{
						type: 'paragraph',
						data: { hName: 'p', hProperties: { class: 'draft-block__title' } },
						children: hasLabel ? first.children : [{ type: 'text', value: label }],
					},
					...(hasLabel ? rest : node.children),
				],
			} as never;
		},
	};
}
