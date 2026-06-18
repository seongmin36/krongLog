const SITE_NAME = "Krong Dev.";
const SITE_DESCRIPTION = "개발하면서 배운 것들을 기록합니다.";

export function buildWebsiteJsonLd(siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: siteUrl,
    description: SITE_DESCRIPTION,
    inLanguage: "ko",
  };
}

export function buildBlogPostingJsonLd({
  siteUrl,
  headline,
  description,
  datePublished,
  dateModified,
  url,
  image,
}: {
  siteUrl: string;
  headline: string;
  description?: string;
  datePublished: Date;
  dateModified?: Date;
  url: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline,
    description,
    datePublished: datePublished.toISOString(),
    ...(dateModified && { dateModified: dateModified.toISOString() }),
    image,
    author: {
      "@type": "Person",
      name: "Krong",
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: siteUrl,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    inLanguage: "ko",
  };
}
