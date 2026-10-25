---
title: "CommonJS와 ESM의 차이"
date: 2026-02-23T19:14:08+09:00
icon: "lucide:code-xml"
tags: ["TIL","JavaScript"]
---

---
CommonJS의 require는 ‘런타임’에 실행되는 함수이므로 조건부 호출이 가능하다. -> 코드를 실행하기 전에는 의존성 파악이 힘들다. 동기적 작동 방식

EcmaScriptModel의 import는 정적이다. 파일의 최상단에 위치하고, 코드를 실행하지 않아도 번들러가 의존성 그래프를 명확하게 하고, 사용하지 않는 ‘트리 쉐이킹(Tree Shaking)’을 구현하는 기반이 된다. 비동기적 작동 방식

예전에 Toss에서 봤던 기술블로그 중에서 @toss/ky가 있었는데, ky는 ESM-only이기 때문에 SSR을 적극적으로 사용하는 toss에서는 Node.js의 CJS를 사용하는 것이 중요했다.
-> 기존 npm 패키지들이 CJS로 작성되어있기 때문에 esm이 cjs를 번역하는 과정에서의 딜레이를 최소화하여 매끄럽게 연동한다.
따라서 번들 사이즈를 줄이기 위해 Tree Shaking이 사용된다.
하지만 CJS는 정적 분석이 어렵고, 런타임에서만 모듈의 관계를 파악할 수 있어 동적으로 하는 것에 아무런 제약이 없다.
반면 ESM은 정적인 구조로 모듈끼리 의존하도록 강제한다. import path에 동적인 값을 넣어야하고, 파일 최상위 스코프에서만 사용할 수 있다.

토스는 이러한 mjs, cjs파일을 하나로 통합하기 위해 exports field를 사용했다.
exports field는 package.json의 main field와 같은 역할을 하여 entry point(진입 지점)를 지정할 수 있다.

<!-- 이미지 -->

<!-- 이미지 -->
