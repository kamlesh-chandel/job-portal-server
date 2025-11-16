import User from '../models/user.model.js';
import cloudinary from '../config/cloudinary.js';

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

  if (data.linkedin_url)
    updates['social_links.linkedin_url'] = data.linkedin_url;

  if (data.github_url) updates['social_links.github_url'] = data.github_url;

  if (file) {
    const uploadPromise = new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'jobportal/resumes',
          resource_type: 'raw',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result.secure_url);
        }
      );
      stream.end(file.buffer);
    });

    const resume_url = await uploadPromise;
    updates['profile.resume_url'] = resume_url;
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
  
  const uploadPromise = new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'jobportal/profile_photos',
        resource_type: 'image',
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    stream.end(file.buffer);
  });

  const profile_url = await uploadPromise;

  const updatedUser = await User.findByIdAndUpdate(
    user_id,
    { 'profile.profile_url': profile_url },
    { new: true }
  ).select('-password');

  return {
    success: true,
    status: 200,
    message: 'Profile photo updated successfully',
    user: updatedUser,
  };
};