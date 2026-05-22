# RSS 피드 + GitHub 프로필 블로그 카드 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** kronglog 블로그에 RSS 피드와 헤더 RSS 아이콘을 추가하고, GitHub 프로필 레포에 최근 포스트 3개를 표시하는 SVG 카드 자동 업데이트 워크플로우를 구축한다.

**Architecture:** kronglog의 `feat/#34/rss-subscribe` 브랜치에서 `@astrojs/rss`로 `/rss.xml` 정적 엔드포인트와 헤더 아이콘을 추가한다. `seongmin36/seongmin36` 프로필 레포에는 RSS를 읽어 SVG를 생성·커밋하는 GitHub Action을 추가한다.

**Tech Stack:** Astro 6 + `@astrojs/rss` + TypeScript (kronglog) / Node.js 22 + GitHub Actions (profile repo)

---

## 파일 맵

### Part A — kronglog (`feat/#34/rss-subscribe`)

| 상태 | 경로 | 역할 |
|------|------|------|
| 신규 | `src/pages/rss.xml.ts` | RSS 2.0 엔드포인트, 빌드 시 `/rss.xml` 생성 |
| 신규 | `src/assets/icons/icon-rss.svg` | RSS 웨이브 아이콘 (currentColor, 24×24) |
| 수정 | `src/components/ui/AppIcons.tsx` | `rss` 아이콘 등록 |
| 수정 | `src/components/Header.astro` | LinkedIn 옆 RSS 아이콘 링크 추가 |

### Part B — seongmin36/seongmin36 (프로필 레포)

| 상태 | 경로 | 역할 |
|------|------|------|
| 신규 | `scripts/generate-blog-card.mjs` | RSS fetch → SVG 생성 스크립트 |
| 신규 | `.github/workflows/update-blog-card.yml` | 스케줄 + 수동 Action |
| 자동 | `recent-posts.svg` | Action이 생성·커밋하는 결과물 |
| 수정 | `README.md` | SVG 카드 삽입 |

---

## Part A — kronglog

### Task 1: `@astrojs/rss` 설치

**Files:**
- Modify: `package.json`, `pnpm-lock.yaml`

- [ ] **Step 1: 패키지 설치**

```bash
cd /Users/josengmin/Desktop/Project/kronglog
git checkout feat/#34/rss-subscribe
pnpm add @astrojs/rss
```

- [ ] **Step 2: 설치 확인**

```bash
cat package.json | grep @astrojs/rss
```

Expected: `"@astrojs/rss": "^4.x.x"` 또는 최신 버전

- [ ] **Step 3: 커밋**

```bash
git add package.json pnpm-lock.yaml
git commit -m "feat(rss): install @astrojs/rss (#34)"
git push origin feat/#34/rss-subscribe
```

---

### Task 2: RSS 엔드포인트 생성

**Files:**
- Create: `src/pages/rss.xml.ts`

- [ ] **Step 1: `src/pages/rss.xml.ts` 생성**

```ts
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = await getCollection('post');
  const sorted = posts.sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime()
  );

  return rss({
    title: 'Krong Dev.',
    description: '개발하면서 배운 것들을 기록합니다.',
    site: context.site!,
    items: sorted.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description ?? '',
      link: `/blogs/${post.id}`,
    })),
  });
}
```

- [ ] **Step 2: 빌드 후 RSS 파일 존재 확인**

```bash
pnpm build 2>&1 | tail -5
```

Expected: 빌드 성공 (exit 0)

```bash
ls dist/rss.xml
```

Expected: `dist/rss.xml` 파일 존재

- [ ] **Step 3: XML 유효성 확인**

```bash
head -5 dist/rss.xml
```

Expected:
```
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" ...>
  <channel>
    <title>Krong Dev.</title>
```

- [ ] **Step 4: 커밋**

```bash
git add src/pages/rss.xml.ts
git commit -m "feat(rss): add rss feed endpoint (#34)"
git push origin feat/#34/rss-subscribe
```

---

### Task 3: RSS 아이콘 SVG 추가

**Files:**
- Create: `src/assets/icons/icon-rss.svg`

- [ ] **Step 1: `src/assets/icons/icon-rss.svg` 생성**

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M4 11a9 9 0 0 1 9 9"/>
  <path d="M4 4a16 16 0 0 1 16 16"/>
  <circle cx="5" cy="19" r="1"/>
</svg>
```

- [ ] **Step 2: `src/components/ui/AppIcons.tsx` 수정 — rss 아이콘 등록**

기존 파일:
```tsx
import GithubIcon from "@/assets/icons/icon-github.svg?react";
import LinkedinIcon from "@/assets/icons/icon-linkedin.svg?react";

const ICONS = {
  sun: SunIcon,
  moon: MoonIcon,
  github: GithubIcon,
  linkedin: LinkedinIcon,
} as const;
```

변경 후:
```tsx
import GithubIcon from "@/assets/icons/icon-github.svg?react";
import LinkedinIcon from "@/assets/icons/icon-linkedin.svg?react";
import RssIcon from "@/assets/icons/icon-rss.svg?react";

