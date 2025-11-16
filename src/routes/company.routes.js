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
  .route('/register')
  .post(
    authMiddleware,
    upload.single('logo'),
    validateRequest(companyRegisterSchema),
    registerCompany
  );

router.get('/getcompanies', authMiddleware, getMyCompanies);

router
  .route('/:id')
  .put(
    authMiddleware,
    upload.single('logo'),
    validateRequest(companyRegisterSchema),
    updateCompany
  );

export default router;
