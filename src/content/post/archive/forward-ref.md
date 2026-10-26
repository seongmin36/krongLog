---
title: "forwardRef"
date: 2026-05-09T10:52:23+09:00
icon: "lucide:atom"
tags: ["TIL", "React"]
---

---

- forwardRef : 자식 컴포넌트가 받은 Ref를 내부 DOM 노드에 전달하는 패턴이다.
  이게 왜 Input 태그에서 사용될까? 우리가 일반적으로 react에서 사용하는 input은 value를 state로 관리하고, 화면은 그 state를 따라가는 것이 기본 방식이다.
  하지만, 에러가 발생했을때, 유효성 검사에 실패했을 때, 스크롤을 이동해야할 떄 등 DOM 조작을 위해서는 ref가 필요하다.
  forwardRef를 사용하게 되면, 커스텀 Input 컴포넌트 내부 input에 ref를 직접 제어할 수 있게 만들 수 있다.
