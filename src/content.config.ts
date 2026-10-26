import { defineCollection } from 'astro:content';
import { z } from 'zod';
import { glob } from 'astro/loaders';

const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
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
