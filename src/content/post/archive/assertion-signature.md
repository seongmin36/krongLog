---
title: "assertion signature와 non-null assertion"
date: 2026-05-06T20:28:01+09:00
icon: "lucide:code-xml"
tags: ["TIL","TypeScript"]
---

---
- TypeScript의 assertion signature는 ‘이 함수가 에러없이 끝나면, 타입스크립트가 특정 조건이 참이라고 믿어도 된다’는 뜻이다.

<!-- 이미지 -->

- 사용 방법은 props에 asserts를 붙여, asserts condition으로 반환 타입을 정의하면, invariant(condition)을 실행했을 때 실패하지 않고 반환되면, ‘condition은 참(True)’이라고 타입스크립트에게 알려주는 형태다.
그래서 이 함수를 호출한 뒤에는 타입스크립트가 위 조건을 바탕으로 타입을 더 좁혀준다.
- 쉽게 말하면,
런타입 : 조건이 falsy하면 에러를 던진다.
타입 시스템 : 에러가 안 났다면 그 조건은 true로 간주한다.
즉, 단순한 boolean 반환이 아니라 타입 좁히기용 함수다.
- 이걸 사용하는 이유는 타입스크립트에게 ‘이 검사 끝나면 이 값은 안전하다’를 알려주기 위함이다.
따라서 이후에 Null, undefined, 잘못된 타입 때문에 매번 다시 검사하지 않아도 되고, 타입 좁히기(narrowing)가 자동으로 된다.
즉, 기존 if()로만 조건식 표현을 하는 방식은 런타임 검사는 되지만, 타입스크립트가 강하게 추론하지 못해서 타입스크립트에게 타입스크립트의 타입 시스템에 condition이 truthy함을 컴파일타임 힌트로 알려주는 것이다. -> 타입 안정성 챙기기
- ‘!’는 non-null assertion operator라고 하는데, 타입스크립트에게 ‘이 값은 null도 undefined도 아니다’라고 단언하는 표시다.
즉 타입 단언을 위한 연산자다.
