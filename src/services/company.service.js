import Company from '../models/company.model.js';
import cloudinary from '../config/cloudinary.js';

const serializeCompany = company => {
  if (!company) return null;

  const obj = company.toObject();

  return {
    id: obj._id,
    name: obj.name,
    website: obj.website,
    address: obj.address,
    logoUrl: obj.logo_url,
    userId: obj.user_id,
    createdAt: obj.created_at,
    updatedAt: obj.updated_at,
  };
};

export const registerCompanyService = async (data, user_id, file) => {
  let logo_url = null;

  if (file) {
    const uploadPromise = new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'jobportal/companies' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result.secure_url);
        }
      );

      stream.end(file.buffer);
    });

    logo_url = await uploadPromise;
  }

  const newCompany = await Company.create({
    ...data,
    user_id,
    logo_url,
  });

  return {
    success: true,
    status: 201,
    message: 'Company registered successfully',
    company: serializeCompany(newCompany),
  };
};

export const getCompaniesByRecruiterService = async (
  user_id,
  page,
  limit
) => {
  const skip = (page - 1) * limit;

  const companies = await Company.find({
    user_id,
    deleted_at: null,
  })
    .skip(skip)
    .limit(limit)
    .sort({ created_at: -1 });

  const total = await Company.countDocuments({
    user_id,
    deleted_at: null,
  });

  return {
    success: true,
    status: 200,
    message: 'Companies fetched successfully',
    companies: companies.map(c => serializeCompany(c)),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const updateCompanyService = async (company_id, user_id, data, file) => {
  const company = await Company.findOne({
    _id: company_id,
    user_id,
    deleted_at: null,
  });

  if (!company) {
    return {
      success: false,
      status: 404,
      message: 'Company not found or unauthorized',
    };
  }

  let logo_url = company.logo_url;

  if (file) {
    if (logo_url) {
      const publicId = logo_url.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`jobportal/companies/${publicId}`);
    }

    const uploadPromise = new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'jobportal/companies' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result.secure_url);
        }
      );
      stream.end(file.buffer);
    });

    logo_url = await uploadPromise;
  }

  const updatedCompany = await Company.findByIdAndUpdate(
    company_id,
    {
      ...data,
      logo_url,
    },
    { new: true }
  );

  return {
    success: true,
    status: 200,
    message: 'Company updated successfully',
    company: serializeCompany(updatedCompany),
  };
};
