import { z } from 'zod';

export const OfferingSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1),
  audience: z.enum(['youth', 'adult']),
  ages: z.string().min(1),
  description: z.string().min(1),
  schedule: z.string().min(1),
  price: z.string().min(1),
  instructor: z.string().optional(),
  portalUrl: z.string().url(),
  active: z.boolean().default(true),
});

export const RoomSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1),
  dimensions: z.string().min(1),
  ceiling: z.string().min(1),
  floor: z.string().min(1),
  features: z.array(z.string()),
  rate: z.string().min(1),
  photos: z.array(z.string().url()).optional(),
});

export type Offering = z.infer<typeof OfferingSchema>;
export type Room = z.infer<typeof RoomSchema>;
