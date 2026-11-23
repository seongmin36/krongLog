export const ABOUT_GITHUB_URL = "https://github.com/seongmin36";
export const ABOUT_LINKEDIN_URL = "https://www.linkedin.com/in/krongsungmin/";
// 페이지가 생기면 여기에 주소를 넣는다. 없으면 버튼이 비활성 자리표시로 그려진다.
export const ABOUT_RESUME_HREF: string | undefined = undefined;
export const ABOUT_PORTFOLIO_HREF: string | undefined = undefined;
export const ABOUT_EMAIL = "[email@domain]";

export interface AboutValue {
  title: string;
  description: string;
}

export interface AboutNowItem {
  label: string;
  description: string;
}

export interface AboutActivity {
  category: string;
  title: string;
  summary: string;
  period: string;
  learned: string;
  link: { label: string; href?: string };
}

export interface AboutEvent {
  title: string;
  description: string;
}

export const ABOUT_VALUES: AboutValue[] = [
  {
    title: "발표와 세션을 좋아합니다",
    description:
      "사람들 앞에서 제가 배운 것을 공유하는 순간이 가장 설렙니다. 교내 GitHub 세션을 직접 기획하고 진행했고, UMC에서는 파트 리더로서 매주 발표 자료를 준비하며 전달력을 키웠습니다.",
  },
  {
    title: "듣는 것도 좋아합니다",
    description:
      "다른 개발자들의 이야기에서 항상 새로운 영감을 얻습니다. 테오콘, UMCON 같은 행사에서 커뮤니티의 열기를 직접 느끼는 것 — 그게 저를 계속 움직이게 하는 원동력입니다.",
  },
  {
    title: "결과를 한 번 더 의심합니다",
    description:
      "AI가 '전부 통과'라고 해도 그대로 믿지 않습니다. Storybook 접근성 실험을 16번 다시 돌려 이전 결론을 바로잡은 뒤로, 결과는 측정으로 확인하는 습관이 생겼습니다.",
  },
  {
    title: "경험을 나누는 것이 성장이라고 믿습니다",
    description:
      "블로그에 글을 쓰고, 스터디에서 발표하고, 팀 회고를 문서로 정리하는 건 경험을 체화하는 과정이라고 생각합니다.",
  },
];

export const ABOUT_NOW_ITEMS: AboutNowItem[] = [
  { label: "공부", description: "[지금 공부하고 있는 것]" },
  {
    label: "기여",
    description: "OSSCA 2026에서 Fedify 테스트 신뢰성 개선에 기여하고 있어요.",
  },
  { label: "준비", description: "[준비 중인 발표나 글, 또는 읽고 있는 책]" },
];

export const ABOUT_ACTIVITIES: AboutActivity[] = [
  {
    category: "오픈소스",
    title: "OSSCA 2026 · Fedify 멘티",
    summary: "오픈소스 컨트리뷰션 아카데미 참여, 테스트 신뢰성 PR 4건 머지",
    period: "2026.06 — 현재",
    learned: "[배운 점 한 줄]",
    link: { label: "GitHub" },
  },
  {
    category: "리딩",
    title: "kt cloud TECH-UP 프론트엔드 파트 리더",
    summary: "Frontend 2기 수료 · 22인 통합 프로젝트(5issue) 프론트엔드 리딩",
    period: "2026.03 — 2026.10",
    learned: "[배운 점 한 줄]",
    link: { label: "GitHub" },
  },
  {
    category: "리딩",
    title: "UMC 9기 Web 파트장",
    summary: "매주 6명 코드 리뷰 및 파트원 대상 발표 세션 진행",
    period: "2025.09 — 2026.02",
    learned: "매주 발표를 준비하며 설명하는 법을 배웠습니다",
    link: { label: "LinkedIn" },
  },
  {
    category: "발표",
    title: "교내 Git/GitHub 세션",
    summary: "초보자를 위한 GitHub 가이드 기획부터 자료 제작, 진행까지 담당",
    period: "[YYYY.MM]",
    learned: "[배운 점 한 줄]",
    link: { label: "GitHub" },
  },
  {
    category: "[분류]",
    title: "[활동 이름]",
    summary: "[한 줄 설명]",
    period: "[YYYY.MM]",
    learned: "[배운 점 한 줄]",
    link: { label: "GitHub" },
  },
  {
    category: "[분류]",
    title: "[활동 이름]",
    summary: "[한 줄 설명]",
    period: "[YYYY.MM]",
    learned: "[배운 점 한 줄]",
    link: { label: "GitHub" },
  },
  {
    category: "[분류]",
    title: "[활동 이름]",
    summary: "[한 줄 설명]",
    period: "[YYYY.MM]",
    learned: "[배운 점 한 줄]",
    link: { label: "GitHub" },
  },
  {
    category: "[분류]",
    title: "[활동 이름]",
    summary: "[한 줄 설명]",
    period: "[YYYY.MM]",
    learned: "[배운 점 한 줄]",
    link: { label: "GitHub" },
  },
];

export const ABOUT_EVENTS: AboutEvent[] = [
  { title: "UMCON #2", description: "UMC 연합 행사 발표 세션" },
  { title: "UMCON #3", description: "UMC 네트워킹 행사 참여" },
  { title: "[행사 이름]", description: "[한 줄 설명]" },
];
