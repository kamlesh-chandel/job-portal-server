import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import {
  applyJobSchema,
  updateStatusSchema,
} from '../validators/submission.validator.js';
import {
  applyJob,
  getAppliedJobs,
  getApplicants,
  updateApplicationStatus,
  checkSubmissionStatus,
} from '../controllers/submission.controller.js';

const router = express.Router();

router.post('/', authMiddleware, validateRequest(applyJobSchema), applyJob);

router.get('/check', authMiddleware, checkSubmissionStatus);

router.get('/applicants', authMiddleware, getApplicants);

router.get('/applied', authMiddleware, getAppliedJobs);

router.patch(
  '/:submissionId',
  authMiddleware,
  validateRequest(updateStatusSchema),
  updateApplicationStatus
);

export default router;
