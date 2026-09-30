import {
  devError,
} from "../../utils/devLogger";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  AlertCircle,
  Bookmark,
  Check,
  RefreshCw,
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
  fetchFavoritePrompts,
  toggleSavedPromptFavoriteApi,
} from "../../services/savedPromptService";

import type {
  SavedPrompt,
} from "../../types/savedPrompt";

/*
 * ===============================================
 * ERROR MESSAGE
 * ===============================================
 */

function getErrorMessage(
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

function FavoritesPage() {
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
    actionMessage,
    setActionMessage,
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

  /*
   * ===============================================
   * LOAD FAVORITES FROM POSTGRESQL
   * ===============================================
   */

  const loadFavorites =
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
          const favoritePrompts =
            await fetchFavoritePrompts(
              token,
            );

          setPrompts(
            favoritePrompts,
          );
        } catch (error) {
          devError(
            "Unable to load favorites:",
            error,
          );

          setPrompts([]);

          setLoadError(
            getErrorMessage(
              error,
              "Unable to load your favorite prompts.",
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
    void loadFavorites();
  }, [
    loadFavorites,
  ]);

  /*
   * ===============================================
   * OPEN
   * ===============================================
   */

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
   * REMOVE FAVORITE
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

    setActionMessage(
      null,
    );

    try {
      const updatedPrompt =
        await toggleSavedPromptFavoriteApi(
          token,
          prompt.id,
        );

      /*
       * If it is no longer favorite,
       * remove it from this page.
       */
      if (
        !updatedPrompt.isFavorite
      ) {
        setPrompts(
          (currentPrompts) =>
            currentPrompts.filter(
              (currentPrompt) =>
                currentPrompt.id !==
                prompt.id,
            ),
        );

        return;
      }

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
        getErrorMessage(
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

    setActionMessage(
      null,
    );

    try {
      await duplicateSavedPromptApi(
        token,
        prompt,
      );

      /*
       * Duplicates start as non-favorites,
       * so they belong in My Prompts but do not
       * appear on the Favorites page.
       */
      setActionMessage(
        "Copy saved to My Prompts.",
      );
    } catch (error) {
      devError(
        "Unable to duplicate prompt:",
        error,
      );

      setActionError(
        getErrorMessage(
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

    setActionMessage(
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
        getErrorMessage(
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
   * BROWSE
   * ===============================================
   */

  function handleBrowsePrompts() {
    navigate(
      "/prompts",
    );
  }

  /*
   * ===============================================
   * RENDER
   * ===============================================
   */

  return (
    <PageContainer>
      <div className="mx-auto w-full max-w-6xl py-4 sm:py-8">

        {/* HEADER */}

        <header className="border-b border-border pb-6">

          <p className="text-sm font-medium text-primary">
            Library
          </p>

          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
            Favorites
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-text-secondary">
            Keep your most useful prompts
            easy to find.
          </p>

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

        {/* SUCCESS MESSAGE */}

        {actionMessage && (
          <div className="mt-5 flex items-start gap-3 rounded-prompt-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            <Check
              aria-hidden="true"
              className="mt-0.5 size-4 shrink-0"
            />

            <p className="leading-6">
              {actionMessage}
            </p>
          </div>
        )}

        {/* LOADING */}

        {isLoading ? (
          <section className="mt-7">
            <PromptListSkeleton />
          </section>
        ) : loadError ? (

          /* ERROR */

          <section className="flex min-h-80 flex-col items-center justify-center px-4 py-16 text-center">

            <div className="flex size-12 items-center justify-center rounded-prompt-lg bg-red-50 text-red-600">
              <AlertCircle
                aria-hidden="true"
                className="size-5"
              />
            </div>

            <h2 className="mt-5 text-lg font-semibold text-text-primary">
              Unable to load favorites
            </h2>

            <p className="mt-2 max-w-md text-sm leading-6 text-text-secondary">
              {loadError}
            </p>

            <button
              type="button"
              onClick={() =>
                void loadFavorites()
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
        ) : prompts.length === 0 ? (

          /* EMPTY */

          <section className="flex min-h-80 flex-col items-center justify-center px-4 py-16 text-center">

            <div className="flex size-12 items-center justify-center rounded-prompt-lg bg-primary-soft text-primary">
              <Bookmark
                aria-hidden="true"
                className="size-5"
              />
            </div>

            <h2 className="mt-5 text-lg font-semibold text-text-primary">
              No favorites yet
            </h2>

            <p className="mt-2 max-w-md text-sm leading-6 text-text-secondary">
              Favorite prompts from My
              Prompts to keep your most
              useful ones here.
            </p>

            <button
              type="button"
              onClick={
                handleBrowsePrompts
              }
              className="mt-5 inline-flex min-h-10 items-center justify-center rounded-prompt-md bg-primary px-4 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
            >
              Browse My Prompts
            </button>

          </section>
        ) : (

          /* FAVORITES */

          <section className="mt-7">

            <div className="mb-4">
              <p className="text-sm text-text-secondary">
                {prompts.length ===
                1
                  ? "1 favorite prompt"
                  : `${prompts.length} favorite prompts`}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">

              {prompts.map(
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

          </section>
        )}

      </div>
    </PageContainer>
  );
}

export default FavoritesPage;