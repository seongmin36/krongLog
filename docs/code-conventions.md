# 코드 컨벤션 — 스타일 토큰

색상·테마 값은 **`src/styles/global.css`의 `@theme` 블록**에서만 정의합니다.<br />
`mdx.css`, 컴포넌트, MDX 본문에서는 **hex / rgb / rgba 리터럴을 쓰지 않고** 토큰(`var(--color-…)` 또는 Tailwind 유틸)만 사용합니다.

## 규칙

1. **새 색이 필요하면** `global.css`에 역할(role) 이름으로 토큰을 추가한 뒤 사용합니다.
2. **기존 토큰이 있으면** 새 이름을 만들지 않고 재사용합니다.
3. **다크 모드**는 `-dark` 접미사 토큰 또는 `.dark` 선택자 + 다크 전용 토큰으로 처리합니다.
4. **브랜드/기술 태그** 색은 `--color-tag-{name}-*` 패밀리를 유지합니다.
5. **Shiki 코드 블록** 배경은 github-light/dark와 맞춘 `--color-code-block-surface*` 를 사용합니다. Shiki 인라인 `style`은 빌드 산출물이며, 시각적 덮어쓰기는 CSS 토큰으로 합니다.

## 네이밍

| 패턴 | 용도 | 예 |
|------|------|-----|
| `--color-{role}` | 라이트 기본 | `--color-primary`, `--color-description` |
| `--color-{role}-dark` | 다크 전용 | `--color-dark-description`, `--color-code-block-surface-dark` |
| `--color-tag-{brand}-*` | 기술 태그 | `--color-tag-react-bg` |
| `--color-brand-*` | 외부 서비스 브랜드 | `--color-brand-linkedin` |
| `--color-hover-overlay-*` | hover 배경 오버레이 | `--color-hover-overlay-light` |

## 토큰 목록 (`global.css`)

### 브랜드 · 본문

| 토큰 | 값 | 용도 |
|------|-----|------|
| `--color-primary` | `#3b7a57` | 링크, 강조, 인라인 코드(라이트) |
| `--color-description` | `#4b5563` | 본문 보조, 코드 블록 border(라이트) |
| `--color-dark` | `#1b1b1b` | 다크 배경, 테이블 헤더(라이트) |
| `--color-dark-text` | `#f0a8b8` | 다크 모드 강조 텍스트 |
| `--color-dark-description` | `#d1d5db` | 다크 본문 보조, 코드 블록 border(다크) |

### UI 보조

| 토큰 | 값 | 용도 |
|------|-----|------|
| `--color-muted` | `#9ca3af` | copy 버튼, 라인 넘버(라이트) |
| `--color-muted-dark` | `#6b7280` | copy 버튼·라인 넘버(다크) |
| `--color-success` | `#16a34a` | copy 성공(라이트) |
| `--color-success-dark` | `#4ade80` | copy 성공(다크) |
| `--color-hover-overlay-light` | `rgba(0,0,0,0.06)` | 버튼 hover 배경(라이트) |
| `--color-hover-overlay-dark` | `rgba(255,255,255,0.08)` | 버튼 hover 배경(다크) |

### MDX · 코드

| 토큰 | 값 | 용도 |
|------|-----|------|
| `--color-highlight-pen` | `#e9f1ec` | `<mark>`, Shiki 줄/단어 하이라이트(라이트) |
| `--color-highlight-pen-dark` | `#7a5b69` | 동일(다크) |
| `--color-code-block-surface` | `#f6f8fa` | 코드 블록·lang 탭 배경(라이트) |
| `--color-code-block-surface-dark` | `#24292e` | 코드 블록·lang 탭 배경(다크) |
| `--color-inline-code-surface` | `#f3f4f6` | 인라인 `` `code` `` · 기본 태그 배경(라이트) |
| `--color-inline-code-surface-dark` | `#2a2d35` | 인라인 `` `code` `` 배경(다크) |
| `--color-blockquote-surface` | `#f8fafc` | 인용구 배경(라이트) |
| `--color-blockquote-surface-dark` | `#1a1b1e` | 인용구 배경(다크) |
| `--color-blockquote-text-dark` | `#9ca3af` | 인용구 텍스트(다크) |
| `--color-tag-default-bg-dark` | `#383b40` | 기본 태그 배경(다크) |
| `--color-tag-default-text-dark` | `#9ca3af` | 기본 태그 텍스트(다크) |

라이트 모드 기본 태그는 `--color-inline-code-surface` + `--color-description` 조합을 재사용합니다.

### Tooltip · 소셜

| 토큰 | 용도 |
|------|------|
| `--tootip-light`, `--tootip-light-text` | Tooltip(라이트) |
| `--tootip-dark`, `--tootip-dark-text` | Tooltip(다크) |
| `--color-brand-linkedin` | LinkedIn 아이콘 hover |
| `--color-brand-rss` | RSS 아이콘 hover |

기술 태그(`--color-tag-react-*` 등) 전체 목록은 `global.css` `@theme` 블록을 참고합니다.

## 사용 예

```css
/* CSS (mdx.css 등) */
.copy-btn {
  color: var(--color-muted);
}
.dark .copy-btn:hover {
  color: var(--color-dark-description);
  background-color: var(--color-hover-overlay-dark);
}
```

```html
<!-- Tailwind: @theme에 등록된 --color-* 는 text-*, bg-* 유틸로도 사용 가능 -->
<p class="text-description dark:text-dark-description">...</p>
```

## 로컬 alias (예외)

코드 블록처럼 **한 컴포넌트 묶음**에서 같은 토큰을 여러 선택자가 쓰면, 래퍼에 alias만 허용합니다.

```css
.code-block-wrapper {
  --code-block-border: var(--color-description);
  --code-block-surface: var(--color-code-block-surface);
}
.dark .code-block-wrapper {
  --code-block-border: var(--color-dark-description);
  --code-block-surface: var(--color-code-block-surface-dark);
}
```

alias 값은 **반드시 global 토큰을 참조**하고, hex를 직접 넣지 않습니다.

## 금지 · 허용

| 금지 | 허용 |
|------|------|
| `color: #9ca3af` | `color: var(--color-muted)` |
| `dark:bg-[#2a2d35]` | `dark:bg-[var(--color-inline-code-surface-dark)]` |
| `@apply … dark:bg-[#383B40]` | `background-color: var(--color-tag-default-bg-dark)` |
| MDX 본문에 임의 hex (특수 하이라이트 제외) | `<mark>` + CSS 토큰 |

MDX 본문 일회성 색(`study-nodejs-4th` JWT `<mark style="…">` 등)은 콘텐츠 예외로 두고, UI·테마는 토큰만 사용합니다.
