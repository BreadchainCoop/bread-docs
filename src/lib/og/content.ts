/**
 * Build-time wrappers around ./card.ts that read the content collections.
 */
import { getCollection, type CollectionEntry } from 'astro:content';
import { cardFromPage, type SectionLabels } from './card';

export { CARD_VARIANT, cardPath, customCardPaths, homeCard } from './card';

let labelsPromise: Promise<SectionLabels> | undefined;

/** Folder labels come from the same _meta.yml files that drive the sidebar. */
export function sectionLabels() {
	labelsPromise ??= getCollection('autoSidebar').then(
		(entries) => new Map(entries.map((e) => [e.id.replace(/\/_meta$/, ''), e.data.label as string | undefined]))
	);
	return labelsPromise;
}

export async function cardFor(entry: CollectionEntry<'docs'>) {
	return cardFromPage(entry, await sectionLabels());
}
