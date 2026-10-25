---
title: "window.matchMedia와 CSS 미디어 쿼리"
date: 2026-02-27T23:32:31+09:00
icon: "lucide:code-xml"
tags: ["TIL","CSS"]
---

---
- window.matchmedia : 브라우저의 window 객체에 제공되는 Web API 메서드로, css 미디어 쿼리를 js에서 프로그래밍적으로 평가하고 감지
객체의 matches 속성은 현재 뷰포트나 디바이스 조건이 쿼리를 만족하는지 boolean으로 나타내며, media 속성은 쿼리 문자열 자체를 저장
- css 미디어 쿼리 : css에서 디바이스나 뷰포트 조건(화면 크기, 방향)을 기반으로 스타일을 선택적으로 적용하는 규칙
- 주의점 : DB에서의 쿼리와 미디어 쿼리의 ‘쿼리’는 다른 의미임 -> css 미디어 쿼리는 ‘쿼리 문자열’이라고 불리는데, 브라우저 뷰포트, 디바이스 조건을 검사하는 CSS 문법이다.
