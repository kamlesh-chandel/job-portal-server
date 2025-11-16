import Submission from '../models/submission.model.js';
import Job from '../models/job.model.js';
import mongoose from 'mongoose';

export const applyJobService = async (user_id, role, job_id) => {
  if (!mongoose.Types.ObjectId.isValid(job_id)) {
    return { success: false, status: 400, message: 'Invalid job_id' };
  }

  if (role !== 'student') {
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
      populate: {
        path: 'company_id',
        select: 'name logo_url',
      },
    })
    .sort({ created_at: -1 });

  return {
    success: true,
    status: 200,
    message: 'Applied jobs fetched successfully',
    applications,
  };
};

export const getApplicantsService = async (user_id, role, job_id) => {
  // Only recruiters can access
  if (role !== 'recruiter') {
    return {
      success: false,
      status: 403,
      message: 'Only recruiters can view applicants',
    };
  }

  // Check job exists & belongs to recruiter
  const job = await Job.findOne({ _id: job_id, deleted_at: null });

  if (!job) {
    return { success: false, status: 404, message: 'Job not found' };
  }

  if (job.created_by.toString() !== user_id) {
    return {
      success: false,
      status: 403,
      message: 'You can only view applicants for your own jobs',
    };
  }

  // Fetch applicants
  const applicants = await Submission.find({
    job_id,
    deleted_at: null,
  })
    .populate('applicant_id', 'name email profile skills social_links') // user info
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