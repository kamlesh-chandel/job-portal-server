import express from 'express';
import { toggleBookmark } from '../controllers/bookmark.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/:job_id', authMiddleware, toggleBookmark);

export default router;