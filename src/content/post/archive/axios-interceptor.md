---
title: "axios interceptor의 주 역할"
date: 2026-05-10T20:26:02+09:00
icon: "lucide:code-xml"
tags: ["TIL","Axios"]
---

---
- 요청이 나가기 전(request)이나 응답이 돌아온 직후(response)에 공통 작업을 끼워 넣는 것이다.
- request interceptor
    - 요청이 서버로 가기 직전에 실행
    - Authorization 헤더 추가
    - 공통 헤더 세팅
    - 토큰 만료 체크
    - 요청 로깅
- Response interceptor
    - 응답 데이터 가공
    - 에러 공통 처리
    - refresh token 응답 처리
    - 새 토큰을 저장하고 이후 요청에 반영
