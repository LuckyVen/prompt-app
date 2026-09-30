import {
  devWarn,
} from "../../utils/devLogger";

import {
  useState,
} from "react";

import type {
  KeyboardEvent,
} from "react";

import {
  ArrowRight,
  LoaderCircle,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import PageContainer from "../../components/layout/PageContainer";

import {
  generateQuestionsWithAi,
} from "../../services/aiService";

import type {
  PromptCategory,
} from "../../types/builder";

import {
  clearPromptSession,
  saveBuilderSession,
} from "../../utils/promptSessionStorage";

import {
  createBuilderSession,
} from "../../utils/createBuilderSession";

import {
  detectPromptCategory,
} from "../../utils/detectPromptCategory";

const categories: {
  label: string;
  value: PromptCategory;
}[] = [
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
];

function HomePage() {
  const navigate =
    useNavigate();

  const [
    idea,
    setIdea,
  ] = useState("");

  const [
    selectedCategory,
    setSelectedCategory,
  ] =
    useState<PromptCategory | null>(
      null,
    );

  const [
    isPreparingBuilder,
    setIsPreparingBuilder,
  ] = useState(false);

  const trimmedIdea =
    idea.trim();

  const canContinue =
    trimmedIdea.length > 0 &&
    !isPreparingBuilder;

  async function handleContinue() {
    if (!canContinue) {
      return;
    }

    const category =
      selectedCategory ??
      detectPromptCategory(
        trimmedIdea,
      );

    setIsPreparingBuilder(true);

    try {
      /*
       * =============================================
       * ADAPTIVE QUESTIONS
       * =============================================
       *
       * Try to create questions based specifically
       * on what the user has already told PROMPT.
       */

      const result =
        await generateQuestionsWithAi({
          originalIdea:
            trimmedIdea,
          category,
        });

      const session =
        createBuilderSession(
          trimmedIdea,
          category,
          {
            questions:
              result.questions,

            questionSource:
              "ai",
          },
        );

      clearPromptSession();

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
    } catch (error) {
      /*
       * =============================================
       * STATIC FALLBACK
       * =============================================
       *
       * Adaptive questions must never prevent the
       * user from entering the Smart Builder.
       *
       * This also means PROMPT. remains usable while
       * API credits are unavailable.
       */

      devWarn(
        "Adaptive questions unavailable. Using static Builder questions.",
        error,
      );

      const fallbackSession =
        createBuilderSession(
          trimmedIdea,
          category,
        );

      clearPromptSession();

      saveBuilderSession(
        fallbackSession,
      );

      navigate(
        "/prompts/new",
        {
          state: {
            session:
              fallbackSession,
          },
        },
      );
    } finally {
      setIsPreparingBuilder(false);
    }
  }

  function handleKeyDown(
    event:
      KeyboardEvent<HTMLTextAreaElement>,
  ) {
    const shouldSubmit =
      (
        event.ctrlKey ||
        event.metaKey
      ) &&
      event.key === "Enter";

    if (!shouldSubmit) {
      return;
    }

    event.preventDefault();

    void handleContinue();
  }

  return (
    <PageContainer>
      <div className="mx-auto flex min-h-[calc(100dvh-9rem)] w-full min-w-0 max-w-3xl flex-col justify-center py-8 sm:py-12">
        <div className="text-center">
          <p className="text-sm font-medium text-primary">
            PROMPT.
          </p>

          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-text-primary sm:text-4xl">
            What do you want to do?
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-text-secondary sm:text-base">
            Start with a simple idea.
            We'll help you turn it
            into a clear prompt.
          </p>
        </div>

        <div className="mt-8">
          <div className="w-full min-w-0 rounded-prompt-lg border border-border bg-surface p-3 transition focus-within:border-primary focus-within:ring-4 focus-within:ring-primary-soft">
            <textarea
              rows={5}
              value={idea}
              onChange={(event) =>
                setIdea(
                  event.target.value,
                )
              }
              onKeyDown={
                handleKeyDown
              }
              disabled={
                isPreparingBuilder
              }
              aria-label="Describe your idea"
              placeholder="Describe your idea..."
              className="w-full min-w-0 resize-none border-0 bg-transparent px-2 py-2 text-base text-text-primary outline-none placeholder:text-text-muted disabled:cursor-wait disabled:opacity-70"
            />

            <div className="flex items-center justify-between gap-3 px-1 pb-1">
              <span className="text-xs text-text-muted">
                {isPreparingBuilder
                  ? "Preparing Smart Builder..."
                  : "Ctrl + Enter to continue"}
              </span>

              <button
                type="button"
                onClick={() =>
                  void handleContinue()
                }
                disabled={
                  !canContinue
                }
                aria-label="Continue to Smart Builder"
                className="flex size-10 shrink-0 items-center justify-center rounded-prompt-md bg-primary text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isPreparingBuilder ? (
                  <LoaderCircle
                    size={18}
                    className="animate-spin"
                  />
                ) : (
                  <ArrowRight
                    size={18}
                  />
                )}
              </button>
            </div>
          </div>

          <div className="mt-4">
            <p className="mb-2 text-center text-xs text-text-muted">
              Optional: choose a category
            </p>

            <div className="flex flex-wrap justify-center gap-2">
              {categories.map(
                (category) => {
                  const isSelected =
                    selectedCategory ===
                    category.value;

                  return (
                    <button
                      key={
                        category.value
                      }
                      type="button"
                      disabled={
                        isPreparingBuilder
                      }
                      aria-pressed={
                        isSelected
                      }
                      onClick={() =>
                        setSelectedCategory(
                          (current) =>
                            current ===
                            category.value
                              ? null
                              : category.value,
                        )
                      }
                      className={[
                        "rounded-full border px-3 py-1.5 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50",

                        isSelected
                          ? "border-primary bg-primary-soft text-primary"
                          : "border-border bg-surface text-text-secondary hover:border-primary hover:text-primary",
                      ].join(" ")}
                    >
                      {
                        category.label
                      }
                    </button>
                  );
                },
              )}
            </div>
          </div>

          <div className="mt-7 text-center">
            <span className="text-sm text-text-secondary">
              Already have a
              prompt?{" "}
            </span>

            <Link
              to="/improve"
              className="text-sm font-medium text-primary hover:underline"
            >
              Improve it
            </Link>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

export default HomePage;