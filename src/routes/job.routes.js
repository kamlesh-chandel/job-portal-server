import express from 'express';
import {
  createJob,
  getAllJobs,
  getJobById,
  getRecruiterJobs,
} from '../controllers/job.controller.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import { jobCreateSchema } from '../validators/job.validator.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/create', authMiddleware, validateRequest(jobCreateSchema), createJob);
router.get('/get', authMiddleware, getAllJobs);
router.get('/get/:id', getJobById);
router.get('/get-recruiter-jobs', authMiddleware, getRecruiterJobs);

export default router;
