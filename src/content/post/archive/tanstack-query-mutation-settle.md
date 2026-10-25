---
title: "invalidateQuery를 return 해야하는 이유와 영원히 pending인 Promise"
date: 2026-08-05T23:37:27+09:00
icon: "lucide:atom"
tags: ["TIL","TanStack Query"]
---

---
- invalidateQuery를 return 해야하는 이유?
    - tanstack query는 mutation에서 onSuccess의 콜백이 끝날때의 시점을 정할 수 있는데, 즉, settle처리 시점을 정할 수 있다. return Promise를 넣게 되면, 비동기 처리가 끝날때까지 settle 처리되지 않는다.
    - 반대로 return을 주지 않으면 return이 끝나기 전에 settle처리가 된다.
- 401에서 영원히 pending인 Promise

<!-- 이미지 -->

- 이 경우에 문제가 되는 것은 window.location.href는 즉시 페이지를 바꾸지 않고, 브라우저는 현재 실행중인 js를 마저 실행하고, 이동한다.
그 찰나에 여기서 null을 반환하거나 에러를 던지면, tanstack query가 그걸 결과로 받아
    - 상태 갱신 → 컴포넌트 리렌더링 → 데이터가 없는 화면이나 에러 화면 번쩍임
- 따라서 절대 해결되지 않는 Promise를 계속 주면 무한 pending에 빠질 수 있다.
