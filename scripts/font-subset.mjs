#!/usr/bin/env node
/**
 * 단일 진입점: 문자 스캔 → public/fonts/subset-chars.txt → pyftsubset 4종 실행
 *
 * 필요: fonttools 설치 후 PATH에 pyftsubset
 * 원본: public/fonts/source/*.woff2 (README 참고)
 */
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import {
  generateFontSubsetCharsFile,
  REPO_ROOT,
  SUBSET_CHARS_FILE,
} from "./generate-font-subset-text.mjs";

const FONT_JOBS = [
  [
    "public/fonts/source/KakaoBigSans-Regular.woff2",
    "public/fonts/KakaoBigSans-Regular.subset.woff2",
  ],
  [
    "public/fonts/source/KakaoBigSans-Bold.woff2",
    "public/fonts/KakaoBigSans-Bold.subset.woff2",
  ],
  [
    "public/fonts/source/KakaoBigSans-ExtraBold.woff2",
    "public/fonts/KakaoBigSans-ExtraBold.subset.woff2",
  ],
  [
    "public/fonts/source/KakaoSmallSans-Light.woff2",
    "public/fonts/KakaoSmallSans-Light.subset.woff2",
  ],
];

function resolveFromRoot(p) {
  return path.join(REPO_ROOT, p);
}

async function main() {
  await generateFontSubsetCharsFile();

  const textFile = SUBSET_CHARS_FILE;
  const textRel = path.relative(REPO_ROOT, textFile);

  for (const [inputRel, outputRel] of FONT_JOBS) {
    const inputAbs = resolveFromRoot(inputRel);
    const outputAbs = resolveFromRoot(outputRel);

    if (!existsSync(inputAbs)) {
      console.error(
        `\n[font] 원본 폰트가 없습니다:\n  ${path.relative(REPO_ROOT, inputAbs)}\n\n` +
          `public/fonts/source/README.md 를 읽고, 카카오에서 받은 전체 woff2를 해당 경로 이름으로 두세요.`,
      );
      process.exit(1);
    }

    console.log(`[font] pyftsubset ← ${inputRel}`);
    const r = spawnSync(
      "pyftsubset",
      [
        inputAbs,
        `--text-file=${textFile}`,
        "--flavor=woff2",
        `--output-file=${outputAbs}`,
      ],
      {
        cwd: REPO_ROOT,
        stdio: "inherit",
        encoding: "utf8",
      },
    );

    if (r.status !== 0 && r.status !== null) {
      console.error(
        "[font] pyftsubset 실패 (fonttools 미설치이거나 명령 오류일 수 있습니다)",
      );
      process.exit(r.status);
    }

    console.log(`[font]   → ${outputRel}`);
  }

  console.log(`[font] 완료 (--text-file=${textRel})`);
}

await main();
