import type { CollectionEntry } from 'astro:content';

export const ALL_TAGS = [
  'Writing', 'Photos', 'Reviews', 'Food', 'Games',
  'Movies', 'TV', 'Anime', 'Drinks', 'Books',
  'Travel', 'Gear', 'Software', 'Tech Industry',
] as const;

export type Tag = typeof ALL_TAGS[number];

export function tagToSlug(tag: string): string {
  return tag.toLowerCase().replace(/\s+/g, '-');
}

export function slugToTag(slug: string): string {
  const found = ALL_TAGS.find(t => tagToSlug(t) === slug);
  return found ?? slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

export function getPostsByTag(
  posts: CollectionEntry<'posts'>[],
  tag: string
): CollectionEntry<'posts'>[] {
  return posts.filter(post => post.data.tags.includes(tag as Tag));
}
