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
| 페이지 단위 UI 컴포넌트 | `src/components/blog/` 또는 `src/components/ui/` |
| 재사용 UI 컴포넌트 | `src/components/ui/` |
| 전역 스타일·토큰 | `src/styles/global.css` |
| MDX·prose 스타일 | `src/styles/mdx.css` |

## 스타일 위치

| 상황 | 방법 |
|------|------|
| 재사용 UI 컴포넌트(`components/ui/`) | Tailwind 유틸리티 클래스. 색상은 `@theme` 토큰이 생성하는 유틸리티(`text-description`, `bg-hover-overlay-light` 등)를 사용 |
| 상태·변형이 많아 유틸리티로 쓰면 장황해지는 컴포넌트 | 해당 `.astro` 파일의 `<style>` 블록 |
| 여러 컴포넌트가 공유하는 스타일 | `src/styles/mdx.css` 또는 새 CSS 파일 |
| 색상·테마 토큰 | `src/styles/global.css`의 `@theme` 블록 |

같은 클래스 문자열이 여러 엘리먼트에 반복되면 frontmatter 상수로 뽑아 `class={value}`로 재사용합니다(`Pagination.astro`의 `arrowButtonClass` 참고).

## 클라이언트 스크립트

`<script>` 블록은 UI를 담당하는 컴포넌트 파일 안에 둡니다.
라우트 파일(`index.astro`)에 `<script>`를 넣지 않습니다.

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
