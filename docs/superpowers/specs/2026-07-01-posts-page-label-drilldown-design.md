# 전체 글 페이지 — Label → 카테고리 드릴다운 설계

**날짜:** 2026-07-01
**이슈:** seongmin36/krongLog#53
**브랜치:** feature/#53/all-posts-page

---

## 1. 배경 · 문제

`/blogs` 전체 글 페이지(`PostsPage.astro`)에서 상단 필터 칩(`.posts-chips`)과 사이드바 "카테고리"(`.sidebar-list`)가 **똑같이 전체 태그 빈도순 목록**을 보여주고, 둘 다 동일한 `activeTag` 하나를 세팅하는 중복 UI다.

우아한형제들 기술블로그 패턴을 참고해, 상단 label을 고르면 사이드바가 그 label과 **함께 쓰인 세부 태그**로 드릴다운되도록 바꿔 중복을 없앤다.

## 2. 목표 · 비목표

**목표**
- 상단 칩(1단계 label) 선택에 따라 사이드바 "카테고리"(2단계)가 동적으로 바뀌는 드릴다운 구현
- 오른쪽 포스트 목록은 두 단계 필터의 AND 조건으로 필터링 (현재 우측 목록 렌더링 구조는 유지)

**비목표**
- 검색바(`.posts-search`) 개선 — 별도 기획 예정, 이번 스코프 아님
- "연도" 사이드바 섹션 — 현재도 클릭 핸들러가 없는 정적 표시이며 이번 변경과 무관, 그대로 둠
- frontmatter에 `category` 필드 신설 — 안 함, 기존 `tags` 배열만 사용

## 3. 상호작용 모델

- **1단계 (상단 칩, `.posts-chips`)**: 기존과 동일 — "전체" + 전체 태그 빈도순 Top N.
- **2단계 (사이드바 "카테고리", `.sidebar-list`)**:
  - 상단이 **"전체"**일 때 → 지금과 동일하게 전체 태그 빈도순 목록을 보여준다 (기존 `topTags` 재사용).
  - 상단에서 **특정 label**(예: `Backend`)을 고르면 → 사이드바는 "`Backend`가 붙은 포스트들에 함께 붙은 다른 태그"를 빈도순으로 다시 계산해 보여준다. 목록 첫 항목은 "전체"(= `Backend` 전체, 하위 태그 미선택, 카운트 = `Backend` 포함 포스트 총합).
- 사이드바에서 하위 태그를 고르면 **상단 label AND 하위 태그**로 우측 포스트 목록이 좁혀진다.
- 상단 칩을 바꾸면 사이드바 하위 선택은 초기화된다(사이드바는 새 label 기준으로 다시 계산되어 "전체" 상태로 리셋).
- 검색어(`searchQuery`)는 기존처럼 라벨/하위태그 필터와 별개로 AND 결합 유지.

## 4. 데이터 · 계산

**빌드 타임(`src/pages/blogs/index.astro`)에서 계산:**

```ts
// 상단 칩 후보(topTags)마다: 그 태그가 붙은 포스트들에서
// 자기 자신을 뺀 나머지 태그의 빈도 맵을 계산
const subTagsByLabel: Record<string, [string, number][]> = {};
for (const [label] of topTags) {
  const counts = new Map<string, number>();
  for (const post of sortedPosts) {
    const tags = post.data.tags ?? [];
    if (!tags.includes(label)) continue;
    for (const tag of tags) {
      if (tag === label) continue;
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  subTagsByLabel[label] = [...counts.entries()].sort((a, b) => b[1] - a[1]);
}
```

- `topTags`(전체 태그 빈도순, 기존 로직 그대로)와 `subTagsByLabel`을 함께 `PostsPage`에 props로 전달.
- 클라이언트 스크립트는 이 JSON을 그대로 참조만 하고 재계산하지 않는다 (빌드 시 1회 계산, 클라이언트는 순수 렌더링/필터링만 담당).

## 5. 컴포넌트 · DOM 변경

**`PostsPage.astro` props 추가**
```ts
interface Props {
  posts: CollectionEntry<"post">[];
  topTags: [string, number][];
  subTagsByLabel: Record<string, [string, number][]>;
  sortedYears: [number, number][];
}
```

**사이드바 렌더링**
- 서버 렌더링 시 기본값(초기 상태 = "전체" label)인 `topTags` 기준 목록을 그대로 렌더링 (현재와 동일한 초기 마크업).
- `subTagsByLabel`은 `<script type="application/json" id="sub-tags-data">`로 페이지에 임베드.
- 클라이언트 스크립트가 상단 칩 클릭 시:
  1. `activeLabel` 갱신, `activeSubTag`는 항상 `""`로 리셋
  2. `activeLabel === ""`(전체)이면 사이드바 목록을 `topTags`로, 아니면 `subTagsByLabel[activeLabel]`로 다시 그림 (첫 항목 "전체" + 나머지 태그 버튼, `sidebar-count` 포함)
  3. 새로 그려진 사이드바 항목에 클릭 핸들러 재바인딩
- 사이드바 하위 태그 클릭 시 `activeSubTag`만 갱신(상단 칩/목록 재렌더링 없음).

**필터 로직**
```ts
function filter() {
  // matchTag = activeLabel이 없거나 tags.includes(activeLabel)
  //            AND (activeSubTag이 없거나 tags.includes(activeSubTag))
  // matchSearch는 기존과 동일
}
```

## 6. 엣지 케이스

| 상황 | 처리 |
|------|------|
| 특정 label에 하위 태그가 하나도 없음(단일 태그 포스트만 있는 경우) | 사이드바는 "전체" 항목만 표시 |
| 상단 칩을 다시 "전체"로 변경 | 사이드바가 전체 태그 빈도순 목록으로 복귀, `activeSubTag` 리셋 |
| 검색어 입력 중 상단/사이드바 변경 | 검색어는 유지된 채 AND 조건 재적용 |
| `topTags`에 없는 태그(Top N 밖) | 상단 칩으로 노출되지 않으므로 `subTagsByLabel` 계산 대상에서도 제외 (기존 Top N 정책 유지) |

## 7. 테스트 체크리스트

- [ ] 상단 "전체" 상태에서 사이드바가 기존과 동일한 전체 태그 빈도순 목록을 보여주는지
- [ ] 상단에서 `Backend` 클릭 → 사이드바가 `Backend`와 함께 쓰인 태그들로 바뀌는지, 카운트가 실제 포스트 수와 일치하는지
- [ ] 사이드바 하위 태그 클릭 → 우측 목록이 label AND 하위태그로 좁혀지는지
- [ ] 상단 칩을 다른 label로 변경 → 사이드바 하위 선택이 초기화되고 새 label 기준으로 재계산되는지
- [ ] 검색어 + label + 하위태그 동시 적용 시 AND로 정상 필터링되는지
- [ ] `pnpm typecheck` 통과
