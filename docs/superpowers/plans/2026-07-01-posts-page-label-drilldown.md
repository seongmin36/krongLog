# 전체 글 페이지 Label 드릴다운 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `/blogs` 전체 글 페이지에서 상단 필터 칩(label)을 고르면 사이드바 "카테고리"가 그 label과 함께 쓰인 하위 태그로 드릴다운되도록 만들어, 칩과 사이드바가 똑같은 목록을 중복 표시하던 문제를 없앤다.

**Architecture:** 빌드 타임(`src/pages/blogs/index.astro`)에서 각 상단 label별 하위 태그 빈도 맵(`subTagsByLabel`)을 미리 계산해 `PostsPage.astro`에 props로 전달하고, JSON으로 페이지에 임베드한다. 클라이언트 스크립트는 이 JSON을 그대로 참조해 상단 칩 클릭 시 사이드바 목록을 다시 그리고, `activeLabel`(상단) + `activeSubTag`(사이드바) 두 상태의 AND 조건으로 우측 포스트 목록을 필터링한다. 재계산은 빌드 타임 1회, 클라이언트는 순수 렌더링/필터링만 담당한다.

**Tech Stack:** Astro 6, TypeScript(astro check), vanilla DOM API(인라인 `<script>`, 프레임워크 없음). 이 저장소는 단위 테스트 러너가 없으므로(`package.json`에 vitest/jest 없음), "테스트" 단계는 `pnpm typecheck` + `pnpm dev`로 브라우저에서 직접 확인하는 수동 검증으로 대체한다.

## Global Constraints

- 색상/스타일 토큰 변경 없음 — 이번 작업은 마크업/데이터/스크립트 로직만 다룬다 (`docs/conventions/style-tokens.md` 대상 아님).
- "연도"(`sortedYears`) 사이드바 섹션은 이번 스코프에서 손대지 않는다.
- 검색바(`.posts-search`) 스타일/구조 변경 없음 — 검색어 필터 로직(AND 결합)만 기존 그대로 유지.
- `pnpm typecheck` (astro check) 0 errors 유지.
- 커밋 메시지는 저장소 컨벤션(`type: 한국어 설명`, 예: `feat: ...`, `fix: ...`)을 따른다.
- `docs/superpowers/specs/2026-07-01-posts-page-label-drilldown-design.md`는 이번 기능 구현이 끝나고 사용자가 이상 없음을 확인한 뒤 삭제한다 (사용자 지시, 2026-07-01). 임의로 먼저 지우지 말고 마지막 확인 후에만 삭제한다.

---

### Task 1: 빌드 타임 서브태그 맵 계산 + PostsPage 데이터 전달

**Files:**
- Modify: `src/pages/blogs/index.astro`
- Modify: `src/components/blog/PostsPage.astro`

**Interfaces:**
- Produces: `subTagsByLabel: Record<string, [string, number][]>` — key는 `topTags`에 있는 label 문자열, value는 그 label이 붙은 포스트들에서 자기 자신을 뺀 나머지 태그의 `[태그, 카운트]` 배열(빈도 내림차순). Task 2가 클라이언트에서 이 JSON을 그대로 소비한다.
- Produces: `PostsPage.astro` 템플릿 내 `<script type="application/json" id="sub-tags-data">` — Task 2의 클라이언트 스크립트가 `document.getElementById("sub-tags-data")`로 읽는다.
- Produces: `<ul id="category-list" class="sidebar-list">` — Task 2가 `document.getElementById("category-list")`로 참조해 자식을 다시 그린다.

- [ ] **Step 1: `index.astro`에 subTagsByLabel 계산 추가**

`src/pages/blogs/index.astro`에서 기존 `topTags` 계산 블록 바로 아래에 추가:

```astro
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

그리고 `<PostsPage />` 호출에 prop 추가:

```astro
<PostsPage
  posts={sortedPosts}
  topTags={topTags}
  subTagsByLabel={subTagsByLabel}
  sortedYears={sortedYears}
/>
```

- [ ] **Step 2: `PostsPage.astro` Props 인터페이스 확장**

`src/components/blog/PostsPage.astro` frontmatter의 `Props` 인터페이스와 구조분해를 수정:

```ts
interface Props {
  posts: CollectionEntry<"post">[];
  topTags: [string, number][];
  subTagsByLabel: Record<string, [string, number][]>;
  sortedYears: [number, number][];
}

