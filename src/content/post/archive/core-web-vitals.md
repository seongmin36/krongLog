---
title: "Core Web Vitals"
date: 2026-08-12T11:28:56+09:00
icon: "lucide:code-xml"
tags: ["TIL", "성능"]
---

---

Core Web Vitals는 실제 사용자가 웹페이지를 이용할 때 느끼는 ‘핵심 사용자 경험을 측정하는 지표’다.

- LCP : Large Contentful Paint — 주요 콘텐츠가 얼마나 빨리 표시되는가 (가장 큰 주요 콘텐츠가 표시되는 시간)
  - 주요 원인
    - 대용량 이미지
    - PNG 중심의 이미지 제공
    - 이미지 preload 부족
    - CDN, 캐시 미적용 또는 캐시 미적중
    - 모바일 네트워크 환경
- CLS : Cumulative Layout Shift — 화면이 얼마나 안정적으로 유지되는가 (로딩 중 화면이 밀리는 정도)
  - 주요 원인
    - 이미지에 width / height 또는 aspect-ratio 지정
    - 배너 / 추천 영역에 min-height 예약
    - 광고 / 개인화 영역의 고정 슬롯 확보
    - 늦게 삽입되는 콘텐츠로 인한 레이아웃 변경 방지
    - 스켈레톤 UI와 실제 콘텐츠의 동일한 높이 유지
- INP : Interaction to Next Paint — 사용자의 클릭·터치에 얼마나 빠르게 반응하는가 (사용자 입력 후 화면이 반응하는 시간)
  - 주요 원인
    - 과도한 JavaScript 실행
    - 큰 클라이언트 번들
    - 긴 메인 스레드 작업
    - 무거운 React 렌더링 → useTransition을 이용한 전환 상태 표시
    - 필터 변경 시 전체 목록 재렌더링
    - 이벤트 처리 중 동기적인 API·계산 수행

LCP, CLS, INP는 핵심 사용자 경험 지표고, FCP, TTFB, TBT는 문제 원인을 찾기 위한 보조 지표다.

- FCP : First Contentful Paint — 화면에 첫 번째 콘텐츠가 표시되는 시간
  - 로고, 텍스트, 배경 이미지 등이 나타나는 시점을 측정한다.
    - ex. FCP가 빠르다 → 첫 화면 표시가 빠르다
    - ex. FCP는 빠르지만, LCP가 느리다 → 기본 콘텐츠는 빠르지만 주요 콘텐츠가 늦다
- TTFB : Time to First Byte — 브라우저가 서버에 요청을 보낸 뒤 첫 번째 응답을 받을 때까지의 시간
  - 주요 원인
    - 서버 응답 지연
    - 데이터베이스 쿼리 지연
    - API 처리 지연
    - CDN 미적용
    - 네트워크 지연
- TBT : Total Blocking Time — 메인 스레드가 사용자 입력을 막은 총 시간
  50ms를 초과하는 긴 작업 발생하면 50ms를 넘긴 부분이 Blocking Time으로 계산된다.
  - 모바일에서 JS 실행량이 많고, React 렌더링이나 서드파티 스크립트가 무거운지 확인할 때 유용하다.

Lab과 Field 데이터 차이?

- Lab 데이터 : Chrome DevTools나 Lighthouse에서 특정 조건을 설정해 측정한 데이터
  - 네트워크 속도
  - CPU 성능
  - 화면 크기
  - 캐시 상태
  - 로그인 상태
