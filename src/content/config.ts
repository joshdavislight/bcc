import { defineCollection, z } from 'astro:content';

const pages = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    nav: z.boolean().default(false),
    order: z.number().default(99),
    updated: z.string(),
    noindex: z.boolean().optional(),
  }),
});

export const collections = { pages };
