# RSS 피드 + GitHub 프로필 블로그 카드 설계

**날짜:** 2026-05-22  
**이슈:** seongmin36/krongLog#34  
**브랜치:** feat/#34/rss-subscribe

---

## 1. 개요

두 가지 기능을 구현한다:

1. **RSS 피드** — `blog.kronglog.dev/rss.xml`을 정적으로 생성해 외부 RSS 리더 구독 지원
2. **GitHub 프로필 블로그 카드** — GitHub Actions가 RSS를 읽어 SVG를 생성·커밋, `seongmin36/seongmin36` README에 최근 포스트 3개를 표시

---

## 2. 아키텍처

```
[seongmin36/krongLog — feat/#34/rss-subscribe]
  src/pages/rss.xml.ts          ← RSS 엔드포인트 (정적 빌드)
  src/assets/icons/icon-rss.svg ← RSS 아이콘 SVG
  src/components/ui/AppIcons.tsx ← rss 아이콘 등록
  src/components/Header.astro   ← RSS 아이콘 링크 추가

[seongmin36/seongmin36 — 프로필 레포]
  scripts/generate-blog-card.mjs          ← RSS fetch → SVG 생성
  .github/workflows/update-blog-card.yml  ← 스케줄 + 수동 트리거
  recent-posts.svg                        ← 자동 생성 결과물
  README.md                               ← ![](./recent-posts.svg) 삽입
```

---

## 3. kronglog — RSS 피드

### 3-1. 패키지

```
@astrojs/rss
```

`astro.config.mjs` 변경 없음 (integration이 아닌 helper 함수).

### 3-2. `src/pages/rss.xml.ts`

- `GET` 핸들러로 Astro RSS XML 반환
- 포함 필드: `title`, `pubDate`(=`date`), `description`(없으면 빈 문자열), `link`(`/blogs/${post.id}`)
- 날짜 내림차순 정렬, 전체 포스트 포함
- feed 메타: `title: "Krong Dev."`, `description: "개발하면서 배운 것들을 기록합니다."`, `site: "https://blog.kronglog.dev"`

### 3-3. 헤더 RSS 아이콘

| 항목 | 내용 |
|------|------|
| `src/assets/icons/icon-rss.svg` | 표준 RSS 웨이브 SVG (24×24, currentColor) |
| `src/components/ui/AppIcons.tsx` | `rss: RssIcon` 추가 |
| `src/components/Header.astro` | LinkedIn 옆에 NavLink 추가, `href="/rss.xml"`, `target="_blank"` |

호버 색상: `#F26522` (RSS 표준 오렌지, LinkedIn `#0A66C2` 패턴과 동일하게 적용).

---

## 4. seongmin36/seongmin36 — 블로그 카드

### 4-1. `scripts/generate-blog-card.mjs`

- 외부 의존성 없음 (Node 22 내장 `fetch`, `DOMParser` 없이 정규식 기반 XML 파싱)
- 최신 3개 포스트 추출: `title`, `description`(60자 truncate + `…`), `pubDate`, `link`
- SVG 출력 스펙:
  - 너비 480px, 높이 동적 계산
  - 내장 `<style>`에 `prefers-color-scheme: dark` 미디어쿼리로 다크/라이트 자동 전환
  - 라이트: 흰 배경 + 어두운 텍스트 / 다크: 어두운 배경 + 밝은 텍스트
  - 포스트당: 제목(볼드) + 설명(그레이) + 날짜(소형)
  - SVG `<a>` 태그 미사용 (GitHub 보안 정책상 무시됨)
- `recent-posts.svg`로 파일 write

### 4-2. `.github/workflows/update-blog-card.yml`

```yaml
트리거:
  - schedule: '0 */6 * * *'   # 매 6시간
  - workflow_dispatch          # 수동 실행

steps:
  1. actions/checkout
  2. actions/setup-node@v4 (node-version: '22')
  3. node scripts/generate-blog-card.mjs
  4. git diff --quiet && exit 0  # 변경 없으면 스킵
  5. git config user 설정 (github-actions[bot])
  6. git commit -m "chore: update recent-posts.svg"
  7. git push
```

### 4-3. `README.md`

```markdown
## 📝 최근 블로그 글

[![Recent Posts](./recent-posts.svg)](https://blog.kronglog.dev/blogs)
```

SVG 전체를 블로그 목록으로 링크 걸어 클릭 가능하게 처리.

---

## 5. 에러 핸들링 & 엣지케이스

| 상황 | 처리 |
|------|------|
| RSS fetch 실패 | non-zero exit → Action 실패 표시, SVG 덮어쓰기 않음 |
| description 없는 포스트 | 빈 줄로 처리 |
| 포스트 3개 미만 | 있는 것만 표시 |
| SVG 내 특수문자 (`<`, `>`, `&`) | XML escape |
| 변경 없을 때 | `git diff --quiet` 체크 후 커밋 스킵 |

---

## 6. 커밋 전략

| 레포 | 커밋 단위 | 포맷 예시 |
|------|-----------|-----------|
| kronglog | RSS 엔드포인트 | `feat(rss): add rss feed endpoint (#34)` |
| kronglog | 헤더 RSS 아이콘 | `feat(rss): add rss icon to header (#34)` |
| seongmin36/seongmin36 | 블로그 카드 스크립트 + Action | `feat: add blog card auto-update workflow` |
| seongmin36/seongmin36 | README 업데이트 | `docs: add recent blog posts card to README` |

---

## 7. 테스트 체크리스트

- [ ] `pnpm build` 후 `dist/rss.xml` 존재 확인
- [ ] `dist/rss.xml` 유효 XML 파싱 가능
- [ ] 헤더 RSS 아이콘 라이트/다크 모드 호버 색상 확인
- [ ] `node scripts/generate-blog-card.mjs` 로컬 실행 → SVG 생성 확인
- [ ] SVG 다크/라이트 모드 브라우저 확인
- [ ] `workflow_dispatch`로 수동 Action 실행 → 커밋 확인
