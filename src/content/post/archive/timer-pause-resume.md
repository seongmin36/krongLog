---
title: "setInterval()을 정지했다가 다시 시작하면?"
date: 2026-03-20T20:55:27+09:00
icon: "lucide:timer"
tags: ["TIL", "JavaScript"]
---

---

- `setTimeout()`과 `setInterval()` => 추가로 `setInterval()` 정지, 시작 토글을 눌렀을 때 다시 interval이 돌아가는 이유
  - `clearTimeout()`, `clearInterval()` 등 타이머 언마운트 메서드를 선언해줌으로써 처음부터 다시 타이머를 잰다.
  - 그래서 타이머를 정지했을 때 `clearInterval()`과 상관없이 돌리려면?
    - `performance.now()`를 사용하여 시작 시간, 정지한 시간, 알람 등의 기능을 구현할 수 있다. -> 정밀한 시간 계산의 장점.
    - 만약 타이머를 ‘무적’으로 계속 돌리려면, useRef의 ref객체(DOM 요소에 직접 접근)를 이용해서 현재 시간을 빼서 구현하면 된다.
