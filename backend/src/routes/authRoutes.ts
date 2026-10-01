import {
  Router,
} from "express";

import {
  getCurrentUser,
  login,
  register,
} from "../controllers/authController.js";

import {
  requestPasswordReset,
  resetPassword,
} from "../controllers/passwordResetController.js";

import {
  requireAuth,
} from "../middleware/authMiddleware.js";

const authRouter =
  Router();

authRouter.post(
  "/register",
  register,
);

authRouter.post(
  "/login",
  login,
);

authRouter.post(
  "/forgot-password",
  requestPasswordReset,
);

authRouter.post(
  "/reset-password",
  resetPassword,
);

authRouter.get(
  "/me",
  requireAuth,
  getCurrentUser,
);

export default authRouter;