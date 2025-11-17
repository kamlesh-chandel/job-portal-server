import { z } from 'zod';
import mongoose from 'mongoose';

const objectIdString = () =>
  z
    .string()
    .min(1, 'companyId is required')
    .refine(id => mongoose.Types.ObjectId.isValid(id), {
      message: 'Invalid companyId',
    });

export const jobCreateSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  requirements: z.union([z.string().min(1), z.array(z.string().min(1))]),
  salary: z
    .number({
      invalid_type_error: 'Salary must be a number',
    })
    .nonnegative('Salary must be a non-negative number'),
  experienceLevel: z
    .number({
      invalid_type_error: 'Experience level must be a number',
    })
    .nonnegative('Experience level must be a non-negative number'),
  location: z.string().optional().nullable(),
  jobType: z.string().optional().nullable(),
  positions: z
    .number({
      invalid_type_error: 'Positions must be a number',
    })
    .int()
    .min(1, 'Positions must be at least 1'),
  companyId: objectIdString(),
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
