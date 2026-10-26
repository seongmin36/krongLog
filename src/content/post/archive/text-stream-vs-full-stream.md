---
title: "textStream과 fullStream"
date: 2026-06-16T16:11:21+09:00
icon: "lucide:code-xml"
tags: ["TIL", "AI"]
---

---

AI 챗봇은 기본적으로 ‘stream’으로 출력된다. 데이터가 한 번에 오게 되면 출력까지의 시간이 꽤나 걸리기 때문에 스트리밍으로 바로바로 처리하는게 효율적이다.

- textStream은 텍스트만 흘려보내는 단순 스트림
- fullStream은 텍스트를 포함한 모든 이벤트를 흘려보내는 상세 스트림
