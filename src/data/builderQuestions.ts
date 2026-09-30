import type {
  BuilderQuestion,
  PromptCategory,
} from "../types/builder";

/*
 * =========================================================
 * GENERAL QUESTIONS
 * =========================================================
 *
 * These questions are shared between categories.
 *
 * IMPORTANT:
 * Keep these placeholders category-neutral because
 * Build, Write, Learn, Research, Create, Fix, and General
 * can all use them.
 */

const generalQuestions: BuilderQuestion[] = [
  {
    id: "goal",
    title: "What result do you want?",
    description:
      "Describe what a successful result should look like.",
    type: "textarea",
    required: true,
    placeholder:
      "Describe the result you want to achieve...",
  },

  {
    id: "audience",
    title: "Who is this for?",
    description:
      "Knowing the audience helps make the prompt more specific.",
    type: "text",
    required: false,
    placeholder:
      "For example: students, customers, beginners, developers...",
  },

  {
    id: "style",
    title: "How should the result feel?",
    type: "single-select",
    required: false,
    options: [
      {
        id: "professional",
        label: "Professional",
        value: "professional",
      },
      {
        id: "simple",
        label: "Simple",
        value: "simple",
      },
      {
        id: "creative",
        label: "Creative",
        value: "creative",
      },
      {
        id: "detailed",
        label: "Detailed",
        value: "detailed",
      },
    ],
  },

  {
    id: "requirements",
    title: "Anything the result must include?",
    description:
      "Add important requirements, limitations, sections, or details.",
    type: "textarea",
    required: false,
    placeholder:
      "Add any important requirements or constraints...",
  },
];

/*
 * =========================================================
 * BUILD
 * =========================================================
 */

const buildQuestions: BuilderQuestion[] = [
  {
    id: "project-type",
    title: "What are you building?",
    description:
      "Choose the type of project you want to create.",
    type: "single-select",
    required: true,
    options: [
      {
        id: "website",
        label: "Website",
        value: "website",
      },
      {
        id: "web-app",
        label: "Web App",
        value: "web-app",
      },
      {
        id: "mobile-app",
        label: "Mobile App",
        value: "mobile-app",
      },
      {
        id: "software",
        label: "Software",
        value: "software",
      },
      {
        id: "other",
        label: "Something Else",
        value: "other",
      },
    ],
  },

  {
    id: "features",
    title: "What should it be able to do?",
    description:
      "List the most important features or behaviors.",
    type: "textarea",
    required: true,
    placeholder:
      "For example: login, search, user profiles, project gallery...",
  },

  {
    id: "technology",
    title: "Do you have a preferred technology?",
    description:
      "Leave this blank if you want the technology to be recommended.",
    type: "text",
    required: false,
    placeholder:
      "For example: React, TypeScript, C#, Python, or no preference",
  },
];

/*
 * =========================================================
 * WRITE
 * =========================================================
 */

const writeQuestions: BuilderQuestion[] = [
  {
    id: "writing-type",
    title: "What are you writing?",
    description:
      "Choose the type of content you want to produce.",
    type: "single-select",
    required: true,
    options: [
      {
        id: "email",
        label: "Email",
        value: "email",
      },
      {
        id: "essay",
        label: "Essay",
        value: "essay",
      },
      {
        id: "post",
        label: "Post",
        value: "post",
      },
      {
        id: "report",
        label: "Report",
        value: "report",
      },
      {
        id: "other",
        label: "Something Else",
        value: "other",
      },
    ],
  },

  {
    id: "tone",
    title: "What tone should it use?",
    description:
      "Choose the tone that best fits the writing.",
    type: "single-select",
    required: false,
    options: [
      {
        id: "professional",
        label: "Professional",
        value: "professional",
      },
      {
        id: "friendly",
        label: "Friendly",
        value: "friendly",
      },
      {
        id: "casual",
        label: "Casual",
        value: "casual",
      },
      {
        id: "formal",
        label: "Formal",
        value: "formal",
      },
    ],
  },
];

/*
 * =========================================================
 * LEARN
 * =========================================================
 */

