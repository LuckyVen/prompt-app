import type {
  BuilderAnswers,
  BuilderQuestion,
  PromptCategory,
} from "./builder";

/*
 * ===============================================
 * ADAPTIVE QUESTIONS
 * ===============================================
 */

export interface GenerateQuestionsRequest {
  originalIdea: string;
  category: PromptCategory;
}

export interface GenerateQuestionsResponse {
  questions: BuilderQuestion[];
}

/*
 * ===============================================
 * GENERATE PROMPT
 * ===============================================
 */

export interface GeneratePromptRequest {
  originalIdea: string;
  category: PromptCategory;
  answers: BuilderAnswers;
}

export interface GeneratePromptResponse {
  title: string;
  content: string;
  category: PromptCategory;
}

/*
 * ===============================================
 * IMPROVE PROMPT
 * ===============================================
 */

export interface ImprovePromptRequest {
  prompt: string;
}

export interface ImprovePromptResponse {
  originalPrompt: string;
  improvedPrompt: string;
}