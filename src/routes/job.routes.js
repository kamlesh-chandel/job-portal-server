import express from 'express';
import {
  createJob,
  getAllJobs,
  getJobById,
  getRecruiterJobs,
} from '../controllers/job.controller.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import {
  jobCreateSchema,
  jobQuerySchema,
} from '../validators/job.validator.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', authMiddleware, validateRequest(jobCreateSchema), createJob);
router.get('/', validateRequest(jobQuerySchema, 'query'), getAllJobs);
router.get(
  '/recruiter',
  authMiddleware,
  validateRequest(jobQuerySchema, 'query'),
  getRecruiterJobs
);
router.get('/:id', getJobById);

export default router;
