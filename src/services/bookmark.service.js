import Bookmark from '../models/bookmark.model.js';
import mongoose from 'mongoose';

const serializeBookmark = bookmarkDoc => {
  if (!bookmarkDoc) return null;

  const b = bookmarkDoc.toObject ? bookmarkDoc.toObject() : bookmarkDoc;

  return {
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

  const existing = await Bookmark.findOne({
    user_id: userId,
    job_id: jobId,
  });

  if (existing && existing.deleted_at === null) {
    return {
      success: true,
      status: 200,
      message: 'Already saved',
      bookmark: serializeBookmark(existing),
    };
  }

  if (existing && existing.deleted_at !== null) {
    existing.deleted_at = null;
    await existing.save();

    return {
      success: true,
      status: 200,
      message: 'Job saved successfully',
      bookmark: serializeBookmark(existing),
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


export const deleteBookmarkService = async (userId, bookmarkId) => {
  if (!mongoose.Types.ObjectId.isValid(bookmarkId)) {
    return { success: false, status: 400, message: 'Invalid bookmarkId' };
  }

  const bookmark = await Bookmark.findOne({
    _id: bookmarkId,
    user_id: userId,
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
