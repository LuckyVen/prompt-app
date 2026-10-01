import type {
  PromptCategory,
} from "../types/builder";

export type DefaultPromptCategory =
  | "auto"
  | "build"
  | "create"
  | "write"
  | "learn"
  | "research"
  | "fix";

export interface PromptPreferences {
  defaultCategory:
    DefaultPromptCategory;
}

const PREFERENCES_KEY =
  "prompt.preferences";

const DEFAULT_PREFERENCES:
  PromptPreferences = {
    defaultCategory: "auto",
  };

function isBrowser(): boolean {
  return (
    typeof window !== "undefined"
  );
}

function isDefaultCategory(
  value: unknown,
): value is DefaultPromptCategory {
  return [
    "auto",
    "build",
    "create",
    "write",
    "learn",
    "research",
    "fix",
  ].includes(String(value));
}

export function getPromptPreferences():
  PromptPreferences {
  if (!isBrowser()) {
    return {
      ...DEFAULT_PREFERENCES,
    };
  }

  try {
    const stored =
      window.localStorage.getItem(
        PREFERENCES_KEY,
      );

    if (!stored) {
      return {
        ...DEFAULT_PREFERENCES,
      };
    }

    const parsed =
      JSON.parse(stored) as Partial<PromptPreferences>;

    return {
      defaultCategory:
        isDefaultCategory(
          parsed.defaultCategory,
        )
          ? parsed.defaultCategory
          : DEFAULT_PREFERENCES.defaultCategory,
    };
  } catch {
    return {
      ...DEFAULT_PREFERENCES,
    };
  }
}

export function savePromptPreferences(
  preferences: PromptPreferences,
): void {
  if (!isBrowser()) {
    return;
  }

  try {
    window.localStorage.setItem(
      PREFERENCES_KEY,
      JSON.stringify(
        preferences,
      ),
    );
  } catch {
    // Preferences are optional.
    // The app can continue using defaults.
  }
}

export function resetPromptPreferences():
  PromptPreferences {
  const preferences = {
    ...DEFAULT_PREFERENCES,
  };

  if (isBrowser()) {
    try {
      window.localStorage.removeItem(
        PREFERENCES_KEY,
      );
    } catch {
      // Keep default values in memory.
    }
  }

  return preferences;
}

export function preferenceToPromptCategory(
  preference:
    DefaultPromptCategory,
): PromptCategory | null {
  if (
    preference === "auto"
  ) {
    return null;
  }

  return preference;
}