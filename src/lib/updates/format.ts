import type { CollectionEntry } from 'astro:content';

const dateFormat = new Intl.DateTimeFormat('en-GB', { dateStyle: 'long', timeZone: 'UTC' });
export const formatDate = (d: Date) => dateFormat.format(d);

/** Newest first */
export const sortUpdates = (entries: CollectionEntry<'updates'>[]) =>
	[...entries].sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
