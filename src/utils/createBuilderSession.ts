import {
  getQuestionsForCategory,
} from "../data/builderQuestions";

import type {
  BuilderQuestion,
  BuilderQuestionSource,
  BuilderSession,
  PromptCategory,
} from "../types/builder";

/*
 * ===============================================
 * CREATE BUILDER SESSION OPTIONS
 * ===============================================
 */

interface CreateBuilderSessionOptions {
  /*
   * Optional custom questions.
   *
   * Step 11 does not use AI questions yet.
   * This prepares the session factory so Step 12
   * can provide dynamically generated questions.
   */

  questions?: BuilderQuestion[];

  /*
   * Identifies where the supplied questions
   * came from.
   */

  questionSource?:
    BuilderQuestionSource;
}

/*
 * ===============================================
 * CREATE BUILDER SESSION
 * ===============================================
 */

export function createBuilderSession(
  originalIdea: string,
  category: PromptCategory = "general",
  options: CreateBuilderSessionOptions = {},
): BuilderSession {
  /*
   * =============================================
   * STATIC FALLBACK QUESTIONS
   * =============================================
   *
   * Existing category questions remain the
   * reliable default.
   */

  const staticQuestions =
    getQuestionsForCategory(
      category,
    );

  /*
   * =============================================
   * QUESTION RESOLUTION
   * =============================================
   *
   * If custom questions are provided later by
   * the adaptive AI service, use them.
   *
   * Otherwise keep using the existing static
   * category questions.
   */

  const hasCustomQuestions =
    Array.isArray(
      options.questions,
    ) &&
    options.questions.length > 0;

  const questions =
    hasCustomQuestions
      ? options.questions!
      : staticQuestions;

  const questionSource:
    BuilderQuestionSource =
      hasCustomQuestions
        ? (
            options.questionSource ??
            "ai"
          )
        : "static";

  return {
    id: crypto.randomUUID(),

    originalIdea:
      originalIdea.trim(),

    category,

    questionSource,

    questions,

    answers: {},

    currentQuestionIndex: 0,

    status: "building",

    createdAt:
      new Date().toISOString(),
  };
}