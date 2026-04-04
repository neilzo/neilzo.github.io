import { getCollection } from 'astro:content';

export async function getAllPosts(includeDrafts = false) {
  const posts = await getCollection('posts', ({ data }) =>
    includeDrafts ? true : !data.draft
  );
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}
