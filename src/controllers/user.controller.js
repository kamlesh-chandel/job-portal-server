import {
  updateProfileService,
  updateProfilePhotoService,
} from '../services/user.service.js';
import { sendResponse } from '../utils/api.response.js';

export const updateProfile = async (req, res, next) => {
  try {
    const user_id = req.user?.user_id;
    const file = req.file;

    const result = await updateProfileService(user_id, req.body, file);

    return sendResponse(
      res,
      result.status,
      result.success,
      result.message,
      result.user
    );
  } catch (error) {
    next(error);
  }
};

export const updateProfilePhoto = async (req, res, next) => {
  try {
    const user_id = req.user?.user_id;
    const file = req.file;

    if (!file) {
      return sendResponse(res, 400, false, 'No profile photo uploaded');
    }

    const result = await updateProfilePhotoService(user_id, file);

    return sendResponse(
      res,
      result.status,
      result.success,
      result.message,
      result.user
    );
  } catch (error) {
    next(error);
  }
};