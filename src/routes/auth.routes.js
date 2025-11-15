import express from "express";
import { register, login } from "../controllers/auth.controller.js";
import { validateRequest } from "../middlewares/validate.middleware.js";
import { loginSchema, registerSchema } from "../validators/auth.validator.js";

const router = express.Router();

router
  .route("/register")
  .post(validateRequest(registerSchema), register);

router
  .route("/login")
  .post(validateRequest(loginSchema), login);

export default router;
