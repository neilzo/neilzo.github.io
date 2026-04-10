import type { CollectionEntry } from 'astro:content';

/**
 * Returns a map of post.id → padded entry number string (e.g. "001").
 * Oldest post = 001, newest = N. Stable across pages and tag filters.
 */
export function computeEntryNumbers(allPosts: CollectionEntry<'posts'>[]): Record<string, string> {
  const sorted = [...allPosts].sort((a, b) => a.data.date.getTime() - b.data.date.getTime());
  const result: Record<string, string> = {};
  sorted.forEach((post, i) => {
    result[post.id] = String(i + 1).padStart(3, '0');
  });
  return result;
}
