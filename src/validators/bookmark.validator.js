import { z } from 'zod';
import mongoose from 'mongoose';

export const bookmarkBodySchema = z.object({
  jobId: z.string().refine(id => mongoose.Types.ObjectId.isValid(id), {
    message: 'Invalid jobId',
  }),
});

export const bookmarkQuerySchema = z.object({
  limit: z
    .string()
    .optional()
    .transform(s => (s ? parseInt(s, 10) : 10))
    .refine(n => Number.isFinite(n) && n > 0, {
      message: 'limit must be positive',
    }),
  offset: z
    .string()
    .optional()
    .transform(s => (s ? parseInt(s, 10) : 0))
    .refine(n => Number.isFinite(n) && n >= 0, {
      message: 'offset must be >= 0',
    }),
});