const { posts, topTags, subTagsByLabel, sortedYears } = Astro.props;
```

- [ ] **Step 3: JSON 임베드 + 사이드바 `<ul>`에 id 추가**

같은 파일의 사이드바 마크업에서 "카테고리" `<ul class="sidebar-list">`에 `id="category-list"` 추가:

```astro
<div class="sidebar-section">
  <p class="sidebar-label">카테고리</p>
  <ul id="category-list" class="sidebar-list">
    <li>
      <button
        class="sidebar-item sidebar-item-active"
        data-sidebar=""
        aria-pressed="true"
      >
        <span>전체</span>
        <span class="sidebar-count">{posts.length}</span>
      </button>
    </li>
    {
      topTags.map(([tag, count]) => (
        <li>
          <button
            class="sidebar-item"
            data-sidebar={tag}
            aria-pressed="false"
          >
            <span>{tag}</span>
            <span class="sidebar-count">{count}</span>
          </button>
        </li>
      ))
    }
  </ul>
</div>
```

`</div>`(`.posts-page` 닫는 태그) 바로 앞, `<script>` 태그 바로 앞에 JSON 임베드 태그 추가:

```astro
<script
  type="application/json"
  id="sub-tags-data"
  set:html={JSON.stringify(subTagsByLabel)}
/>
```

- [ ] **Step 4: typecheck 실행**

Run: `pnpm typecheck`
Expected: `Result (27 files): 0 errors, 0 warnings` (기존과 동일한 결과, 새 에러 없음)

- [ ] **Step 5: 브라우저에서 데이터 확인**

Run: `pnpm dev` (백그라운드 실행 후) → 브라우저에서 `http://localhost:4321/blogs` 접속 → 개발자 도구 콘솔에서:

```js
JSON.parse(document.getElementById("sub-tags-data").textContent)
```

Expected: `{ "Backend": [["Nest.js", N], ["TypeORM", N], ...], "DevOps": [...], ... }` 형태 — 각 key가 상단 칩에 보이는 label과 일치하고, value 배열에 key 자기 자신은 포함되지 않아야 함.

- [ ] **Step 6: Commit**

```bash
git add src/pages/blogs/index.astro src/components/blog/PostsPage.astro
git commit -m "feat: label별 하위 태그 빈도 맵을 빌드 타임에 계산해 전달"
```

---

### Task 2: 사이드바 드릴다운 인터랙션 스크립트 구현

**Files:**
- Modify: `src/components/blog/PostsPage.astro` (`<script>` 블록 전체 교체)

**Interfaces:**
- Consumes: Task 1이 만든 `#sub-tags-data`(JSON), `#category-list`(`<ul>`)
- Consumes: 기존 `.post-row` 엘리먼트의 `data-post-title`, `data-post-tags` (변경 없음)
- Produces: 없음 (최종 사용자 인터랙션 계층, 이후 태스크 없음)

- [ ] **Step 1: 기존 `<script>` 블록을 아래 내용으로 전체 교체**

`src/components/blog/PostsPage.astro` 하단의 `<script>` 블록(현재 `searchInput`, `postList`, `chips`, `sidebarItems`, `filter`, `setTag` 로직)을 통째로 아래로 교체:

```ts
type SubTagEntry = [string, number];

const searchInput = document.getElementById(
  "post-search",
) as HTMLInputElement;
const postList = document.getElementById("post-list")!;
const emptyMsg = document.getElementById("posts-empty")!;
const categoryList = document.getElementById("category-list")!;
const chips = document.querySelectorAll<HTMLButtonElement>("[data-chip]");
const subTagsDataEl = document.getElementById("sub-tags-data")!;
const subTagsByLabel = JSON.parse(
  subTagsDataEl.textContent ?? "{}",
) as Record<string, SubTagEntry[]>;
const totalPostCount = postList.querySelectorAll(".post-row").length;

let activeLabel = "";
let activeSubTag = "";
let searchQuery = "";

function filter() {
  const rows = postList.querySelectorAll<HTMLAnchorElement>(".post-row");
  let visible = 0;

  rows.forEach((row) => {
    const title = row.dataset.postTitle ?? "";
    const tags: string[] = JSON.parse(row.dataset.postTags ?? "[]");
    const matchLabel = activeLabel === "" || tags.includes(activeLabel);
    const matchSubTag = activeSubTag === "" || tags.includes(activeSubTag);
    const matchSearch =
      searchQuery === "" || title.includes(searchQuery.toLowerCase());

    const show = matchLabel && matchSubTag && matchSearch;
    row.hidden = !show;
    if (show) visible++;
  });

  emptyMsg.hidden = visible > 0;
}

function labelPostCount(label: string): number {
  if (label === "") return totalPostCount;
  const rows = postList.querySelectorAll<HTMLAnchorElement>(".post-row");
  let count = 0;
  rows.forEach((row) => {
    const tags: string[] = JSON.parse(row.dataset.postTags ?? "[]");
    if (tags.includes(label)) count++;
  });
  return count;
}

function setSubTag(tag: string) {
  activeSubTag = tag;
  categoryList
    .querySelectorAll<HTMLButtonElement>("[data-sidebar]")
    .forEach((item) => {
      const on = item.dataset.sidebar === tag;
      item.classList.toggle("sidebar-item-active", on);
      item.setAttribute("aria-pressed", String(on));
    });
  filter();
}

function renderCategoryList(label: string) {
  const entries: SubTagEntry[] = label === "" ? [] : (subTagsByLabel[label] ?? []);
  const allCount = labelPostCount(label);

  categoryList.replaceChildren();

  const allLi = document.createElement("li");
  const allButton = document.createElement("button");
  allButton.className = "sidebar-item sidebar-item-active";
  allButton.dataset.sidebar = "";
  allButton.setAttribute("aria-pressed", "true");
  allButton.innerHTML = `<span>전체</span><span class="sidebar-count">${allCount}</span>`;
  allButton.addEventListener("click", () => setSubTag(""));
  allLi.appendChild(allButton);
  categoryList.appendChild(allLi);

  entries.forEach(([tag, count]) => {
    const li = document.createElement("li");
    const button = document.createElement("button");
    button.className = "sidebar-item";
    button.dataset.sidebar = tag;
    button.setAttribute("aria-pressed", "false");
    button.innerHTML = `<span>${tag}</span><span class="sidebar-count">${count}</span>`;
    button.addEventListener("click", () => setSubTag(tag));
    li.appendChild(button);
    categoryList.appendChild(li);
  });
}

function setLabel(label: string) {
  activeLabel = label;
  activeSubTag = "";
  chips.forEach((chip) => {
    const on = chip.dataset.chip === label;
    chip.classList.toggle("chip-active", on);
    chip.setAttribute("aria-pressed", String(on));
  });
  renderCategoryList(label);
  filter();
}

chips.forEach((chip) =>
  chip.addEventListener("click", () => setLabel(chip.dataset.chip ?? "")),
);
searchInput.addEventListener("input", () => {
  searchQuery = searchInput.value;
  filter();
});

renderCategoryList("");
```

