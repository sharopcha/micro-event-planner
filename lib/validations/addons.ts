import { z } from 'zod';

export const addonSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  category: z.enum(['venue', 'food', 'drinks', 'decor', 'music', 'photography', 'activities', 'extras']),
  description: z.string().optional(),
  price: z.coerce.number().min(0, 'Price must be positive'),
  budget_tag: z.enum(['cheap', 'standard', 'premium']),
  compatible_event_types: z.array(z.enum(['baby_shower', 'birthday_party', 'picnic', 'proposal'])).min(1, 'Select at least one event type'),
  active: z.boolean().default(true),
  image_url: z.string().url().optional().or(z.literal('')),
});

export type AddonFormData = z.infer<typeof addonSchema>;
