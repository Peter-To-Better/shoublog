import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    description: z.string().default(''),
    author: z.string().default('Peter'),
    tags: z.array(z.string()).default([]),
    category: z.string().default('uncategorized'),
    keywords: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts };
