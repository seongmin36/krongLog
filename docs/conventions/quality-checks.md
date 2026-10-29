# 검사 흐름 컨벤션

코드 품질 검사는 **커밋 전 훅**과 **CI** 두 단계로 나눕니다.
빠른 검사는 커밋할 때, 프로젝트 전체를 보는 검사는 CI에서 실행합니다.

## 1. 커밋 전 (lefthook)

`lefthook.yml`의 `pre-commit`이 **스테이지된 파일만** 순서대로 검사합니다.

| 순서 | 검사 | 대상 |
|------|------|------|
| 1 | `eslint --fix` | `*.{js,mjs,ts,tsx,astro}` |
| 2 | `prettier --write` | `*.{js,mjs,ts,tsx,astro,css,json}` |

- 고친 내용은 자동으로 다시 스테이지됩니다(`stage_fixed`).
- 훅은 `pnpm install` 때 `prepare` 스크립트로 설치됩니다. CI에서는 설치하지 않습니다.
- `typecheck`·`build`는 프로젝트 전체를 보고 시간이 걸려 훅에 넣지 않습니다.

## 2. CI (`.github/workflows/ci.yml`)

`main` 대상 PR에서 아래 순서로 실행하고, 하나라도 실패하면 멈춥니다.

```
lint → format:check → typecheck → build → verify:build
```

- `verify:build`(`scripts/verify-build.mjs`)는 `dist`를 검사합니다.
  - 핵심 페이지(`/`, `/blogs/`, `/archive/`, `/about/`, `rss.xml`, `sitemap-index.xml`, `robots.txt`) 존재
  - 페이지 수가 `MIN_PAGES` 이상 (아카이브 HTML 조각 `chunks`는 제외하고 셈)
  - 모든 페이지에 `<title>`과 `description` 존재
- 라우트를 의도적으로 줄였다면 `MIN_PAGES`도 함께 낮춥니다.

## 3. 로컬에서 PR 올리기 전

```bash
pnpm check && pnpm build && pnpm verify:build
```

## 4. 검사 제외 범위

- **Prettier:** `.prettierignore`에서 빌드 산출물과 손으로 포맷하는 `src/content`, `*.md`, `docs`를 제외합니다.
- **ESLint:** `eslint.config.js`의 `ignores`에서 `dist`, `.vercel`, `.astro`, `public`, `src/content`를 제외합니다.

## 5. 주의할 문법 (`prettier-plugin-astro`)

표현식(`{ … ? (<>…</>) : … }`) 안에서는 아래를 쓰지 않습니다. Prettier가 파싱하지 못합니다.

- HTML 주석 `<!-- -->` → `{/* */}`로 씁니다.
- `<noscript><style>` → 표현식 밖으로 빼고 `<style is:inline>`으로 씁니다. `is:inline`이 없으면 Astro가 스타일을 컴포넌트 스타일로 끌어올려 항상 적용됩니다.
