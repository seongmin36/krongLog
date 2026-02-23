// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

import mdx from '@astrojs/mdx';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // 배포 URL 설정 (배포 시 실제 도메인으로 변경)
  // site: 'https://example.com',

  // 기본 경로 설정 (서브디렉토리에 배포하는 경우)
  // base: '/',

  // URL 끝 슬래시 처리 방식: 'always' | 'never' | 'ignore'
  trailingSlash: 'ignore',

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [react(), mdx(), sitemap()]
});