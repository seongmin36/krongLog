import { getCollection, type CollectionEntry } from "astro:content";

export const PAGE_SIZE = 8;

// 최신순 정렬된 포스트 전체
export async function getSortedPosts(): Promise<CollectionEntry<"post">[]> {
  const posts = await getCollection("post");
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

// 글 수 기준 내림차순 상위 태그 [태그, 글 수]
export function countTopTags(
  posts: { data: { tags?: string[] } }[],
  limit = 10,
): [string, number][] {
  const tagCounts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.data.tags ?? []) {
      tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
    }
  }
  return [...tagCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, limit);
}
