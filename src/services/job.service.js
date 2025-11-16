import Job from '../models/job.model.js';
import Company from '../models/company.model.js';
import mongoose from 'mongoose';

export const createJobService = async (payload, user_id) => {
  const {
    title,
    description,
    requirements,
    salary,
    experience_level,
    location,
    job_type,
    positions,
    company_id,
  } = payload;

  if (!mongoose.Types.ObjectId.isValid(company_id)) {
    return { success: false, status: 400, message: 'Invalid company_id' };
  }

  const company = await Company.findOne({ _id: company_id, deleted_at: null });
  if (!company) {
    return { success: false, status: 404, message: 'Company not found' };
  }
  if (String(company.user_id) !== String(user_id)) {
    return {
      success: false,
      status: 403,
      message: 'Unauthorized to post job for this company',
    };
  }

  const reqArray = requirements
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

  const newJob = await Job.create({
    title,
    description,
    requirements: reqArray,
    salary,
    experience_level,
    location,
    job_type,
    positions,
    company_id,
    created_by: user_id,
  });

  return {
    success: true,
    status: 201,
    message: 'Job posted successfully',
    job: newJob,
  };
};

export const getAllJobsService = async () => {
  const jobs = await Job.find({ deleted_at: null })
    .populate('company_id', 'name logo_url')
    .sort({ created_at: -1 });

  return {
    success: true,
    status: 200,
    message: 'Jobs fetched successfully',
    jobs,
  };
};

export const getJobByIdService = async job_id => {
  const job = await Job.findOne({ _id: job_id, deleted_at: null })
    .populate('company_id', 'name logo_url address')
    .populate('created_by', 'name email');

  if (!job) {
    return {
      success: false,
      status: 404,
      message: 'Job not found',
    };
  }

  return {
    success: true,
    status: 200,
    message: 'Job fetched successfully',
    job,
  };
};

export const getRecruiterJobsService = async user_id => {
  const jobs = await Job.find({
    created_by: user_id,
    deleted_at: null,
  })
    .populate('company_id', 'name logo_url')
    .sort({ created_at: -1 });

  return {
    success: true,
    status: 200,
    message: 'Recruiter jobs fetched successfully',
    jobs,
  };
};
