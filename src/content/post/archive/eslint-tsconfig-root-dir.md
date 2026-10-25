---
title: "모노레포에서 ESLint tsconfigRootDir 지정하기"
date: 2026-05-10T19:08:43+09:00
icon: "lucide:code-xml"
tags: ["TIL","ESLint"]
---

---
- vite.config.ts가 TypeScript ESLint 프로젝트 서비스로 파싱될 때 모노레포에 apps/server와 apps/web이 있어 루트가 모호합니다. apps/web/eslint.config.js에 parserOptions.tsconfigRootDir(및 필요 시 projectService)를 명시합니다.
- 조치
    - apps/web/eslint.config.js의 TypeScript 파서에 `tsconfigRootDir: import.meta.dirname`과 함께 `projectService: true`를 넣었습니다. 이 설정 파일이 있는 디렉터리(apps/web)를 ESLint의 TS 프로젝트 루트로 고정해서, 모노레포 안에 apps/server·apps/web이 같이 있을 때 생기던 “multiple candidate TSConfigRootDirs” 파싱 오류를 피합니다.
    - 정확한 의도는 TypeScript ESLint가 타입 정보를 쓰려면 ‘이 파일을 어떤 tsconfig 트리로 볼지’를 명시적으로 정해줘야 한다.
모노레포에서는 apps/server와 apps/web처럼 각각 자기 tsconfig가 있는 루트가 여러 개라서, 그걸 자동으로 고를 때 후보가 둘 이상이 된다.
그 상태에서 tsconfigRootDir를 명시적으로 주지 않으면, 파서가 ‘어떤 디렉토리를 ts 프로젝트 루트로 쓸지’를 정하지 못해서 ‘multiple candidate TSConfigRootDirs’같은 오류가 난다.
그래서 apps/web/eslint.config.js 안에서 `tsconfigRootDir: import.meta.dirname`으로 ‘이 설정으로 린트하는 파일은 무조건 apps/web 기준으로 ts 프로젝트 잡아’라고 한 군데만 고정한 것이다.
    - `projectService: true`의 역할은 ts의 language service(프로젝트 서비스) 쪽 방식으로 타입/프로그램 정보를 다루겠다는 옵션이다.
    - 어? 그러면 기존 tsconfig를 지우고, repo/에 정의된 tsconfig만 쓰면 되는건가? 그건 아니다.
eslint.config의 tsconfigRootDir와 projectService는 ‘ESLint가 타입 정보를 가져올 때 어느 폴더를 TS 프로젝트 루트로 볼지’만 정하는 설정이고, 그 폴더 안에 있는 tsconfig 내용을 대체하지는 않는다.
