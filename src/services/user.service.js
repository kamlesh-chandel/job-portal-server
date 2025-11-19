import User from '../models/user.model.js';
import cloudinary from '../config/cloudinary.js';
import UserRole from '../models/userRole.model.js';

const uploadToCloudinary = (file, folder, resourceType = 'image') => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    stream.end(file.buffer);
  });
};


export const updateProfileService = async (user_id, data, file) => {
  const user = await User.findOne({ _id: user_id, deleted_at: null });

  if (!user) {
    return { success: false, status: 404, message: 'User not found' };
  }

  const updates = {};

  if (data.name) updates.name = data.name;
  if (data.email) updates.email = data.email;

  if (data.skills) {
    updates['profile.skills'] = data.skills
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
  }

  if (data.linkedinUrl) {
    updates['social_links.linkedin_url'] = data.linkedinUrl;
  }

  if (data.githubUrl) {
    updates['social_links.github_url'] = data.githubUrl;
  }

  if (file) {
    const resumeUrl = await uploadToCloudinary(
      file,
      'jobportal/resumes',
      'raw'
    );
    updates['profile.resume_url'] = resumeUrl;
  }

  const updatedUser = await User.findByIdAndUpdate(user_id, updates, {
    new: true,
  }).select('-password');

  const userRole = await UserRole.findOne({
    user_id,
    deleted_at: null,
  }).populate('role_id');

  let role = null;

  if (userRole && userRole.role_id) {
    role = userRole.role_id.name;
  }

  return {
    success: true,
    status: 200,
    message: 'Profile updated successfully',
    user: {
      ...updatedUser.toObject(),
      role,
    },
  };
};


export const updateProfilePhotoService = async (user_id, file) => {
  const user = await User.findOne({ _id: user_id, deleted_at: null });

  if (!user) {
    return { success: false, status: 404, message: 'User not found' };
  }

  const profileUrl = await uploadToCloudinary(
    file,
    'jobportal/profile_photos',
    'image'
  );

  const updatedUser = await User.findByIdAndUpdate(
    user_id,
    { 'profile.profile_url': profileUrl },
    { new: true }
  ).select('-password');

    const userRole = await UserRole.findOne({
      user_id,
      deleted_at: null,
    }).populate('role_id');

    let role = null;

    if (userRole && userRole.role_id) {
      role = userRole.role_id.name;
    }

  return {
    success: true,
    status: 200,
    message: 'Profile photo updated successfully',
    user:  {
      ...updatedUser.toObject(),
      role,
    },
  };
};

