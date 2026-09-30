import {
  devError,
} from "../../utils/devLogger";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  AlertCircle,
  FileText,
  Plus,
  RefreshCw,
  Search,
  X,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import PageContainer from "../../components/layout/PageContainer";

import PromptCard from "../../components/prompts/PromptCard";

import PromptListSkeleton from "../../components/prompts/PromptListSkeleton";

import {
  useAuth,
} from "../../hooks/useAuth";

import {
  ApiError,
} from "../../services/api";

import {
  deleteSavedPromptApi,
  duplicateSavedPromptApi,
  fetchSavedPrompts,
  toggleSavedPromptFavoriteApi,
} from "../../services/savedPromptService";

import type {
  SavedPrompt,
} from "../../types/savedPrompt";

import type {
  PromptCategory,
} from "../../types/builder";

/*
 * ===============================================
 * FILTER TYPES
 * ===============================================
 */

type CategoryFilter =
  | "all"
  | PromptCategory;

/*
 * ===============================================
 * FILTER OPTIONS
 * ===============================================
 */

const categoryFilters: {
  label: string;
  value: CategoryFilter;
}[] = [
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
  {
    label: "General",
    value: "general",
  },
];

/*
 * ===============================================
 * ERROR MESSAGE
 * ===============================================
 */

function getActionErrorMessage(
  error: unknown,
  fallback: string,
): string {
  if (
    error instanceof
    ApiError
  ) {
    if (
      error.status ===
      401
    ) {
      return "Your session is no longer valid. Please sign in again.";
    }

    return error.message;
  }

  return fallback;
}

/*
 * ===============================================
 * PAGE
 * ===============================================
 */

