import { registerService, loginService } from "../services/auth.service.js";
import { sendResponse } from "../utils/api.response.js";

export const register = async (req, res, next) => {
  try {
    const result = await registerService(req.body);

    return sendResponse(
      res,
      result.status,
      result.success,
      result.message,
      result.data || null
    );
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const result = await loginService(req.body);

    return sendResponse(
      res,
      result.status,
      result.success,
      result.message,
      result.token
        ? { token: result.token, user: result.user }
        : null
    );
  } catch (error) {
    next(error);
  }
};
