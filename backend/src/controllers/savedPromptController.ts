import type {
  Request,
  Response,
} from "express";

import type {
  AuthenticatedRequest,
} from "../middleware/authMiddleware.js";

import {
  createSavedPrompt,
  deleteSavedPrompt,
  getFavoritePromptsByUser,
  getSavedPromptById,
  getSavedPromptsByUser,
  toggleSavedPromptFavorite,
  updateSavedPrompt,
} from "../repositories/savedPromptRepository.js";

import type {
  SavedPrompt,
} from "../types/savedPrompt.js";

/*
 * ===============================================
 * VALID CATEGORIES
 * ===============================================
 */

const VALID_CATEGORIES = [
  "build",
  "create",
  "write",
  "learn",
  "research",
  "fix",
  "general",
] as const;

type ValidCategory =
  (typeof VALID_CATEGORIES)[number];

/*
 * ===============================================
 * UUID VALIDATION
 * ===============================================
 */

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isValidUuid(
  value: unknown,
): value is string {
  return (
    typeof value === "string" &&
    UUID_PATTERN.test(value)
  );
}

/*
 * ===============================================
 * CATEGORY VALIDATION
 * ===============================================
 */

function isValidCategory(
  value: unknown,
): value is ValidCategory {
  return (
    typeof value === "string" &&
    VALID_CATEGORIES.includes(
      value as ValidCategory,
    )
  );
}

/*
 * ===============================================
 * GET AUTHENTICATED USER ID
 * ===============================================
 */

function getAuthenticatedUserId(
  request: Request,
): string | null {
  const authenticatedRequest =
    request as AuthenticatedRequest;

  return (
    authenticatedRequest.auth?.userId ??
    null
  );
}

/*
 * ===============================================
 * API RESPONSE MAPPER
 * ===============================================
 *
 * PostgreSQL uses snake_case.
 * Frontend uses camelCase.
 */

function mapSavedPrompt(
  prompt: SavedPrompt,
) {
  return {
    id: prompt.id,
    title: prompt.title,
    content: prompt.content,
    category: prompt.category,
    isFavorite:
      prompt.is_favorite,
    createdAt:
      prompt.created_at,
    updatedAt:
      prompt.updated_at,
  };
}

/*
 * ===============================================
 * GET ALL SAVED PROMPTS
 * ===============================================
 */

export async function listSavedPrompts(
  request: Request,
  response: Response,
): Promise<void> {
  const userId =
    getAuthenticatedUserId(
      request,
    );

  if (!userId) {
    response.status(401).json({
      success: false,
      message:
        "Authentication required.",
    });

    return;
  }

  try {
    const prompts =
      await getSavedPromptsByUser(
        userId,
      );

    response.status(200).json({
      success: true,
      prompts:
        prompts.map(
          mapSavedPrompt,
        ),
    });
  } catch (error) {
    console.error(
      "Unable to load saved prompts:",
      error,
    );

    response.status(500).json({
      success: false,
      message:
        "Unable to load saved prompts.",
    });
  }
}

/*
 * ===============================================
 * GET FAVORITE PROMPTS
 * ===============================================
 */

export async function listFavoritePrompts(
  request: Request,
  response: Response,
): Promise<void> {
  const userId =
    getAuthenticatedUserId(
      request,
    );

  if (!userId) {
    response.status(401).json({
      success: false,
      message:
        "Authentication required.",
    });

    return;
  }

  try {
    const prompts =
      await getFavoritePromptsByUser(
        userId,
      );

    response.status(200).json({
      success: true,
      prompts:
        prompts.map(
          mapSavedPrompt,
        ),
    });
  } catch (error) {
    console.error(
      "Unable to load favorite prompts:",
      error,
    );

    response.status(500).json({
      success: false,
      message:
        "Unable to load favorite prompts.",
    });
  }
}

/*
 * ===============================================
 * GET ONE SAVED PROMPT
 * ===============================================
 */

