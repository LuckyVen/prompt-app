import {
  devError,
} from "./devLogger";

import type {
  BuilderSession,
  GeneratedPrompt,
} from "../types/builder";

const BUILDER_SESSION_KEY =
  "prompt.activeBuilderSession";

const GENERATED_PROMPT_KEY =
  "prompt.activeGeneratedPrompt";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function saveBuilderSession(
  session: BuilderSession,
): void {
  if (!isBrowser()) {
    return;
  }

  try {
    sessionStorage.setItem(
      BUILDER_SESSION_KEY,
      JSON.stringify(session),
    );
  } catch (error) {
    devError(
      "Unable to save builder session:",
      error,
    );
  }
}

export function getBuilderSession():
  | BuilderSession
  | null {
  if (!isBrowser()) {
    return null;
  }

  try {
    const storedSession =
      sessionStorage.getItem(
        BUILDER_SESSION_KEY,
      );

    if (!storedSession) {
      return null;
    }

    const parsed =
      JSON.parse(storedSession) as BuilderSession;

    if (
      !parsed ||
      typeof parsed !== "object" ||
      typeof parsed.id !== "string" ||
      typeof parsed.originalIdea !== "string" ||
      !Array.isArray(parsed.questions) ||
      typeof parsed.currentQuestionIndex !==
        "number" ||
      !parsed.answers
    ) {
      sessionStorage.removeItem(
        BUILDER_SESSION_KEY,
      );

      return null;
    }

    // Protect against an invalid stored index.
    if (parsed.questions.length > 0) {
      parsed.currentQuestionIndex = Math.min(
        Math.max(
          parsed.currentQuestionIndex,
          0,
        ),
        parsed.questions.length - 1,
      );
    }

    return parsed;
  } catch (error) {
    devError(
      "Unable to restore builder session:",
      error,
    );

    sessionStorage.removeItem(
      BUILDER_SESSION_KEY,
    );

    return null;
  }
}

export function saveGeneratedPrompt(
  prompt: GeneratedPrompt,
): void {
  if (!isBrowser()) {
    return;
  }

  try {
    sessionStorage.setItem(
      GENERATED_PROMPT_KEY,
      JSON.stringify(prompt),
    );
  } catch (error) {
    devError(
      "Unable to save generated prompt:",
      error,
    );
  }
}

export function getGeneratedPrompt():
  | GeneratedPrompt
  | null {
  if (!isBrowser()) {
    return null;
  }

  try {
    const storedPrompt =
      sessionStorage.getItem(
        GENERATED_PROMPT_KEY,
      );

    if (!storedPrompt) {
      return null;
    }

    const parsed =
      JSON.parse(
        storedPrompt,
      ) as GeneratedPrompt;

    if (
      !parsed ||
      typeof parsed !== "object" ||
      typeof parsed.id !== "string" ||
      typeof parsed.title !== "string" ||
      typeof parsed.content !== "string"
    ) {
      sessionStorage.removeItem(
        GENERATED_PROMPT_KEY,
      );

      return null;
    }

    return parsed;
  } catch (error) {
    devError(
      "Unable to restore generated prompt:",
      error,
    );

    sessionStorage.removeItem(
      GENERATED_PROMPT_KEY,
    );

    return null;
  }
}

export function clearBuilderSession(): void {
  if (!isBrowser()) {
    return;
  }

  sessionStorage.removeItem(
    BUILDER_SESSION_KEY,
  );
}

export function clearGeneratedPrompt(): void {
  if (!isBrowser()) {
    return;
  }

  sessionStorage.removeItem(
    GENERATED_PROMPT_KEY,
  );
}

export function clearPromptSession(): void {
  if (!isBrowser()) {
    return;
  }

  clearBuilderSession();
  clearGeneratedPrompt();
}