---
title: "display: table-cell에서 width: 1px"
date: 2026-07-03T23:04:34+09:00
icon: "lucide:code-xml"
tags: ["TIL","CSS"]
---

---
- 일반 inline-block이나 div태그일때는 width:1px이면, 정말 1px로 고정된다.
- 하지만, display: table-cell인 경우에 width: 1px은 “최소한 1px은 필요하고, 나머지 늘어나는 부분은 자연스럽게 늘어난다.”라고 인식한다.
