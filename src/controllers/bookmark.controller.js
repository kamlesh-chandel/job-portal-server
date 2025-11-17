import {
  toggleBookmarkService,
  getBookmarksService,
} from '../services/bookmark.service.js';
import { sendResponse } from '../utils/api.response.js';

export const toggleBookmark = async (req, res, next) => {
  try {
    const userId = req.user?.user_id;
    const jobId = req.params.jobId;

    if (!userId) {
      return sendResponse(res, 401, false, 'Unauthorized');
    }

    const result = await toggleBookmarkService(userId, jobId);

    return sendResponse(
      res,
      result.status,
      result.success,
      result.message,
      result.bookmark || { action: result.action }
    );
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