const learnQuestions: BuilderQuestion[] = [
  {
    id: "topic",
    title: "What do you want to understand?",
    description:
      "Enter the topic or concept you want to learn.",
    type: "text",
    required: true,
    placeholder:
      "For example: JavaScript functions, cloud computing, photosynthesis...",
  },

  {
    id: "level",
    title: "What explanation level do you want?",
    description:
      "Choose how advanced the explanation should be.",
    type: "single-select",
    required: true,
    options: [
      {
        id: "beginner",
        label: "Beginner",
        value: "beginner",
      },
      {
        id: "intermediate",
        label: "Intermediate",
        value: "intermediate",
      },
      {
        id: "advanced",
        label: "Advanced",
        value: "advanced",
      },
    ],
  },

  {
    id: "learning-format",
    title: "How would you like it explained?",
    description:
      "Select one or more explanation styles.",
    type: "multi-select",
    required: false,
    options: [
      {
        id: "steps",
        label: "Step-by-step",
        value: "step-by-step",
      },
      {
        id: "examples",
        label: "Examples",
        value: "examples",
      },
      {
        id: "analogy",
        label: "Analogy",
        value: "analogy",
      },
      {
        id: "summary",
        label: "Summary",
        value: "summary",
      },
    ],
  },
];

/*
 * =========================================================
 * RESEARCH
 * =========================================================
 */

const researchQuestions: BuilderQuestion[] = [
  {
    id: "research-topic",
    title: "What do you want to research?",
    description:
      "Describe the topic, question, or subject you want investigated.",
    type: "textarea",
    required: true,
    placeholder:
      "For example: the advantages and disadvantages of cloud computing...",
  },

  {
    id: "research-focus",
    title: "What should the research focus on?",
    description:
      "Add the areas, questions, or comparisons that matter most.",
    type: "textarea",
    required: false,
    placeholder:
      "For example: cost, security, performance, benefits, and limitations...",
  },

  {
    id: "research-depth",
    title: "How detailed should the research be?",
    type: "single-select",
    required: false,
    options: [
      {
        id: "quick-overview",
        label: "Quick Overview",
        value: "quick-overview",
      },
      {
        id: "balanced",
        label: "Balanced",
        value: "balanced",
      },
      {
        id: "in-depth",
        label: "In-depth",
        value: "in-depth",
      },
    ],
  },
];

/*
 * =========================================================
 * CREATE
 * =========================================================
 */

const createQuestions: BuilderQuestion[] = [
  {
    id: "creation-type",
    title: "What do you want to create?",
    description:
      "Choose the type of creative result you need.",
    type: "single-select",
    required: true,
    options: [
      {
        id: "design",
        label: "Design",
        value: "design",
      },
      {
        id: "image-concept",
        label: "Image Concept",
        value: "image-concept",
      },
      {
        id: "presentation",
        label: "Presentation",
        value: "presentation",
      },
      {
        id: "content-idea",
        label: "Content Idea",
        value: "content-idea",
      },
      {
        id: "other",
        label: "Something Else",
        value: "other",
      },
    ],
  },

  {
    id: "creative-direction",
    title: "What creative direction do you want?",
    description:
      "Describe the look, mood, theme, or overall direction.",
    type: "textarea",
    required: false,
    placeholder:
      "For example: modern, minimal, playful, futuristic, or elegant...",
  },

  {
    id: "creative-purpose",
    title: "What will it be used for?",
    description:
      "Knowing the purpose helps make the result more appropriate.",
    type: "text",
    required: false,
    placeholder:
      "For example: a school project, website, social post, or presentation...",
  },
];

/*
 * =========================================================
 * FIX
 * =========================================================
 */

const fixQuestions: BuilderQuestion[] = [
  {
    id: "problem",
    title: "What's going wrong?",
    description:
      "Describe the problem or unexpected behavior.",
    type: "textarea",
    required: true,
    placeholder:
      "Explain what's happening and when the problem occurs...",
  },

  {
    id: "expected-result",
    title: "What should happen instead?",
    description:
      "Describe the behavior you expected.",
    type: "textarea",
    required: true,
    placeholder:
      "Describe what you expected to happen...",
  },

  {
    id: "error-message",
    title: "Do you have an error message?",
    description:
      "Paste the exact error if one is available.",
    type: "textarea",
    required: false,
    placeholder:
      "Paste the error message here...",
  },
];

