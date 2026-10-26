---
title: "enabled gate란?"
date: 2026-10-01T00:41:34+09:00
icon: "lucide:atom"
tags: ["TIL", "TanStack Query"]
---

---

- tanstack query의 enabled 옵션으로 ‘아직 fetch 하지마’와 같은 조건을 걸어두는 패턴을 말한다.
  즉, /refresh 요청이 있기 전에 다른 api 엔드포인트를 보내지말라는 방식이다.

‘gate’ 라고 불리는 이유는?

- 위에서의 설명으로 유추할 수 있듯이, 조건이 맞을 때만 private 쿼리가 열리고, 그 전에는 닫혀 있어서 문처럼 통과 조건을 두는 것과 같다.

현재 프로젝트에서 어떤 상황인데?

- 현재 로그인(/refresh) 구조는
- 1. accessToken은 메모리에만 있고, 새로고침·첫 진입 시 비어있다.
- 2. SessionBootstrap이 POST /refresh로 토큰을 채운다.
- 3. 동시에 use훅 등이 Authorization 없이 API를 먼저 친다.
- 4. Route Handler·Spring 쪽에서 `401` → privateFetch같은 `tryRefresh()` 로 retry 된다. → `200`
- 5. Devtools에는 실패 1줄 + 성공 1줄이 같이 노출된다.
     (추가로 Serwist SW가 localhost에 남아있으면 톱니(⚙) 아이콘 요청이 보일 수 있다.)
- 여기서 뭐가 문제냐면, /refresh 성공 후 화면이 정상이면 설계상 자연스러운 동작이지만, `401` 로그·알람이 ‘노이즈’가 될 수 있다는 것이다. 따라서 위와 같은 enabled gate로 이를 잠시 해결할 수 있다.
  - 최초 진입 시에 Network `401`은 줄어든다.
  - 하지만, 브라우징 중 토큰 만료 후 `401`→refresh→재시도는 그대로다.
  - 또한 훅마다 수동 게이트, 로딩 상태 재점검, Storybook/테스트 래퍼, refresh 지연 시에는 전부 대기하는 어마무시한 비용이 발생한다.
- 따라서 근본적인 문제 해결을 위한 방법은 훅 N곳 게이트가 아니라 apiClient / privateFetch 한 곳에서 ‘refresh 준비될 때까지 대기’와 같은 선제 `401`을 줄이는 것과 같은 방식을 모색해야 한다.
