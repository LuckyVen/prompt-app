import type {
  PromptCategory,
} from "./builder";

export interface SavedPrompt {
  id: string;

  title: string;

  content: string;

  category: PromptCategory;

  isFavorite: boolean;

  createdAt: string;

  updatedAt: string;
}