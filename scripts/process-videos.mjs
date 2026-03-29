import { readdirSync, existsSync, mkdirSync } from "node:fs";
import { join, parse, relative } from "node:path";
import { execSync } from "node:child_process";

const RAW_DIR = "raw-videos";
const OUT_DIR = "public/videos";

function findMovFiles(dir) {
  const results = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findMovFiles(fullPath));
    } else if (entry.name.endsWith(".mov")) {
      results.push(fullPath);
    }
  }
  return results;
}

if (!existsSync(RAW_DIR)) {
  console.log("raw-videos/ 폴더가 없습니다. 건너뜁니다.");
  process.exit(0);
}

const movFiles = findMovFiles(RAW_DIR);

if (movFiles.length === 0) {
  console.log("변환할 .mov 파일이 없습니다.");
  process.exit(0);
}

for (const movPath of movFiles) {
  const rel = relative(RAW_DIR, movPath);
  const { dir: subDir, name } = parse(rel);
  const outDir = join(OUT_DIR, subDir);
  const outPath = join(outDir, `${name}.mp4`);

  if (existsSync(outPath)) {
    console.log(`skip: ${outPath}`);
    continue;
  }

  mkdirSync(outDir, { recursive: true });
  console.log(`convert: ${movPath} -> ${outPath}`);

  try {
    execSync(`ffmpeg -i "${movPath}" -c copy "${outPath}" -y`, {
      stdio: "pipe",
    });
    console.log(`done (copy): ${outPath}`);
  } catch {
    console.log(`copy failed, re-encoding...`);
    execSync(
      `ffmpeg -i "${movPath}" ` +
        `-vf "scale=1920:-1" ` +
        `-c:v libx264 -preset veryfast -crf 20 ` +
        `-c:a aac -b:a 128k ` +
        `"${outPath}" -y`,
      { stdio: "pipe" },
    );
    console.log(`done (re-encode): ${outPath}`);
  }
}
