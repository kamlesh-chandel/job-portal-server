import Bookmark from '../models/bookmark.model.js';
import mongoose from 'mongoose';

const serializeBookmark = bookmarkDoc => {
  if (!bookmarkDoc) return null;

  const b = bookmarkDoc.toObject ? bookmarkDoc.toObject() : bookmarkDoc;

  return {
    id: b._id,
    userId: b.user_id?._id || b.user_id,
    jobId: b.job_id?._id || b.job_id,
    createdAt: b.created_at,
    updatedAt: b.updated_at,
  };
};

export const toggleBookmarkService = async (userId, jobId) => {
  if (!mongoose.Types.ObjectId.isValid(jobId)) {
    return { success: false, status: 400, message: 'Invalid jobId' };
  }

  const active = await Bookmark.findOne({
    user_id: userId,
    job_id: jobId,
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
    user_id: userId,
    job_id: jobId,
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
      bookmark: serializeBookmark(deletedBookmark),
    };
  }

  const newBookmark = await Bookmark.create({
    user_id: userId,
    job_id: jobId,
  });

  return {
    success: true,
    status: 201,
    message: 'Job saved successfully',
    action: 'saved',
    bookmark: serializeBookmark(newBookmark),
  };
};

export const getBookmarksService = async ({
  userId,
  limit = 10,
  offset = 0,
}) => {
  const filter = { user_id: userId, deleted_at: null };

  const [total, bookmarks] = await Promise.all([
    Bookmark.countDocuments(filter),
    Bookmark.find(filter)
      .populate('job_id')
      .sort({ created_at: -1 })
      .skip(Number(offset))
      .limit(Number(limit)),
  ]);

  return {
    success: true,
    status: 200,
    message: 'Bookmarks fetched successfully',
    data: {
      total,
      limit,
      offset,
      items: bookmarks.map(serializeBookmark),
    },
  };
};
