import {
  Router,
} from "express";

import {
  getCurrentUser,
  login,
  register,
} from "../controllers/authController.js";

import {
  requireAuth,
} from "../middleware/authMiddleware.js";

import {
  authRateLimiter,
} from "../middleware/rateLimiters.js";

import {
  validateLogin,
  validateRegister,
} from "../middleware/authValidation.js";

const authRouter =
  Router();

/*
 * ===============================================
 * REGISTER
 * ===============================================
 */

authRouter.post(
  "/register",
  authRateLimiter,
  validateRegister,
  register,
);

/*
 * ===============================================
 * LOGIN
 * ===============================================
 */

authRouter.post(
  "/login",
  authRateLimiter,
  validateLogin,
  login,
);

/*
 * ===============================================
 * CURRENT USER
 * ===============================================
 */

authRouter.get(
  "/me",
  requireAuth,
  getCurrentUser,
);

export default authRouter;