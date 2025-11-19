import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import { applyJobSchema, updateStatusSchema } from '../validators/submission.validator.js';
import { applyJob, getAppliedJobs, getApplicants, updateApplicationStatus, checkSubmissionStatus } from '../controllers/submission.controller.js';

const router = express.Router();

router.post(
  '/apply',
  authMiddleware,
  validateRequest(applyJobSchema),
  applyJob
);

router.get('/applied', authMiddleware, getAppliedJobs);
router.get('/check/:jobId', authMiddleware, checkSubmissionStatus);
router.get('/applicants/:job_id', authMiddleware, getApplicants);
router.put(
  '/status/:submission_id',
  authMiddleware,
  validateRequest(updateStatusSchema),
  updateApplicationStatus
);

export default router;