function MyPromptsPage() {
  const navigate =
    useNavigate();

  const {
    token,
  } = useAuth();

  /*
   * ===============================================
   * STATE
   * ===============================================
   */

  const [
    prompts,
    setPrompts,
  ] =
    useState<SavedPrompt[]>([]);

  const [
    isLoading,
    setIsLoading,
  ] =
    useState(true);

  const [
    loadError,
    setLoadError,
  ] =
    useState<string | null>(
      null,
    );

  const [
    actionError,
    setActionError,
  ] =
    useState<string | null>(
      null,
    );

  const [
    activeActionId,
    setActiveActionId,
  ] =
    useState<string | null>(
      null,
    );

  const [
    searchQuery,
    setSearchQuery,
  ] =
    useState("");

  const [
    categoryFilter,
    setCategoryFilter,
  ] =
    useState<CategoryFilter>(
      "all",
    );

  /*
   * ===============================================
   * LOAD SAVED PROMPTS
   * ===============================================
   */

  const loadSavedPrompts =
    useCallback(
      async () => {
        if (!token) {
          setPrompts([]);

          setLoadError(
            "Your authenticated session is not available. Please sign in again.",
          );

          setIsLoading(
            false,
          );

          return;
        }

        setIsLoading(
          true,
        );

        setLoadError(
          null,
        );

        try {
          const savedPrompts =
            await fetchSavedPrompts(
              token,
            );

          setPrompts(
            savedPrompts,
          );
        } catch (error) {
          devError(
            "Unable to load saved prompts:",
            error,
          );

          setPrompts([]);

          setLoadError(
            getActionErrorMessage(
              error,
              "Unable to load your saved prompts. Please try again.",
            ),
          );
        } finally {
          setIsLoading(
            false,
          );
        }
      },
      [
        token,
      ],
    );

  useEffect(() => {
    void loadSavedPrompts();
  }, [
    loadSavedPrompts,
  ]);

  /*
   * ===============================================
   * FILTERED PROMPTS
   * ===============================================
   */

  const filteredPrompts =
    useMemo(() => {
      const normalizedSearch =
        searchQuery
          .trim()
          .toLowerCase();

      return prompts.filter(
        (prompt) => {
          const matchesCategory =
            categoryFilter ===
              "all" ||
            prompt.category ===
              categoryFilter;

          if (!matchesCategory) {
            return false;
          }

          if (!normalizedSearch) {
            return true;
          }

          const searchableText = [
            prompt.title,
            prompt.content,
            prompt.category,
          ]
            .join(" ")
            .toLowerCase();

          return searchableText.includes(
            normalizedSearch,
          );
        },
      );
    }, [
      prompts,
      searchQuery,
      categoryFilter,
    ]);

  /*
   * ===============================================
   * FAVORITE
   * ===============================================
   */

  async function handleToggleFavorite(
    prompt: SavedPrompt,
  ) {
    if (
      !token ||
      activeActionId
    ) {
      return;
    }

    setActiveActionId(
      prompt.id,
    );

    setActionError(
      null,
    );

    try {
      const updatedPrompt =
        await toggleSavedPromptFavoriteApi(
          token,
          prompt.id,
        );

      setPrompts(
        (currentPrompts) =>
          currentPrompts.map(
            (currentPrompt) =>
              currentPrompt.id ===
              updatedPrompt.id
                ? updatedPrompt
                : currentPrompt,
          ),
      );
    } catch (error) {
      devError(
        "Unable to update favorite:",
        error,
      );

      setActionError(
        getActionErrorMessage(
          error,
          "Unable to update the favorite status.",
        ),
      );
    } finally {
      setActiveActionId(
        null,
      );
    }
  }

  /*
   * ===============================================
   * DUPLICATE
   * ===============================================
   */

  async function handleDuplicatePrompt(
    prompt: SavedPrompt,
  ) {
    if (
      !token ||
      activeActionId
    ) {
      return;
    }

    setActiveActionId(
      prompt.id,
    );

    setActionError(
      null,
    );

    try {
      const duplicatedPrompt =
        await duplicateSavedPromptApi(
          token,
          prompt,
        );

      /*
       * Backend orders newest prompts first,
       * so place the new copy first locally too.
       */
      setPrompts(
        (currentPrompts) => [
          duplicatedPrompt,
          ...currentPrompts,
        ],
      );
    } catch (error) {
      devError(
        "Unable to duplicate prompt:",
        error,
      );

      setActionError(
        getActionErrorMessage(
          error,
          "Unable to duplicate this prompt.",
        ),
      );
    } finally {
      setActiveActionId(
        null,
      );
    }
  }

  /*
   * ===============================================
   * DELETE
   * ===============================================
   */

  async function handleDeletePrompt(
    prompt: SavedPrompt,
  ) {
    if (
      !token ||
      activeActionId
    ) {
      return;
    }

    setActiveActionId(
      prompt.id,
    );

    setActionError(
      null,
    );

    try {
      await deleteSavedPromptApi(
        token,
        prompt.id,
      );

      setPrompts(
        (currentPrompts) =>
          currentPrompts.filter(
            (currentPrompt) =>
              currentPrompt.id !==
              prompt.id,
          ),
      );
    } catch (error) {
      devError(
        "Unable to delete prompt:",
        error,
      );

      setActionError(
        getActionErrorMessage(
          error,
          "Unable to delete this prompt.",
        ),
      );
    } finally {
      setActiveActionId(
        null,
      );
    }
  }

  /*
   * ===============================================
   * NAVIGATION
   * ===============================================
   */

  function handleNewPrompt() {
    navigate("/");
  }

  function handleOpenPrompt(
    prompt: SavedPrompt,
  ) {
    navigate(
      `/prompts/${prompt.id}`,
      {
        state: {
          savedPrompt:
            prompt,
        },
      },
    );
  }

  /*
   * ===============================================
   * FILTERS
   * ===============================================
   */

  function handleClearFilters() {
    setSearchQuery("");

    setCategoryFilter(
      "all",
    );
  }

  /*
   * ===============================================
   * DERIVED STATE
   * ===============================================
   */

  const hasPrompts =
    prompts.length > 0;

  const hasResults =
    filteredPrompts.length >
    0;

  const hasActiveFilters =
    searchQuery
      .trim()
      .length >
      0 ||
    categoryFilter !==
      "all";

  /*
   * ===============================================
   * RENDER
   * ===============================================
   */

  return (
    <PageContainer>
      <div className="mx-auto w-full max-w-6xl py-4 sm:py-8">

        {/* HEADER */}

        <header className="flex flex-col gap-5 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <p className="text-sm font-medium text-primary">
              Library
            </p>

            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
              My Prompts
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-text-secondary">
              Search, filter, and manage the
              prompts you have saved.
            </p>
          </div>

          <button
            type="button"
            onClick={
              handleNewPrompt
            }
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-prompt-md bg-primary px-4 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
          >
            <Plus
              aria-hidden="true"
              className="size-4"
            />

            New Prompt
          </button>

        </header>

        {/* ACTION ERROR */}

        {actionError && (
          <div
            role="alert"
            className="mt-5 flex items-start gap-3 rounded-prompt-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            <AlertCircle
              aria-hidden="true"
              className="mt-0.5 size-4 shrink-0"
            />

            <p className="leading-6">
              {actionError}
            </p>
          </div>
        )}

        {/* LOADING */}

        {isLoading ? (
          <section className="mt-7">
            <PromptListSkeleton />
          </section>
        ) : loadError ? (

          /* LOAD ERROR */

          <section className="flex min-h-80 flex-col items-center justify-center px-4 py-16 text-center">

            <div className="flex size-12 items-center justify-center rounded-prompt-lg bg-red-50 text-red-600">
              <AlertCircle
                aria-hidden="true"
                className="size-5"
              />
            </div>

            <h2 className="mt-5 text-lg font-semibold text-text-primary">
              Unable to load prompts
            </h2>

            <p className="mt-2 max-w-md text-sm leading-6 text-text-secondary">
              {loadError}
            </p>

            <button
              type="button"
              onClick={() =>
                void loadSavedPrompts()
              }
              className="mt-5 inline-flex min-h-10 items-center justify-center gap-2 rounded-prompt-md border border-border bg-surface px-4 text-sm font-medium text-text-secondary transition-colors hover:bg-background hover:text-text-primary"
            >
              <RefreshCw
                aria-hidden="true"
                className="size-4"
              />

              Try Again
            </button>

          </section>
        ) : !hasPrompts ? (

          /* EMPTY */

          <section className="flex min-h-80 flex-col items-center justify-center px-4 py-16 text-center">

            <div className="flex size-12 items-center justify-center rounded-prompt-lg bg-primary-soft text-primary">
              <FileText
                aria-hidden="true"
                className="size-5"
              />
            </div>

            <h2 className="mt-5 text-lg font-semibold text-text-primary">
              No saved prompts yet
            </h2>

            <p className="mt-2 max-w-md text-sm leading-6 text-text-secondary">
              Create a prompt with Smart
              Builder and save it to keep it
              here.
            </p>

            <button
              type="button"
              onClick={
                handleNewPrompt
              }
              className="mt-5 inline-flex min-h-10 items-center justify-center gap-2 rounded-prompt-md bg-primary px-4 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
            >
              <Plus
                aria-hidden="true"
                className="size-4"
              />

              Create Prompt
            </button>

          </section>
        ) : (
          <>
            {/* SEARCH + FILTER */}

            <section className="mt-6">

              <div className="relative">
                <Search
                  aria-hidden="true"
                  className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-text-muted"
                />

                <input
                  type="search"
                  value={
                    searchQuery
                  }
                  onChange={(
                    event,
                  ) =>
                    setSearchQuery(
                      event.target.value,
                    )
                  }
                  placeholder="Search prompts..."
                  aria-label="Search saved prompts"
                  className="min-h-11 w-full rounded-prompt-md border border-border bg-surface py-2 pl-11 pr-11 text-sm text-text-primary outline-none transition placeholder:text-text-muted focus:border-primary focus:ring-4 focus:ring-primary-soft"
                />

                {searchQuery && (
                  <button
                    type="button"
                    onClick={() =>
                      setSearchQuery(
                        "",
                      )
                    }
                    aria-label="Clear search"
                    className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-prompt-md text-text-muted transition-colors hover:bg-background hover:text-text-primary"
                  >
                    <X
                      aria-hidden="true"
                      className="size-4"
                    />
                  </button>
                )}
              </div>

              <div className="mt-4 overflow-x-auto pb-1">
                <div className="flex min-w-max items-center gap-2">

                  {categoryFilters.map(
                    (filter) => {
                      const isActive =
                        categoryFilter ===
                        filter.value;

                      return (
                        <button
                          key={
                            filter.value
                          }
                          type="button"
                          onClick={() =>
                            setCategoryFilter(
                              filter.value,
                            )
                          }
                          className={`inline-flex min-h-9 items-center justify-center rounded-full border px-4 text-xs font-medium transition-colors ${
                            isActive
                              ? "border-primary bg-primary text-white"
                              : "border-border bg-surface text-text-secondary hover:border-primary/30 hover:text-text-primary"
                          }`}
                        >
                          {filter.label}
                        </button>
                      );
                    },
                  )}

                </div>
              </div>

            </section>

            {/* RESULTS */}

            <section className="mt-6">

              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">

                <p className="text-sm text-text-secondary">
                  {filteredPrompts.length ===
                  1
                    ? "1 prompt"
                    : `${filteredPrompts.length} prompts`}
                </p>

                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={
                      handleClearFilters
                    }
                    className="text-xs font-medium text-primary transition-colors hover:text-primary-hover"
                  >
                    Clear filters
                  </button>
                )}

              </div>

              {hasResults ? (
                <div className="grid gap-4 md:grid-cols-2">

                  {filteredPrompts.map(
                    (prompt) => (
                      <PromptCard
                        key={
                          prompt.id
                        }
                        prompt={
                          prompt
                        }
                        onOpen={
                          handleOpenPrompt
                        }
                        onToggleFavorite={
                          handleToggleFavorite
                        }
                        onDuplicate={
                          handleDuplicatePrompt
                        }
                        onDelete={
                          handleDeletePrompt
                        }
                      />
                    ),
                  )}

                </div>
              ) : (
                <div className="flex min-h-64 flex-col items-center justify-center rounded-prompt-lg border border-border bg-surface px-4 py-12 text-center">

                  <div className="flex size-11 items-center justify-center rounded-prompt-lg bg-background text-text-secondary">
                    <Search
                      aria-hidden="true"
                      className="size-5"
                    />
                  </div>

                  <h2 className="mt-4 text-base font-semibold text-text-primary">
                    No prompts found
                  </h2>

                  <p className="mt-2 max-w-sm text-sm leading-6 text-text-secondary">
                    Try another search or
                    choose a different
                    category.
                  </p>

                  <button
                    type="button"
                    onClick={
                      handleClearFilters
                    }
                    className="mt-5 inline-flex min-h-10 items-center justify-center rounded-prompt-md border border-border bg-surface px-4 text-sm font-medium text-text-secondary transition-colors hover:bg-background hover:text-text-primary"
                  >
                    Clear filters
                  </button>

                </div>
              )}

            </section>
          </>
        )}

      </div>
    </PageContainer>
  );
}

export default MyPromptsPage;