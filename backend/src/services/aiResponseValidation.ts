import type {
  AdaptiveBuilderQuestion,
  BuilderQuestionType,
  GeneratePromptOutput,
  GenerateQuestionsOutput,
  ImprovePromptOutput,
  PromptCategory,
} from "../types/ai.js";

/*
 * ===============================================
 * RESPONSE LIMITS
 * ===============================================
 */

const MAX_TITLE_LENGTH = 200;
const MAX_GENERATED_PROMPT_LENGTH = 30_000;
const MAX_IMPROVED_PROMPT_LENGTH = 30_000;

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
 * HELPERS
 * ===============================================
 */

function isPlainObject(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

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

function isNonEmptyString(
  value: unknown,
): value is string {
  return (
    typeof value === "string" &&
    value.trim().length > 0
  );
}

/*
 * ===============================================
 * ADAPTIVE QUESTION VALIDATION
 * ===============================================
 */

const VALID_QUESTION_TYPES:
  BuilderQuestionType[] = [
    "text",
    "textarea",
    "single-select",
    "multi-select",
  ];

function isBuilderQuestionType(
  value: unknown,
): value is BuilderQuestionType {
  return (
    typeof value === "string" &&
    VALID_QUESTION_TYPES.includes(
      value as BuilderQuestionType,
    )
  );
}

function normalizeOptionalString(
  value: unknown,
  maxLength: number,
): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== "string") {
    throw new Error(
      "AI generated an invalid adaptive question response.",
    );
  }

  const normalized =
    value.trim();

  if (
    normalized.length === 0 ||
    normalized.length > maxLength
  ) {
    throw new Error(
      "AI generated an invalid adaptive question response.",
    );
  }

  return normalized;
}

export function validateGenerateQuestionsOutput(
  value: unknown,
): GenerateQuestionsOutput {
  if (!isPlainObject(value)) {
    throw new Error(
      "AI generated an invalid adaptive question response.",
    );
  }

  const { questions } = value;

  if (
    !Array.isArray(questions) ||
    questions.length === 0 ||
    questions.length >
      MAX_ADAPTIVE_QUESTIONS
  ) {
    throw new Error(
      "AI generated an invalid number of adaptive questions.",
    );
  }

  const seenIds =
    new Set<string>();

  const normalizedQuestions:
    AdaptiveBuilderQuestion[] = [];

  for (const question of questions) {
    if (!isPlainObject(question)) {
      throw new Error(
        "AI generated an invalid adaptive question.",
      );
    }

    const {
      id,
      title,
      description,
      type,
      required,
      placeholder,
      options,
    } = question;

    if (!isNonEmptyString(id)) {
      throw new Error(
        "AI generated a question without a valid ID.",
      );
    }

    const normalizedId =
      id.trim();

    if (
      normalizedId.length > 100 ||
      !/^[a-z0-9-]+$/.test(
        normalizedId,
      ) ||
      seenIds.has(normalizedId)
    ) {
      throw new Error(
        "AI generated an invalid or duplicate question ID.",
      );
    }

    seenIds.add(normalizedId);

    if (!isNonEmptyString(title)) {
      throw new Error(
        "AI generated a question without a valid title.",
      );
    }

    const normalizedTitle =
      title.trim();

    if (
      normalizedTitle.length >
      MAX_QUESTION_TITLE_LENGTH
    ) {
      throw new Error(
        "AI generated a question title that is too long.",
      );
    }

    if (!isBuilderQuestionType(type)) {
      throw new Error(
        "AI generated an unsupported question type.",
      );
    }

    if (
      required !== undefined &&
      typeof required !== "boolean"
    ) {
      throw new Error(
        "AI generated an invalid required value.",
      );
    }

    const normalizedDescription =
      normalizeOptionalString(
        description,
        MAX_QUESTION_DESCRIPTION_LENGTH,
      );

    const normalizedPlaceholder =
      normalizeOptionalString(
        placeholder,
        MAX_QUESTION_PLACEHOLDER_LENGTH,
      );

    let normalizedOptions:
      AdaptiveBuilderQuestion["options"];

    if (
      type === "single-select" ||
      type === "multi-select"
    ) {
      if (
        !Array.isArray(options) ||
        options.length < 2 ||
        options.length >
          MAX_QUESTION_OPTIONS
      ) {
        throw new Error(
          "AI generated an invalid set of question options.",
        );
      }

      const seenOptionIds =
        new Set<string>();

      normalizedOptions =
        options.map((option) => {
          if (!isPlainObject(option)) {
            throw new Error(
              "AI generated an invalid question option.",
            );
          }

          const {
            id: optionId,
            label,
            value: optionValue,
          } = option;

          if (
            !isNonEmptyString(optionId) ||
            !isNonEmptyString(label) ||
            !isNonEmptyString(optionValue)
          ) {
            throw new Error(
              "AI generated an invalid question option.",
            );
          }

          const normalizedOptionId =
            optionId.trim();

          const normalizedLabel =
            label.trim();

          const normalizedValue =
            optionValue.trim();

          if (
            normalizedOptionId.length >
              MAX_OPTION_TEXT_LENGTH ||
            normalizedLabel.length >
              MAX_OPTION_TEXT_LENGTH ||
            normalizedValue.length >
              MAX_OPTION_TEXT_LENGTH ||
            !/^[a-z0-9-]+$/.test(
              normalizedOptionId,
            ) ||
            seenOptionIds.has(
              normalizedOptionId,
            )
          ) {
            throw new Error(
              "AI generated an invalid or duplicate question option.",
            );
          }

          seenOptionIds.add(
            normalizedOptionId,
          );

          return {
            id: normalizedOptionId,
            label: normalizedLabel,
            value: normalizedValue,
          };
        });
    } else if (options !== undefined) {
      throw new Error(
        "AI generated options for a text question.",
      );
    }

    normalizedQuestions.push({
      id: normalizedId,
      title: normalizedTitle,
      type,
      required:
        required ?? false,

      ...(normalizedDescription
        ? {
            description:
              normalizedDescription,
          }
        : {}),

      ...(normalizedPlaceholder
        ? {
            placeholder:
              normalizedPlaceholder,
          }
        : {}),

      ...(normalizedOptions
        ? {
            options:
              normalizedOptions,
          }
        : {}),
    });
  }

  return {
    questions:
      normalizedQuestions,
  };
}

