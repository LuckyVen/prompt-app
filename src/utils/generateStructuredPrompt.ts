import type {
  BuilderAnswer,
  BuilderQuestion,
  BuilderSession,
  GeneratedPrompt,
} from "../types/builder";

/*
 * Convert a stored option value into the
 * human-readable label shown in the UI.
 *
 * Example:
 * "web-app" -> "Web App"
 */
function findOptionLabel(
  question: BuilderQuestion,
  value: string,
): string {
  const normalizedValue = value.trim();

  if (!normalizedValue) {
    return "";
  }

  const option = question.options?.find(
    (item) =>
      item.value === normalizedValue,
  );

  return option?.label ?? normalizedValue;
}

/*
 * Format and normalize an answer based
 * on the question type.
 *
 * This also prevents empty or whitespace-only
 * answers from appearing in the generated prompt.
 */
function formatQuestionAnswer(
  question: BuilderQuestion,
  answer: BuilderAnswer,
): string {
  /*
   * Multi-select answers are stored as arrays.
   *
   * Example:
   * ["step-by-step", "examples", "   "]
   *
   * becomes:
   * "Step-by-step, Examples"
   */
  if (Array.isArray(answer)) {
    return answer
      .map((value) => value.trim())
      .filter(
        (value) => value.length > 0,
      )
      .map((value) =>
        findOptionLabel(
          question,
          value,
        ),
      )
      .filter(
        (value) => value.length > 0,
      )
      .join(", ");
  }

  /*
   * Normalize normal text answers.
   *
   * "  Website  " -> "Website"
   * "      "      -> ""
   */
  const normalizedAnswer =
    answer.trim();

  if (!normalizedAnswer) {
    return "";
  }

  /*
   * Single-select questions store the
   * option value, so convert it back
   * into its display label.
   */
  if (
    question.type ===
    "single-select"
  ) {
    return findOptionLabel(
      question,
      normalizedAnswer,
    );
  }

  /*
   * Text and textarea questions can
   * return their normalized answer.
   */
  return normalizedAnswer;
}

/*
 * Create a short title for the generated prompt.
 *
 * We intentionally keep this deterministic
 * during Phase 5.
 */
function createTitle(
  session: BuilderSession,
): string {
  const idea =
    session.originalIdea.trim();

  const shortIdea =
    idea.length > 50
      ? `${idea
          .slice(0, 47)
          .trimEnd()}...`
      : idea;

  const category =
    session.category
      .charAt(0)
      .toUpperCase() +
    session.category.slice(1);

  return `${category}: ${shortIdea}`;
}

/*
 * Generate the final structured prompt
 * from the completed Builder session.
 */
export function generateStructuredPrompt(
  session: BuilderSession,
): GeneratedPrompt {
  const originalIdea =
    session.originalIdea.trim();

  /*
   * Read every Builder question and
   * collect only meaningful answers.
   */
  const answeredQuestions =
    session.questions
      .map((question) => {
        const answer =
          session.answers[
            question.id
          ];

        /*
         * The user never answered
         * this question.
         */
        if (answer === undefined) {
          return null;
        }

        const formattedAnswer =
          formatQuestionAnswer(
            question,
            answer,
          );

        /*
         * Ignore empty answers.
         *
         * Examples:
         *
         * ""
         * "       "
         * []
         * ["       "]
         */
        if (!formattedAnswer) {
          return null;
        }

        return {
          question,
          answer: formattedAnswer,
        };
      })
      .filter(
        (
          item,
        ): item is {
          question: BuilderQuestion;
          answer: string;
        } => item !== null,
      );

  /*
   * Convert meaningful answers into
   * readable prompt details.
   */
  const details =
    answeredQuestions
      .map(
        ({
          question,
          answer,
        }) =>
          `- ${question.title}: ${answer}`,
      )
      .join("\n");

  /*
   * Build the final prompt in sections.
   */
  const sections: string[] = [
    "I need help with the following task:",
    originalIdea,
  ];

  /*
   * Don't create an empty
   * "Additional details" section.
   */
  if (details) {
    sections.push(
      "Additional details:",
      details,
    );
  }

  sections.push(
    "Please provide a clear, useful, and well-structured response based on the information above.",
  );

  /*
   * Return the generated prompt object.
   */
  return {
    id: crypto.randomUUID(),

    title:
      createTitle(session),

    category:
      session.category,

    content:
      sections.join("\n\n"),

    createdAt:
      new Date().toISOString(),
  };
}