import type { CollectionEntry } from "astro:content";

export const PAGE_SIZE = 8;
export function getPaginationPosts(
  posts: CollectionEntry<"post">[],
  current: number,
) {
  const start = (current - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  return posts.slice(start, end);
}
