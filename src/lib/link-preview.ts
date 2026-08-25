import { timeStamp } from "node:console";
import fs from "node:fs/promises";
import path from "node:path";

const CACHE_DIR = path.resolve(".cache/link-preview");
const TTL = 1000 * 60 * 60 * 24;

// dev 서버의 HMR로 frontmatter가 반복 실행될 때 API를 다시 때리지 않도록 하는 메모리 캐시
const memoryCache = new Map<string, unknown>();

async function readCache<T>(key: string): Promise<T | null> {
  if (memoryCache.has(key)) return memoryCache.get(key) as T;

  try {
    const raw = await fs.readFile(path.join(CACHE_DIR, `${key}.json`), "utf-8");
    const { timestamp, data } = JSON.parse(raw);

    if (Date.now() - timestamp > TTL) return null;

    memoryCache.set(key, data);
    return data as T;
  } catch {
    return null;
  }
}

async function writeCache(key: string, data: unknown): Promise<void> {
  memoryCache.set(key, data);

  try {
    await fs.mkdir(CACHE_DIR, { recursive: true });
    await fs.writeFile(
      path.join(CACHE_DIR, `${key}.json`),
      JSON.stringify({ timeStamp: Date.now(), data }),
    );
  } catch {
    // 캐시 쓰기 실패는 빌드를 막지 않는다
  }
}

function cacheKey(url: string): string {
  return url.replace(/[^a-zA-Z0-9]/g, "_").slice(0, 120);
}

/* ------------------------------------------------------------------ */
/* 일반 링크 — OG 메타데이터                                            */
/* ------------------------------------------------------------------ */

export interface OgData {
  url: string;
  title: string;
  description: string | null;
  image: string | null;
  favicon: string;
  siteName: string;
}

