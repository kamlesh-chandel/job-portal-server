import { z } from 'zod';

export const jobCreateSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  requirements: z.string().min(1, 'Requirements is required'),
  salary: z.number().min(0, 'Salary must be a number'),
  experience_level: z.number().min(0, 'Experience level is required'),
  location: z.string().optional(),
  job_type: z.string().optional(),
  positions: z.number().min(1, 'Positions must be at least 1'),
  company_id: z.string().min(1, 'company_id is required'),
});
