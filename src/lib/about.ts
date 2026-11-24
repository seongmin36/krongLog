import { blogPostPath } from "@/lib/blog-url";
import woowaconImage from "@/assets/blog/2026-woowacon/1.png";
import pyconImage from "@/assets/about/events/2026-pycon.png";
import aiExpoImage from "@/assets/about/events/2026-ai-expo.jpeg";
import workshopImage from "@/assets/about/events/2026-univ-workshop.jpeg";
import kDevconImage from "@/assets/about/events/2026-k-devcon.jpeg";
import umc9thDemodayImage from "@/assets/about/events/2026-9th-umc-demoday.jpeg";
import umcon9thImage from "@/assets/about/events/2026-9th-umcon.png";
import teoconfImage from "@/assets/about/events/2025-teoconf.jpeg";
import umc8thDemodayImage from "@/assets/about/events/2025-8th-umc-demoday.jpeg";
import umcon8thImage from "@/assets/blog/reflection-2025/8.jpg";

export const ABOUT_GITHUB_URL = "https://github.com/seongmin36";
export const ABOUT_LINKEDIN_URL = "https://www.linkedin.com/in/krongsungmin/";
export const ABOUT_RESUME_HREF = "/about/resume/";
export const ABOUT_EMAIL = "whtjdals3625@gmail.com";

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
  date?: string;
  image?: ImageMetadata;
}

export const ABOUT_VALUES: AboutValue[] = [
  {
    title: "배운 것을 발표합니다",
    description:
      "배운 것을 사람들 앞에서 설명할 때 가장 많이 배웁니다. UMC 9기 Web 파트장으로 매주 6명의 코드를 리뷰했고, 기수를 마치며 초보자를 위한 GitHub 가이드를 발표했습니다.",
  },
  {
    title: "행사에 가서 듣고 묻습니다",
    description:
      "테오콘, UMCON 같은 행사에서 다른 개발자들의 이야기를 듣고 새로운 영감을 얻습니다. 우아콘 2026에서는 제 프로젝트에서 겪은 측정 고민을 발표자분께 직접 질문했습니다.",
  },
  {
    title: "결과를 한 번 더 의심합니다",
    description:
      "한 번 통과한 결과로 결론 내리지 않습니다. Storybook 접근성 검사가 전부 통과했을 때 16번 다시 돌려 실패를 찾아낸 뒤로, 한 번의 결과로 결론 내리지 않는 습관이 생겼습니다.",
  },
  {
    title: "기록하고 정리합니다",
    description:
      "블로그에 글을 쓰고, 스터디에서 발표하고, 팀 회고를 문서로 정리하는 건 경험을 제 것으로 만드는 과정이라고 생각합니다.",
  },
];

export const ABOUT_NOW_ITEMS: AboutNowItem[] = [
  {
    label: "공부",
    description:
      "5issue에서 쓴 검증 도구를 다시 공부하고 있습니다.\nStorybook 접근성 검사의 경고·차단 설정, Lighthouse CI, Playwright e2e를 CI에 넣는 방법입니다.",
  },
  {
    label: "기여",
    description:
      "OSSCA 2026에서 Fedify 테스트 신뢰성 개선에 기여하고 있습니다.",
  },
  { label: "블로그", description: "우아콘 2026 회고 글을 쓰고 있습니다." },
  {
    label: "활동",
    description:
      "AWS Student Builder Group 서경대학교 1기 코어 멤버로 활동하고 있습니다.",
  },
];

