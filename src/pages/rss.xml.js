import rss from '@astrojs/rss';
import { getAllPosts } from '../utils/getAllPosts';

export async function GET(context) {
  const posts = await getAllPosts();
  const feedPosts = posts.filter(post => post.data.template !== 'review');

  return rss({
    title: 'Neil Daftary',
    description: 'The personal site of Neil Daftary — writing, photography, and more.',
    site: context.site,
    items: feedPosts.map(post => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.excerpt,
      link: `/posts/${post.id}/`,
    })),
    customData: `<language>en-us</language>`,
  });
}
