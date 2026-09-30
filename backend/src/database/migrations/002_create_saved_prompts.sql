CREATE TABLE saved_prompts (
  id UUID PRIMARY KEY,

  user_id UUID NOT NULL,

  title VARCHAR(255) NOT NULL,

  content TEXT NOT NULL,

  category VARCHAR(100) NOT NULL,

  is_favorite BOOLEAN NOT NULL DEFAULT FALSE,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT fk_saved_prompts_user
    FOREIGN KEY (user_id)
    REFERENCES users (id)
    ON DELETE CASCADE
);

CREATE INDEX idx_saved_prompts_user_id
ON saved_prompts (user_id);

CREATE INDEX idx_saved_prompts_user_created_at
ON saved_prompts (
  user_id,
  created_at DESC
);

CREATE INDEX idx_saved_prompts_user_favorite
ON saved_prompts (
  user_id,
  is_favorite
);