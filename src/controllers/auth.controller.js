import { registerService, loginService } from "../services/auth.service.js";
import { sendResponse } from "../utils/api.response.js";
import { generateAccessToken } from "../utils/token.js";

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

    if (!result.success) {
      return sendResponse(
        res,
        result.status,
        result.success,
        result.message,
        null
      );
    }

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return sendResponse(
      res,
      result.status,
      result.success,
      result.message,
      {
        accessToken: result.accessToken,
        user: result.user,
      }
    );

  } catch (error) {
    next(error);
  }
};

export const refreshAccessToken = (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return sendResponse(res, 401, false, "Refresh token missing");
    }

    jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
      if (err) {
        return sendResponse(res, 401, false, "Invalid or expired refresh token");
      }

      const newAccessToken = generateAccessToken({
        user_id: decoded.user_id,
        role: decoded.role,
      });

      return sendResponse(res, 200, true, "New access token generated", {
        accessToken: newAccessToken,
      });
    });
  } catch (error) {
    next(error);
  }
};