import express from 'express';
import {
  createBookmark,
  deleteBookmark,
  getBookmarks,
} from '../controllers/bookmark.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import {
  bookmarkBodySchema,
  bookmarkQuerySchema,
} from '../validators/bookmark.validator.js';

const router = express.Router();

router.post(
  '/',
  authMiddleware,
  validateRequest(bookmarkBodySchema, 'body'),
  createBookmark
);

router.delete(
  '/:bookmarkId',
  authMiddleware,
  validateRequest(bookmarkBodySchema, 'body'),
  deleteBookmark
);

router.get(
  '/',
  authMiddleware,
  validateRequest(bookmarkQuerySchema, 'query'),
  getBookmarks
);

export default router;
