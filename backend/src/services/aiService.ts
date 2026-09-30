import type {
  GeneratePromptInput,
  GeneratedPromptResult,
  ImprovePromptInput,
  ImprovedPromptResult,
} from "../types/ai.js";

/*
 * ===============================================
 * AI SERVICE CONTRACT
 * ===============================================
 */

export interface AiService {
  generatePrompt(
    input: GeneratePromptInput,
  ): Promise<GeneratedPromptResult>;

  improvePrompt(
    input: ImprovePromptInput,
  ): Promise<ImprovedPromptResult>;
}