export const ABOUT_ACTIVITIES: AboutActivity[] = [
  {
    category: "오픈소스",
    title: "OSSCA 2026 · Fedify 멘티",
    summary: "오픈소스 컨트리뷰션 아카데미 참여, 테스트 신뢰성 PR 4건 머지",
    period: "2026.06 — 현재",
    learned:
      "실제 시간에 의존하던 테스트를 Clock 주입으로 고쳐, 언제 돌려도 같은 결과가 나오게 만드는 법을 배웠습니다",
    link: {
      label: "블로그",
      href: blogPostPath("fedify-cfworkers-listen-test"),
    },
  },
  {
    category: "커뮤니티",
    title: "AWS Student Builder Group",
    summary: "서경대학교 AWS Student Builder Group 1기 코어 멤버",
    period: "2026.10 — 현재",
    learned:
      "클라우드 자격증 스터디 운영을 위해 계획 및 스터디 리딩을 맡고 있습니다",
    link: { label: "링크" },
  },
  {
    category: "리딩",
    title: "kt cloud TECH-UP 프론트엔드 파트 리더",
    summary:
      "Frontend 2기 수료 · 통합 프로젝트(5issue, 7개 직군 22명) 프론트엔드 파트 리더",
    period: "2026.03 — 2026.10",
    learned:
      "API 명세만 있으면 백엔드를 기다리지 않고도 Zod 스키마와 MSW 목으로 화면을 먼저 만들 수 있다는 걸 배웠습니다",
    link: { label: "GitHub", href: "https://github.com/5issue/total-client" },
  },
  {
    category: "발표",
    title: "UMC 9기 GitHub 가이드 발표",
    summary:
      "초보자도 이해하기 쉬운 실전 최적화 GitHub 가이드, 기획부터 자료 제작과 발표까지 담당",
    period: "2026.03",
    learned:
      "처음 서 본 발표에서, 아는 것과 남에게 설명할 수 있는 것은 다르다는 걸 배웠습니다",
    link: {
      label: "LinkedIn",
      href: "https://www.linkedin.com/feed/update/urn:li:activity:7440791682192896000/",
    },
  },
  {
    category: "공모전",
    title: "ICT COC 피우다 프로젝트 15회 공모전 결선 진출",
    summary:
      "옷 교환 파티 예약·관리 서비스 ReFit Lab에서 예약, 마이페이지 QR 입장권, 관리자 페이지 구현",
    period: "2025.10 — 2025.12",
    learned:
      "인증 상태 하이드레이션 오류를 고치며 Next.js 서버 렌더링과 클라이언트 상태의 차이를 배웠습니다",
    link: {
      label: "GitHub",
      href: "https://github.com/refit-lab/refit-lab-fe",
    },
  },
  {
    category: "리딩",
    title: "UMC 9기 Web 파트장",
    summary: "매주 6명 코드 리뷰, 기수 마무리 GitHub 가이드 발표",
    period: "2025.09 — 2026.02",
    learned: "매주 코드 리뷰를 하며 설명하는 법을 배웠습니다",
    link: { label: "GitHub", href: "https://github.com/9th-SKU-UMC/9th-Web" },
  },
  {
    category: "프로젝트",
    title: "UMC 8기 Web Challenger",
    summary:
      "AI 향수 추천 서비스 CHICCHIC Web 파트장, 커뮤니티·상세·쇼핑 페이지 API 연동",
    period: "2025.03 — 2025.08",
    learned:
      "API 연동의 약 60%를 혼자 맡으며, 혼자 많이 하는 것이 협업은 아니라는 걸 배웠습니다",
    link: { label: "GitHub", href: "https://github.com/UMC-CHICCHIC/FE" },
  },
];

// 최근 행사부터 적는다.
export const ABOUT_EVENTS: AboutEvent[] = [
  {
    title: "우아콘 2026",
    description: "critical-script 세션 발표자에게 측정 편차 질문",
    date: "2026.10.28",
    image: woowaconImage,
  },
  {
    title: "PyCon Korea 2026 스프린트",
    description: "김인제 님의 '누구나 원하는 오픈소스에 기여를!' 스프린트 참여",
    date: "2026.08.17",
    image: pyconImage,
  },
  {
    title: "AI EXPO KOREA 2026",
    description: "행사 참여 및 네트워킹",
    date: "2026.05.08",
    image: aiExpoImage,
  },
  {
    title: "송요창 님 초청 워크샵",
    description:
      "배달의민족 개발자 송요창 님의 '프롬프트로 간단한 프로그램 만들기' 워크샵과 진로 질의응답 멘토링 참여",
    date: "2026.05.08",
    image: workshopImage,
  },
  {
    title: "K-DEVCON",
    description: "컨퍼런스 연사 발표 청취",
    date: "2026.03.21",
    image: kDevconImage,
  },
  {
    title: "UMC 9기 데모데이",
    description: "Travlocks 프로젝트 시연 및 설명",
    date: "2026.02.20",
    image: umc9thDemodayImage,
  },
  {
    title: "9기 UMCON",
    description: "UMC 컨퍼런스 연사 발표 청취 및 네트워킹",
    date: "2026.01.24",
    image: umcon9thImage,
  },
  {
    title: "TEO Conf 2025",
    description: "컨퍼런스 연사 발표 청취 및 네트워킹",
    date: "2025.12.06",
    image: teoconfImage,
  },
  {
    title: "UMC 8기 데모데이",
    description: "CHICCHIC 프로젝트로 참여",
    date: "2025.08.22",
    image: umc8thDemodayImage,
  },
  {
    title: "8기 UMCON",
    description: "UMC 컨퍼런스 연사 발표 청취 및 네트워킹",
    date: "2025.07.27",
    image: umcon8thImage,
  },
];
