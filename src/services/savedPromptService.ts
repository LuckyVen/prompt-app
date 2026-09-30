import {
  apiRequest,
} from "./api";

import type {
  SavedPrompt,
} from "../types/savedPrompt";

/*
 * ===============================================
 * TYPES
 * ===============================================
 */

export interface CreateSavedPromptInput {
  id: string;
  title: string;
  content: string;
  category: SavedPrompt["category"];
  isFavorite?: boolean;
}

export interface UpdateSavedPromptInput {
  title?: string;
  content?: string;
  category?: SavedPrompt["category"];
  isFavorite?: boolean;
}

interface SavedPromptListResponse {
  success: boolean;
  prompts: SavedPrompt[];
}

interface SavedPromptResponse {
  success: boolean;
  message?: string;
  prompt: SavedPrompt;
}

interface DeleteSavedPromptResponse {
  success: boolean;
  message: string;
}

/*
 * ===============================================
 * AUTH HEADERS
 * ===============================================
 */

function createAuthHeaders(
  token: string,
): HeadersInit {
  return {
    Authorization:
      `Bearer ${token}`,
  };
}

/*
 * ===============================================
 * GET ALL SAVED PROMPTS
 * ===============================================
 */

export async function fetchSavedPrompts(
  token: string,
): Promise<SavedPrompt[]> {
  const response =
    await apiRequest<SavedPromptListResponse>(
      "/saved-prompts",
      {
        method: "GET",
        headers:
          createAuthHeaders(
            token,
          ),
      },
    );

  return response.prompts;
}

/*
 * ===============================================
 * GET FAVORITE PROMPTS
 * ===============================================
 */

export async function fetchFavoritePrompts(
  token: string,
): Promise<SavedPrompt[]> {
  const response =
    await apiRequest<SavedPromptListResponse>(
      "/saved-prompts/favorites",
      {
        method: "GET",
        headers:
          createAuthHeaders(
            token,
          ),
      },
    );

  return response.prompts;
}

/*
 * ===============================================
 * GET ONE SAVED PROMPT
 * ===============================================
 */

export async function fetchSavedPromptById(
  token: string,
  promptId: string,
): Promise<SavedPrompt> {
  const response =
    await apiRequest<SavedPromptResponse>(
      `/saved-prompts/${promptId}`,
      {
        method: "GET",
        headers:
          createAuthHeaders(
            token,
          ),
      },
    );

  return response.prompt;
}

/*
 * ===============================================
 * CREATE SAVED PROMPT
 * ===============================================
 */

export async function createSavedPromptApi(
  token: string,
  input: CreateSavedPromptInput,
): Promise<SavedPrompt> {
  const response =
    await apiRequest<SavedPromptResponse>(
      "/saved-prompts",
      {
        method: "POST",

        headers:
          createAuthHeaders(
            token,
          ),

        body: JSON.stringify({
          id: input.id,
          title: input.title,
          content: input.content,
          category: input.category,
          isFavorite:
            input.isFavorite ??
            false,
        }),
      },
    );

  return response.prompt;
}

/*
 * ===============================================
 * UPDATE SAVED PROMPT
 * ===============================================
 */

export async function updateSavedPromptApi(
  token: string,
  promptId: string,
  input: UpdateSavedPromptInput,
): Promise<SavedPrompt> {
  const response =
    await apiRequest<SavedPromptResponse>(
      `/saved-prompts/${promptId}`,
      {
        method: "PATCH",

        headers:
          createAuthHeaders(
            token,
          ),

        body:
          JSON.stringify(
            input,
          ),
      },
    );

  return response.prompt;
}

/*
 * ===============================================
 * TOGGLE FAVORITE
 * ===============================================
 */

export async function toggleSavedPromptFavoriteApi(
  token: string,
  promptId: string,
): Promise<SavedPrompt> {
  const response =
    await apiRequest<SavedPromptResponse>(
      `/saved-prompts/${promptId}/favorite`,
      {
        method: "PATCH",

        headers:
          createAuthHeaders(
            token,
          ),
      },
    );

  return response.prompt;
}

/*
 * ===============================================
 * DELETE SAVED PROMPT
 * ===============================================
 */

export async function deleteSavedPromptApi(
  token: string,
  promptId: string,
): Promise<void> {
  await apiRequest<DeleteSavedPromptResponse>(
    `/saved-prompts/${promptId}`,
    {
      method: "DELETE",

      headers:
        createAuthHeaders(
          token,
        ),
    },
  );
}

/*
 * ===============================================
 * DUPLICATE SAVED PROMPT
 * ===============================================
 */

export async function duplicateSavedPromptApi(
  token: string,
  prompt: SavedPrompt,
): Promise<SavedPrompt> {
  const suffix =
    " (Copy)";

  /*
   * Backend title limit is 255 characters.
   */
  const maxBaseLength =
    255 -
    suffix.length;

  const baseTitle =
    prompt.title
      .trim()
      .slice(
        0,
        maxBaseLength,
      )
      .trimEnd();

  return createSavedPromptApi(
    token,
    {
      id:
        crypto.randomUUID(),

      title:
        `${baseTitle}${suffix}`,

      content:
        prompt.content,

      category:
        prompt.category,

      /*
       * A duplicate should not automatically
       * become a favorite.
       */
      isFavorite:
        false,
    },
  );
}