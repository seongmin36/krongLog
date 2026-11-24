import { ABOUT_EMAIL, ABOUT_GITHUB_URL, ABOUT_LINKEDIN_URL } from "@/lib/about";

export interface ResumeLink {
  label: string;
  href: string;
}

/** lead는 문장 앞 굵은 글씨 */
export interface ResumeText {
  lead?: string;
  text: string;
}

export interface ResumeEntry {
  name: string;
  title: string;
  period: string;
  meta: string[];
}

export interface ResumeMetric {
  label: string;
  value: string;
}

export interface ResumeContribution {
  number: string;
  href: string;
  text: string;
}

export const RESUME_NAME = "조성민";
export const RESUME_ROLE = "Software Developer";

export const RESUME_CONTACTS: (ResumeLink & { term: string })[] = [
  { term: "Email", label: ABOUT_EMAIL, href: `mailto:${ABOUT_EMAIL}` },
  { term: "GitHub", label: "github.com/seongmin36", href: ABOUT_GITHUB_URL },
  {
    term: "Blog",
    label: "blog.kronglog.dev",
    href: "https://blog.kronglog.dev/",
  },
  {
    term: "LinkedIn",
    label: "linkedin.com/in/krongSungmin",
    href: ABOUT_LINKEDIN_URL,
  },
];

export const RESUME_INTRO: ResumeText[] = [
  {
    lead: "직접 측정해 확인한 것만 성과로 삼습니다.",
    text: "커머스 PWA에서 측정할 때마다 크게 달라지던 Lighthouse 수치의 원인을 계산으로 찾아 실측을 판단 기준으로 삼았고, 대표값은 최고점이 아닌 6회 평균으로 잡았습니다.",
  },
  {
    lead: "이슈는 재현부터 하고 수정합니다.",
    text: "OSSCA 2026에서 Fedify와 Cloudflare Workers 문서를 읽고 이슈가 실제로 발생하는지 확인한 뒤, 시간 의존 Flaky 테스트 수정을 포함한 테스트 신뢰성 PR 4건을 머지했습니다.",
  },
  {
    lead: "배운 것은 공유하고, 모르는 것은 물어봅니다.",
    text: "UMC 9기에서 초보자를 위한 GitHub 가이드를 발표했고, 우아콘 2026에서는 이 측정 편차를 발표자에게 질문해 실사용자 데이터 수집이라는 답을 얻었습니다.",
  },
];

export const RESUME_PROJECT: ResumeEntry = {
  name: "5issue",
  title: "마켓컬리를 기준선으로 성능과 UX를 개선한 커머스 PWA",
  period: "2026.08 – 2026.09",
  meta: [
    "kt cloud TECH-UP 통합 프로젝트, 7개 직군 22명 중 프론트엔드 2인",
    "Next.js 16, React 19, TypeScript, TanStack Query, Zustand, Zod, MSW, Storybook, Playwright",
  ],
};

export const RESUME_PROJECT_ROLE: ResumeText = {
  lead: "프론트엔드 파트 리더.",
  text: "약 2개월간 타 파트에 진행 상황과 지연을 공유하고 일정을 조율. 백엔드 배포 지연 시 API 명세 기반 Zod 스키마와 MSW 목으로 화면 개발을 선행",
};

/** 마지막 항목은 왼쪽 구분선을 둔다 */
export const RESUME_METRICS: ResumeMetric[] = [
  { label: "폰트 전송량", value: "6.7MB → 2.06MB" },
  { label: "렌더링 차단", value: "450ms → 0ms" },
  { label: "총 전송량 (29% 감소)", value: "8.70MB → 6.20MB" },
  {
    label: "최종 (Lighthouse devtools 모드, 6회 평균)",
    value: "Performance 98점, LCP 1.55초",
  },
];

export const RESUME_METRICS_NOTE =
  "참고 비교 (마켓컬리와 동일한 Lighthouse 모바일 시뮬레이션): Performance 마켓컬리 40점 / 5issue 78점";

