import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const post = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/post/blog" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().optional(),
      date: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      tags: z.array(z.string()).optional(),
      image: image().optional(),
    }),
});

const archive = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/post/archive" }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string(),
        // 시간까지 표시하므로 KST 오프셋을 붙여 작성: 2026-10-21T01:42:00+09:00
        date: z.coerce.date(),
        // iconify 아이콘 이름 (예: lucide:coffee)
        icon: z.string().default("lucide:pencil-line"),
        // note: 일반 · quote: 인용
        type: z.enum(["note", "quote"]).default("note"),
        quote: z.string().optional(),
        author: z.string().optional(),
        tags: z.array(z.string()).optional(),
        image: image().optional(),
      })
      .refine((data) => data.type !== "quote" || Boolean(data.quote), {
        message: "type이 quote이면 quote가 필요합니다.",
        path: ["quote"],
      }),
});

export const collections = { post, archive };
