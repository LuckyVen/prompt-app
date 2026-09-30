import {
  db,
} from "../database/db.js";

import type {
  CreateSavedPromptInput,
  SavedPrompt,
  UpdateSavedPromptInput,
} from "../types/savedPrompt.js";

/*
 * ===============================================
 * GET ALL SAVED PROMPTS FOR USER
 * ===============================================
 */

export async function getSavedPromptsByUser(
  userId: string,
): Promise<SavedPrompt[]> {
  const result =
    await db.query<SavedPrompt>(
      `
        SELECT
          id,
          user_id,
          title,
          content,
          category,
          is_favorite,
          created_at,
          updated_at
        FROM saved_prompts
        WHERE user_id = $1
        ORDER BY created_at DESC;
      `,
      [
        userId,
      ],
    );

  return result.rows;
}

/*
 * ===============================================
 * GET FAVORITE PROMPTS FOR USER
 * ===============================================
 */

export async function getFavoritePromptsByUser(
  userId: string,
): Promise<SavedPrompt[]> {
  const result =
    await db.query<SavedPrompt>(
      `
        SELECT
          id,
          user_id,
          title,
          content,
          category,
          is_favorite,
          created_at,
          updated_at
        FROM saved_prompts
        WHERE
          user_id = $1
          AND is_favorite = TRUE
        ORDER BY created_at DESC;
      `,
      [
        userId,
      ],
    );

  return result.rows;
}

/*
 * ===============================================
 * GET ONE SAVED PROMPT
 * ===============================================
 *
 * IMPORTANT:
 * Always filter by BOTH prompt ID and user ID.
 *
 * This prevents one user from reading another
 * user's prompt simply by knowing its UUID.
 */

export async function getSavedPromptById(
  promptId: string,
  userId: string,
): Promise<SavedPrompt | null> {
  const result =
    await db.query<SavedPrompt>(
      `
        SELECT
          id,
          user_id,
          title,
          content,
          category,
          is_favorite,
          created_at,
          updated_at
        FROM saved_prompts
        WHERE
          id = $1
          AND user_id = $2
        LIMIT 1;
      `,
      [
        promptId,
        userId,
      ],
    );

  return (
    result.rows[0] ??
    null
  );
}

/*
 * ===============================================
 * CREATE SAVED PROMPT
 * ===============================================
 */

export async function createSavedPrompt(
  input: CreateSavedPromptInput,
): Promise<SavedPrompt> {
  const result =
    await db.query<SavedPrompt>(
      `
        INSERT INTO saved_prompts (
          id,
          user_id,
          title,
          content,
          category,
          is_favorite
        )
        VALUES (
          $1,
          $2,
          $3,
          $4,
          $5,
          $6
        )
        RETURNING
          id,
          user_id,
          title,
          content,
          category,
          is_favorite,
          created_at,
          updated_at;
      `,
      [
        input.id,
        input.userId,
        input.title,
        input.content,
        input.category,
        input.isFavorite ?? false,
      ],
    );

  const savedPrompt =
    result.rows[0];

  if (!savedPrompt) {
    throw new Error(
      "Saved prompt was not returned after creation.",
    );
  }

  return savedPrompt;
}

/*
 * ===============================================
 * UPDATE SAVED PROMPT
 * ===============================================
 */

export async function updateSavedPrompt(
  promptId: string,
  userId: string,
  input: UpdateSavedPromptInput,
): Promise<SavedPrompt | null> {
  const currentPrompt =
    await getSavedPromptById(
      promptId,
      userId,
    );

  if (!currentPrompt) {
    return null;
  }

  const title =
    input.title ??
    currentPrompt.title;

  const content =
    input.content ??
    currentPrompt.content;

  const category =
    input.category ??
    currentPrompt.category;

  const isFavorite =
    input.isFavorite ??
    currentPrompt.is_favorite;

  const result =
    await db.query<SavedPrompt>(
      `
        UPDATE saved_prompts
        SET
          title = $1,
          content = $2,
          category = $3,
          is_favorite = $4,
          updated_at = NOW()
        WHERE
          id = $5
          AND user_id = $6
        RETURNING
          id,
          user_id,
          title,
          content,
          category,
          is_favorite,
          created_at,
          updated_at;
      `,
      [
        title,
        content,
        category,
        isFavorite,
        promptId,
        userId,
      ],
    );

  return (
    result.rows[0] ??
    null
  );
}

/*
 * ===============================================
 * TOGGLE FAVORITE
 * ===============================================
 */

export async function toggleSavedPromptFavorite(
  promptId: string,
  userId: string,
): Promise<SavedPrompt | null> {
  const result =
    await db.query<SavedPrompt>(
      `
        UPDATE saved_prompts
        SET
          is_favorite = NOT is_favorite,
          updated_at = NOW()
        WHERE
          id = $1
          AND user_id = $2
        RETURNING
          id,
          user_id,
          title,
          content,
          category,
          is_favorite,
          created_at,
          updated_at;
      `,
      [
        promptId,
        userId,
      ],
    );

  return (
    result.rows[0] ??
    null
  );
}

/*
 * ===============================================
 * DELETE SAVED PROMPT
 * ===============================================
 */

export async function deleteSavedPrompt(
  promptId: string,
  userId: string,
): Promise<boolean> {
  const result =
    await db.query(
      `
        DELETE FROM saved_prompts
        WHERE
          id = $1
          AND user_id = $2;
      `,
      [
        promptId,
        userId,
      ],
    );

  return (
    result.rowCount !== null &&
    result.rowCount > 0
  );
}