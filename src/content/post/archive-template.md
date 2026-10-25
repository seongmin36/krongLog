# Krong Dev 아카이브 작성 컨벤션

아카이브(`/archive/`)는 블로그 글보다 가볍게 남기는 짧은 글입니다.
글은 `src/content/post/archive/{slug}.md`에 두고, 링크 블록 같은 컴포넌트가 필요하면 `.mdx`로 씁니다.

---

## 1. frontmatter

```yaml
---
title: "글 제목"
date: 2026-03-20T16:33:34+09:00 # 시간까지, KST 오프셋(+09:00) 필수
icon: "lucide:code-xml" # 아래 「아이콘」 규칙
tags: ["배움일기", "React"]
image: "../../../assets/archive/{slug}/cover.jpg" # 선택. 있으면 이미지 카드
type: quote # 선택. 인용 글만 (quote, author 함께)
---
```

- 본문 이미지는 `src/assets/archive/{slug}/`에 두고 상대 경로로 넣습니다. 외부 이미지 URL은 쓰지 않습니다.

---

## 2. 메인 타이틀 아래 구분선

본문 맨 위에 `---`를 넣어 제목과 본문을 구분합니다. (`.mdx`면 import 다음 줄)

```md
---
title: "..."
---

---

본문 시작
```

---

## 3. 아이콘

| 주제                                            | 아이콘                                        |
| ----------------------------------------------- | --------------------------------------------- |
| LeetCode·코딩 테스트                            | `lucide:copy`                                 |
| git·GitHub                                      | `lucide:git-*` 중 상황에 맞는 것 (예: `git-compare`, `git-merge`) |
| 로그인·보안·인증 등 개인정보가 들어간 주제      | `lucide:key-round`                            |
| Promise·동시성 등 타이밍에 대한 주제            | `lucide:timer`                                |
| DOM·알고리즘 등 구조에 대한 주제                | `lucide:network`                              |
| React·Next.js·프론트엔드 라이브러리(React Hook Form 등) | `lucide:atom`                          |
| Figma·database(Supabase) 등 명확한 주제         | 주제에 맞는 아이콘 (`figma`, `database` …)    |
| 나머지                                          | `lucide:code-xml`                             |

---

## 4. 굵게 (`**문자**`)

굵게 안에 `()` 같은 기호가 들어가 기호와 한글이 맞붙으면 `**`가 그대로 보입니다.
이때는 `<strong>`으로 감쌉니다. (블로그 글도 동일)

```md
<!-- ❌ ** 가 그대로 렌더링 -->
**race condition(경쟁 상태)**이나

<!-- ✅ -->
<strong>race condition(경쟁 상태)</strong>이나
```

---

## 5. 링크

- `링크 :`, `출처 :` 뒤에 붙는 링크와 문장 속 링크는 지금처럼 하이퍼링크 텍스트로 둡니다.

  ```md
  문제 링크 : [https://leetcode.com/problems/...](https://leetcode.com/problems/...)
  ```

- "자세한 내용은 …" 처럼 참고 자료로 거는 링크와 **글 최하단 링크**는 링크 블록(`LinkCard`)을 씁니다. (`.mdx` 필요)

  ```mdx
  import LinkCard from "@/components/ui/LinkCard.astro";

  **\*태스크 큐**에 대한 자세한 내용은 MDN: 태스크 큐

  <LinkCard url="https://developer.mozilla.org/ko/docs/Web/API/HTML_DOM_API/Microtask_guide" />
  ```

---

## 6. 카드 UI (자동)

목록 카드는 frontmatter에 따라 자동으로 정해집니다. 따로 지정하지 않습니다.

| 조건                         | 카드          |
| ---------------------------- | ------------- |
| `type: quote`                | 인용 카드     |
| `image` 있음                 | 이미지 카드   |
| 18:00~06:00(KST) 사이 작성   | 다크 카드     |
| 그 외                        | 기본 흰 카드  |