/*
 * ===============================================
 * GENERATED PROMPT RESPONSE
 * ===============================================
 */

export function validateGeneratePromptOutput(
  value: unknown,
): GeneratePromptOutput {
  if (!isPlainObject(value)) {
    throw new Error(
      "AI generated an invalid prompt response.",
    );
  }

  const {
    title,
    content,
    category,
  } = value;

  /*
   * TITLE
   */

  if (!isNonEmptyString(title)) {
    throw new Error(
      "AI response is missing a valid title.",
    );
  }

  const normalizedTitle =
    title.trim();

  if (
    normalizedTitle.length >
    MAX_TITLE_LENGTH
  ) {
    throw new Error(
      "AI generated a title that is too long.",
    );
  }

  /*
   * CONTENT
   */

  if (!isNonEmptyString(content)) {
    throw new Error(
      "AI response is missing prompt content.",
    );
  }

  const normalizedContent =
    content.trim();

  if (
    normalizedContent.length >
    MAX_GENERATED_PROMPT_LENGTH
  ) {
    throw new Error(
      "AI generated prompt content that is too long.",
    );
  }

  /*
   * CATEGORY
   */

  if (!isPromptCategory(category)) {
    throw new Error(
      "AI response contains an invalid prompt category.",
    );
  }

  /*
   * SAFE NORMALIZED RESULT
   */

  return {
    title: normalizedTitle,
    content: normalizedContent,
    category,
  };
}

/*
 * ===============================================
 * IMPROVED PROMPT RESPONSE
 * ===============================================
 */

export function validateImprovePromptOutput(
  value: unknown,
): ImprovePromptOutput {
  if (!isPlainObject(value)) {
    throw new Error(
      "AI generated an invalid improvement response.",
    );
  }

  const {
    originalPrompt,
    improvedPrompt,
  } = value;

  /*
   * ORIGINAL PROMPT
   */

  if (!isNonEmptyString(originalPrompt)) {
    throw new Error(
      "AI response is missing the original prompt.",
    );
  }

  /*
   * IMPROVED PROMPT
   */

  if (!isNonEmptyString(improvedPrompt)) {
    throw new Error(
      "AI response is missing the improved prompt.",
    );
  }

  const normalizedOriginalPrompt =
    originalPrompt.trim();

  const normalizedImprovedPrompt =
    improvedPrompt.trim();

  if (
    normalizedOriginalPrompt.length >
    MAX_IMPROVED_PROMPT_LENGTH ||
    normalizedImprovedPrompt.length >
    MAX_IMPROVED_PROMPT_LENGTH
  ) {
    throw new Error(
      "AI improvement response is too long.",
    );
  }

  return {
    originalPrompt:
      normalizedOriginalPrompt,

    improvedPrompt:
      normalizedImprovedPrompt,
  };
}

const MAX_ADAPTIVE_QUESTIONS = 6;
const MAX_QUESTION_TITLE_LENGTH = 200;
const MAX_QUESTION_DESCRIPTION_LENGTH = 500;
const MAX_QUESTION_PLACEHOLDER_LENGTH = 500;
const MAX_QUESTION_OPTIONS = 8;
const MAX_OPTION_TEXT_LENGTH = 100;