import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { blogPostPath } from "@/lib/blog-url";
import { getSortedPosts } from "@/lib/blog";

export async function GET(context: APIContext) {
  const sorted = await getSortedPosts();

  return rss({
    title: "Krong Dev.",
    description: "개발하면서 배운 것들을 기록합니다.",
    site: context.site!,
    items: sorted.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description ?? "",
      link: blogPostPath(post.id),
    })),
  });
}
