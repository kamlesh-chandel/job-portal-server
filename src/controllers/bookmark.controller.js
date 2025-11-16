import { toggleBookmarkService } from '../services/bookmark.service.js';
import { sendResponse } from '../utils/api.response.js';

export const toggleBookmark = async (req, res, next) => {
  try {
    const user_id = req.user?.user_id;
    const job_id = req.params.job_id;

    if (!user_id) {
      return sendResponse(res, 401, false, 'Unauthorized');
    }

    const result = await toggleBookmarkService(user_id, job_id);

    return sendResponse(
      res,
      result.status,
      result.success,
      result.message,
      result.action ? { action: result.action } : null
    );
  } catch (error) {
    next(error);
  }
};
