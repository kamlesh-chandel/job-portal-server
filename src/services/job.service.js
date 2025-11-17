import Job from '../models/job.model.js';
import Company from '../models/company.model.js';
import mongoose from 'mongoose';

const serializeJob = jobDoc => {
  if (!jobDoc) return null;
  const job = jobDoc.toObject ? jobDoc.toObject() : jobDoc;

  return {
    id: job._id,
    title: job.title,
    description: job.description,
    requirements: job.requirements || [],
    salary: job.salary,
    experienceLevel: job.experience_level,
    location: job.location,
    jobType: job.job_type,
    positions: job.positions,
    company: job.company_id
      ? {
          id: job.company_id._id,
          name: job.company_id.name,
          logoUrl: job.company_id.logo_url || null,
          address: job.company_id.address || null,
        }
      : null,
    createdBy: job.created_by
      ? {
          id: job.created_by._id,
          name: job.created_by.name,
          email: job.created_by.email,
        }
      : null,
    createdAt: job.created_at,
    updatedAt: job.updated_at,
  };
};

export const createJobService = async (payload, user_id) => {
  const {
    title,
    description,
    requirements,
    salary,
    experienceLevel,
    location,
    jobType,
    positions,
    companyId,
  } = payload;

  if (!mongoose.Types.ObjectId.isValid(companyId)) {
    return { success: false, status: 400, message: 'Invalid company_id' };
  }

  const company = await Company.findOne({ _id: companyId, deleted_at: null });
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

  let reqArray = [];
  if (Array.isArray(requirements)) {
    reqArray = requirements.map(s => String(s).trim()).filter(Boolean);
  } else if (typeof requirements === 'string') {
    reqArray = requirements
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
  }

  const newJob = await Job.create({
    title,
    description,
    requirements: reqArray,
    salary,
    experience_level: experienceLevel,
    location,
    job_type: jobType,
    positions,
    company_id: companyId,
    created_by: user_id,
  });

  const populatedJob = await newJob.populate([
    { path: 'company_id', select: 'name logo_url address user_id' },
    { path: 'created_by', select: 'name email' },
  ]);

  return {
    success: true,
    status: 201,
    message: 'Job posted successfully',
    job: serializeJob(populatedJob),
  };
};

export const getAllJobsService = async ({
  limit = 10,
  offset = 0,
  q = null,
} = {}) => {
  const filter = { deleted_at: null };

  if (q) {
    filter.$or = [
      { title: new RegExp(q, 'i') },
      { description: new RegExp(q, 'i') },
    ];
  }

  const [total, jobs] = await Promise.all([
    Job.countDocuments(filter),
    Job.find(filter)
      .populate('company_id', 'name logo_url address')
      .populate('created_by', 'name email')
      .sort({ created_at: -1 })
      .skip(Number(offset))
      .limit(Number(limit)),
  ]);

  const data = {
    total,
    limit: Number(limit),
    offset: Number(offset),
    items: jobs.map(serializeJob),
  };

  return {
    success: true,
    status: 200,
    message: 'Jobs fetched successfully',
    data,
  };
};

export const getJobByIdService = async job_id => {
  if (!mongoose.Types.ObjectId.isValid(job_id)) {
    return { success: false, status: 400, message: 'Invalid job id' };
  }

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
    job: serializeJob(job),
  };
};

export const getRecruiterJobsService = async ({
  userId,
  limit = 10,
  offset = 0,
}) => {
  const filter = { created_by: userId, deleted_at: null };

  const [total, jobs] = await Promise.all([
    Job.countDocuments(filter),
    Job.find(filter)
      .populate('company_id', 'name logo_url address')
      .populate('created_by', 'name email')
      .sort({ created_at: -1 })
      .skip(Number(offset))
      .limit(Number(limit)),
  ]);

  const data = {
    total,
    limit: Number(limit),
    offset: Number(offset),
    items: jobs.map(serializeJob),
  };

  return {
    success: true,
    status: 200,
    message: 'Recruiter jobs fetched successfully',
    data,
  };
};
