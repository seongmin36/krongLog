import { defineConfig, fontProviders } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";
import svgr from "vite-plugin-svgr";
import { visit } from "unist-util-visit";
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

// rehype 플러그인: 래퍼 div + 언어탭 + copy 버튼 주입
function rehypeCodeBlock() {
  return (tree) => {
    visit(tree, "element", (node, index, parent) => {
      if (node.tagName !== "pre" || !parent || index == null) return;
      const lang = node.properties?.["data-lang"] ?? "";
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
      parent.children[index] = {
        type: "element",
        tagName: "div",
        properties: { className: ["code-block-wrapper"] },
        children: header ? [header, body] : [body],
      };
    });
  };
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
    rehypePlugins: [rehypeCodeBlock],
  },

  vite: {
    plugins: [tailwindcss(), svgr()],
  },
  image: {
    service: {
      entrypoint: "astro/assets/services/sharp",
    },
  },
  integrations: [mdx(), react(), sitemap()],
});
