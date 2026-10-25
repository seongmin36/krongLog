import { getCollection, type CollectionEntry } from "astro:content";
import { getKstHour } from "@/lib/format-date";

export type ArchiveEntry = CollectionEntry<"archive">;

/** 카드 표현 방식. night는 저녁·새벽(NIGHT_FROM_HOUR시~NIGHT_UNTIL_HOUR시)에 쓴 글로 다크 카드 */
export type ArchiveVariant = "note" | "night" | "image" | "quote";

/** 필터 칩 하나에 해당하는 목록 (전체 또는 태그별) */
export interface ArchiveFeed {
  /** 정적 조각 경로에 쓰는 키: 전체는 all, 태그는 ARCHIVE_FILTER_TAGS 순서대로 t0, t1 … */
  key: string;
  /** 칩 라벨 (전체, #태그) */
  label: string;
  /** ARCHIVE_PAGE_SIZE씩 나눈 묶음 */
  pages: ArchiveEntry[][];
}

/** 한 번에 불러오는 카드 수 */
export const ARCHIVE_PAGE_SIZE = 12;
/** 필터 칩으로 노출하는 태그 (이 순서대로, 글이 있는 태그만) */
export const ARCHIVE_FILTER_TAGS = [
  "배움일기",
  "알고리즘",
  "코딩테스트",
  "회고",
  "TIL",
] as const;

/** 이 시각(KST, 시)부터 다음 날 NIGHT_UNTIL_HOUR시 전까지 쓴 글은 다크 카드 */
const NIGHT_FROM_HOUR = 18;
const NIGHT_UNTIL_HOUR = 6;

/** 카드마다 살짝 다르게 기울이는 각도 (id 해시로 고정) */
const TILTS = [-1.5, -1.2, -0.9, -0.6, -0.4, 0.3, 0.5, 0.8, 1.1, 1.4];

/** 최신순 정렬된 아카이브 전체 */
export async function getSortedArchive(): Promise<ArchiveEntry[]> {
  const entries = await getCollection("archive");
  return entries.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/** 마크다운·MDX 문법을 걷어낸 본문 텍스트 */
function plainBody(entry: ArchiveEntry): string {
  return (
    (entry.body ?? "")
      // 코드 블록
      .replace(/^```[\s\S]*?^```/gm, " ")
      // MDX import·export, 표현식·주석({/* */})
      .replace(/^\s*(import|export)\s.+$/gm, " ")
      .replace(/\{[^}]*\}/g, " ")
      // HTML·컴포넌트 태그 (<br /> 포함)
      .replace(/<[^>]+>/g, " ")
      // 링크·이미지는 텍스트만
      .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
      // 구분선 (---)
      .replace(/^\s*([-*_])(\s*\1){2,}\s*$/gm, " ")
      // 줄 머리 문법 (제목, 인용, 목록)만 지워 본문 속 #·> 기호는 남긴다
      .replace(/^\s*(#{1,6}|>|[-*+]|\d+\.)\s+/gm, "")
      // 강조·인라인 코드 기호
      .replace(/\*+|~~|`/g, "")
      .replace(/\s+/g, " ")
      .trim()
  );
}

export function archiveVariant(entry: ArchiveEntry): ArchiveVariant {
  const { type, image, date } = entry.data;
  if (type === "quote") return "quote";
  if (image) return "image";
  const hour = getKstHour(date);
  return hour >= NIGHT_FROM_HOUR || hour < NIGHT_UNTIL_HOUR ? "night" : "note";
}

/** 상세 페이지에 렌더링할 본문이 있는지 */
export function archiveHasBody(entry: ArchiveEntry): boolean {
  return plainBody(entry) !== "";
}

/** 카드·메타 설명용 본문 발췌 */
export function archiveExcerpt(entry: ArchiveEntry, maxLength = 240): string {
  const text = plainBody(entry);
  return text.length > maxLength ? `${text.slice(0, maxLength)}…` : text;
}

/** 목록 행·메타 description용 요약. 인용은 본문 대신 인용문 */
export function archiveSummary(entry: ArchiveEntry, maxLength = 120): string {
  return archiveVariant(entry) === "quote"
    ? (entry.data.quote ?? "")
    : archiveExcerpt(entry, maxLength);
}

/** 카드 기울기 (예: "-1.2deg") */
export function archiveTilt(id: string): string {
  let hash = 0;
  for (const char of id) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return `${TILTS[hash % TILTS.length]}deg`;
}

function chunkEntries(entries: ArchiveEntry[]): ArchiveEntry[][] {
  const pages: ArchiveEntry[][] = [];
  for (let i = 0; i < entries.length; i += ARCHIVE_PAGE_SIZE) {
    pages.push(entries.slice(i, i + ARCHIVE_PAGE_SIZE));
  }
  return pages;
}

/**
 * 전체 + 지정 태그 피드. 목록 페이지(1페이지)와 정적 조각 라우트(전 페이지)가
 * 같은 결과를 쓰므로 칩의 페이지 수와 실제 조각 수가 항상 일치한다
 */
export function buildArchiveFeeds(entries: ArchiveEntry[]): ArchiveFeed[] {
  const tagFeeds = ARCHIVE_FILTER_TAGS.map((tag, index) => ({
    key: `t${index}`,
    label: `#${tag}`,
    pages: chunkEntries(
      entries.filter((entry) => entry.data.tags?.includes(tag)),
    ),
  }));
  return [
    { key: "all", label: "전체", pages: chunkEntries(entries) },
    // 아직 글이 없는 태그는 빈 목록이 되므로 칩을 숨긴다
    ...tagFeeds.filter((feed) => feed.pages.length > 0),
  ];
}
