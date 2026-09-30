import type { PromptCategory } from "../types/builder";

const categoryKeywords: Record<
  Exclude<PromptCategory, "general">,
  string[]
> = {
  build: [
    "build",
    "website",
    "web app",
    "app",
    "application",
    "program",
    "software",
    "code",
    "develop",
  ],

  create: [
    "create",
    "design",
    "generate",
    "make",
    "logo",
    "image",
    "presentation",
  ],

  write: [
    "write",
    "email",
    "essay",
    "letter",
    "article",
    "caption",
    "report",
  ],

  learn: [
    "learn",
    "teach",
    "explain",
    "understand",
    "tutorial",
    "study",
  ],

  research: [
    "research",
    "compare",
    "investigate",
    "analyze",
    "find information",
  ],

  fix: [
    "fix",
    "error",
    "bug",
    "broken",
    "not working",
    "debug",
    "issue",
  ],
};

export function detectPromptCategory(
  idea: string,
): PromptCategory {
  const normalizedIdea = idea.toLowerCase();

  let bestCategory: PromptCategory = "general";
  let bestScore = 0;

  for (const [category, keywords] of Object.entries(
    categoryKeywords,
  )) {
    const score = keywords.reduce((total, keyword) => {
      return normalizedIdea.includes(keyword)
        ? total + 1
        : total;
    }, 0);

    if (score > bestScore) {
      bestScore = score;
      bestCategory = category as PromptCategory;
    }
  }

  return bestCategory;
}