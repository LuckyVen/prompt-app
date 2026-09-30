import {
  randomUUID,
} from "node:crypto";

import jwt from "jsonwebtoken";

export interface AuthTokenPayload {
  userId: string;
  email: string;
}

/*
 * ===============================================
 * JWT CONFIGURATION
 * ===============================================
 */

const JWT_ALGORITHM =
  "HS256" as const;

const DEFAULT_JWT_EXPIRES_IN =
  "1d";

const DEFAULT_JWT_ISSUER =
  "prompt-api";

const DEFAULT_JWT_AUDIENCE =
  "prompt-web";

const MIN_JWT_SECRET_BYTES =
  32;

/*
 * ===============================================
 * ENVIRONMENT HELPERS
 * ===============================================
 */

function getJwtSecret(): string {
  const secret =
    process.env.JWT_SECRET
      ?.trim();

  if (!secret) {
    throw new Error(
      "JWT_SECRET is not configured.",
    );
  }

  const secretLength =
    Buffer.byteLength(
      secret,
      "utf8",
    );

  if (
    secretLength <
    MIN_JWT_SECRET_BYTES
  ) {
    throw new Error(
      `JWT_SECRET must contain at least ${MIN_JWT_SECRET_BYTES} bytes.`,
    );
  }

  return secret;
}

function getJwtExpiresIn():
  jwt.SignOptions["expiresIn"] {
  const expiresIn =
    process.env.JWT_EXPIRES_IN
      ?.trim();

  if (!expiresIn) {
    return DEFAULT_JWT_EXPIRES_IN;
  }

  return expiresIn as
    jwt.SignOptions["expiresIn"];
}

function getJwtIssuer(): string {
  return (
    process.env.JWT_ISSUER
      ?.trim() ||
    DEFAULT_JWT_ISSUER
  );
}

function getJwtAudience(): string {
  return (
    process.env.JWT_AUDIENCE
      ?.trim() ||
    DEFAULT_JWT_AUDIENCE
  );
}

/*
 * ===============================================
 * CONFIGURATION VALIDATION
 * ===============================================
 *
 * Called during server startup so a bad JWT
 * configuration fails immediately instead of
 * failing only when someone tries to log in.
 */

export function validateAuthConfiguration():
  void {
  getJwtSecret();
  getJwtExpiresIn();
  getJwtIssuer();
  getJwtAudience();
}

/*
 * ===============================================
 * CREATE JWT
 * ===============================================
 */

export function createAuthToken(
  payload: AuthTokenPayload,
): string {
  return jwt.sign(
    {
      email:
        payload.email,
    },
    getJwtSecret(),
    {
      algorithm:
        JWT_ALGORITHM,

      expiresIn:
        getJwtExpiresIn(),

      issuer:
        getJwtIssuer(),

      audience:
        getJwtAudience(),

      subject:
        payload.userId,

      jwtid:
        randomUUID(),
    },
  );
}

/*
 * ===============================================
 * VERIFY JWT
 * ===============================================
 */

export function verifyAuthToken(
  token: string,
): AuthTokenPayload {
  const decoded =
    jwt.verify(
      token,
      getJwtSecret(),
      {
        algorithms: [
          JWT_ALGORITHM,
        ],

        issuer:
          getJwtIssuer(),

        audience:
          getJwtAudience(),

        /*
         * Small tolerance for clocks that differ
         * by a few seconds.
         */

        clockTolerance:
          5,
      },
    );

  if (
    typeof decoded ===
      "string" ||
    typeof decoded.sub !==
      "string" ||
    typeof decoded.email !==
      "string"
  ) {
    throw new Error(
      "Invalid authentication token.",
    );
  }

  return {
    userId:
      decoded.sub,

    email:
      decoded.email,
  };
}