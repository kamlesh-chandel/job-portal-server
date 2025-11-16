import {
  createJobService,
  getAllJobsService,
  getJobByIdService,
  getRecruiterJobsService,
} from '../services/job.service.js';
import { sendResponse } from '../utils/api.response.js';

export const createJob = async (req, res, next) => {
  try {
    const user_id = req.user?.user_id;
    const role = req.user?.role;

    if (!user_id) {
      return sendResponse(res, 401, false, 'Unauthorized');
    }

    if (role !== 'recruiter') {
      return sendResponse(res, 403, false, 'Only recruiters can post jobs');
    }

    const result = await createJobService(req.body, user_id);

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
    const result = await getAllJobsService();

    return sendResponse(
      res,
      result.status,
      result.success,
      result.message,
      result.jobs
    );
  } catch (error) {
    next(error);
  }
};

export const getJobById = async (req, res, next) => {
  try {
    const job_id = req.params.id;

    const result = await getJobByIdService(job_id);

    return sendResponse(
      res,
      result.status,
      result.success,
      result.message,
      result.job
    );
  } catch (error) {
    next(error);
  }
};

export const getRecruiterJobs = async (req, res, next) => {
  try {
    const user_id = req.user?.user_id;
    const role = req.user?.role;

    if (role !== 'recruiter') {
      return sendResponse(res, 403, false, 'Only recruiters can access this');
    }

    const result = await getRecruiterJobsService(user_id);

    return sendResponse(
      res,
      result.status,
      result.success,
      result.message,
      result.jobs
    );
  } catch (error) {
    next(error);
  }
};