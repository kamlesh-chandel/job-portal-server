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

// Student apply job
router.post('/', authMiddleware, validateRequest(applyJobSchema), applyJob);

// Student: check if already applied
router.get('/check', authMiddleware, checkSubmissionStatus);

// Recruiter: get applicants for a job
router.get('/applicants', authMiddleware, getApplicants);

// Student: get all applied jobs
router.get('/applied', authMiddleware, getAppliedJobs);

// Recruiter: update status of an application
router.patch(
  '/:submissionId',
  authMiddleware,
  validateRequest(updateStatusSchema),
  updateApplicationStatus
);

export default router;
