import { z } from 'zod';


export const updateProfileSchema = z.object({
  name: z.string().optional(),
  email: z.string().email('Invalid email').optional(),

  skills: z.string().optional(),

  linkedin_url: z.string().url().optional().or(z.literal('')),
  github_url: z.string().url().optional().or(z.literal('')),

});
