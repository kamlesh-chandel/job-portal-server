import express from 'express';
import {
  updateProfile,
  updateProfilePhoto,
} from '../controllers/user.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import { updateProfileSchema } from '../validators/user.validator.js';
import { upload } from '../middlewares/upload.middleware.js';

const router = express.Router();

router.put(
  '/update',
  authMiddleware,
  upload.single('resume'),
  validateRequest(updateProfileSchema),
  updateProfile
);

router.put(
  '/update-photo',
  authMiddleware,
  upload.single('profile'),
  updateProfilePhoto
);

export default router;
