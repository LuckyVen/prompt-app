import type {
  Request,
  Response,
} from "express";

import {
  generatePromptWithOpenAi,
  generateQuestionsWithOpenAi,
  improvePromptWithOpenAi,
} from "../services/openAiService.js";

import {
  mapOpenAiError,
} from "../services/openAiError.js";

import type {
  GeneratePromptInput,
  GenerateQuestionsInput,
  ImprovePromptInput,
  PromptCategory,
} from "../types/ai.js";

/*
 * ===============================================
 * VALID CATEGORIES
 * ===============================================
 */

const VALID_CATEGORIES: PromptCategory[] = [
  "build",
  "create",
  "write",
  "learn",
  "research",
  "fix",
  "general",
];

/*
 * ===============================================
 * TYPE GUARDS
 * ===============================================
 */

function isPromptCategory(
  value: unknown,
): value is PromptCategory {
  return (
    typeof value === "string" &&
    VALID_CATEGORIES.includes(
      value as PromptCategory,
    )
  );
}

function isBuilderAnswers(
  value: unknown,
): value is GeneratePromptInput["answers"] {
  if (
    typeof value !== "object" ||
    value === null ||
    Array.isArray(value)
  ) {
    return false;
  }

  return Object.values(value).every(
    (answer) => {
      if (
        typeof answer === "string"
      ) {
        return true;
      }

      if (Array.isArray(answer)) {
        return answer.every(
          (item) =>
            typeof item === "string",
        );
      }

      return false;
    },
  );
}

/*
 * ===============================================
 * GENERATE ADAPTIVE QUESTIONS
 * ===============================================
 */

export async function generateQuestions(
  request: Request,
  response: Response,
): Promise<void> {
  const {
    originalIdea,
    category,
  } =
    request.body as Partial<GenerateQuestionsInput>;

  if (
    typeof originalIdea !== "string" ||
    originalIdea.trim().length === 0
  ) {
    response.status(400).json({
      success: false,
      message:
        "Original idea is required.",
    });

    return;
  }

  if (!isPromptCategory(category)) {
    response.status(400).json({
      success: false,
      message:
        "A valid prompt category is required.",
    });

    return;
  }

  try {
    const result =
      await generateQuestionsWithOpenAi({
        originalIdea:
          originalIdea.trim(),

        category,
      });

    response.status(200).json(
      result,
    );
  } catch (error) {
    console.error(
      "OpenAI adaptive question generation failed:",
      error,
    );

    const mappedError =
      mapOpenAiError(error);

    response
      .status(mappedError.status)
      .json({
        success: false,
        code: mappedError.code,
        message:
          mappedError.message,
      });
  }
}

/*
 * ===============================================
 * GENERATE PROMPT
 * ===============================================
 */

export async function generatePrompt(
  request: Request,
  response: Response,
): Promise<void> {
  const {
    originalIdea,
    category,
    answers,
  } =
    request.body as Partial<GeneratePromptInput>;

  /*
   * ORIGINAL IDEA
   */

  if (
    typeof originalIdea !== "string" ||
    originalIdea.trim().length === 0
  ) {
    response.status(400).json({
      success: false,
      message:
        "Original idea is required.",
    });

    return;
  }

  /*
   * CATEGORY
   */

  if (!isPromptCategory(category)) {
    response.status(400).json({
      success: false,
      message:
        "A valid prompt category is required.",
    });

    return;
  }

  /*
   * ANSWERS
   */

  if (!isBuilderAnswers(answers)) {
    response.status(400).json({
      success: false,
      message:
        "Builder answers must be a valid object.",
    });

    return;
  }

  /*
   * =============================================
   * OPENAI
   * =============================================
   */

  try {
    const result =
      await generatePromptWithOpenAi({
        originalIdea:
          originalIdea.trim(),

        category,

        answers,
      });

    response.status(200).json(
      result,
    );
  } catch (error) {
    /*
     * Keep the real provider error on the server.
     *
     * Never expose API keys, provider internals,
     * stack traces, or raw OpenAI errors to the
     * frontend.
     */

    console.error(
      "OpenAI prompt generation failed:",
      error,
    );

    const mappedError =
      mapOpenAiError(error);

    response
      .status(mappedError.status)
      .json({
        success: false,
        code: mappedError.code,
        message: mappedError.message,
      });
  }
}

/*
 * ===============================================
 * IMPROVE PROMPT
 * ===============================================
 */

export async function improvePrompt(
  request: Request,
  response: Response,
): Promise<void> {
  const {
    prompt,
  } =
    request.body as Partial<ImprovePromptInput>;

  /*
   * PROMPT
   */

  if (
    typeof prompt !== "string" ||
    prompt.trim().length === 0
  ) {
    response.status(400).json({
      success: false,
      message:
        "Prompt is required.",
    });

    return;
  }

  /*
   * =============================================
   * OPENAI
   * =============================================
   */

  try {
    const result =
      await improvePromptWithOpenAi({
        prompt:
          prompt.trim(),
      });

    response.status(200).json(
      result,
    );
  } catch (error) {
    /*
     * Keep the real provider error on the server.
     *
     * Never expose API keys, provider internals,
     * stack traces, or raw OpenAI errors to the
     * frontend.
     */

    console.error(
      "OpenAI prompt improvement failed:",
      error,
    );

    const mappedError =
      mapOpenAiError(error);

    response
      .status(mappedError.status)
      .json({
        success: false,
        code: mappedError.code,
        message: mappedError.message,
      });
  }
}