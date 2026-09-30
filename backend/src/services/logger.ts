import pino from "pino";

/*
 * ===============================================
 * LOG LEVEL
 * ===============================================
 */

const VALID_LOG_LEVELS =
  new Set([
    "fatal",
    "error",
    "warn",
    "info",
    "debug",
    "trace",
    "silent",
  ]);

function getLogLevel(): string {
  const defaultLevel =
    process.env.NODE_ENV ===
    "production"
      ? "info"
      : "debug";

  const configuredLevel =
    process.env.LOG_LEVEL
      ?.trim()
      .toLowerCase();

  if (!configuredLevel) {
    return defaultLevel;
  }

  if (
    !VALID_LOG_LEVELS.has(
      configuredLevel,
    )
  ) {
    throw new Error(
      `Invalid LOG_LEVEL: ${configuredLevel}`,
    );
  }

  return configuredLevel;
}

/*
 * ===============================================
 * LOGGER
 * ===============================================
 */

export const logger =
  pino({
    level:
      getLogLevel(),

    /*
     * ISO timestamp instead of numeric Unix time.
     */

    timestamp:
      pino.stdTimeFunctions
        .isoTime,

    /*
     * Information attached to every log.
     */

    base: {
      service:
        "prompt-api",

      environment:
        process.env.NODE_ENV ??
        "development",
    },

    /*
     * =============================================
     * SECRET REDACTION
     * =============================================
     *
     * Even if one of these values accidentally
     * enters a log object, Pino hides it.
     */

    redact: {
      paths: [
        "req.headers.authorization",
        "request.headers.authorization",

        "req.headers.cookie",
        "request.headers.cookie",

        "authorization",
        "*.authorization",

        "password",
        "*.password",

        "token",
        "*.token",

        "accessToken",
        "*.accessToken",

        "refreshToken",
        "*.refreshToken",

        "JWT_SECRET",
        "*.JWT_SECRET",

        "DATABASE_URL",
        "*.DATABASE_URL",

        "OPENAI_API_KEY",
        "*.OPENAI_API_KEY",
      ],

      censor:
        "[REDACTED]",
    },

    /*
     * Serialize Error objects correctly.
     */

    serializers: {
      err:
        pino.stdSerializers.err,

      error:
        pino.stdSerializers.err,
    },
  });