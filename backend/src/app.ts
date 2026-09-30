import cors from "cors";
import express from "express";
import helmet from "helmet";

import {
  errorHandler,
  notFoundHandler,
} from "./middleware/errorHandler.js";

import {
  apiRateLimiter,
} from "./middleware/rateLimiters.js";

import {
  rejectUnsafeObjectKeys,
} from "./middleware/requestSecurity.js";

import {
  requestLogger,
} from "./middleware/requestLogger.js";

import authRouter from "./routes/authRoutes.js";

import promptRouter from "./routes/promptRoutes.js";

import savedPromptRouter from "./routes/savedPromptRoutes.js";

const app =
  express();

/*
 * ===============================================
 * BASIC SECURITY
 * ===============================================
 */

app.disable(
  "x-powered-by",
);

/*
 * ===============================================
 * REQUEST LOGGING
 * ===============================================
 *
 * Place early so almost every HTTP request is
 * recorded, including errors and unknown routes.
 */

app.use(
  requestLogger,
);

/*
 * ===============================================
 * SECURITY HEADERS
 * ===============================================
 */

app.use(
  helmet(),
);

/*
 * ===============================================
 * ALLOWED FRONTEND ORIGINS
 * ===============================================
 */

const allowedOrigins =
  new Set(
    (
      process.env.FRONTEND_URL ??
      "http://localhost:5173"
    )
      .split(",")
      .map(
        (origin) =>
          origin.trim(),
      )
      .filter(Boolean),
  );

/*
 * ===============================================
 * CORS
 * ===============================================
 */

app.use(
  cors({
    origin: (
      origin,
      callback,
    ) => {
      if (!origin) {
        callback(
          null,
          true,
        );

        return;
      }

      if (
        allowedOrigins.has(
          origin,
        )
      ) {
        callback(
          null,
          true,
        );

        return;
      }

      callback(
        null,
        false,
      );
    },

    methods: [
      "GET",
      "POST",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Request-ID",
    ],

    exposedHeaders: [
      "X-Request-ID",
    ],
  }),
);

/*
 * ===============================================
 * JSON BODY PARSER
 * ===============================================
 */

app.use(
  express.json({
    limit:
      "1mb",
  }),
);

/*
 * ===============================================
 * REQUEST SECURITY
 * ===============================================
 */

app.use(
  rejectUnsafeObjectKeys,
);

/*
 * ===============================================
 * GLOBAL API RATE LIMIT
 * ===============================================
 */

app.use(
  "/api",
  apiRateLimiter,
);

/*
 * ===============================================
 * HEALTH CHECK
 * ===============================================
 */

app.get(
  "/api/health",
  (
    _request,
    response,
  ) => {
    response
      .status(200)
      .json({
        success: true,
        message:
          "PROMPT. API is running.",
      });
  },
);

/*
 * ===============================================
 * AUTH
 * ===============================================
 */

app.use(
  "/api/auth",
  authRouter,
);

/*
 * ===============================================
 * AI PROMPTS
 * ===============================================
 */

app.use(
  "/api/prompts",
  promptRouter,
);

/*
 * ===============================================
 * SAVED PROMPTS
 * ===============================================
 */

app.use(
  "/api/saved-prompts",
  savedPromptRouter,
);

/*
 * ===============================================
 * 404
 * ===============================================
 */

app.use(
  notFoundHandler,
);

/*
 * ===============================================
 * CENTRAL ERROR HANDLER
 * ===============================================
 */

app.use(
  errorHandler,
);

export default app;