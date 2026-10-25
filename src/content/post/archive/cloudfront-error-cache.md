---
title: "CloudFront가 401을 캐싱했던 문제"
date: 2026-10-02T01:46:11+09:00
icon: "lucide:code-xml"
tags: ["TIL","AWS"]
---

---
- MSA 기반 인프라를 끼워넣을때 401, 403, 502가 떴다.
    - 401, 403은 CloudFront 에러였다.
- CloudFront란?

<!-- 이미지 -->

- Amazon Cloudfront 에러는 웹 브라우저가 전송한 요청이 CloudFront CDN을 거쳐 origin 서버(EKS/ALB, S3, Vercel 등)로 전달되거나 응답받는 과정에서 문제가 생겼을 때 나타나는 오류다.
    - 프론트엔드/인프라 협업 과정에서 자주 발생하는 CloudFront에러는 크게 두 종류로 나뉜다.
        - 4xx(클라이언트/설정 오류)
            - 이건 내가 발생했던 오류인 401, 403이었는데, X-Cache: Error from cloudfront 헤더가 찍히고, Cache-Control(Cache-Option)을 추가하여 해결하였다.
이는 CDN의 캐싱 동작 방식과 헤더 전달 문제로 인해 발생하는 전형적인 이슈다.
        - 5xx(오리진/서버 오류)
            - 502, 504가 대표적인 예시인데, CloudFront가 뒤에 있는 오리진 서버(EKS 클러스터의 Node/Ingress/ALB)로 요청을 보냈으나, 오리진 서버가 응답을 주지 않거나(Timeout) 연결이 끊긴 경우다.
- 원인은 무엇일까?
    - X-Cache: Error from cloudfront는 요청이 오리진(Next.js/S3/ALB)까지 갔다가 에러 응답(401/403)을 받아 CloudFront가 그 에러 응답 상태를 캐싱했거나, CloudFront 차원에서 요청을 거부했을 때 반환되는 응답 헤더다.
    - 후자의 경우는 인프라팀에서 관리할 수 있기 때문에 내가 해결해볼 수 있는 방식은 CloudFront가 에러 응답 상태를 캐싱하지 못하도록 Cache-Control 옵션을 추가하여 문제를 해결했다.
    - 결국 이 원인은 CloudFront는 기본적으로 오리진의 에러 응답(4xx, 5xx)도 일정 시간 동안 엣지 로케이션에 저장하는 성질때문에 발생한다.
    - 인증이 필요한(userId가 필요한) GET 엔드포인트에서 토큰 누락/만료로 401을 수신하면, CloudFront가 해당 401 상태를 캐싱하여 이후 유효한 토큰(Authorization 헤더)을 넘겨도 오리진으로 보낼 필요없이 엣지에서 바로 401을 뱉은 것이다.
        - 부록 : POST는 정상 동작했는데, 이는 HTTP 스펙상 GET과 달라서 POST/PUT/DELETE 등 변경 작업 메서드는 CDN 레벨에서 캐싱 대상에서 제외되기 때문이다.
- Cache-Control을 어떻게 적절하게 사용한걸까?
    - private : 이 응답은 특정 단일 사용자(클라이언트 브라우저)만을 위한 것이므로 중간 공유 캐시(Cloudfront CDN 등)가 저장해서는 안된다고 전달한다.
    - no-store : 클라이언트 브라우저 및 중간 프록시·CDN을 포함한 어떠한 캐시 저장소에도 응답 데이터를 저장하지 않도록 강제한다.
- 이 설정을 공용 응답 함수[ ok(), fail() ] 레벨에서 `/api/**` 하위 전체에 일괄 적용해서 향후 추가될 모든 API 엔드포인트에서도 동일한 CloudFront 캐시 오작동을 근본적으로 예방하여 문제를 해결하였다.