- [ ] **Step 2: typecheck 실행**

Run: `pnpm typecheck`
Expected: `Result (27 files): 0 errors, 0 warnings`

- [ ] **Step 3: 브라우저 수동 검증 — 기본 상태**

`pnpm dev` (이미 떠 있지 않다면 실행) → `http://localhost:4321/blogs` 접속.

확인:
- 사이드바 "카테고리" 목록이 기존과 동일하게 전체 태그 빈도순으로 보이는지
- "전체" 항목 카운트가 전체 포스트 수와 일치하는지

- [ ] **Step 4: 브라우저 수동 검증 — label 드릴다운**

상단 칩에서 `Backend`(또는 실제 존재하는 최빈 태그) 클릭.

확인:
- 사이드바 "카테고리" 목록이 `Backend`와 함께 쓰인 태그들(예: `Nest.js`, `TypeORM`, `Logging` 등)로 바뀌는지
- 각 카운트가 실제로 `Backend` + 해당 태그를 모두 가진 포스트 수와 일치하는지 (`src/content/post/blog/*.mdx` frontmatter의 `tags`와 대조)
- 사이드바 "전체" 카운트가 `Backend` 포함 전체 포스트 수와 일치하는지
- 오른쪽 포스트 목록이 `Backend` 포함 포스트만 남는지

- [ ] **Step 5: 브라우저 수동 검증 — 하위 태그 + 검색 결합**

`Backend` 선택 상태에서 사이드바 하위 태그(예: `Nest.js`) 클릭 → 오른쪽 목록이 `Backend` AND `Nest.js` 교집합으로 좁혀지는지 확인.

검색창에 아무 키워드 입력 → 위 필터에 검색어 조건까지 AND로 추가 적용되는지 확인.

다른 상단 칩(`전체` 또는 다른 label) 클릭 → 사이드바 하위 선택이 초기화되고 새 label 기준으로 목록이 다시 계산되는지 확인.

- [ ] **Step 6: Commit**

```bash
git add src/components/blog/PostsPage.astro
git commit -m "feat: 상단 label 선택 시 사이드바 카테고리를 하위 태그로 드릴다운"
```

---

### Task 3: 스펙 문서 정리 (사용자 확인 후에만 진행)

**Files:**
- Delete: `docs/superpowers/specs/2026-07-01-posts-page-label-drilldown-design.md`

- [ ] **Step 1: 사용자에게 Task 1~2 검증 결과에 이상이 없는지 확인 요청**

Task 1, 2의 브라우저 수동 검증까지 마친 뒤, 사용자에게 "드릴다운 기능이 의도대로 동작하는지" 확인을 요청한다. 이상 없다는 답을 받기 전까지 Step 2를 실행하지 않는다.

- [ ] **Step 2: 사용자 확인 후 스펙 문서 삭제 + 커밋**

```bash
rm docs/superpowers/specs/2026-07-01-posts-page-label-drilldown-design.md
git add docs/superpowers/specs/2026-07-01-posts-page-label-drilldown-design.md
git commit -m "chore: 구현 완료된 label 드릴다운 스펙 문서 정리"
```
