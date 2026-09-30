import type {
  BuilderAnswer,
  BuilderQuestion,
} from "../types/builder";

export function validateBuilderAnswer(
  question: BuilderQuestion,
  answer: BuilderAnswer | undefined,
): boolean {
  // Optional questions are always valid.
  if (!question.required) {
    return true;
  }

  switch (question.type) {
    case "text":
    case "textarea":
      return (
        typeof answer === "string" &&
        answer.trim().length > 0
      );

    case "single-select":
      return (
        typeof answer === "string" &&
        answer.trim().length > 0
      );

    case "multi-select":
      return (
        Array.isArray(answer) &&
        answer.length > 0
      );

    default:
      return false;
  }
}