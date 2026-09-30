export interface SavedPrompt {
  id: string;
  user_id: string;
  title: string;
  content: string;
  category: string;
  is_favorite: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateSavedPromptInput {
  id: string;
  userId: string;
  title: string;
  content: string;
  category: string;
  isFavorite?: boolean;
}

export interface UpdateSavedPromptInput {
  title?: string;
  content?: string;
  category?: string;
  isFavorite?: boolean;
}