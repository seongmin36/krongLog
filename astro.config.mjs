import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";
import svgr from "vite-plugin-svgr";
import {
  transformerMetaHighlight,
  transformerMetaWordHighlight,
  transformerNotationDiff,
  transformerNotationErrorLevel,
  transformerNotationFocus,
  transformerNotationHighlight,
} from "@shikijs/transformers";

export default defineConfig({
  output: "static",
  adapter: vercel(),
  site: "https://blog.kronglog.dev",
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
      ],
    },
  },

  vite: {
    plugins: [tailwindcss(), svgr()],
  },
  image: {
    service: {
      entrypoint: "astro/assets/services/sharp",
    },
  },
  integrations: [
    mdx(),
    react(),
    sitemap(),
  ],
});