export async function getSavedPrompt(
  request: Request,
  response: Response,
): Promise<void> {
  const userId =
    getAuthenticatedUserId(
      request,
    );

  if (!userId) {
    response.status(401).json({
      success: false,
      message:
        "Authentication required.",
    });

    return;
  }

  const {
    id,
  } = request.params;

  if (!isValidUuid(id)) {
    response.status(400).json({
      success: false,
      message:
        "Invalid prompt ID.",
    });

    return;
  }

  try {
    const prompt =
      await getSavedPromptById(
        id,
        userId,
      );

    if (!prompt) {
      response.status(404).json({
        success: false,
        message:
          "Saved prompt not found.",
      });

      return;
    }

    response.status(200).json({
      success: true,
      prompt:
        mapSavedPrompt(
          prompt,
        ),
    });
  } catch (error) {
    console.error(
      "Unable to load saved prompt:",
      error,
    );

    response.status(500).json({
      success: false,
      message:
        "Unable to load saved prompt.",
    });
  }
}

/*
 * ===============================================
 * CREATE SAVED PROMPT
 * ===============================================
 */

export async function createSavedPromptController(
  request: Request,
  response: Response,
): Promise<void> {
  const userId =
    getAuthenticatedUserId(
      request,
    );

  if (!userId) {
    response.status(401).json({
      success: false,
      message:
        "Authentication required.",
    });

    return;
  }

  const body =
    request.body as
      | {
          id?: unknown;
          title?: unknown;
          content?: unknown;
          category?: unknown;
          isFavorite?: unknown;
        }
      | undefined;

  if (!body) {
    response.status(400).json({
      success: false,
      message:
        "Request body is required.",
    });

    return;
  }

  const {
    id,
    title,
    content,
    category,
    isFavorite,
  } = body;

  if (!isValidUuid(id)) {
    response.status(400).json({
      success: false,
      message:
        "A valid prompt ID is required.",
    });

    return;
  }

  if (
    typeof title !== "string" ||
    title.trim().length === 0 ||
    title.trim().length > 255
  ) {
    response.status(400).json({
      success: false,
      message:
        "Prompt title must contain between 1 and 255 characters.",
    });

    return;
  }

  if (
    typeof content !== "string" ||
    content.trim().length === 0
  ) {
    response.status(400).json({
      success: false,
      message:
        "Prompt content is required.",
    });

    return;
  }

  if (!isValidCategory(category)) {
    response.status(400).json({
      success: false,
      message:
        "A valid prompt category is required.",
    });

    return;
  }

  if (
    isFavorite !== undefined &&
    typeof isFavorite !== "boolean"
  ) {
    response.status(400).json({
      success: false,
      message:
        "isFavorite must be a boolean.",
    });

    return;
  }

  try {
    const prompt =
      await createSavedPrompt({
        id,
        userId,
        title:
          title.trim(),
        content:
          content.trim(),
        category,
        isFavorite:
          isFavorite ?? false,
      });

    response.status(201).json({
      success: true,
      message:
        "Prompt saved successfully.",
      prompt:
        mapSavedPrompt(
          prompt,
        ),
    });
  } catch (error) {
    const databaseError =
      error as {
        code?: string;
      };

    /*
     * PostgreSQL unique violation.
     */
    if (
      databaseError.code ===
      "23505"
    ) {
      response.status(409).json({
        success: false,
        message:
          "This prompt has already been saved.",
      });

      return;
    }

    console.error(
      "Unable to save prompt:",
      error,
    );

    response.status(500).json({
      success: false,
      message:
        "Unable to save prompt.",
    });
  }
}

/*
 * ===============================================
 * UPDATE SAVED PROMPT
 * ===============================================
 */

