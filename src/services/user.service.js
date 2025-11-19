import User from '../models/user.model.js';
import cloudinary from '../config/cloudinary.js';

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

  // Skills parsing
  if (data.skills) {
    updates['profile.skills'] = data.skills
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
  }

  // Social links (now using camelCase)
  if (data.linkedinUrl) {
    updates['social_links.linkedin_url'] = data.linkedinUrl;
  }

  if (data.githubUrl) {
    updates['social_links.github_url'] = data.githubUrl;
  }

  // Resume upload using common helper
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

  return {
    success: true,
    status: 200,
    message: 'Profile updated successfully',
    user: updatedUser,
  };
};

export const updateProfilePhotoService = async (user_id, file) => {
  const user = await User.findOne({ _id: user_id, deleted_at: null });

  if (!user) {
    return { success: false, status: 404, message: 'User not found' };
  }

  // Profile photo upload using shared helper
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

  return {
    success: true,
    status: 200,
    message: 'Profile photo updated successfully',
    user: updatedUser,
  };
};
