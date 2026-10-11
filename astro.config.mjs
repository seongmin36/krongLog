import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";
import icon from "astro-icon";
import svgr from "vite-plugin-svgr";
import { satteri, satteriHeadingIdsPlugin } from "@astrojs/markdown-satteri";
import { defineHastPlugin } from "satteri";
import {
  transformerMetaHighlight,
  transformerMetaWordHighlight,
  transformerNotationDiff,
  transformerNotationErrorLevel,
  transformerNotationFocus,
  transformerNotationHighlight,
} from "@shikijs/transformers";

function transformerCodeBlock() {
  return {
    name: "code-block-mac",
    pre(node) {
      const lang = this.options.lang ?? "";
      if (lang) node.properties["data-lang"] = lang;
    },
  };
}

// 코드블록 래퍼 구조(언어탭 + copy 버튼)를 만든다.
// mdx.css의 .code-block-wrapper / .code-block-header / .code-block-body /
// .copy-btn 스타일과 CodeBlock.astro의 복사 스크립트가 이 구조에 의존한다.
function buildCodeBlockWrapper(node, lang) {
  const langTab = lang
    ? {
        type: "element",
        tagName: "span",
        properties: { className: ["code-block-lang"] },
        children: [{ type: "text", value: lang }],
      }
    : null;
  const copyBtn = {
    type: "element",
    tagName: "button",
    properties: { className: ["copy-btn"], "aria-label": "코드 복사" },
    children: [
      {
        type: "element",
        tagName: "svg",
        properties: {
          xmlns: "http://www.w3.org/2000/svg",
          width: "14",
          height: "14",
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          "stroke-width": "2",
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "aria-hidden": "true",
        },
        children: [
          {
            type: "element",
            tagName: "rect",
            properties: {
              x: "9",
              y: "9",
              width: "13",
              height: "13",
              rx: "2",
              ry: "2",
            },
            children: [],
          },
          {
            type: "element",
            tagName: "path",
            properties: {
              d: "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1",
            },
            children: [],
          },
        ],
      },
    ],
  };
  const header = langTab
    ? {
        type: "element",
        tagName: "div",
        properties: { className: ["code-block-header"] },
        children: [langTab],
      }
    : null;
  const body = {
    type: "element",
    tagName: "div",
    properties: { className: ["code-block-body"] },
    children: [node, copyBtn],
  };
  return {
    type: "element",
    tagName: "div",
    properties: { className: ["code-block-wrapper"] },
    children: header ? [header, body] : [body],
  };
}

// Sätteri hast 플러그인: <pre>를 래퍼 구조로 교체한다.
// Astro는 Shiki 하이라이팅을 사용자 hast 플러그인보다 먼저 실행하므로,
// transformerCodeBlock()이 심어둔 data-lang을 여기서 읽을 수 있다.
function satteriCodeBlock() {
  return defineHastPlugin({
    name: "code-block-wrapper",
    element: {
      filter: ["pre"],
      visit(node, ctx) {
        const lang = node.properties?.["data-lang"] ?? "";
        ctx.replaceNode(node, buildCodeBlockWrapper(node, lang));
      },
    },
  });
}

// Sätteri hast 플러그인: h1~h4에 섹션 앵커 링크를 붙인다.
// satteriHeadingIdsPlugin()이 먼저 실행되어야 node.properties.id를 읽을 수 있다.
function satteriAutolinkHeadings() {
  return defineHastPlugin({
    name: "autolink-headings",
    element: {
      filter: ["h1", "h2", "h3", "h4"],
      visit(node, ctx) {
        const id = node.properties?.id;
        if (typeof id !== "string" || id.length === 0) return;
        ctx.appendChild(node, {
          type: "element",
          tagName: "a",
          properties: {
            className: ["heading-anchor"],
            href: `#${id}`,
            "aria-label": `${ctx.textContent(node)} 섹션 링크`,
          },
          children: [{ type: "text", value: "#" }],
        });
      },
    },
  });
}

export default defineConfig({
  output: "static",
  adapter: vercel(),
  site: "https://blog.kronglog.dev",
  trailingSlash: "always",
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "viewport",
  },

  markdown: {
    shikiConfig: {
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
      // 긴 코드라인 자동 줄바꿈 (가로 스크롤 방지)
      wrap: true,
      langs: [
        "tsx",
        "jsx",
        "javascript",
        "typescript",
        "json",
        "html",
        "css",
        "scss",
        "less",
        "sass",
        "stylus",
        "python",
        "http",
        "java",
        "c",
        "cpp",
        "csharp",
        "bash",
        "shell",
        "sql",
        "yaml",
        "markdown",
        "diff",
        "docker",
        "go",
        "rust",
      ],
      transformers: [
        transformerMetaHighlight(),
        transformerMetaWordHighlight(),
        transformerNotationDiff(),
        transformerNotationErrorLevel(),
        transformerNotationFocus(),
        transformerNotationHighlight(),
        transformerCodeBlock(),
      ],
    },
    processor: satteri({
      features: {
        // `## 제목 {#custom-id}` 형태로 앵커 ID를 직접 지정할 수 있다.
        headingAttributes: true,
      },
      // 순서 주의: Astro는 heading ID 플러그인을 사용자 플러그인 "뒤"에 붙이므로,
      // autolink가 id를 읽으려면 satteriHeadingIdsPlugin()을 직접 맨 앞에 둬야 한다.
      hastPlugins: [
        satteriHeadingIdsPlugin(),
        satteriCodeBlock(),
        satteriAutolinkHeadings(),
      ],
    }),
  },

  vite: {
    plugins: [tailwindcss(), svgr()],
  },
  image: {
    service: {
      entrypoint: "astro/assets/services/sharp",
    },
  },
  integrations: [mdx(), react(), sitemap(), icon()],
});
