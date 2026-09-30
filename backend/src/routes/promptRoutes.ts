import {
  Router,
} from "express";

import {
  generatePrompt,
  generateQuestions,
  improvePrompt,
} from "../controllers/promptController.js";

import {
  validateGeneratePrompt,
  validateGenerateQuestions,
  validateImprovePrompt,
} from "../middleware/promptValidation.js";

import {
  aiRateLimiter,
} from "../middleware/rateLimiters.js";

const promptRouter =
  Router();

/*
 * ===============================================
 * AI RATE LIMIT
 * ===============================================
 *
 * Every route in this router is an AI-related
 * endpoint, so one limiter can protect all of
 * them.
 */

promptRouter.use(
  aiRateLimiter,
);

/*
 * ===============================================
 * GENERATE ADAPTIVE QUESTIONS
 * ===============================================
 */

promptRouter.post(
  "/questions",
  validateGenerateQuestions,
  generateQuestions,
);

/*
 * ===============================================
 * GENERATE PROMPT
 * ===============================================
 */

promptRouter.post(
  "/generate",
  validateGeneratePrompt,
  generatePrompt,
);

/*
 * ===============================================
 * IMPROVE PROMPT
 * ===============================================
 */

promptRouter.post(
  "/improve",
  validateImprovePrompt,
  improvePrompt,
);

export default promptRouter;