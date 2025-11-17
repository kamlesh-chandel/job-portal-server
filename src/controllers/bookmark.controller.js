import {
  createBookmarkService,
  deleteBookmarkService,
  getBookmarksService,
} from '../services/bookmark.service.js';
import { sendResponse } from '../utils/api.response.js';

export const createBookmark = async (req, res, next) => {
  try {
    const userId = req.user?.user_id;
    const { jobId } = req.body;

    const result = await createBookmarkService(userId, jobId);

    return sendResponse(
      res,
      result.status,
      result.success,
      result.message,
      result.bookmark
    );
  } catch (error) {
    next(error);
  }
};

export const deleteBookmark = async (req, res, next) => {
  try {
    const userId = req.user?.user_id;
    const { jobId } = req.body;

    const result = await deleteBookmarkService(userId, jobId);

    return sendResponse(res, result.status, result.success, result.message);
  } catch (error) {
    next(error);
  }
};

export const getBookmarks = async (req, res, next) => {
  try {
    const userId = req.user?.user_id;
    const limit = Number(req.query.limit ?? 10);
    const offset = Number(req.query.offset ?? 0);

    const result = await getBookmarksService({ userId, limit, offset });

    return sendResponse(
      res,
      result.status,
      result.success,
      result.message,
      result.data
    );
  } catch (error) {
    next(error);
  }
};