export const RESUME_PROJECT_DETAILS: { title: string; items: ResumeText[] }[] =
  [
    {
      title: "초기 로딩: LCP 41.7초의 원인 추적과 리소스 최적화",
      items: [
        {
          text: "초기 측정에서 LCP가 41.7초까지 늘어난 원인을 추적해 401 응답 이후의 인증 재시도 루프로 특정. 재발급과 재시도를 각 1회로 고정하고, 1회용 refresh 토큰의 동시 재발급 요청은 in-flight Promise를 공유해 1건으로 통합",
        },
        {
          text: "WOFF2 서브셋으로 폰트 전송량을 줄이고, Critical CSS 인라인과 나머지 지연 로드로 렌더링 차단을 해소",
        },
        {
          text: "개선 후에도 Lighthouse LCP가 14~30초로 달라져, 폰트 전송 시간 계산과 요청 기록으로 폰트와 LCP 이미지의 preload 경쟁을 찾고 판단 기준을 실측으로 변경",
        },
      ],
    },
    {
      title: "장바구니: 조작 직후 즉각 피드백",
      items: [
        {
          text: "마켓컬리 분석에서 찾은 조작 후 무반응 문제를 근거로 즉시 반영을 제안하고, 장바구니 수량 변경에 낙관적 반영과 요청 실패 시 이전 수량 롤백을 구현. 실패 안내와 연속 클릭 경합 처리는 미구현",
        },
      ],
    },
    {
      title: "접근성과 협업 규칙",
      items: [
        {
          text: "접근성: 터치 타깃 44px, 확대 제한 금지, aria 상태 전달을 공통 규칙으로 두고 Storybook addon-a11y로 점검. Lighthouse 접근성 96점(마켓컬리 76점), 색 대비 실패 37건은 미해결",
        },
        {
          text: "협업: CLAUDE.md와 .agents 컨벤션 5종(API, 구조, 스타일, Git, 보안)으로 AI 에이전트 출력을 팀 규칙에 맞추고, 인터랙션 테스트, 타입체크, ESLint(CI)와 커밋 훅으로 검증",
        },
      ],
    },
  ];

export const RESUME_PROJECT_LINKS: ResumeLink[] = [
  { label: "GitHub", href: "https://github.com/seongmin36/5issue-client" },
  {
    label: "Chromatic 컴포넌트 카탈로그",
    href: "https://develop--6a978509faf77cfdcaeb125d.chromatic.com/",
  },
];

export const RESUME_OPEN_SOURCE: ResumeEntry = {
  name: "Fedify",
  title: "ActivityPub framework for TypeScript",
  period: "2026.06 – 현재",
  meta: ["OSSCA 2026 멘티로 기여, PR 4건 머지"],
};

export const RESUME_CONTRIBUTIONS: ResumeContribution[] = [
  {
    number: "#1085",
    href: "https://github.com/fedify-dev/fedify/pull/1085",
    text: "실제 시간에 의존해 CI에서 간헐적으로 실패하던 테스트를 Clock 주입 방식으로 바꿔 Flaky 해결 (이슈 #951)",
  },
  {
    number: "#1019",
    href: "https://github.com/fedify-dev/fedify/pull/1019",
    text: "Cloudflare Workers 큐에서 ordering key lock이 이미 잡혀 있는 경우의 테스트 추가 (이슈 #879)",
  },
  {
    number: "#1001",
    href: "https://github.com/fedify-dev/fedify/pull/1001",
    text: "Cloudflare Workers 큐의 listen() 미지원 동작을 검증하는 단위 테스트 추가 (이슈 #881)",
  },
  {
    number: "#1321",
    href: "https://github.com/fedify-dev/fedify/pull/1321",
    text: "Cloudflare Workers 메시지 큐 중복 테스트 통합 및 lock 수명주기 테스트 추가 (이슈 #1048)",
  },
];

