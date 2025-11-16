import { z } from 'zod';

export const applyJobSchema = z.object({
  job_id: z.string().min(1, 'job_id is required'),
});

export const updateStatusSchema = z.object({
  status: z.enum([
    'pending',
    'under review',
    'interview scheduled',
    'hired',
    'rejected',
  ]),
});
