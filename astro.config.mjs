import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";
import image from "@astrojs/image";

export default defineConfig({
  output: "static",
  adapter: vercel(),
  // site: '/',
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "viewport",
  },
  integrations: [
    image(), // TODO: 엔트리 포인트 추가, sharp 옵션 등
    mdx({
      syntaxHighlight: "shiki",
      // shikiConfig: {}
    }),
    react(),
    tailwindcss(),
    mdx(),
    sitemap(),
  ],
});
