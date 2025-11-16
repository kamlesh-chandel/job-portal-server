import Bookmark from '../models/bookmark.model.js';
import mongoose from 'mongoose';

export const toggleBookmarkService = async (user_id, job_id) => {
  if (!mongoose.Types.ObjectId.isValid(job_id)) {
    return { success: false, status: 400, message: 'Invalid job_id' };
  }

  const active = await Bookmark.findOne({
    user_id,
    job_id,
    deleted_at: null,
  });

  if (active) {
    active.deleted_at = new Date();
    await active.save();

    return {
      success: true,
      status: 200,
      message: 'Job removed from saved list',
      action: 'unsaved',
    };
  }
  const deletedBookmark = await Bookmark.findOne({
    user_id,
    job_id,
    deleted_at: { $ne: null },
  });

  if (deletedBookmark) {
    deletedBookmark.deleted_at = null;
    await deletedBookmark.save();

    return {
      success: true,
      status: 200,
      message: 'Job saved successfully',
      action: 'saved',
    };
  }

  const newBookmark = await Bookmark.create({
    user_id,
    job_id,
  });

  return {
    success: true,
    status: 201,
    message: 'Job saved successfully',
    action: 'saved',
    bookmark: newBookmark,
  };
};
