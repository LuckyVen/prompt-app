import {
  Router,
} from "express";

import {
  createSavedPromptController,
  deleteSavedPromptController,
  getSavedPrompt,
  listFavoritePrompts,
  listSavedPrompts,
  toggleFavoriteSavedPrompt,
  updateSavedPromptController,
} from "../controllers/savedPromptController.js";

import {
  requireAuth,
} from "../middleware/authMiddleware.js";

const savedPromptRouter =
  Router();

/*
 * ===============================================
 * EVERY ROUTE BELOW REQUIRES LOGIN
 * ===============================================
 */

savedPromptRouter.use(
  requireAuth,
);

/*
 * ===============================================
 * GET ALL
 * ===============================================
 */

savedPromptRouter.get(
  "/",
  listSavedPrompts,
);

/*
 * ===============================================
 * GET FAVORITES
 * ===============================================
 *
 * Keep this BEFORE /:id so "favorites"
 * is treated as a route, not a prompt ID.
 */

savedPromptRouter.get(
  "/favorites",
  listFavoritePrompts,
);

/*
 * ===============================================
 * GET ONE
 * ===============================================
 */

savedPromptRouter.get(
  "/:id",
  getSavedPrompt,
);

/*
 * ===============================================
 * CREATE
 * ===============================================
 */

savedPromptRouter.post(
  "/",
  createSavedPromptController,
);

/*
 * ===============================================
 * UPDATE
 * ===============================================
 */

savedPromptRouter.patch(
  "/:id",
  updateSavedPromptController,
);

/*
 * ===============================================
 * TOGGLE FAVORITE
 * ===============================================
 */

savedPromptRouter.patch(
  "/:id/favorite",
  toggleFavoriteSavedPrompt,
);

/*
 * ===============================================
 * DELETE
 * ===============================================
 */

savedPromptRouter.delete(
  "/:id",
  deleteSavedPromptController,
);

export default savedPromptRouter;