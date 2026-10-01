import {
  useMemo,
  useState,
} from "react";

import {
  ArrowRight,
  BookOpen,
  Code2,
  FileText,
  Lightbulb,
  Search,
  Sparkles,
  Wrench,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import type {
  LucideIcon,
} from "lucide-react";

import type {
  PromptCategory,
} from "../../types/builder";

import {
  createBuilderSession,
} from "../../utils/createBuilderSession";

import {
  clearPromptSession,
  saveBuilderSession,
} from "../../utils/promptSessionStorage";

/* =========================================================
   TYPES
========================================================= */

interface PromptTemplate {
  id: string;
  title: string;
  description: string;
  category: PromptCategory;
  categoryLabel: string;
  idea: string;
  icon: LucideIcon;
  featured?: boolean;
}

/* =========================================================
   TEMPLATE DATA
========================================================= */

const templates: PromptTemplate[] = [
  {
    id: "website-builder",
    title: "Website Builder",
    description:
      "Plan a complete modern website with clear pages, features, design direction, and technical requirements.",
    category: "build",
    categoryLabel: "Build",
    idea:
      "Help me plan and build a complete modern website. Ask me about the website purpose, target users, pages, features, visual style, technologies, responsiveness, and any important requirements before creating the final prompt.",
    icon: Code2,
    featured: true,
  },
  {
    id: "app-planner",
    title: "App Planner",
    description:
      "Turn an app idea into a structured development brief with features, users, screens, and technical requirements.",
    category: "build",
    categoryLabel: "Build",
    idea:
      "Help me turn my app idea into a complete development plan. Ask about the app goal, target users, core features, screens, user flow, technology preferences, database needs, authentication, and design requirements.",
    icon: Code2,
  },
  {
    id: "creative-concept",
    title: "Creative Concept",
    description:
      "Develop a rough creative idea into a clearer concept with direction, style, audience, and constraints.",
    category: "create",
    categoryLabel: "Create",
    idea:
      "Help me develop a creative concept from a rough idea. Ask about the goal, audience, style, tone, format, important elements, references, and constraints before creating the final prompt.",
    icon: Sparkles,
  },
  {
    id: "content-creator",
    title: "Content Creator",
    description:
      "Create a structured prompt for social content, posts, scripts, captions, or other digital content.",
    category: "create",
    categoryLabel: "Create",
    idea:
      "Help me create digital content. Ask about the platform, audience, purpose, format, tone, length, key message, call to action, and any restrictions before creating the final prompt.",
    icon: Sparkles,
  },
  {
    id: "writing-assistant",
    title: "Writing Assistant",
    description:
      "Build a clear writing brief for essays, articles, reports, messages, descriptions, or other written work.",
    category: "write",
    categoryLabel: "Write",
    idea:
      "Help me write something clearly and effectively. Ask about the type of writing, purpose, audience, tone, length, important points, structure, and formatting requirements.",
    icon: FileText,
    featured: true,
  },
  {
    id: "rewrite-improve",
    title: "Rewrite & Improve",
    description:
      "Create instructions for rewriting text while preserving its meaning and improving clarity and tone.",
    category: "write",
    categoryLabel: "Write",
    idea:
      "Help me improve and rewrite a piece of text. Ask about the intended meaning, audience, preferred tone, desired length, what should remain unchanged, and what should be improved.",
    icon: FileText,
  },
  {
    id: "study-tutor",
    title: "Study Tutor",
    description:
      "Create a personalized learning prompt that explains a topic step-by-step at the right difficulty level.",
    category: "learn",
    categoryLabel: "Learn",
    idea:
      "Teach me a topic step-by-step. Ask what I want to learn, my current knowledge level, what I find difficult, my preferred explanation style, whether I want examples, and how detailed the lesson should be.",
    icon: BookOpen,
    featured: true,
  },
  {
    id: "practice-quiz",
    title: "Practice & Quiz",
    description:
      "Build a study session with explanations, examples, practice questions, and feedback.",
    category: "learn",
    categoryLabel: "Learn",
    idea:
      "Help me study using explanations and practice questions. Ask about the subject, topics covered, difficulty level, question format, number of questions, and whether I want explanations after each answer.",
    icon: BookOpen,
  },
  {
    id: "research-planner",
    title: "Research Planner",
    description:
      "Structure a research task around a topic, scope, questions, evidence needs, and expected output.",
    category: "research",
    categoryLabel: "Research",
    idea:
      "Help me plan a research task. Ask about the topic, research goal, scope, important questions, preferred sources, required evidence, time period, and desired final output.",
    icon: Lightbulb,
    featured: true,
  },
  {
    id: "compare-options",
    title: "Compare Options",
    description:
      "Create a neutral comparison prompt using relevant criteria, tradeoffs, evidence, and constraints.",
    category: "research",
    categoryLabel: "Research",
    idea:
      "Help me compare several options objectively. Ask what options I am comparing, what matters most to me, required criteria, constraints, budget if relevant, and what kind of comparison output I want.",
    icon: Lightbulb,
  },
  {
    id: "code-debugger",
    title: "Code Debugger",
    description:
      "Turn a coding problem into a structured debugging request with errors, expected behavior, and context.",
    category: "fix",
    categoryLabel: "Fix",
    idea:
      "Help me debug a programming problem. Ask about the programming language, framework, relevant code, exact error, expected behavior, actual behavior, what I already tried, and any project constraints.",
    icon: Wrench,
    featured: true,
  },
  {
    id: "problem-solver",
    title: "Problem Solver",
    description:
      "Break down a technical or practical problem and create a clear request for diagnosis and solution.",
    category: "fix",
    categoryLabel: "Fix",
    idea:
      "Help me solve a problem systematically. Ask what is wrong, what I expected to happen, what actually happened, when the problem started, what I already tried, relevant context, and any limitations.",
    icon: Wrench,
  },
];

/* =========================================================
   FILTERS
========================================================= */

const categoryFilters = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Build",
    value: "build",
  },
  {
    label: "Create",
    value: "create",
  },
  {
    label: "Write",
    value: "write",
  },
  {
    label: "Learn",
    value: "learn",
  },
  {
    label: "Research",
    value: "research",
  },
  {
    label: "Fix",
    value: "fix",
  },
] as const;

