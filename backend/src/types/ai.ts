export type PromptCategory =
  | "build"
  | "create"
  | "write"
  | "learn"
  | "research"
  | "fix"
  | "general";

export type BuilderAnswer =
  | string
  | string[];

export interface BuilderAnswers {
  [questionId: string]:
    BuilderAnswer;
}

/*
 * ===============================================
 * ADAPTIVE BUILDER QUESTIONS
 * ===============================================
 */

export type BuilderQuestionType =
  | "text"
  | "textarea"
  | "single-select"
  | "multi-select";

export interface BuilderQuestionOption {
  id: string;
  label: string;
  value: string;
}

export interface AdaptiveBuilderQuestion {
  id: string;
  title: string;
  description?: string;
  type: BuilderQuestionType;
  required?: boolean;
  placeholder?: string;
  options?: BuilderQuestionOption[];
}

export interface GenerateQuestionsInput {
  originalIdea: string;
  category: PromptCategory;
}

export interface GenerateQuestionsOutput {
  questions: AdaptiveBuilderQuestion[];
}

/*
 * ===============================================
 * GENERATE PROMPT
 * ===============================================
 */

export interface GeneratePromptInput {
  originalIdea: string;
  category: PromptCategory;
  answers: BuilderAnswers;
}

export interface GeneratedPromptResult {
  title: string;
  content: string;
  category: PromptCategory;
}

export interface GeneratePromptOutput {
  title: string;
  content: string;
  category: PromptCategory;
}

/*
 * ===============================================
 * IMPROVE PROMPT
 * ===============================================
 */

export interface ImprovePromptInput {
  prompt: string;
}

export interface ImprovedPromptResult {
  originalPrompt: string;
  improvedPrompt: string;
}

export interface ImprovePromptOutput {
  originalPrompt: string;
  improvedPrompt: string;
}