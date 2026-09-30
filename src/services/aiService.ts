import type {
  GeneratePromptRequest,
  GeneratePromptResponse,
  GenerateQuestionsRequest,
  GenerateQuestionsResponse,
  ImprovePromptRequest,
  ImprovePromptResponse,
} from "../types/ai";

import {
  apiRequest,
} from "./api";

/*
 * ===============================================
 * GENERATE ADAPTIVE QUESTIONS
 * ===============================================
 */

export async function generateQuestionsWithAi(
  input: GenerateQuestionsRequest,
): Promise<GenerateQuestionsResponse> {
  return apiRequest<GenerateQuestionsResponse>(
    "/prompts/questions",
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );
}

/*
 * ===============================================
 * GENERATE PROMPT
 * ===============================================
 */

export async function generatePromptWithAi(
  input: GeneratePromptRequest,
): Promise<GeneratePromptResponse> {
  return apiRequest<GeneratePromptResponse>(
    "/prompts/generate",
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );
}

/*
 * ===============================================
 * IMPROVE PROMPT
 * ===============================================
 */

export async function improvePromptWithAi(
  input: ImprovePromptRequest,
): Promise<ImprovePromptResponse> {
  return apiRequest<ImprovePromptResponse>(
    "/prompts/improve",
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );
}