import {
  rateLimit,
} from "express-rate-limit";

/*
 * ===============================================
 * GENERAL API RATE LIMITER
 * ===============================================
 *
 * Applies to the entire /api route.
 *
 * 300 requests per 15 minutes per client.
 */

export const apiRateLimiter =
  rateLimit({
    windowMs:
      15 * 60 * 1000,

    limit:
      300,

    standardHeaders:
      true,

    legacyHeaders:
      false,

    message: {
      success: false,
      message:
        "Too many requests. Please try again later.",
    },
  });

/*
 * ===============================================
 * AUTH RATE LIMITER
 * ===============================================
 *
 * Used only for:
 *
 * POST /api/auth/register
 * POST /api/auth/login
 *
 * We intentionally do NOT apply this strict
 * limiter to GET /api/auth/me because the
 * frontend uses /me to restore authentication
 * after refresh.
 */

export const authRateLimiter =
  rateLimit({
    windowMs:
      15 * 60 * 1000,

    limit:
      20,

    standardHeaders:
      true,

    legacyHeaders:
      false,

    message: {
      success: false,
      message:
        "Too many authentication attempts. Please try again later.",
    },
  });

/*
 * ===============================================
 * AI RATE LIMITER
 * ===============================================
 *
 * AI endpoints receive a smaller limit because
 * these requests can consume external API usage.
 */

export const aiRateLimiter =
  rateLimit({
    windowMs:
      10 * 60 * 1000,

    limit:
      30,

    standardHeaders:
      true,

    legacyHeaders:
      false,

    message: {
      success: false,
      message:
        "AI service is receiving too many requests. Please try again shortly.",
    },
  });