# CLAUDE.md

이 파일은 Claude Code (claude.ai/code)가 이 저장소에서 작업할 때 참고하는 가이드입니다.

## 명령어

```bash
pnpm dev          # 개발 서버 실행 (localhost:4321)
pnpm build        # 동영상 변환 + ./dist/ 로 빌드 (Vercel 정적 출력)
pnpm preview      # 프로덕션 빌드 로컬 미리보기
pnpm video:build  # raw-videos/*.mov → public/videos/*.mp4 변환만 실행
pnpm typecheck    # astro check (Astro + TypeScript 진단)
```

`package.json`의 `engines.node`는 `>=22.0.0`입니다. 린트 스크립트는 별도로 없습니다.

## 아키텍처

`https://blog.kronglog.dev` 에 Vercel로 배포된 **Astro v6 정적 블로그**입니다. 콘텐츠는 한국어 합쇼체(`~합니다`, `~입니다`)로 작성됩니다.

**스택:** Astro 6 (SSG) + TypeScript 6 + Vite 7 (pnpm `overrides`로 고정) + React 19 (인터랙티브 아일랜드 전용) + Tailwind CSS v4 + MDX + Nanostores

**콘텐츠 컬렉션:** 블로그 포스트는 `src/content/post/blog/**/*.{md,mdx}` 경로에 위치하며, `src/content.config.ts`에서 glob으로 로드됩니다. 스키마 필수 필드는 `title`과 `date`이며, 선택 필드는 `description`, `updatedDate`, `tags`입니다. `image`는 스키마상 선택이지만 모든 포스트에 포함하는 것을 원칙으로 합니다.

**라우팅:**
- `/` → 홈 (최근 포스트)
- `/blogs` → 전체 포스트 목록
- `/blogs/[...slug]` → 개별 포스트 (SSG)
- `/about` → 소개 페이지

**주요 아키텍처 결정 사항:**
- React는 클라이언트 사이드 인터랙션이 필요한 컴포넌트(`ThemeToggle.tsx`, `AppIcons.tsx`)에만 사용됩니다. 나머지 컴포넌트는 모두 `.astro` 파일입니다.
- 다크 모드 상태는 Nanostores(`src/lib/stores/theme.ts`)로 관리되며 localStorage에 저장됩니다. `BaseLayout.astro`에 FOUC 방지를 위한 인라인 스크립트가 포함되어 있습니다.
- Tailwind v4 설정은 `src/styles/global.css`에 완전히 위치합니다(`tailwind.config.*` 파일 없음). 커스텀 테마 토큰(색상, 폰트)은 `@theme`으로 정의하며, 규칙은 `docs/code-conventions.md`를 참고합니다.
- 기술 태그 색상(React, TypeScript, Docker 등)은 `Tag.astro`의 `data-tag` 속성을 통한 CSS로 정의됩니다.
- 경로 별칭 `@/*`는 `src/*`로 매핑됩니다.
- SVG 파일은 SVGR(Vite 플러그인, `astro.config.mjs`)을 통해 React 컴포넌트로 임포트됩니다.

**SEO**는 `src/types/seo.ts`에 타입이 정의된 props를 통해 `BaseLayout.astro`에서 처리됩니다.

**본문 형광펜 하이라이트:** 색상 토큰은 `global.css`의 `--color-highlight-pen` (#E9F1EC)·`--color-highlight-pen-dark`입니다. MDX에서 `<mark>`는 **문장이 아닌 헤딩에만** 쓰고(글당 2~3개), **가능하면 `## <mark>…</mark>`** 로 중간 챕터를 강조해 목차 밀도와 가독성을 맞춥니다. 스타일은 `mdx.css`의 `.prose mark`에서 처리합니다(추가 JS 없음). 코드 블록은 기존 Shiki 설정 그대로 두고, `transformerMetaHighlight` / `transformerNotationHighlight` 등으로 붙는 `.line.highlighted`, `.highlighted-word`에 동일 팔레트를 맞춥니다.

**괄호 포함 볼드:** 괄호가 포함된 강조 텍스트(예: `ORM(Object Relational Mapping)`)는 `**...**` 대신 `<strong>...</strong>` 태그를 사용합니다. `**...()**` 형태는 MDX 렌더링이 깨질 수 있습니다.

**MDX 본문 줄바꿈:** 여러 문장이 한 호흡으로 이어지면 가독성이 떨어집니다. **논리 덩어리**(정의와 전제, 규칙과 이유, 서로 다른 주제)마다 **빈 줄**로 단락을 나누고, 같은 덩어리 안에서는 문장 끝에 **`<br />`**만 넣어 줄을 넘깁니다(HTML의 부드러운 줄바꿈, 에디터에서 Shift+Enter에 가깝습니다). Markdown에서 빈 줄 한 번은 새 `<p>`라 **세로 여백이 크게** 벌어지므로, “조금만 띄우기”에는 빈 줄 대신 `<br />`를 사용합니다. CommonMark의 “줄 끝 공백 두 칸 + 줄바꿈” 하드 브레이크는 소스에 잘 보이지 않아 유지보수에 불리하므로 이 저장소의 MDX에서는 쓰지 않습니다.

**블로그 본문 작성·리라이트 시 에이전트 지시문(복사용):** `MDX 본문에서 긴 연속 서술은 한 단락으로 붙이지 말 것. 논리 덩어리마다 빈 줄로 구간을 나누고, 같은 덩어리 안에서는 문장마다 끝에 <br />로 줄만 바꿀 것(큰 단락 여백 없이 읽기 호흡).`

**동영상 파이프라인:** 원본 `.mov` 파일은 `raw-videos/` 폴더에 저장하며(git-ignored), `pnpm video:build` 또는 `pnpm build` 시 `scripts/process-videos.mjs`가 ffmpeg로 `public/videos/`에 `.mp4`로 자동 변환합니다. 이미 변환된 파일은 스킵됩니다. MDX에서는 `<Video src="/videos/폴더명/파일.mp4" />` 컴포넌트(`src/components/ui/Video.astro`)로 사용하며, 런타임 JS 없이 `<video>` 태그만 렌더링됩니다.
