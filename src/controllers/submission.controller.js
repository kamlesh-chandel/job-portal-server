import {
  applyJobService,
  getAppliedJobsService,
  getApplicantsService,
  updateApplicationStatusService,
} from '../services/submission.service.js';
import { sendResponse } from '../utils/api.response.js';

export const applyJob = async (req, res, next) => {
  try {
    const user_id = req.user?.user_id;
    const role = req.user?.role;
    const { job_id } = req.body;

    const result = await applyJobService(user_id, role, job_id);

    return sendResponse(
      res,
      result.status,
      result.success,
      result.message,
      result.submission || null
    );
  } catch (error) {
    next(error);
  }
};

export const getAppliedJobs = async (req, res, next) => {
  try {
    const user_id = req.user?.user_id;
    const role = req.user?.role;

    const result = await getAppliedJobsService(user_id, role);

    return sendResponse(
      res,
      result.status,
      result.success,
      result.message,
      result.applications || null
    );
  } catch (error) {
    next(error);
  }
};

export const getApplicants = async (req, res, next) => {
  try {
    const user_id = req.user?.user_id;
    const role = req.user?.role;
    const { job_id } = req.params;

    const result = await getApplicantsService(user_id, role, job_id);

    return sendResponse(
      res,
      result.status,
      result.success,
      result.message,
      result.applicants || null
    );
  } catch (error) {
    next(error);
  }
};

export const updateApplicationStatus = async (req, res, next) => {
  try {
    const user_id = req.user?.user_id;
    const role = req.user?.role;
    const { submission_id } = req.params;
    const { status } = req.body;

    const result = await updateApplicationStatusService(
      user_id,
      role,
      submission_id,
      status
    );

    return sendResponse(
      res,
      result.status,
      result.success,
      result.message,
      result.submission || null
    );
  } catch (error) {
    next(error);
  }
};
