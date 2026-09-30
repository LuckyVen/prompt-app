export type PromptCategory =
  | "build"
  | "create"
  | "write"
  | "learn"
  | "research"
  | "fix";

export type PromptDetailLevel =
  | "simple"
  | "detailed"
  | "advanced";

export interface Prompt {
  id: string;
  title: string;
  originalIdea: string;
  generatedPrompt: string;
  category: PromptCategory;
  detailLevel: PromptDetailLevel;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}