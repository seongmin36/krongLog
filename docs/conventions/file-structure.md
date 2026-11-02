# 파일 구조 컨벤션

## 역할 분리 원칙

파일이 **데이터 페칭 + UI 렌더링 + 스타일 + 스크립트**를 동시에 담으면 분리합니다.

### 라우트 파일 (`src/pages/**/*.astro`)

데이터 페칭과 컴포넌트 조합만 담당합니다.

```astro
---
// ✅ 허용: 데이터 페칭, props 계산
import PostsPage from "@/components/blog/PostsPage.astro";
const posts = await getCollection("post");
---

<BaseLayout ...>
  <PostsPage posts={posts} ... />
</BaseLayout>
```

```astro
---
// ❌ 금지: 라우트 파일에 대형 HTML + style + script
---
<div class="posts-page">
  ... 수백 줄의 UI ...
</div>
<style> ... </style>
<script> ... </script>
```

### UI 컴포넌트 (`src/components/**/*.astro`)

렌더링·스타일·클라이언트 스크립트를 담습니다.

- 재사용 여부와 무관하게 **파일이 커지면** 컴포넌트로 분리합니다.
- 기준: `<style>` 또는 `<script>` 블록이 눈에 띄게 크거나, template이 50줄을 넘으면 분리를 고려합니다.

### 파일 위치

| 역할 | 위치 |
|------|------|
| 라우트 (데이터 레이어) | `src/pages/` |
| 레이아웃·헤더 등 공통 틀 | `src/layouts/`, `src/layouts/partials/` (Header, NavLink) |
| 홈 화면 조각 | `src/components/home/` |
| 블로그 페이지 UI | `src/components/blog/` |
| 아카이브 페이지 UI | `src/components/archive/` |
| MDX 본문에서 import하는 컴포넌트 | `src/components/mdx/` (CodeBlock, LinkCard, GithubCard, Video, `github/`) |
| 여러 곳에서 쓰는 범용 UI 부품 | `src/components/ui/` (Tag, Tooltip, Pagination, ThemeToggle, AppIcons) |
| 순수 함수·상수·경로 | `src/lib/` |
| 전역 스타일·토큰 | `src/styles/global.css` |
| MDX·prose 스타일 | `src/styles/mdx.css` |

## 스타일 위치

| 상황 | 방법 |
|------|------|
| 재사용 UI 컴포넌트(`components/ui/`) | Tailwind 유틸리티 클래스. 색상은 `@theme` 토큰이 생성하는 유틸리티(`text-description`, `bg-hover-overlay-light` 등)를 사용 |
| 상태·변형이 많아 유틸리티로 쓰면 장황해지는 컴포넌트 | 해당 `.astro` 파일의 `<style>` 블록 |
| 여러 컴포넌트가 공유하는 스타일 | `src/styles/mdx.css` 또는 새 CSS 파일 |
| 스크립트가 만드는 요소나 자식 컴포넌트에 적용되는 스타일 (스코프 `<style>`이 닿지 않음) | `src/styles/`의 CSS 파일 (한 곳에서만 써도 허용, 예: `posts-page.css`, `reveal.css`) |
| 색상·테마 토큰 | `src/styles/global.css`의 `@theme` 블록 |

같은 클래스 문자열이 여러 엘리먼트에 반복되면 frontmatter 상수로 뽑아 `class={value}`로 재사용합니다(`Pagination.astro`의 `arrowButtonClass` 참고).

## 클라이언트 스크립트

`<script>` 블록은 UI를 담당하는 컴포넌트 파일 안에 둡니다.
라우트 파일(`index.astro`)에 `<script>`를 넣지 않습니다.

### 스크립트 내부 순서

`<script>` 안의 코드는 아래 순서로 둡니다. 위에서 아래로 읽으면 "무엇을 쓰고 → 어떻게 그리고 → 언제 실행되는지"가 이어지도록 하기 위함입니다.

1. 상수·타입
2. DOM 참조·초기 데이터 (`querySelector`, JSON 파싱)
3. 상태 (`let`)
4. 함수: 헬퍼(URL ↔ 상태 등) → 렌더(상태 → DOM) → 액션(상태 변경 후 렌더)
5. 이벤트 연결 (`addEventListener`, Observer 등록)
6. 초기 실행 (첫 렌더, 숨김 해제 등)

- 이벤트 연결이나 초기 실행 코드를 함수 정의 사이에 끼워 넣지 않습니다.
- 스크립트가 길어 구역 구분이 필요하면 `// 렌더 (상태 → DOM)`처럼 구역 첫 줄에 한 줄 주석을 답니다(`PostsPage.astro` 참고). 짧은 스크립트는 주석 없이 순서만 지킵니다.
- 요소마다 상태가 따로 필요하면 `init(root)` 같은 함수 하나 안에서 같은 순서를 지킵니다(`ArchiveList.astro` 참고).

## 다크 모드 체크리스트

새 컴포넌트·페이지를 추가할 때 아래를 확인합니다.

- [ ] 모든 텍스트 색상에 `.dark` 변형이 있는가?
- [ ] 배경·border 색상에 `.dark` 변형이 있는가?
- [ ] `var(--color-…)` 토큰으로 처리했는가? (hex/rgba 직접 X)
- [ ] 실제 브라우저에서 다크 모드 토글 후 시각 확인을 했는가?

```css
/* 패턴: 라이트 기본 → .dark 오버라이드 */
.my-element {
  color: var(--color-dark);
  background: var(--color-inline-code-surface);
}
.dark .my-element {
  color: var(--color-dark-description);
  background: var(--color-inline-code-surface-dark);
}
```
