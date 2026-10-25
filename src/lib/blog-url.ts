/** astro.config trailingSlash: "always"와 맞춘 내부 경로 */

export function blogsIndexPath(): string {
  return "/blogs/";
}

export function blogPostPath(id: string): string {
  return `/blogs/${id}/`;
}

export function archiveIndexPath(): string {
  return "/archive/";
}

export function archivePostPath(id: string): string {
  return `/archive/${id}/`;
}

/** 아카이브 목록 더 보기용 정적 HTML 조각 경로 */
export function archiveChunkPath(key: string, page: number | string): string {
  return `/archive/chunks/${key}/${page}/`;
}
