import {
  validateGeneratePromptOutput,
  validateImprovePromptOutput,
} from "./aiResponseValidation.js";

/*
 * ===============================================
 * VALID GENERATED PROMPT
 * ===============================================
 */

const validGeneratedPrompt =
  validateGeneratePromptOutput({
    title:
      "Build a Portfolio Website",

    content:
      "Create a modern developer portfolio website.",

    category:
      "build",
  });

console.log(
  "Valid generated prompt:",
  validGeneratedPrompt,
);

/*
 * ===============================================
 * INVALID GENERATED PROMPT
 * ===============================================
 */

try {
  validateGeneratePromptOutput({
    title: "",
    content:
      "Some prompt content",
    category:
      "build",
  });

  console.error(
    "ERROR: Invalid generated prompt was accepted.",
  );
} catch {
  console.log(
    "Invalid generated prompt rejected correctly.",
  );
}

/*
 * ===============================================
 * VALID IMPROVEMENT
 * ===============================================
 */

const validImprovement =
  validateImprovePromptOutput({
    originalPrompt:
      "build portfolio",

    improvedPrompt:
      "Create a modern, responsive developer portfolio website.",
  });

console.log(
  "Valid improvement:",
  validImprovement,
);

/*
 * ===============================================
 * INVALID IMPROVEMENT
 * ===============================================
 */

try {
  validateImprovePromptOutput({
    originalPrompt:
      "build portfolio",

    improvedPrompt: "   ",
  });

  console.error(
    "ERROR: Invalid improvement was accepted.",
  );
} catch {
  console.log(
    "Invalid improvement rejected correctly.",
  );
}