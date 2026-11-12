import { getImage } from "astro:assets";
import { getCollection, type CollectionEntry } from "astro:content";
import placeholderImage from "@/assets/img-default.png";
import { blogPostPath } from "./blog-url";
import { formatDotDate } from "./format-date";

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

export const FEATURED_IMAGE = {
  widths: [400, 640, 800, 960, 1280],
  sizes: "(max-width: 1023px) 100vw, 680px",
};

export const CARD_IMAGE = {
  widths: [400, 560, 720, 840, 960, 1120],
  sizes: "(max-width: 639px) 100vw, (max-width: 1023px) 50vw, min(400px, 33vw)",
};

export const ROW_THUMB_IMAGE = {
  widths: [96, 192, 288],
  sizes: "96px",
};

export interface HomePostImage {
  src: string;
  srcset: string;
}

// 홈 태그 필터가 카드를 다시 그릴 때 쓰는 메타데이터
export interface HomePostData {
  href: string;
  title: string;
  description: string;
  date: string;
  datetime: string;
  tags: string[];
  alt: string;
  featured: HomePostImage;
  card: HomePostImage;
}

async function buildImage(
  src: ImageMetadata,
  { widths, sizes }: { widths: number[]; sizes: string },
): Promise<HomePostImage> {
  const image = await getImage({
    src,
    widths,
    sizes,
    format: "webp",
    quality: 75,
  });
  return { src: image.src, srcset: image.srcSet.attribute };
}

export async function toHomePostData(
  post: CollectionEntry<"post">,
): Promise<HomePostData> {
  const { title, description, date, tags, image } = post.data;
  const src = image ?? placeholderImage;
  return {
    href: blogPostPath(post.id),
    title,
    description: description ?? "",
    date: formatDotDate(date),
    datetime: date.toISOString(),
    tags: tags ?? [],
    alt: image ? title : "placeholder",
    featured: await buildImage(src, FEATURED_IMAGE),
    card: await buildImage(src, CARD_IMAGE),
  };
}
