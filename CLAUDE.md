# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev        # Start dev server (localhost:4321)
pnpm build      # Build to ./dist/ (Vercel static output)
pnpm preview    # Preview production build locally
```

No test or lint scripts are configured.

## Architecture

**Astro v5 static blog** deployed on Vercel at `https://blog.kronglog.dev`. Content is in Korean.

**Stack:** Astro (SSG) + React 19 (interactive islands only) + Tailwind CSS v4 + MDX + Nanostores

**Content Collections:** Blog posts live in `src/content/post/blog/**/*.{md,mdx}` and are loaded via glob in `src/content.config.ts`. The schema requires `title` and `date`; optional fields are `description`, `updatedDate`, `tags`, and `image`.

**Routing:**
- `/` → Home (recent posts)
- `/blogs` → All posts listing
- `/blogs/[...slug]` → Individual post (SSG)
- `/about` → About page

**Key architectural decisions:**
- React is only used for components that need client-side interactivity (`ThemeToggle.tsx`, `AppIcons.tsx`). All other components are `.astro` files.
- Dark mode state is managed with Nanostores (`src/lib/stores/theme.ts`) and persisted to localStorage. `BaseLayout.astro` has an inline script to prevent FOUC.
- Tailwind v4 config lives entirely in `src/styles/global.css` (no `tailwind.config.*` file). Custom theme tokens (colors, fonts) are defined there with `@theme inline`.
- Tech tag colors (React, TypeScript, Docker, etc.) are defined as CSS via `data-tag` attributes in `Tag.astro`.
- Path alias `@/*` maps to `src/*`.
- SVG files are imported as React components via SVGR (Vite plugin in `astro.config.mjs`).

**SEO** is handled in `BaseLayout.astro` via props typed in `src/types/seo.ts`.
