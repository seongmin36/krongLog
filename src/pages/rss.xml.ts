import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { blogPostPath } from '@/lib/blog-url';

export async function GET(context: APIContext) {
  const posts = await getCollection('post');
  const sorted = posts.sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime()
  );

  return rss({
    title: 'Krong Dev.',
    description: '개발하면서 배운 것들을 기록합니다.',
    site: context.site!,
    items: sorted.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description ?? '',
      link: blogPostPath(post.id),
    })),
  });
}