const ICONS = {
  sun: SunIcon,
  moon: MoonIcon,
  github: GithubIcon,
  linkedin: LinkedinIcon,
  rss: RssIcon,
} as const;
```

- [ ] **Step 3: 타입체크**

```bash
pnpm typecheck 2>&1 | tail -10
```

Expected: 오류 없음

- [ ] **Step 4: 커밋**

```bash
git add src/assets/icons/icon-rss.svg src/components/ui/AppIcons.tsx
git commit -m "feat(rss): add rss svg icon and register in AppIcons (#34)"
git push origin feat/#34/rss-subscribe
```

---

### Task 4: 헤더에 RSS 아이콘 링크 추가

**Files:**
- Modify: `src/components/Header.astro`

- [ ] **Step 1: `src/components/Header.astro` 수정**

LinkedIn NavLink 바로 뒤 (line 63 `</div>` 직전)에 추가:

```astro
<NavLink
  href="/rss.xml"
  target="_blank"
  rel="noopener noreferrer"
  aria-label="RSS 피드"
  title="RSS 피드"
  class="inline-flex size-8 items-center justify-center rounded-lg border-none bg-transparent text-gray-500 no-underline transition-colors duration-200 hover:bg-black/5 hover:text-[#F26522]! sm:size-9 dark:text-gray-400 dark:hover:bg-white/8 dark:hover:text-[#F26522]!"
>
  <AppIcon name="rss" className="size-4.5 sm:size-4.5" />
</NavLink>
```

- [ ] **Step 2: 개발 서버 실행 후 헤더 확인**

```bash
pnpm dev
```

브라우저에서 `http://localhost:4321` 접속:
- LinkedIn 아이콘 오른쪽에 RSS 아이콘 표시 확인
- 호버 시 오렌지색(`#F26522`) 전환 확인
- 다크 모드에서도 동일하게 작동 확인
- 클릭 시 `/rss.xml` 새 탭에서 XML 표시 확인

- [ ] **Step 3: 커밋**

```bash
git add src/components/Header.astro
git commit -m "feat(rss): add rss icon link to header (#34)"
git push origin feat/#34/rss-subscribe
```

---

## Part B — seongmin36/seongmin36 (프로필 레포)

> **사전 준비:** `seongmin36/seongmin36` 레포를 로컬에 클론하거나 이미 있는 경로로 이동한다.
> ```bash
> git clone https://github.com/seongmin36/seongmin36.git
> cd seongmin36
> ```

---

### Task 5: 블로그 카드 SVG 생성 스크립트

**Files:**
- Create: `scripts/generate-blog-card.mjs`

- [ ] **Step 1: `scripts/` 디렉토리 확인**

```bash
ls scripts 2>/dev/null || mkdir scripts
```

- [ ] **Step 2: `scripts/generate-blog-card.mjs` 생성**

```js
#!/usr/bin/env node
import { writeFileSync } from 'node:fs';

const RSS_URL = 'https://blog.kronglog.dev/rss.xml';
const OUTPUT_PATH = './recent-posts.svg';
const MAX_POSTS = 3;
const DESC_MAX = 60;

function xmlEscape(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function extractTag(tag, xml) {
  const cdata = new RegExp(
    `<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>`,
    'i'
  ).exec(xml);
  if (cdata) return cdata[1].trim();
  const plain = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'i').exec(xml);
  return plain ? plain[1].trim() : '';
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

function truncate(str, max) {
  return str.length > max ? str.slice(0, max) + '…' : str;
}

async function fetchPosts() {
  const res = await fetch(RSS_URL);
  if (!res.ok) throw new Error(`RSS fetch failed: ${res.status} ${res.statusText}`);
  const xml = await res.text();

  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)]
    .slice(0, MAX_POSTS)
    .map((m) => {
      const item = m[1];
      return {
        title: extractTag('title', item),
        description: extractTag('description', item),
        pubDate: extractTag('pubDate', item),
      };
    });
}

function generateSvg(posts) {
  const W = 480;
  const PAD = 20;
  const HEADER_H = 52;
  const POST_H = 68;
  const FOOTER_PAD = 16;
  const H = HEADER_H + posts.length * POST_H + FOOTER_PAD;

  const rows = posts
    .map((post, i) => {
      const y = HEADER_H + i * POST_H;
      const title = xmlEscape(truncate(post.title, 55));
      const desc = post.description ? xmlEscape(truncate(post.description, DESC_MAX)) : '';
      const date = xmlEscape(formatDate(post.pubDate));
      return `
  <text class="t" x="${PAD}" y="${y + 18}">› ${title}</text>
  ${desc ? `<text class="d" x="${PAD}" y="${y + 36}">${desc}</text>` : ''}
  <text class="dt" x="${PAD}" y="${y + 52}">${date}</text>`;
    })
    .join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <style>
    .bg { fill: #ffffff }
    .dv { stroke: #e5e7eb; stroke-width: 1 }
    .h  { fill: #374151; font: 600 14px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif }
    .t  { fill: #111827; font: 700 13px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif }
    .d  { fill: #6b7280; font: 400 12px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif }
    .dt { fill: #9ca3af; font: 400 11px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif }
    @media (prefers-color-scheme: dark) {
      .bg { fill: #0d1117 }
      .dv { stroke: #30363d }
      .h  { fill: #c9d1d9 }
      .t  { fill: #f0f6fc }
      .d  { fill: #8b949e }
      .dt { fill: #6e7681 }
    }
  </style>
  <rect class="bg" width="${W}" height="${H}" rx="8"/>
  <text class="h" x="${PAD}" y="30">📝 최근 블로그 글</text>
  <line class="dv" x1="${PAD}" y1="42" x2="${W - PAD}" y2="42"/>
  ${rows}
</svg>`;
}

