import "dotenv/config";

import type {
  Server,
} from "node:http";

import app from "./app.js";

import {
  db,
  testDatabaseConnection,
} from "./database/db.js";

import {
  logger,
} from "./services/logger.js";

import {
  validateAuthConfiguration,
} from "./services/authService.js";

const PORT =
  Number(
    process.env.PORT,
  ) || 5000;

let server:
  Server | undefined;

let isShuttingDown =
  false;

async function startServer():
  Promise<void> {
  try {
    validateAuthConfiguration();

    await testDatabaseConnection();

    server =
      app.listen(
        PORT,
        () => {
          logger.info(
            {
              port:
                PORT,
            },
            "PROMPT. API started",
          );
        },
      );
  } catch (error) {
    logger.fatal(
      {
        err:
          error,
      },
      "Failed to start PROMPT. API",
    );

    await db
      .end()
      .catch(() => {
        // Ignore cleanup failure.
      });

    process.exit(1);
  }
}

async function shutdown(
  signal: string,
): Promise<void> {
  if (
    isShuttingDown
  ) {
    return;
  }

  isShuttingDown =
    true;

  logger.info(
    {
      signal,
    },
    "Shutdown signal received",
  );

  const forceShutdownTimer =
    setTimeout(
      () => {
        logger.fatal(
          "Graceful shutdown timed out",
        );

        process.exit(1);
      },
      10_000,
    );

  forceShutdownTimer.unref();

  try {
    if (server) {
      await new Promise<void>(
        (
          resolve,
          reject,
        ) => {
          server?.close(
            (
              error,
            ) => {
              if (error) {
                reject(
                  error,
                );

                return;
              }

              resolve();
            },
          );
        },
      );
    }

    await db.end();

    clearTimeout(
      forceShutdownTimer,
    );

    logger.info(
      "PROMPT. API shut down successfully",
    );

    process.exit(0);
  } catch (error) {
    clearTimeout(
      forceShutdownTimer,
    );

    logger.error(
      {
        err:
          error,
      },
      "Error during graceful shutdown",
    );

    process.exit(1);
  }
}

process.on(
  "SIGTERM",
  () => {
    void shutdown(
      "SIGTERM",
    );
  },
);

process.on(
  "SIGINT",
  () => {
    void shutdown(
      "SIGINT",
    );
  },
);

void startServer();