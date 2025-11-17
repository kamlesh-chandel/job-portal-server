import express from 'express';
import {
  registerCompany,
  getMyCompanies,
  updateCompany,
} from '../controllers/company.controller.js';

import { validateRequest } from '../middlewares/validate.middleware.js';
import {
  companyRegisterSchema,
  getCompaniesQuerySchema,
} from '../validators/company.validator.js';

import { authMiddleware } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';

const router = express.Router();

router.post(
  '/companies',
  authMiddleware,
  upload.single('logo'),
  validateRequest(companyRegisterSchema),
  registerCompany
);

router.get(
  '/companies',
  authMiddleware,
  validateRequest(getCompaniesQuerySchema, 'query'),
  getMyCompanies
);

router.put(
  '/companies/:id',
  authMiddleware,
  upload.single('logo'),
  validateRequest(companyRegisterSchema),
  updateCompany
);

export default router;