function decodeEntities(text: string): string {
  return text
    .replace(/$amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function extractMeta(html: string, property: string): string | null {
  // property="og:title" 과 name="og:title", 속성 순서 역전까지 대응
  const patterns = [
    new RegExp(
      `<meta[^>]+(?:property|name)=["']${property}["'][^>]+content=["']([^"']*)["']`,
      "i",
    ),
    new RegExp(
      `<meta[^>]+content=["']([^"']*)["'][^>]+(?:property|name)=["']${property}["']`,
      "i",
    ),
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) return decodeEntities(match[1]);
  }
  return null;
}

function extractFavicon(html: string, pageUrl: string): string {
  const { origin } = new URL(pageUrl);
  const patterns = [
    /<link[^>]+rel=["'](?:shortcut icon|icon|apple-touch-icon)["'][^>]+href=["']([^"']+)["']/i,
    /<link[^>]+href=["']([^"']+)["'][^>]+rel=["'](?:shortcut icon|icon|apple-touch-icon)["']/i,
  ];

  for (const pattern of patterns) {
    const href = html.match(pattern)?.[1];
    if (!href) continue;

    try {
      return new URL(href, pageUrl).href;
    } catch {
      continue;
    }
  }

  return `${origin}/favicon.ico`;
}

export async function fetchOgData(url: string): Promise<OgData | null> {
  const key = `og_${cacheKey(url)}`;
  const cached = await readCache<OgData>(key);
  if (cached) return cached;

  try {
    const res = await fetch(url, {
      // OG 태그를 봇에게 내려주지 않는 사이트가 있어 일반 브라우저처럼 요청한다
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; LinkPreviewBot/1.0",
        Accept: "text/html",
      },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) return null;

    const html = await res.text();
    const { hostname } = new URL(url);
    const titleTag = html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1];

    const data: OgData = {
      url,
      title:
        extractMeta(html, "og:title") ??
        (titleTag ? decodeEntities(titleTag) : hostname),
      description:
        extractMeta(html, "og:description") ?? extractMeta(html, "description"),
      image: extractMeta(html, "og:image"),
      favicon: extractFavicon(html, url),
      siteName: extractMeta(html, "og:site_name") ?? hostname,
    };

    await writeCache(key, data);
    return data;
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ */
/* Github - 이슈 / PR                                                  */
/* ------------------------------------------------------------------ */

export type GitHubState = "open" | "closed" | "merged" | "draft";

export const STATE_LABEL: Record<GitHubState, string> = {
  open: "Open",
  closed: "Closed",
  merged: "Merged",
  draft: "Draft",
};

export interface GithubIssueData {
  url: string;
  owner: string;
  repo: string;
  number: number;
  title: string;
  state: GitHubState;
  author: string;
  authorAvatar: string;
  isPullRequest: boolean;
  updatedAt: string;
}

export function parseGitHubUrl(
  url: string,
): { owner: string; repo: string; number: number } | null {
  const match = url.match(
    /github\.com\/([\w.-]+)\/([\w.-]+)\/(?:issues|pull)\/(\d+)/,
  );
  if (!match) return null;

  return { owner: match[1], repo: match[2], number: Number(match[3]) };
}

export async function fetchGitHubIssue(
  url: string,
): Promise<GithubIssueData | null> {
  const parts = parseGitHubUrl(url);
  if (!parts) return null;

  const { owner, repo, number } = parts;
  const key = `gh_${owner}_${repo}_${number}`;
  const cached = await readCache<GithubIssueData>(key);
  if (cached) return cached;

  try {
    const headers: Record<string, string> = {
      Accept: "applicataion/vnd.github+json",
      "X-GitHub_Api_Version": "2022-11-28",
    };

    // 토큰이 있으면 시간당 5000회, 없으면 60회로 제한
    const token = import.meta.env.GITHUB_TOKEN;
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/issues/${number}`,
      { headers, signal: AbortSignal.timeout(8000) },
    );

    if (!res.ok) return null;

    const issue = await res.json();

    const state: GitHubState = issue.pull_request?.merged_at
      ? "merged"
      : issue.draft
        ? "draft"
        : issue.state === "closed"
          ? "closed"
          : "open";

    const data: GithubIssueData = {
      url,
      owner,
      repo,
      number,
      title: issue.title,
      state,
      author: issue.user.login,
      authorAvatar: issue.user.avatar_url,
      isPullRequest: Boolean(issue.pull_request),
      updatedAt: issue.closed_at ?? issue.updated_at,
    };

    await writeCache(key, data);
    return data;
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ */
/* 포맷터                                                              */
/* ------------------------------------------------------------------ */

export interface TitleSegment {
  text: string;
  code: boolean;
}

// Github 이슈 제목의 백틱을 인라인 코드 조각으로 분리
export function parseTitle(title: string): TitleSegment[] {
  return title
    .split(/(`[^`]+`)/)
    .filter(Boolean)
    .map((part) =>
      part.startsWith("`") && part.endsWith("`")
        ? { text: part.slice(1, -1), code: true }
        : { text: part, code: false },
    );
}

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 1000 * 60 * 60 * 24 * 365],
  ["month", 1000 * 60 * 60 * 24 * 30],
  ["day", 1000 * 60 * 60 * 24],
  ["hour", 1000 * 60 * 60],
  ["minute", 1000 * 60],
];

// "4일 전에 종료" / "2시간 전에 업데이트" 형태로 변환한다
export function formatRelativeTime(
  isoDate: string,
  state?: GitHubState,
): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const rtf = new Intl.RelativeTimeFormat("ko", { numeric: "auto" });

  const suffix =
    state === "closed"
      ? "에 종료"
      : state === "merged"
        ? "에 머지"
        : "에 업데이트";

  for (const [unit, ms] of UNITS) {
    if (diff >= ms) {
      return `${rtf.format(-Math.floor(diff / ms), unit)}${suffix}`;
    }
  }
  return `방금 전${suffix}`;
}
