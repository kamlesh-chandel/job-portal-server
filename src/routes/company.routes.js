import express from 'express';
import {
  registerCompany,
  getMyCompanies,
  updateCompany,
} from '../controllers/company.controller.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import { companyRegisterSchema } from '../validators/company.validator.js';

import { authMiddleware } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';

const router = express.Router();

router
  .route('/companies')
  .post(
    authMiddleware,
    upload.single('logo'),
    validateRequest(companyRegisterSchema),
    registerCompany
  );

router.get('/companies', authMiddleware, getMyCompanies);

router
  .route('/companies/:id')
  .put(
    authMiddleware,
    upload.single('logo'),
    validateRequest(companyRegisterSchema),
    updateCompany
  );

export default router;
