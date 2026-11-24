import fs from "node:fs";
import path from "node:path";

// 저장소에 올리지 않는 PDF 파일이라 파일이 있는 환경에서만 링크를 연다.
export const RESUME_PDF_HREF: string | undefined = fs.existsSync(
  path.resolve("public/resume/resume.pdf"),
)
  ? "/resume/resume.pdf"
  : undefined;

// 다운로드할 때 쓰는 파일 이름
export const RESUME_PDF_NAME = "조성민_Frontend_이력서.pdf";
