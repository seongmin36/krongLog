import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";
import icon from "astro-icon";
import svgr from "vite-plugin-svgr";
import { satteri, satteriHeadingIdsPlugin } from "@astrojs/markdown-satteri";
import { defineHastPlugin, htmlToHast } from "satteri";
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

const LINK_ICON_SVG =
  '<path d="m12.11 15.39-3.88 3.88a2.52 2.52 0 0 1-3.5 0 2.47 2.47 0 0 1 0-3.5l3.88-3.88a1 1 0 1 0-1.42-1.42l-3.88 3.89a4.48 4.48 0 0 0 6.33 6.33l3.89-3.88a1 1 0 0 0-1.42-1.42m8.58-12.08a4.49 4.49 0 0 0-6.33 0l-3.89 3.88a1 1 0 1 0 1.42 1.42l3.88-3.88a2.52 2.52 0 0 1 3.5 0 2.47 2.47 0 0 1 0 3.5l-3.88 3.88a1 1 0 0 0 0 1.42 1 1 0 0 0 1.42 0l3.88-3.89a4.49 4.49 0 0 0 0-6.33M8.83 15.17a1 1 0 0 0 .71.29 1 1 0 0 0 .71-.29l4.92-4.92a1 1 0 1 0-1.42-1.42l-4.92 4.92a1 1 0 0 0 0 1.42"/>';

const linkIconChildren = htmlToHast(LINK_ICON_SVG, {
  fragment: true,
  space: "svg",
}).children;

function satteriAutolinkHeadings() {
  return defineHastPlugin({
    name: "autolink-headings",
    element: {
      filter: ["h1", "h2", "h3"],
      visit(node) {
        const id = node.properties?.id;
        if (typeof id !== "string" || id.length === 0) return;
        return {
          type: "element",
          tagName: node.tagName,
          properties: node.properties,
          children: [
            {
              type: "element",
              tagName: "a",
              properties: { className: ["heading-anchor"], href: `#${id}` },
              children: [
                ...node.children,
                {
                  type: "element",
                  tagName: "svg",
                  properties: {
                    width: "20",
                    height: "20",
                    viewBox: "0 0 24 24",
                    fill: "currentColor",
                    "aria-hidden": "true",
                  },
                  children: linkIconChildren,
                },
              ],
            },
          ],
        };
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
        headingAttributes: true,
      },
      // satteriHeadingIdsPlugin()이 먼저 와야 autolink가 id를 읽을 수 있다
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
