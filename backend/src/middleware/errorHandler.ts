import type {
  ErrorRequestHandler,
  Request,
  Response,
} from "express";

import {
  AppError,
} from "../errors/AppError.js";

import {
  logger,
} from "../services/logger.js";

/*
 * ===============================================
 * HTTP ERROR-LIKE SHAPE
 * ===============================================
 */

interface HttpErrorLike {
  type?: string;
  status?: number;
  statusCode?: number;
  code?: string;
}

/*
 * ===============================================
 * HTTP ERROR HELPER
 * ===============================================
 */

function getHttpErrorProperties(
  error: unknown,
): HttpErrorLike {
  if (
    typeof error ===
      "object" &&
    error !== null
  ) {
    return error as
      HttpErrorLike;
  }

  return {};
}

/*
 * ===============================================
 * NOT FOUND HANDLER
 * ===============================================
 */

export function notFoundHandler(
  request: Request,
  response: Response,
): void {
  response
    .status(404)
    .json({
      success: false,
      code:
        "ROUTE_NOT_FOUND",
      message:
        `Route ${request.method} ${request.originalUrl} was not found.`,
    });
}

/*
 * ===============================================
 * CENTRAL ERROR HANDLER
 * ===============================================
 */

export const errorHandler:
  ErrorRequestHandler =
(
  error,
  request,
  response,
  next,
): void => {
  /*
   * =============================================
   * RESPONSE ALREADY STARTED
   * =============================================
   */

  if (
    response.headersSent
  ) {
    next(
      error,
    );

    return;
  }

  /*
   * =============================================
   * HTTP ERROR PROPERTIES
   * =============================================
   */

  const httpError =
    getHttpErrorProperties(
      error,
    );

  /*
   * =============================================
   * INVALID JSON
   * =============================================
   */

  if (
    error instanceof
      SyntaxError &&
    httpError.type ===
      "entity.parse.failed"
  ) {
    response
      .status(400)
      .json({
        success: false,
        code:
          "INVALID_JSON",
        message:
          "Request body contains invalid JSON.",
      });

    return;
  }

  /*
   * =============================================
   * REQUEST BODY TOO LARGE
   * =============================================
   */

  if (
    httpError.type ===
      "entity.too.large" ||
    httpError.status ===
      413 ||
    httpError.statusCode ===
      413
  ) {
    response
      .status(413)
      .json({
        success: false,
        code:
          "PAYLOAD_TOO_LARGE",
        message:
          "Request body is too large.",
      });

    return;
  }

  /*
   * =============================================
   * KNOWN APPLICATION ERROR
   * =============================================
   */

  if (
    error instanceof
    AppError
  ) {
    response
      .status(
        error.statusCode,
      )
      .json({
        success: false,

        ...(error.code
          ? {
              code:
                error.code,
            }
          : {}),

        message:
          error.message,
      });

    return;
  }

  /*
   * =============================================
   * UNEXPECTED ERROR
   * =============================================
   *
   * pino-http already adds request.id.
   *
   * No custom RequestWithId interface is needed.
   */

  logger.error(
    {
      err:
        error,

      requestId:
        request.id,

      method:
        request.method,

      path:
        request.path,
    },
    "Unhandled API error",
  );

  response
    .status(500)
    .json({
      success: false,
      code:
        "INTERNAL_SERVER_ERROR",
      message:
        "An unexpected server error occurred.",
    });
};