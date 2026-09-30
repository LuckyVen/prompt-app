import type {
  NextFunction,
  Request,
  Response,
} from "express";

import {
  verifyAuthToken,
} from "../services/authService.js";

/*
 * Prevent extremely large Authorization headers
 * from being processed as JWTs.
 */

const MAX_AUTH_TOKEN_LENGTH =
  4_096;

export interface AuthenticatedRequest
  extends Request {
  auth?: {
    userId: string;
    email: string;
  };
}

export function requireAuth(
  request: AuthenticatedRequest,
  response: Response,
  next: NextFunction,
): void {
  const authorization =
    request.headers.authorization;

  if (!authorization) {
    response
      .status(401)
      .json({
        success: false,
        message:
          "Authentication required.",
      });

    return;
  }

  /*
   * Require exactly:
   *
   * Bearer <token>
   */

  const match =
    authorization.match(
      /^Bearer\s+([^\s]+)$/i,
    );

  if (!match) {
    response
      .status(401)
      .json({
        success: false,
        message:
          "Invalid authentication token.",
      });

    return;
  }

  const token =
    match[1];

  if (
    !token ||
    token.length >
      MAX_AUTH_TOKEN_LENGTH
  ) {
    response
      .status(401)
      .json({
        success: false,
        message:
          "Invalid authentication token.",
      });

    return;
  }

  try {
    const payload =
      verifyAuthToken(
        token,
      );

    request.auth = {
      userId:
        payload.userId,

      email:
        payload.email,
    };

    next();
  } catch {
    response
      .status(401)
      .json({
        success: false,
        message:
          "Invalid or expired authentication token.",
      });
  }
}