type CategoryFilter =
  (typeof categoryFilters)[number]["value"];

/* =========================================================
   COMPONENT
========================================================= */

function TemplatesPage() {
  const navigate =
    useNavigate();

  const [
    searchQuery,
    setSearchQuery,
  ] = useState("");

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState<CategoryFilter>(
    "all",
  );

  /* =======================================================
     FILTERED TEMPLATES
  ======================================================= */

  const filteredTemplates =
    useMemo(() => {
      const normalizedSearch =
        searchQuery
          .trim()
          .toLowerCase();

      return templates.filter(
        (template) => {
          const matchesCategory =
            selectedCategory ===
              "all" ||
            template.category ===
              selectedCategory;

          if (!matchesCategory) {
            return false;
          }

          if (!normalizedSearch) {
            return true;
          }

          const searchableText = [
            template.title,
            template.description,
            template.categoryLabel,
            template.idea,
          ]
            .join(" ")
            .toLowerCase();

          return searchableText.includes(
            normalizedSearch,
          );
        },
      );
    }, [
      searchQuery,
      selectedCategory,
    ]);

  /* =======================================================
     USE TEMPLATE
  ======================================================= */

  function handleUseTemplate(
    template: PromptTemplate,
  ) {
    /*
     * Remove any old temporary Builder state first.
     * This prevents a previous unfinished prompt from
     * being restored instead of this template.
     */
    clearPromptSession();

    const session =
      createBuilderSession(
        template.idea,
        template.category,
      );

    saveBuilderSession(
      session,
    );

    navigate(
      "/prompts/new",
      {
        state: {
          session,
        },
      },
    );
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      {/* ===================================================
          PAGE HEADER
      =================================================== */}

      <section className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-white px-6 py-8 sm:px-8 sm:py-10 lg:px-10">
        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />

        <div className="relative max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#efedff] px-3 py-1.5 text-xs font-semibold text-primary">
            <Sparkles
              size={14}
              strokeWidth={2}
            />

            Prompt library
          </div>

          <h1 className="text-3xl font-semibold tracking-[-0.03em] text-zinc-950 sm:text-4xl">
            Start with a proven structure.
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500 sm:text-base">
            Choose a starting point, then let
            Smart Builder personalize the details
            for what you actually need.
          </p>
        </div>
      </section>

      {/* ===================================================
          SEARCH + FILTERS
      =================================================== */}

      <section className="mt-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Search */}

          <div className="relative w-full lg:max-w-md">
            <Search
              size={18}
              strokeWidth={1.8}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
            />

            <input
              type="search"
              value={searchQuery}
              onChange={(event) =>
                setSearchQuery(
                  event.target.value,
                )
              }
              placeholder="Search templates..."
              aria-label="Search templates"
              className="
                h-12
                w-full
                rounded-xl
                border
                border-zinc-200
                bg-white
                pl-11
                pr-4
                text-sm
                text-zinc-900
                outline-none
                transition
                placeholder:text-zinc-400
                hover:border-zinc-300
                focus:border-primary
                focus:ring-4
                focus:ring-primary/10
              "
            />
          </div>

          {/* Results */}

          <p className="text-sm text-zinc-500">
            {filteredTemplates.length}{" "}
            {filteredTemplates.length === 1
              ? "template"
              : "templates"}
          </p>
        </div>

        {/* Categories */}

        <div className="mt-5 flex gap-2 overflow-x-auto pb-2">
          {categoryFilters.map(
            (category) => {
              const isActive =
                selectedCategory ===
                category.value;

              return (
                <button
                  key={
                    category.value
                  }
                  type="button"
                  onClick={() =>
                    setSelectedCategory(
                      category.value,
                    )
                  }
                  className={[
                    "shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition",
                    isActive
                      ? "border-primary bg-primary text-white"
                      : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-900",
                  ].join(" ")}
                >
                  {category.label}
                </button>
              );
            },
          )}
        </div>
      </section>

      {/* ===================================================
          TEMPLATE GRID
      =================================================== */}

      {filteredTemplates.length >
      0 ? (
        <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredTemplates.map(
            (template) => {
              const Icon =
                template.icon;

              return (
                <article
                  key={template.id}
                  className="
                    group
                    flex
                    min-h-[280px]
                    flex-col
                    rounded-2xl
                    border
                    border-zinc-200
                    bg-white
                    p-6
                    transition
                    duration-200
                    hover:-translate-y-0.5
                    hover:border-zinc-300
                    hover:shadow-[0_14px_40px_rgba(24,24,27,0.06)]
                  "
                >
                  {/* Card header */}

                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#efedff] text-primary">
                      <Icon
                        size={20}
                        strokeWidth={1.8}
                      />
                    </div>

                    {template.featured && (
                      <span className="rounded-full border border-violet-100 bg-violet-50 px-2.5 py-1 text-[11px] font-semibold text-violet-600">
                        Popular
                      </span>
                    )}
                  </div>

                  {/* Card body */}

                  <div className="mt-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.08em] text-primary">
                      {
                        template.categoryLabel
                      }
                    </p>

                    <h2 className="mt-2 text-lg font-semibold tracking-tight text-zinc-900">
                      {template.title}
                    </h2>

                    <p className="mt-3 text-sm leading-6 text-zinc-500">
                      {
                        template.description
                      }
                    </p>
                  </div>

                  {/* Action */}

                  <div className="mt-auto pt-6">
                    <button
                      type="button"
                      onClick={() =>
                        handleUseTemplate(
                          template,
                        )
                      }
                      className="
                        flex
                        w-full
                        items-center
                        justify-between
                        rounded-xl
                        border
                        border-zinc-200
                        bg-white
                        px-4
                        py-3
                        text-sm
                        font-semibold
                        text-zinc-800
                        transition
                        group-hover:border-primary/30
                        group-hover:bg-[#faf9ff]
                        group-hover:text-primary
                        focus:outline-none
                        focus:ring-4
                        focus:ring-primary/10
                      "
                    >
                      Use template

                      <ArrowRight
                        size={17}
                        strokeWidth={2}
                        className="transition-transform group-hover:translate-x-0.5"
                      />
                    </button>
                  </div>
                </article>
              );
            },
          )}
        </section>
      ) : (
        /* =================================================
           EMPTY SEARCH STATE
        ================================================= */

        <section className="mt-10 rounded-2xl border border-dashed border-zinc-300 bg-white px-6 py-16 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-500">
            <Search
              size={21}
              strokeWidth={1.8}
            />
          </div>

          <h2 className="mt-4 text-base font-semibold text-zinc-900">
            No templates found
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500">
            Try another search term or
            choose a different category.
          </p>

          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory(
                "all",
              );
            }}
            className="mt-5 text-sm font-semibold text-primary transition hover:text-primary-hover"
          >
            Clear filters
          </button>
        </section>
      )}

      {/* ===================================================
          CUSTOM PROMPT CTA
      =================================================== */}

      <section className="mt-8 rounded-2xl border border-zinc-200 bg-zinc-950 px-6 py-7 sm:flex sm:items-center sm:justify-between sm:gap-8 sm:px-8">
        <div>
          <p className="text-base font-semibold text-white">
            Nothing fits your idea?
          </p>

          <p className="mt-1 text-sm leading-6 text-zinc-400">
            Start from scratch and let
            Smart Builder ask what it needs.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            clearPromptSession();

            navigate("/");
          }}
          className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-100 sm:mt-0"
        >
          Start a new prompt

          <ArrowRight
            size={16}
            strokeWidth={2}
          />
        </button>
      </section>
    </div>
  );
}

export default TemplatesPage;