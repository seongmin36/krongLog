---
title: "Astro의 client 지시어와 nanostores"
date: 2026-02-27T14:23:49+09:00
icon: "lucide:atom"
tags: ["TIL","Astro"]
---

---
- client: load: Astro에서 Hydration 지시어로 사용됨.
    - client:load -> 즉시 자바스크립트 로드 및 실행 (네비게이션, 토글 버튼, 검색창)
    - client:idle -> 페이지 로드가 끝나고 브라우저가 한가할 때 실행 (푸터의 복잡한 위젯, 덜 중요한 UI)
    - client:visible -> 해당 요소가 화면에 보일 때(Intersection Observer) 실행 (나중에 만들 Three.js 캔버스, 하단 댓글창)
    - client:only="react" -> 서버 렌더링을 아예 건너뛰고 클라이언트에서만 실행 (브라우저 전용 API(window, document)를 쓰는 컴포넌트)
- nanostores : astro에서 아일랜드 아키텍처를 사용할 때 상태 관리 솔루션
