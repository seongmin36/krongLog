/**
 * 레포 안 텍스트를 스캔해 pyftsubset --text-file 에 넘길 UTF-8 문자열을 파일로 저장합니다.
 * 공백(U+0020)을 건너뛰지 않습니다(trim 필터 금지).
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const REPO_ROOT = path.resolve(__dirname, "..");

const ROOT_DIRS = [
  "src/content",
  "src/pages",
  "src/layouts",
  "src/components",
  "src/lib",
];

const EXTENSIONS = new Set([
  ".md",
  ".mdx",
  ".astro",
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
]);

/** 스캔에 없을 수 있는 문장부호·기호 보조 */
const FALLBACK_CHARS = [
  "\u0020\t\n\r",
  "\u2014\u2013\u2026\u00b7\u2022",
  "\u300c\u300d\u300e\u300f\u300a\u300b\u3008\u3009",
  "\u201c\u201d\u2018\u2019",
  "\u2705\u274c\u2605\u2606\u2192\u2190\u2191\u2193",
].join("");

export const SUBSET_CHARS_FILE = path.join(
  REPO_ROOT,
  "public",
  "fonts",
  "subset-chars.txt",
);

function shouldIncludeCodePoint(cp) {
  if (cp === 0) return false;
  if (cp === 0xfeff) return false;
  if (cp < 32 && cp !== 9 && cp !== 10 && cp !== 13) return false;
  return true;
}

async function walk(dir) {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === "node_modules" || entry.name.startsWith(".")) {
          return [];
        }
        return walk(fullPath);
      }
      if (!EXTENSIONS.has(path.extname(entry.name))) return [];
      return [fullPath];
    }),
  );
  return files.flat();
}

/** @returns {{ path: string, codepointCount: number }} */
export async function generateFontSubsetCharsFile() {
  const charSet = new Set();

  for (const ch of FALLBACK_CHARS) {
    const cp = ch.codePointAt(0);
    if (shouldIncludeCodePoint(cp)) charSet.add(ch);
  }

  for (const dir of ROOT_DIRS) {
    const absDir = path.join(REPO_ROOT, dir);
    const files = await walk(absDir);
    for (const file of files) {
      let content;
      try {
        content = await fs.readFile(file, "utf8");
      } catch {
        continue;
      }
      for (const char of content) {
        const cp = char.codePointAt(0);
        if (!shouldIncludeCodePoint(cp)) continue;
        charSet.add(char);
      }
    }
  }

  const sorted = [...charSet].sort((a, b) =>
    a.localeCompare(b, "ko", { sensitivity: "base" }),
  );
  await fs.mkdir(path.dirname(SUBSET_CHARS_FILE), { recursive: true });
  await fs.writeFile(SUBSET_CHARS_FILE, sorted.join(""), "utf8");

  console.log(
    `[font] subset-chars.txt: ${sorted.length} codepoints → ${path.relative(REPO_ROOT, SUBSET_CHARS_FILE)}`,
  );

  return { path: SUBSET_CHARS_FILE, codepointCount: sorted.length };
}
