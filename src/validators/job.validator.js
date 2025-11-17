import { z } from 'zod';

export const jobCreateSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  requirements: z.union([z.string().min(1), z.array(z.string().min(1))]),
  salary: z.number().nonnegative('Salary must be a number'),
  experience_level: z.number().nonnegative('Experience level must be a number'),
  location: z.string().optional().nullable(),
  job_type: z.string().optional().nullable(),
  positions: z.number().int().min(1, 'Positions must be at least 1'),
  company_id: z.string().min(1, 'company_id is required'),
});

export const jobQuerySchema = z.object({
  limit: z
    .string()
    .optional()
    .transform(s => (s ? parseInt(s, 10) : 10))
    .refine(n => Number.isFinite(n) && n > 0, {
      message: 'limit must be a positive number',
    }),
  offset: z
    .string()
    .optional()
    .transform(s => (s ? parseInt(s, 10) : 0))
    .refine(n => Number.isFinite(n) && n >= 0, {
      message: 'offset must be >= 0',
    }),
 
  q: z.string().optional(),
});
