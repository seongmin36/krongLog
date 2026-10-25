---
title: "useSearchParams()가 왜 페이지 전체를 CSR로 바꿀까?"
date: 2026-10-22T14:30:42+09:00
icon: "lucide:atom"
tags: ["TIL","Next.js"]
---

---
- Next.js의 SSR, SSG는 기본적으로 서버가 HTML을 미리 만들기 위해 필요한 데이터를 알아야 한다.
하지만, url 뒤에 붙은 쿼리 스트링(?search=apple&page=2)같은 사용자가 브라우저에서 주소창을 바꾸나 링크를 클릭하는 ‘실시간 브라우저 환경’에서만 정확히 알 수 있는 값이다.
때문에 서버는 빌드 시점이나 첫 요청 시점에 사용자가 어떤 쿼리 스트링을 들고 올지 미리 완벽하게 예측할 수 없다.
- 즉, suspense 경계로 감싸지 않은 상태에서 useSearchParams()를 페이지 컴포넌트 내부에서 호출하면 Next.js는 정적 생성을 포기하고 페이지 전체를 CSR로 전환한다.
- 따라서 useSearchParams()를 사용하는 부분을 별도 하위 컴포넌트로 쪼개고, `<Suspense>`로 감싸야한다.
