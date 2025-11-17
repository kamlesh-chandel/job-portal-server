import { z } from 'zod';
import mongoose from 'mongoose';


export const bookmarkBodySchema = z.object({
  jobId: z.string().refine(id => mongoose.Types.ObjectId.isValid(id), {
    message: 'Invalid jobId',
  }),
});

export const bookmarkParamsSchema = z.object({
  bookmarkId: z.string().refine(id => mongoose.Types.ObjectId.isValid(id), {
    message: 'Invalid bookmarkId',
  }),
});

export const bookmarkQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform(s => (s ? parseInt(s, 10) : 1))
    .refine(n => Number.isFinite(n) && n >= 1, {
      message: 'page must be >= 1',
    }),

  limit: z
    .string()
    .optional()
    .transform(s => (s ? parseInt(s, 10) : 10))
    .refine(n => Number.isFinite(n) && n > 0, {
      message: 'limit must be positive',
    }),
});
