import pg from "pg";

import {
  logger,
} from "../services/logger.js";

const {
  Pool,
} = pg;

function readBooleanEnvironment(
  name: string,
  fallback: boolean,
): boolean {
  const rawValue =
    process.env[name]
      ?.trim()
      .toLowerCase();

  if (!rawValue) {
    return fallback;
  }

  if (
    [
      "true",
      "1",
      "yes",
      "on",
    ].includes(
      rawValue,
    )
  ) {
    return true;
  }

  if (
    [
      "false",
      "0",
      "no",
      "off",
    ].includes(
      rawValue,
    )
  ) {
    return false;
  }

  throw new Error(
    `${name} must be true or false.`,
  );
}

function readIntegerEnvironment(
  name: string,
  fallback: number,
  minimum: number,
  maximum: number,
): number {
  const rawValue =
    process.env[name]
      ?.trim();

  if (!rawValue) {
    return fallback;
  }

  const parsedValue =
    Number.parseInt(
      rawValue,
      10,
    );

  if (
    !Number.isInteger(
      parsedValue,
    ) ||
    parsedValue <
      minimum ||
    parsedValue >
      maximum
  ) {
    throw new Error(
      `${name} must be an integer between ${minimum} and ${maximum}.`,
    );
  }

  return parsedValue;
}

const databaseUrl =
  process.env.DATABASE_URL
    ?.trim();

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL is not configured.",
  );
}

const sslEnabled =
  readBooleanEnvironment(
    "DATABASE_SSL",
    false,
  );

const rejectUnauthorized =
  readBooleanEnvironment(
    "DATABASE_SSL_REJECT_UNAUTHORIZED",
    true,
  );

const poolMax =
  readIntegerEnvironment(
    "DATABASE_POOL_MAX",
    10,
    1,
    50,
  );

const idleTimeoutMillis =
  readIntegerEnvironment(
    "DATABASE_IDLE_TIMEOUT_MS",
    30_000,
    1_000,
    600_000,
  );

const connectionTimeoutMillis =
  readIntegerEnvironment(
    "DATABASE_CONNECTION_TIMEOUT_MS",
    10_000,
    1_000,
    60_000,
  );

export const db =
  new Pool({
    connectionString:
      databaseUrl,

    max:
      poolMax,

    idleTimeoutMillis,

    connectionTimeoutMillis,

    ssl:
      sslEnabled
        ? {
            rejectUnauthorized,
          }
        : undefined,

    application_name:
      "prompt-api",
  });

db.on(
  "error",
  (
    error,
  ) => {
    logger.error(
      {
        err:
          error,
      },
      "Unexpected PostgreSQL pool error",
    );
  },
);

export async function testDatabaseConnection():
  Promise<void> {
  const client =
    await db.connect();

  try {
    await client.query(
      "SELECT 1",
    );

    logger.info(
      "PostgreSQL database connected",
    );
  } finally {
    client.release();
  }
}