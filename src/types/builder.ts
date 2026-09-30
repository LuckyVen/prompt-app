export type PromptCategory =
  | "build"
  | "create"
  | "write"
  | "learn"
  | "research"
  | "fix"
  | "general";

/*
 * ===============================================
 * QUESTION SOURCE
 * ===============================================
 *
 * static:
 *   Questions came from the local category-based
 *   question library.
 *
 * ai:
 *   Questions were generated dynamically by the
 *   adaptive Builder service.
 */

export type BuilderQuestionSource =
  | "static"
  | "ai";

export type QuestionType =
  | "text"
  | "textarea"
  | "single-select"
  | "multi-select";

export interface BuilderOption {
  id: string;
  label: string;
  value: string;
}

export interface BuilderQuestion {
  id: string;

  title: string;

  description?: string;

  type: QuestionType;

  required?: boolean;

  placeholder?: string;

  options?: BuilderOption[];
}

export type BuilderAnswer =
  | string
  | string[];

export interface BuilderAnswers {
  [questionId: string]:
    BuilderAnswer;
}

export interface BuilderSession {
  id: string;

  originalIdea: string;

  category: PromptCategory;

  /*
   * Tracks where this session's questions
   * came from.
   *
   * Step 11 starts with "static".
   * Step 12 will be able to replace them
   * with AI-generated questions.
   */

  questionSource:
    BuilderQuestionSource;

  questions: BuilderQuestion[];

  answers: BuilderAnswers;

  currentQuestionIndex: number;

  status:
    | "building"
    | "completed";

  createdAt: string;
}

export interface GeneratedPrompt {
  id: string;

  title: string;

  category: PromptCategory;

  content: string;

  createdAt: string;
}