const posts = await fetchPosts();
const svg = generateSvg(posts);
writeFileSync(OUTPUT_PATH, svg, 'utf-8');
console.log(`Generated ${OUTPUT_PATH} with ${posts.length} posts`);
```

- [ ] **Step 3: 로컬 실행으로 SVG 생성 확인**

> **의존성 주의:** Part A(`feat/#34/rss-subscribe`)가 `main`에 머지·배포된 후 실행해야 `https://blog.kronglog.dev/rss.xml`이 유효하다.
> 배포 전 로컬 테스트가 필요한 경우: kronglog 디렉토리에서 `pnpm dev` 실행 후 스크립트 상단 `RSS_URL`을 일시적으로 `http://localhost:4321/rss.xml`로 변경해 테스트한다 (커밋 전 원복).

```bash
node scripts/generate-blog-card.mjs
```

Expected:
```
Generated ./recent-posts.svg with 3 posts
```

- [ ] **Step 4: 생성된 SVG 내용 확인**

```bash
head -20 recent-posts.svg
```

Expected: `<svg xmlns=...`로 시작하는 유효한 SVG, 포스트 제목·날짜 포함

- [ ] **Step 5: 커밋**

```bash
git add scripts/generate-blog-card.mjs recent-posts.svg
git commit -m "feat: add blog card svg generation script"
git push
```

---

### Task 6: GitHub Action 워크플로우 추가

**Files:**
- Create: `.github/workflows/update-blog-card.yml`

- [ ] **Step 1: `.github/workflows/` 디렉토리 확인**

```bash
mkdir -p .github/workflows
```

- [ ] **Step 2: `.github/workflows/update-blog-card.yml` 생성**

```yaml
name: Update Blog Card

on:
  schedule:
    - cron: '0 */6 * * *'
  workflow_dispatch:

jobs:
  update:
    runs-on: ubuntu-latest
    permissions:
      contents: write

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '22'

      - name: Generate blog card
        run: node scripts/generate-blog-card.mjs

      - name: Commit if changed
        run: |
          git diff --quiet && echo "No changes, skipping." && exit 0
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add recent-posts.svg
          git commit -m "chore: update recent-posts.svg"
          git push
```

- [ ] **Step 3: 커밋 & 푸시**

```bash
git add .github/workflows/update-blog-card.yml
git commit -m "feat: add github action to auto-update blog card"
git push
```

- [ ] **Step 4: GitHub에서 수동 실행 확인**

`https://github.com/seongmin36/seongmin36/actions` 접속 →
"Update Blog Card" 워크플로우 → "Run workflow" 클릭 →
실행 성공 및 `recent-posts.svg` 커밋 확인

---

### Task 7: README에 블로그 카드 삽입

**Files:**
- Modify: `README.md`

- [ ] **Step 1: README.md에 블로그 카드 섹션 추가**

원하는 위치에 아래 마크다운 삽입:

```markdown
## 📝 최근 블로그 글

[![Recent Posts](./recent-posts.svg)](https://blog.kronglog.dev/blogs)
```

SVG 전체를 `https://blog.kronglog.dev/blogs`로 링크해 클릭 가능하게 처리.

- [ ] **Step 2: GitHub 프로필 페이지에서 카드 표시 확인**

```bash
git add README.md
git commit -m "docs: add recent blog posts card to README"
git push
```

`https://github.com/seongmin36` 접속 → 프로필 페이지에서 블로그 카드 표시 확인
라이트/다크 모드 전환 시 SVG 색상 자동 변경 확인

---

## 완료 체크리스트

- [ ] `https://blog.kronglog.dev/rss.xml` 유효한 RSS 2.0 XML 반환
- [ ] 블로그 헤더에 RSS 아이콘 표시, 호버 오렌지 전환
- [ ] GitHub 프로필에 최근 포스트 3개 SVG 카드 표시
- [ ] 다크/라이트 모드 SVG 자동 전환
- [ ] GitHub Action 스케줄(매 6시간) 정상 실행
- [ ] `feat/#34/rss-subscribe` 브랜치 PR 생성 가능 상태
