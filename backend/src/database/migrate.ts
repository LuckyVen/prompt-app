import "dotenv/config";

import {
  readdir,
  readFile,
} from "node:fs/promises";

import {
  join,
} from "node:path";

import {
  db,
  testDatabaseConnection,
} from "./db.js";

const migrationsDirectory =
  join(
    process.cwd(),
    "src",
    "database",
    "migrations",
  );

async function ensureMigrationTable(): Promise<void> {
  await db.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
}

async function getMigrationFiles(): Promise<string[]> {
  const files =
    await readdir(
      migrationsDirectory,
    );

  return files
    .filter((file) =>
      file.endsWith(".sql"),
    )
    .sort();
}

async function hasMigrationRun(
  name: string,
): Promise<boolean> {
  const result =
    await db.query(
      `
        SELECT 1
        FROM schema_migrations
        WHERE name = $1
        LIMIT 1;
      `,
      [name],
    );

  return (
    result.rowCount !== null &&
    result.rowCount > 0
  );
}

async function applyMigration(
  name: string,
): Promise<void> {
  const migrationPath =
    join(
      migrationsDirectory,
      name,
    );

  const sql =
    await readFile(
      migrationPath,
      "utf8",
    );

  const client =
    await db.connect();

  try {
    await client.query("BEGIN");

    await client.query(sql);

    await client.query(
      `
        INSERT INTO schema_migrations (name)
        VALUES ($1);
      `,
      [name],
    );

    await client.query("COMMIT");

    console.log(
      `Applied migration: ${name}`,
    );
  } catch (error) {
    await client.query(
      "ROLLBACK",
    );

    throw error;
  } finally {
    client.release();
  }
}

async function migrate(): Promise<void> {
  try {
    await testDatabaseConnection();

    await ensureMigrationTable();

    const migrationFiles =
      await getMigrationFiles();

    for (
      const migrationFile
      of migrationFiles
    ) {
      const alreadyApplied =
        await hasMigrationRun(
          migrationFile,
        );

      if (alreadyApplied) {
        console.log(
          `Skipped migration: ${migrationFile}`,
        );

        continue;
      }

      await applyMigration(
        migrationFile,
      );
    }

    console.log(
      "Database migrations complete.",
    );
  } catch (error) {
    console.error(
      "Database migration failed:",
      error,
    );

    process.exitCode = 1;
  } finally {
    await db.end();
  }
}

void migrate();