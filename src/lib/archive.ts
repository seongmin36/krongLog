import { getCollection, type CollectionEntry } from "astro:content";
import { countTopTags } from "@/lib/post-tags";

export type ArchiveEntry = CollectionEntry<"archive">;

/** 카드·상세 표현 방식. headline은 본문 없이 제목만 있는 글 */
export type ArchiveVariant = "note" | "headline" | "image" | "quote" | "todo";

export interface ArchiveTodoItem {
  done: boolean;
  text: string;
}

export interface ArchiveFilter {
  /** 정적 조각 경로에 쓰는 키 (all, t0, t1 …) */
  key: string;
  /** null이면 전체 */
  tag: string | null;
  label: string;
  /** 해당 필터의 조각(페이지) 수 */
  totalPages: number;
}

/** 한 번에 불러오는 카드 수 */
export const ARCHIVE_PAGE_SIZE = 12;
/** 필터 칩으로 노출하는 상위 태그 수 */
export const ARCHIVE_TAG_LIMIT = 12;

/** 카드마다 살짝 다르게 기울이는 각도 (id 해시로 고정) */
const TILTS = [-1.5, -1.2, -0.9, -0.6, -0.4, 0.3, 0.5, 0.8, 1.1, 1.4];

/** 최신순 정렬된 아카이브 전체 */
export async function getSortedArchive(): Promise<ArchiveEntry[]> {
  const entries = await getCollection("archive");
  return entries.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/** 마크다운·MDX 문법을 걷어낸 본문 텍스트 */
function plainBody(entry: ArchiveEntry): string {
  return (entry.body ?? "")
    .replace(/^\s*(import|export)\s.+$/gm, " ")
    .replace(/^\s*[-*]\s+\[[ xX]\]\s+.*$/gm, " ")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[`*_~>#]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function archiveVariant(entry: ArchiveEntry): ArchiveVariant {
  const { type, image } = entry.data;
  if (type === "quote") return "quote";
  if (type === "todo") return "todo";
  if (image) return "image";
  return plainBody(entry) === "" ? "headline" : "note";
}

/** 상세 페이지에 렌더링할 본문(글 또는 체크리스트)이 있는지 */
export function archiveHasBody(entry: ArchiveEntry): boolean {
  return plainBody(entry) !== "" || archiveTodoItems(entry).length > 0;
}

/** 카드·메타 설명용 본문 발췌 */
export function archiveExcerpt(entry: ArchiveEntry, maxLength = 240): string {
  const text = plainBody(entry);
  return text.length > maxLength ? `${text.slice(0, maxLength)}…` : text;
}

/** `- [x] 할 일` 형태의 체크리스트 항목 */
export function archiveTodoItems(entry: ArchiveEntry): ArchiveTodoItem[] {
  return [...(entry.body ?? "").matchAll(/^\s*[-*]\s+\[([ xX])\]\s+(.+)$/gm)].map(
    ([, mark, text]) => ({ done: mark !== " ", text: text.trim() }),
  );
}

/** 카드 기울기 (예: "-1.2deg") */
export function archiveTilt(id: string): string {
  let hash = 0;
  for (const char of id) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return `${TILTS[hash % TILTS.length]}deg`;
}

export function chunkEntries<T>(items: T[], size = ARCHIVE_PAGE_SIZE): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

export function filterByTag(
  entries: ArchiveEntry[],
  tag: string | null,
): ArchiveEntry[] {
  return tag === null
    ? entries
    : entries.filter((entry) => entry.data.tags?.includes(tag));
}

/** 전체 + 상위 태그 필터 목록 */
export function buildArchiveFilters(entries: ArchiveEntry[]): ArchiveFilter[] {
  const tags = countTopTags(entries, ARCHIVE_TAG_LIMIT).map(([tag]) => tag);
  return [null, ...tags].map((tag, i) => ({
    key: tag === null ? "all" : `t${i - 1}`,
    tag,
    label: tag === null ? "전체" : `#${tag}`,
    totalPages: chunkEntries(filterByTag(entries, tag)).length,
  }));
}
