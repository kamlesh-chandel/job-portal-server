import Submission from '../models/submission.model.js';
import Job from '../models/job.model.js';
import mongoose from 'mongoose';
import { ROLES } from '../constants/roles.js';

export const applyJobService = async (user_id, role, job_id) => {
  if (!mongoose.Types.ObjectId.isValid(job_id)) {
    return { success: false, status: 400, message: 'Invalid job_id' };
  }

  if (role !== ROLES.STUDENT) {
    return { success: false, status: 403, message: 'Only students can apply' };
  }

  const job = await Job.findOne({ _id: job_id, deleted_at: null });

  if (!job) {
    return { success: false, status: 404, message: 'Job not found' };
  }

  if (job.created_by.toString() === user_id) {
    return {
      success: false,
      status: 403,
      message: 'You cannot apply to your own job',
    };
  }

  const alreadyApplied = await Submission.findOne({
    job_id,
    applicant_id: user_id,
    deleted_at: null,
  });

  if (alreadyApplied) {
    return {
      success: false,
      status: 409,
      message: 'You have already applied for this job',
    };
  }

  const submission = await Submission.create({
    job_id,
    applicant_id: user_id,
  });

  return {
    success: true,
    status: 201,
    message: 'Application submitted successfully',
    submission,
  };
};

export const checkSubmissionStatusService = async (jobId, userId) => {
  const existing = await Submission.findOne({
    job_id: jobId,
    applicant_id: userId,
    deleted_at: null,
  });
const isAlreadyApplied = !!existing;

   return {
      success: true,
      status: 200,
      message: 'apply status',
      isAlreadyApplied
    };;
};

export const getAppliedJobsService = async (user_id, role) => {
  if (role !== 'student') {
    return {
      success: false,
      status: 403,
      message: 'Only students can view applied jobs',
    };
  }

  const applications = await Submission.find({
    applicant_id: user_id,
    deleted_at: null,
  })
    .populate({
      path: 'job_id',
      match: { deleted_at: null },
      select: '-deleted_at',
      populate: {
        path: 'company_id',
        select: 'name logo_url',
        select: '-deleted_at',
      },
    })
    .select('-deleted_at')
    .sort({ created_at: -1 });

  return {
    success: true,
    status: 200,
    message: 'Applied jobs fetched successfully',
    applications,
  };
};

export const getApplicantsService = async (user_id, role, jobId) => {

  const normalizedRole = String(role ?? '').toLowerCase();

  if (normalizedRole !== 'recruiter') {
    return {
      success: false,
      status: 403,
      message: 'Only recruiters can view applicants',
    };
  }

  if (!mongoose.Types.ObjectId.isValid(jobId)) {
    return { success: false, status: 400, message: 'Invalid jobId' };
  }

  const job = await Job.findOne({ _id: jobId, deleted_at: null });

  if (!job) {
    return { success: false, status: 404, message: 'Job not found' };
  }

  const jobOwner = job.created_by ?? job.createdBy ?? job.createdById ?? null;

  const isOwner =
    jobOwner &&
    (typeof jobOwner.equals === 'function'
      ? jobOwner.equals(String(user_id))
      : String(jobOwner) === String(user_id));

  if (!isOwner) {
    return {
      success: false,
      status: 403,
      message: 'You can only view applicants for your own jobs',
    };
  }

const applicants = await Submission.find({
  job_id: jobId,
  deleted_at: null,
})
  .populate('applicant_id', 'name email profile skills social_links')
  .sort({ created_at: -1 });


  return {
    success: true,
    status: 200,
    message: 'Applicants fetched successfully',
    applicants,
  };
};


export const updateApplicationStatusService = async (
  user_id,
  role,
  submission_id,
  status
) => {
  if (role !== 'recruiter') {
    return {
      success: false,
      status: 403,
      message: 'Only recruiters can update status',
    };
  }

  const submission = await Submission.findOne({
    _id: submission_id,
    deleted_at: null,
  });

  if (!submission) {
    return { success: false, status: 404, message: 'Application not found' };
  }

  const job = await Job.findOne({
    _id: submission.job_id,
    deleted_at: null,
  });

  if (!job) {
    return { success: false, status: 404, message: 'Job not found' };
  }

  if (job.created_by.toString() !== user_id) {
    return {
      success: false,
      status: 403,
      message: 'You can update applications only for your own jobs',
    };
  }
  
  submission.status = status;
  await submission.save();

  return {
    success: true,
    status: 200,
    message: 'Application status updated successfully',
    submission,
  };
};