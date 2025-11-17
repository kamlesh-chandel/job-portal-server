import {
  createJobService,
  getAllJobsService,
  getJobByIdService,
  getRecruiterJobsService,
} from '../services/job.service.js';
import { sendResponse } from '../utils/api.response.js';

export const createJob = async (req, res, next) => {
  try {
    const userId = req.user?.user_id;
    const role = req.user?.role;

    if (!userId) return sendResponse(res, 401, false, 'Unauthorized');

    if (role !== 'recruiter') {
      return sendResponse(res, 403, false, 'Only recruiters can post jobs');
    }

    const result = await createJobService(req.body, userId);

    return sendResponse(
      res,
      result.status,
      result.success,
      result.message,
      result.job || null
    );
  } catch (error) {
    next(error);
  }
};

export const getAllJobs = async (req, res, next) => {
  try {
    const limit = Number(req.query.limit ?? 10);
    const offset = Number(req.query.offset ?? 0);
    const q = req.query.q ?? null;

    const result = await getAllJobsService({ limit, offset, q });

    return sendResponse(
      res,
      result.status,
      result.success,
      result.message,
      result.data
    );
  } catch (error) {
    next(error);
  }
};

export const getJobById = async (req, res, next) => {
  try {
    const jobId = req.params.id;

    const result = await getJobByIdService(jobId);

    return sendResponse(
      res,
      result.status,
      result.success,
      result.message,
      result.job || null
    );
  } catch (error) {
    next(error);
  }
};

export const getRecruiterJobs = async (req, res, next) => {
  try {
    const userId = req.user?.user_id;
    const role = req.user?.role;

    if (!userId) return sendResponse(res, 401, false, 'Unauthorized');
    if (role !== 'recruiter')
      return sendResponse(res, 403, false, 'Only recruiters can access this');

    const limit = Number(req.query.limit ?? 10);
    const offset = Number(req.query.offset ?? 0);

    const result = await getRecruiterJobsService({ userId, limit, offset });

    return sendResponse(
      res,
      result.status,
      result.success,
      result.message,
      result.data
    );
  } catch (error) {
    next(error);
  }
};