export async function updateSavedPromptController(
  request: Request,
  response: Response,
): Promise<void> {
  const userId =
    getAuthenticatedUserId(
      request,
    );

  if (!userId) {
    response.status(401).json({
      success: false,
      message:
        "Authentication required.",
    });

    return;
  }

  const {
    id,
  } = request.params;

  if (!isValidUuid(id)) {
    response.status(400).json({
      success: false,
      message:
        "Invalid prompt ID.",
    });

    return;
  }

  const body =
    request.body as
      | {
          title?: unknown;
          content?: unknown;
          category?: unknown;
          isFavorite?: unknown;
        }
      | undefined;

  if (!body) {
    response.status(400).json({
      success: false,
      message:
        "Request body is required.",
    });

    return;
  }

  const {
    title,
    content,
    category,
    isFavorite,
  } = body;

  if (
    title === undefined &&
    content === undefined &&
    category === undefined &&
    isFavorite === undefined
  ) {
    response.status(400).json({
      success: false,
      message:
        "At least one field must be provided.",
    });

    return;
  }

  if (
    title !== undefined &&
    (
      typeof title !== "string" ||
      title.trim().length === 0 ||
      title.trim().length > 255
    )
  ) {
    response.status(400).json({
      success: false,
      message:
        "Prompt title must contain between 1 and 255 characters.",
    });

    return;
  }

  if (
    content !== undefined &&
    (
      typeof content !== "string" ||
      content.trim().length === 0
    )
  ) {
    response.status(400).json({
      success: false,
      message:
        "Prompt content cannot be empty.",
    });

    return;
  }

  if (
    category !== undefined &&
    !isValidCategory(category)
  ) {
    response.status(400).json({
      success: false,
      message:
        "A valid prompt category is required.",
    });

    return;
  }

  if (
    isFavorite !== undefined &&
    typeof isFavorite !== "boolean"
  ) {
    response.status(400).json({
      success: false,
      message:
        "isFavorite must be a boolean.",
    });

    return;
  }

  try {
    const prompt =
      await updateSavedPrompt(
        id,
        userId,
        {
          title:
            typeof title ===
            "string"
              ? title.trim()
              : undefined,

          content:
            typeof content ===
            "string"
              ? content.trim()
              : undefined,

          category:
            isValidCategory(
              category,
            )
              ? category
              : undefined,

          isFavorite:
            typeof isFavorite ===
            "boolean"
              ? isFavorite
              : undefined,
        },
      );

    if (!prompt) {
      response.status(404).json({
        success: false,
        message:
          "Saved prompt not found.",
      });

      return;
    }

    response.status(200).json({
      success: true,
      message:
        "Prompt updated successfully.",
      prompt:
        mapSavedPrompt(
          prompt,
        ),
    });
  } catch (error) {
    console.error(
      "Unable to update saved prompt:",
      error,
    );

    response.status(500).json({
      success: false,
      message:
        "Unable to update saved prompt.",
    });
  }
}

/*
 * ===============================================
 * TOGGLE FAVORITE
 * ===============================================
 */

export async function toggleFavoriteSavedPrompt(
  request: Request,
  response: Response,
): Promise<void> {
  const userId =
    getAuthenticatedUserId(
      request,
    );

  if (!userId) {
    response.status(401).json({
      success: false,
      message:
        "Authentication required.",
    });

    return;
  }

  const {
    id,
  } = request.params;

  if (!isValidUuid(id)) {
    response.status(400).json({
      success: false,
      message:
        "Invalid prompt ID.",
    });

    return;
  }

  try {
    const prompt =
      await toggleSavedPromptFavorite(
        id,
        userId,
      );

    if (!prompt) {
      response.status(404).json({
        success: false,
        message:
          "Saved prompt not found.",
      });

      return;
    }

    response.status(200).json({
      success: true,
      message:
        prompt.is_favorite
          ? "Prompt added to favorites."
          : "Prompt removed from favorites.",

      prompt:
        mapSavedPrompt(
          prompt,
        ),
    });
  } catch (error) {
    console.error(
      "Unable to update favorite status:",
      error,
    );

    response.status(500).json({
      success: false,
      message:
        "Unable to update favorite status.",
    });
  }
}

/*
 * ===============================================
 * DELETE SAVED PROMPT
 * ===============================================
 */

export async function deleteSavedPromptController(
  request: Request,
  response: Response,
): Promise<void> {
  const userId =
    getAuthenticatedUserId(
      request,
    );

  if (!userId) {
    response.status(401).json({
      success: false,
      message:
        "Authentication required.",
    });

    return;
  }

  const {
    id,
  } = request.params;

  if (!isValidUuid(id)) {
    response.status(400).json({
      success: false,
      message:
        "Invalid prompt ID.",
    });

    return;
  }

  try {
    const wasDeleted =
      await deleteSavedPrompt(
        id,
        userId,
      );

    if (!wasDeleted) {
      response.status(404).json({
        success: false,
        message:
          "Saved prompt not found.",
      });

      return;
    }

    response.status(200).json({
      success: true,
      message:
        "Prompt deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Unable to delete saved prompt:",
      error,
    );

    response.status(500).json({
      success: false,
      message:
        "Unable to delete saved prompt.",
    });
  }
}