export const RESUME_AI_PROJECT: ResumeEntry = {
  name: "PODECK",
  title: "LLM 출력을 신뢰하지 않는 AI 덱 추천 기능",
  period: "2026.04 – 2026.06",
  meta: [
    "kt cloud TECH-UP 프론트엔드 과정, 4인",
    "Next.js 16, React 19, Vercel AI SDK, Gemini, Zod, Supabase",
  ],
};

export const RESUME_AI_PROJECT_DETAILS: ResumeText[] = [
  {
    text: "AI 덱 추천 기능의 호출, 검증, 캐시 레이어 담당. Gemini가 후보 외 포켓몬을 반환하는 문제를 출력 검증, temperature 하향 재시도, 폴백 3단계로 막아 보유 포켓몬으로만 구성된 덱을 반환하도록 제약",
  },
  {
    text: "AI 호출 비용을 줄이려 Supabase 캐시 테이블을 두었으나, 키가 user_id + theme이라 새 포켓몬을 얻어도 이전 추천이 반환되는 문제 발생. 정렬한 로스터(dexId:level)의 SHA-256 해시를 키에 추가해 로스터가 바뀔 때만 새로 추천하도록 해결",
  },
  {
    text: "Rate Limit을 서버(60초 제한 강제)와 클라이언트(버튼 비활성화, 잔여 시간 표시) 이중 레이어로 분리",
  },
];

export const RESUME_AI_PROJECT_LINKS: ResumeLink[] = [
  { label: "GitHub", href: "https://github.com/seongmin36/PODECK-FE" },
];

export const RESUME_ACTIVITIES: (ResumeText & { period: string })[] = [
  {
    lead: "AWS Student Builder Group",
    text: "서경대학교 1기 코어 멤버",
    period: "2026.10 – 현재",
  },
  {
    lead: "OSSCA 2026",
    text: "오픈소스 컨트리뷰션 아카데미, Fedify 파트 멘티",
    period: "2026.06 – 현재",
  },
  {
    lead: "kt cloud TECH-UP",
    text: "Frontend 2기 수료, 통합 프로젝트 프론트엔드 파트 리더",
    period: "2026.03 – 2026.10",
  },
  {
    lead: "UMC 9기",
    text: "Web 파트장 (매주 6명 코드 리뷰)",
    period: "2025.09 – 2026.02",
  },
  { lead: "UMC 8기", text: "Web Challenger", period: "2025.03 – 2025.08" },
  {
    lead: "ICT COC 피우다 프로젝트 15회 공모전 결선 진출",
    text: "(ReFit Lab)",
    period: "2025.10 – 2025.12",
  },
];

export const RESUME_BLOG = {
  lead: "기술 블로그",
  link: { label: "blog.kronglog.dev", href: "https://blog.kronglog.dev/" },
  text: ", 기술 글 29편과 TIL 61편",
};

export const RESUME_SKILLS: { term: string; text: string }[] = [
  { term: "Language", text: "TypeScript, JavaScript" },
  { term: "Framework", text: "React 19, Next.js 16 (App Router, RSC)" },
  {
    term: "State, Data",
    text: "TanStack Query, Zustand, Zod, React Hook Form",
  },
  { term: "Styling", text: "Tailwind CSS v4" },
  {
    term: "Test, Quality",
    text: "Vitest, Playwright, Storybook, MSW, ESLint, Lighthouse",
  },
  { term: "AI, Tools", text: "Claude Code, Cursor, Vercel AI SDK" },
  { term: "Etc", text: "Supabase, GitHub Actions, Docker" },
];

export const RESUME_EDUCATION: ResumeText & { period: string } = {
  lead: "서경대학교",
  text: "컴퓨터공학과, 3학년 2학기 수료 후 2026년 휴학 중",
  period: "2021.03 – 2028.02 (졸업 예정)",
};
