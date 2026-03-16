# CLAUDE.md

이 파일은 Claude Code (claude.ai/code)가 이 저장소에서 작업할 때 참고하는 가이드입니다.

## 명령어

```bash
pnpm dev        # 개발 서버 실행 (localhost:4321)
pnpm build      # ./dist/ 로 빌드 (Vercel 정적 출력)
pnpm preview    # 프로덕션 빌드 로컬 미리보기
```

테스트 및 린트 스크립트는 별도로 설정되어 있지 않습니다.

## 아키텍처

`https://blog.kronglog.dev` 에 Vercel로 배포된 **Astro v5 정적 블로그**입니다. 콘텐츠는 한국어로 작성됩니다.

**스택:** Astro (SSG) + React 19 (인터랙티브 아일랜드 전용) + Tailwind CSS v4 + MDX + Nanostores

**콘텐츠 컬렉션:** 블로그 포스트는 `src/content/post/blog/**/*.{md,mdx}` 경로에 위치하며, `src/content.config.ts`에서 glob으로 로드됩니다. 스키마 필수 필드는 `title`과 `date`이며, 선택 필드는 `description`, `updatedDate`, `tags`, `image`입니다.

**라우팅:**
- `/` → 홈 (최근 포스트)
- `/blogs` → 전체 포스트 목록
- `/blogs/[...slug]` → 개별 포스트 (SSG)
- `/about` → 소개 페이지

**주요 아키텍처 결정 사항:**
- React는 클라이언트 사이드 인터랙션이 필요한 컴포넌트(`ThemeToggle.tsx`, `AppIcons.tsx`)에만 사용됩니다. 나머지 컴포넌트는 모두 `.astro` 파일입니다.
- 다크 모드 상태는 Nanostores(`src/lib/stores/theme.ts`)로 관리되며 localStorage에 저장됩니다. `BaseLayout.astro`에 FOUC 방지를 위한 인라인 스크립트가 포함되어 있습니다.
- Tailwind v4 설정은 `src/styles/global.css`에 완전히 위치합니다(`tailwind.config.*` 파일 없음). 커스텀 테마 토큰(색상, 폰트)은 `@theme inline`으로 정의됩니다.
- 기술 태그 색상(React, TypeScript, Docker 등)은 `Tag.astro`의 `data-tag` 속성을 통한 CSS로 정의됩니다.
- 경로 별칭 `@/*`는 `src/*`로 매핑됩니다.
- SVG 파일은 SVGR(Vite 플러그인, `astro.config.mjs`)을 통해 React 컴포넌트로 임포트됩니다.

**SEO**는 `src/types/seo.ts`에 타입이 정의된 props를 통해 `BaseLayout.astro`에서 처리됩니다.
