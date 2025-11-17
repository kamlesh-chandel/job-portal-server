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

export const createBookmarkService = async (userId, jobId) => {
  if (!mongoose.Types.ObjectId.isValid(jobId)) {
    return { success: false, status: 400, message: 'Invalid jobId' };
  }

  const active = await Bookmark.findOne({
    user_id: userId,
    job_id: jobId,
    deleted_at: null,
  });

  if (active) {
    return {
      success: true,
      status: 200,
      message: 'Already saved',
      bookmark: serializeBookmark(active),
    };
  }

  const deleted = await Bookmark.findOne({
    user_id: userId,
    job_id: jobId,
    deleted_at: { $ne: null },
  });

  if (deleted) {
    deleted.deleted_at = null;
    await deleted.save();

    return {
      success: true,
      status: 200,
      message: 'Job saved successfully',
      bookmark: serializeBookmark(deleted),
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
    bookmark: serializeBookmark(newBookmark),
  };
};

export const deleteBookmarkService = async (userId, jobId) => {
  if (!mongoose.Types.ObjectId.isValid(jobId)) {
    return { success: false, status: 400, message: 'Invalid jobId' };
  }

  const bookmark = await Bookmark.findOne({
    user_id: userId,
    job_id: jobId,
    deleted_at: null,
  });

  if (!bookmark) {
    return {
      success: false,
      status: 404,
      message: 'Bookmark not found',
    };
  }

  bookmark.deleted_at = new Date();
  await bookmark.save();

  return {
    success: true,
    status: 200,
    message: 'Job removed from saved list',
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
