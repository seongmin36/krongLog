import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const DIST = "dist";
const MIN_PAGES = 90;
const REQUIRED = [
  "index.html",
  "blogs/index.html",
  "archive/index.html",
  "about/index.html",
  "rss.xml",
  "sitemap-index.xml",
  "robots.txt",
];

const errors = [];

for (const file of REQUIRED) {
  if (!existsSync(join(DIST, file))) errors.push(`누락: ${file}`);
}

function pages(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      return ["_astro", "chunks"].includes(entry.name) ? [] : pages(path);
    }
    return entry.name === "index.html" ? [path] : [];
  });
}

const files = pages(DIST);
if (files.length < MIN_PAGES) {
  errors.push(`페이지 수 부족: ${files.length} (최소 ${MIN_PAGES})`);
}

for (const file of files) {
  const html = readFileSync(file, "utf8");
  const title = html.match(/<title>([^<]*)<\/title>/)?.[1].trim();
  if (!title) errors.push(`title 없음: ${file}`);
  if (!/<meta name="description" content="[^"]+"/.test(html)) {
    errors.push(`description 없음: ${file}`);
  }
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`빌드 검증 통과 (${files.length}페이지)`);