/*
 * =========================================================
 * CATEGORY-SPECIFIC GENERAL QUESTIONS
 * =========================================================
 *
 * The structure stays consistent, but the examples now
 * match the category the user selected.
 */

function getGeneralQuestionsForCategory(
  category: PromptCategory,
): BuilderQuestion[] {
  return generalQuestions.map((question) => {
    if (question.id === "goal") {
      switch (category) {
        case "build":
          return {
            ...question,
            placeholder:
              "For example: A responsive portfolio website that showcases my projects and skills...",
          };

        case "write":
          return {
            ...question,
            placeholder:
              "For example: A clear email that politely explains the situation and asks for consideration...",
          };

        case "learn":
          return {
            ...question,
            placeholder:
              "For example: Understand the topic well enough to explain it in my own words...",
          };

        case "research":
          return {
            ...question,
            placeholder:
              "For example: A clear summary of the key findings, comparisons, and important evidence...",
          };

        case "fix":
          return {
            ...question,
            placeholder:
              "For example: Fix the issue, explain what caused it, and show the corrected solution...",
          };

        case "create":
          return {
            ...question,
            placeholder:
              "For example: A clean and creative result that matches the intended style and purpose...",
          };

        case "general":
        default:
          return question;
      }
    }

    if (question.id === "audience") {
      switch (category) {
        case "build":
          return {
            ...question,
            placeholder:
              "For example: recruiters, customers, students, or developers...",
          };

        case "write":
          return {
            ...question,
            placeholder:
              "For example: my teacher, manager, customers, classmates...",
          };

        case "learn":
          return {
            ...question,
            placeholder:
              "For example: a beginner student, developer, or someone new to the topic...",
          };

        case "research":
          return {
            ...question,
            placeholder:
              "For example: students, researchers, teachers, or decision-makers...",
          };

        case "fix":
          return {
            ...question,
            placeholder:
              "For example: a beginner developer or someone maintaining the project...",
          };

        case "create":
          return {
            ...question,
            placeholder:
              "For example: students, customers, social media users, or website visitors...",
          };

        case "general":
        default:
          return question;
      }
    }

    if (question.id === "requirements") {
      switch (category) {
        case "build":
          return {
            ...question,
            placeholder:
              "For example: responsive design, accessibility, specific pages, or technologies...",
          };

        case "write":
          return {
            ...question,
            placeholder:
              "For example: mention the deadline, keep it concise, include a greeting and closing...",
          };

        case "learn":
          return {
            ...question,
            placeholder:
              "For example: include examples, avoid advanced terms, or explain each step...",
          };

        case "research":
          return {
            ...question,
            placeholder:
              "For example: include comparisons, key findings, limitations, or source requirements...",
          };

        case "fix":
          return {
            ...question,
            placeholder:
              "For example: don't rewrite unrelated code, explain the cause, and show the exact fix...",
          };

        case "create":
          return {
            ...question,
            placeholder:
              "For example: specific dimensions, sections, visual elements, or constraints...",
          };

        case "general":
        default:
          return question;
      }
    }

    return question;
  });
}

/*
 * =========================================================
 * QUESTION RESOLVER
 * =========================================================
 */

export function getQuestionsForCategory(
  category: PromptCategory,
): BuilderQuestion[] {
  const categoryGeneralQuestions =
    getGeneralQuestionsForCategory(
      category,
    );

  switch (category) {
    case "build":
      return [
        ...buildQuestions,
        ...categoryGeneralQuestions,
      ];

    case "create":
      return [
        ...createQuestions,
        ...categoryGeneralQuestions,
      ];

    case "write":
      return [
        ...writeQuestions,
        ...categoryGeneralQuestions,
      ];

    case "learn":
      return [
        ...learnQuestions,
        ...categoryGeneralQuestions,
      ];

    case "research":
      return [
        ...researchQuestions,
        ...categoryGeneralQuestions,
      ];

    case "fix":
      return [
        ...fixQuestions,
        ...categoryGeneralQuestions,
      ];

    case "general":
    default:
      return categoryGeneralQuestions;
  }
}