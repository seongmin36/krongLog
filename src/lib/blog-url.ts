/** astro.config trailingSlash: "always"와 맞춘 내부 경로 */

export function blogsIndexPath(): string {
  return "/blogs/";
}

export function blogPostPath(id: string): string {
  return `/blogs/${id}/`;
}
