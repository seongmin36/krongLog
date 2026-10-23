import type { CollectionEntry } from "astro:content";

/** 글 수 기준 내림차순 상위 태그 [태그, 글 수] */
export function countTopTags(
  posts: CollectionEntry<"post">[],
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
