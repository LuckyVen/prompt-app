import {
  devWarn,
} from "../utils/devLogger";

import {
  generatePromptWithAi,
} from "./aiService";

import type {
  BuilderSession,
  GeneratedPrompt,
} from "../types/builder";

import {
  generateStructuredPrompt,
} from "../utils/generateStructuredPrompt";

/*
 * ===============================================
 * PROMPT GENERATION RESULT
 * ===============================================
 *
 * This tells the rest of the application where
 * the generated prompt came from.
 *
 * "ai"
 *   → Backend AI generation succeeded.
 *
 * "fallback"
 *   → AI/API/network generation failed and the
 *     deterministic generator was used instead.
 */

export interface PromptGenerationResult {
  prompt: GeneratedPrompt;

  source:
    | "ai"
    | "fallback";
}

/*
 * ===============================================
 * GENERATE PROMPT
 * ===============================================
 *
 * This service owns the generation strategy.
 *
 * The React page should not need to know how
 * fallback generation works.
 *
 * Flow:
 *
 * Builder Session
 *      ↓
 * Try AI
 *      ↓
 * ┌───────────────┐
 * │               │
 * Success       Failure
 * │               │
 * AI Prompt     Deterministic Prompt
 * │               │
 * └───────┬───────┘
 *         ↓
 * PromptGenerationResult
 */

export async function generatePrompt(
  session: BuilderSession,
): Promise<PromptGenerationResult> {
  try {
    /*
     * ===========================================
     * AI GENERATION
     * ===========================================
     */

    const result =
      await generatePromptWithAi({
        originalIdea:
          session.originalIdea,

        category:
          session.category,

        answers:
          session.answers,
      });

    /*
     * ===========================================
     * CONVERT API RESULT
     * ===========================================
     *
     * The backend response does not contain the
     * local application fields such as id and
     * createdAt.
     *
     * Create those here before returning the
     * GeneratedPrompt to the page.
     */

    const prompt: GeneratedPrompt = {
      id:
        crypto.randomUUID(),

      title:
        result.title.trim(),

      content:
        result.content.trim(),

      category:
        result.category,

      createdAt:
        new Date().toISOString(),
    };

    return {
      prompt,
      source: "ai",
    };
  } catch (error) {
    /*
     * ===========================================
     * DETERMINISTIC FALLBACK
     * ===========================================
     *
     * Smart Builder already has a legitimate
     * non-AI prompt generator.
     *
     * If any part of the AI request fails:
     *
     * - AI unavailable
     * - backend unavailable
     * - network unavailable
     * - server error
     * - future invalid AI response
     *
     * PROMPT. can still produce a useful prompt.
     */

    devWarn(
      "AI generation unavailable. Using deterministic fallback.",
      error,
    );

    const prompt =
      generateStructuredPrompt(
        session,
      );

    return {
      prompt,
      source: "fallback",
    };
  }
}