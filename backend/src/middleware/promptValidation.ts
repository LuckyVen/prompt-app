import type {
  NextFunction,
  Request,
  Response,
} from "express";

import type {
  PromptCategory,
} from "../types/ai.js";

/*
 * ===============================================
 * LIMITS
 * ===============================================
 */

const MAX_ORIGINAL_IDEA_LENGTH =
  5_000;

const MAX_IMPROVE_PROMPT_LENGTH =
  20_000;

const MAX_ANSWER_COUNT =
  50;

const MAX_ANSWER_KEY_LENGTH =
  100;

const MAX_ANSWER_LENGTH =
  5_000;

const MAX_ARRAY_ITEMS =
  50;

/*
 * ===============================================
 * PROMPT CATEGORIES
 * ===============================================
 */

const VALID_CATEGORIES:
  PromptCategory[] = [
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
 * ALLOWED TOP-LEVEL FIELDS
 * ===============================================
 */

const QUESTIONS_FIELDS =
  new Set([
    "originalIdea",
    "category",
  ]);

const GENERATE_FIELDS =
  new Set([
    "originalIdea",
    "category",
    "answers",
  ]);

const IMPROVE_FIELDS =
  new Set([
    "prompt",
  ]);

/*
 * ===============================================
 * HELPERS
 * ===============================================
 */

function isPlainObject(
  value: unknown,
): value is Record<
  string,
  unknown
> {
  return (
    typeof value ===
      "object" &&
    value !== null &&
    !Array.isArray(
      value,
    )
  );
}

function containsOnlyFields(
  value: Record<
    string,
    unknown
  >,
  allowedFields:
    Set<string>,
): boolean {
  return Object.keys(
    value,
  ).every(
    (key) =>
      allowedFields.has(
        key,
      ),
  );
}

function isPromptCategory(
  value: unknown,
): value is PromptCategory {
  return (
    typeof value ===
      "string" &&
    VALID_CATEGORIES.includes(
      value as PromptCategory,
    )
  );
}

function isValidAnswerKey(
  key: string,
): boolean {
  return (
    key.length > 0 &&
    key.length <=
      MAX_ANSWER_KEY_LENGTH
  );
}

function normalizeAnswerString(
  value: string,
): string {
  /*
   * We trim outer whitespace only.
   *
   * We intentionally do NOT remove HTML,
   * Markdown, code, quotes, angle brackets,
   * punctuation, etc.
   */

  return value.trim();
}

/*
 * ===============================================
 * QUESTIONS VALIDATION
 * ===============================================
 */

export function validateGenerateQuestions(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  if (
    !isPlainObject(
      request.body,
    )
  ) {
    response
      .status(400)
      .json({
        success: false,
        message:
          "Request body must be a valid JSON object.",
      });

    return;
  }

  if (
    !containsOnlyFields(
      request.body,
      QUESTIONS_FIELDS,
    )
  ) {
    response
      .status(400)
      .json({
        success: false,
        message:
          "Question-generation request contains unsupported fields.",
      });

    return;
  }

  const {
    originalIdea,
    category,
  } = request.body;

  if (
    typeof originalIdea !==
      "string" ||
    originalIdea
      .trim()
      .length === 0
  ) {
    response
      .status(400)
      .json({
        success: false,
        message:
          "Original idea is required.",
      });

    return;
  }

  const normalizedIdea =
    originalIdea.trim();

  if (
    normalizedIdea.length >
    MAX_ORIGINAL_IDEA_LENGTH
  ) {
    response
      .status(400)
      .json({
        success: false,
        message:
          `Original idea must be ${MAX_ORIGINAL_IDEA_LENGTH} characters or fewer.`,
      });

    return;
  }

  if (
    !isPromptCategory(
      category,
    )
  ) {
    response
      .status(400)
      .json({
        success: false,
        message:
          "A valid prompt category is required.",
      });

    return;
  }

  request.body = {
    originalIdea:
      normalizedIdea,

    category,
  };

  next();
}

/*
 * ===============================================
 * GENERATE PROMPT VALIDATION
 * ===============================================
 */

export function validateGeneratePrompt(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  if (
    !isPlainObject(
      request.body,
    )
  ) {
    response
      .status(400)
      .json({
        success: false,
        message:
          "Request body must be a valid JSON object.",
      });

    return;
  }

  if (
    !containsOnlyFields(
      request.body,
      GENERATE_FIELDS,
    )
  ) {
    response
      .status(400)
      .json({
        success: false,
        message:
          "Prompt-generation request contains unsupported fields.",
      });

    return;
  }

  const {
    originalIdea,
    category,
    answers,
  } = request.body;

  /*
   * ORIGINAL IDEA
   */

  if (
    typeof originalIdea !==
      "string" ||
    originalIdea
      .trim()
      .length === 0
  ) {
    response
      .status(400)
      .json({
        success: false,
        message:
          "Original idea is required.",
      });

    return;
  }

  const normalizedIdea =
    originalIdea.trim();

  if (
    normalizedIdea.length >
    MAX_ORIGINAL_IDEA_LENGTH
  ) {
    response
      .status(400)
      .json({
        success: false,
        message:
          `Original idea must be ${MAX_ORIGINAL_IDEA_LENGTH} characters or fewer.`,
      });

    return;
  }

  /*
   * CATEGORY
   */

  if (
    !isPromptCategory(
      category,
    )
  ) {
    response
      .status(400)
      .json({
        success: false,
        message:
          "A valid prompt category is required.",
      });

    return;
  }

  /*
   * ANSWERS
   */

  if (
    !isPlainObject(
      answers,
    )
  ) {
    response
      .status(400)
      .json({
        success: false,
        message:
          "Builder answers must be a valid object.",
      });

    return;
  }

  const answerEntries =
    Object.entries(
      answers,
    );

  if (
    answerEntries.length >
    MAX_ANSWER_COUNT
  ) {
    response
      .status(400)
      .json({
        success: false,
        message:
          `Builder answers cannot contain more than ${MAX_ANSWER_COUNT} entries.`,
      });

    return;
  }

  const normalizedAnswers:
    Record<
      string,
      string | string[]
    > = {};

  for (
    const [
      key,
      answer,
    ] of answerEntries
  ) {
    if (
      !isValidAnswerKey(
        key,
      )
    ) {
      response
        .status(400)
        .json({
          success: false,
          message:
            `Builder answer keys must be between 1 and ${MAX_ANSWER_KEY_LENGTH} characters.`,
        });

      return;
    }

    /*
     * SINGLE VALUE
     */

    if (
      typeof answer ===
      "string"
    ) {
      if (
        answer.length >
        MAX_ANSWER_LENGTH
      ) {
        response
          .status(400)
          .json({
            success: false,
            message:
              `Each builder answer must be ${MAX_ANSWER_LENGTH} characters or fewer.`,
          });

        return;
      }

      normalizedAnswers[
        key
      ] =
        normalizeAnswerString(
          answer,
        );

      continue;
    }

    /*
     * MULTI-SELECT VALUE
     */

    if (
      Array.isArray(
        answer,
      )
    ) {
      if (
        answer.length >
        MAX_ARRAY_ITEMS
      ) {
        response
          .status(400)
          .json({
            success: false,
            message:
              `A multi-select answer cannot contain more than ${MAX_ARRAY_ITEMS} items.`,
          });

        return;
      }

      const normalizedArray:
        string[] = [];

      for (
        const item
        of answer
      ) {
        if (
          typeof item !==
          "string"
        ) {
          response
            .status(400)
            .json({
              success: false,
              message:
                "Multi-select answers must contain only strings.",
            });

          return;
        }

        if (
          item.length >
          MAX_ANSWER_LENGTH
        ) {
          response
            .status(400)
            .json({
              success: false,
              message:
                `Each multi-select answer must be ${MAX_ANSWER_LENGTH} characters or fewer.`,
            });

          return;
        }

        normalizedArray.push(
          normalizeAnswerString(
            item,
          ),
        );
      }

      normalizedAnswers[
        key
      ] =
        normalizedArray;

      continue;
    }

    response
      .status(400)
      .json({
        success: false,
        message:
          "Each builder answer must be a string or an array of strings.",
      });

    return;
  }

  /*
   * CLEAN REQUEST BODY
   */

  request.body = {
    originalIdea:
      normalizedIdea,

    category,

    answers:
      normalizedAnswers,
  };

  next();
}

/*
 * ===============================================
 * IMPROVE PROMPT VALIDATION
 * ===============================================
 */

export function validateImprovePrompt(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  if (
    !isPlainObject(
      request.body,
    )
  ) {
    response
      .status(400)
      .json({
        success: false,
        message:
          "Request body must be a valid JSON object.",
      });

    return;
  }

  if (
    !containsOnlyFields(
      request.body,
      IMPROVE_FIELDS,
    )
  ) {
    response
      .status(400)
      .json({
        success: false,
        message:
          "Prompt-improvement request contains unsupported fields.",
      });

    return;
  }

  const {
    prompt,
  } = request.body;

  if (
    typeof prompt !==
      "string" ||
    prompt
      .trim()
      .length === 0
  ) {
    response
      .status(400)
      .json({
        success: false,
        message:
          "Prompt is required.",
      });

    return;
  }

  const normalizedPrompt =
    prompt.trim();

  if (
    normalizedPrompt.length >
    MAX_IMPROVE_PROMPT_LENGTH
  ) {
    response
      .status(400)
      .json({
        success: false,
        message:
          `Prompt must be ${MAX_IMPROVE_PROMPT_LENGTH} characters or fewer.`,
      });

    return;
  }

  request.body = {
    prompt:
      normalizedPrompt,
  };

  next();
}