import { z } from 'zod';

export const companyRegisterSchema = z.object({
  name: z.string().min(1, 'Company name is required'),
  website: z.string().url('Invalid website URL').optional(),
  address: z
    .object({
      street: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      country: z.string().optional(),
    })
    .optional(),
  logo: z.any().optional(),
});


export const getCompaniesQuerySchema = z.object({
  page: z
    .string()
    .transform(val => Number(val))
    .default('1')
    .refine(v => v >= 1, 'Page must be >= 1'),
  limit: z
    .string()
    .transform(val => Number(val))
    .default('10')
    .refine(v => v >= 1 && v <= 100, 'Limit must be between 1 and 100'),
});
