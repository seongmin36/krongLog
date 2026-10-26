---
title: "앰비언트 모듈과 모듈 확장 파일"
date: 2026-02-26T16:52:50+09:00
icon: "lucide:code-xml"
tags: ["TIL", "TypeScript"]
---

---

- 앰비언트 모듈 : .d.ts는 앰비언트 모듈 선언 파일이다. 구문은 ES 모듈과 유사하지만, 최상위 수준에서 가져오기/내보내기를 허용하지 않는다. Typescript가 이를 감지하면 해당 파일을 모듈 확장 파일로 간주하여 전역 타입 정의가 꺠질 수 있다.
- 모듈 확장 파일 : .d.ts 선언 파일을 별도로 분리해서 모듈 확장을 위한 파일을 커스텀으로 확장한다.

1. 외부, 서드파티 라이브러리 타입 보강 : types/xxx.d.ts 처럼 .d.ts 파일을 만들고, `declare module 'react';` 같은 형태로 보강한다. 여기서 이 파일이 tsconfig.json의 include 경로에 포함되도록 설정한다.
2. 전역(글로벌) 보강 : global.d.ts 등에서 `declare global { interface Window { … } }` 패턴을 사용한다.
3. 로컬 모듈 보강 : 자체 코드 모듈을 보강할 때는 .ts 파일에 `declare module './myLocalModule' { … }`를 두고, 이 파일을 어딘가에서 한 번 이상 임포트 (`import './myLocalModule-augmentations';`) 하면 된다.
