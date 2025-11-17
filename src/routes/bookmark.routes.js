import express from 'express';
import {
  toggleBookmark,
  getBookmarks,
} from '../controllers/bookmark.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import {
  bookmarkParamsSchema,
  bookmarkQuerySchema,
} from '../validators/bookmark.validator.js';

const router = express.Router();

router.post(
  '/:jobId',
  authMiddleware,
  validateRequest(bookmarkParamsSchema, 'params'),
  toggleBookmark
);

router.get(
  '/',
  authMiddleware,
  validateRequest(bookmarkQuerySchema, 'query'),
  getBookmarks
);

export default router;
