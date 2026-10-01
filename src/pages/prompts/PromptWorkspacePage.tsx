import {
  devError,
} from "../../utils/devLogger";

import {
  useEffect,
  useState,
} from "react";

import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  AlertCircle,
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  Check,
  Copy,
  Pencil,
  RefreshCw,
  RotateCcw,
  Sparkles,
  X,
} from "lucide-react";

import PageContainer from "../../components/layout/PageContainer";

import {
  useAuth,
} from "../../hooks/useAuth";

import {
  ApiError,
} from "../../services/api";

import {
  createSavedPromptApi,
  fetchSavedPromptById,
  updateSavedPromptApi,
} from "../../services/savedPromptService";

import {
  clearPromptSession,
  getGeneratedPrompt,
  saveGeneratedPrompt,
} from "../../utils/promptSessionStorage";

import type {
  GeneratedPrompt,
} from "../../types/builder";

import type {
  SavedPrompt,
} from "../../types/savedPrompt";

/*
 * =====================================================
 * LOCATION STATE
 * =====================================================
 */

interface PromptWorkspaceLocationState {
  prompt?: GeneratedPrompt;
  savedPrompt?: SavedPrompt;
}

/*
 * =====================================================
 * HELPERS
 * =====================================================
 */

function formatCategory(
  category: GeneratedPrompt["category"],
): string {
  return (
    category.charAt(0).toUpperCase() +
    category.slice(1)
  );
}

function savedPromptToGeneratedPrompt(
  savedPrompt: SavedPrompt,
): GeneratedPrompt {
  return {
    id:
      savedPrompt.id,

    title:
      savedPrompt.title,

    content:
      savedPrompt.content,

    category:
      savedPrompt.category,

    createdAt:
      savedPrompt.createdAt,
  };
}

/*
 * =====================================================
 * PAGE
 * =====================================================
 */

function PromptWorkspacePage() {
  const navigate =
    useNavigate();

  const location =
    useLocation();

  const {
    id,
  } = useParams();

  const {
    token,
  } = useAuth();

  const state =
    location.state as
      | PromptWorkspaceLocationState
      | null;

  /*
   * ===================================================
   * INCOMING DATA
   * ===================================================
   */

  const incomingGeneratedPrompt =
    state?.prompt;

  const incomingSavedPrompt =
    state?.savedPrompt;

  const incomingPrompt =
    incomingGeneratedPrompt
      ? incomingGeneratedPrompt
      : incomingSavedPrompt
        ? savedPromptToGeneratedPrompt(
            incomingSavedPrompt,
          )
        : null;

  /*
   * ===================================================
   * SESSION FALLBACK
   * ===================================================
   */

  const sessionPrompt =
    (() => {
      const storedPrompt =
        getGeneratedPrompt();

      if (
        storedPrompt &&
        storedPrompt.id === id
      ) {
        return storedPrompt;
      }

      return null;
    })();

  /*
   * ===================================================
   * INITIAL PROMPT
   * ===================================================
   */

  const initialPrompt =
    incomingPrompt ??
    sessionPrompt;

  /*
   * ===================================================
   * WORKSPACE STATE
   * ===================================================
   */

  const [
    prompt,
    setPrompt,
  ] =
    useState<GeneratedPrompt | null>(
      initialPrompt,
    );

  const [
    draftContent,
    setDraftContent,
  ] =
    useState(
      initialPrompt?.content ??
        "",
    );

  const [
    isEditing,
    setIsEditing,
  ] =
    useState(false);

  const [
    copied,
    setCopied,
  ] =
    useState(false);

  /*
   * True means this prompt already exists
   * in PostgreSQL.
   */

  const [
    hasPersistentRecord,
    setHasPersistentRecord,
  ] =
    useState(
      Boolean(
        incomingSavedPrompt,
      ),
    );

  /*
   * True means the current Workspace content
   * matches the PostgreSQL version.
   */

  const [
    isSaved,
    setIsSaved,
  ] =
    useState(
      Boolean(
        incomingSavedPrompt,
      ),
    );

  const [
    isSaving,
    setIsSaving,
  ] =
    useState(false);

  const [
    isLoadingPrompt,
    setIsLoadingPrompt,
  ] =
    useState(
      initialPrompt === null,
    );

  const [
    loadError,
    setLoadError,
  ] =
    useState<string | null>(
      null,
    );

  const [
    saveError,
    setSaveError,
  ] =
    useState<string | null>(
      null,
    );

  /*
   * ===================================================
   * LOAD SAVED PROMPT FROM POSTGRESQL
   * ===================================================
   *
   * Normal My Prompts navigation already provides
   * the saved prompt through navigation state.
   *
   * A page refresh loses that navigation state,
   * so we fetch the prompt again using its ID.
   */

  useEffect(() => {
    /*
     * A saved prompt came directly from
     * My Prompts.
     */
    if (
      incomingSavedPrompt
    ) {
      setHasPersistentRecord(
        true,
      );

      setIsSaved(
        true,
      );

      setIsLoadingPrompt(
        false,
      );

      return;
    }

    /*
     * A brand-new generated prompt came directly
     * from Smart Builder.
     *
     * It does not exist in PostgreSQL yet.
     */
    if (
      incomingGeneratedPrompt
    ) {
      setHasPersistentRecord(
        false,
      );

      setIsSaved(
        false,
      );

      setIsLoadingPrompt(
        false,
      );

      return;
    }

    /*
     * Refresh/direct URL.
     *
     * Check PostgreSQL to determine whether this
     * prompt already exists permanently.
     */

    if (
      !id ||
      !token
    ) {
      setIsLoadingPrompt(
        false,
      );

      return;
    }

    let isCancelled =
      false;

    async function loadPrompt() {
      setLoadError(
        null,
      );

      if (!initialPrompt) {
        setIsLoadingPrompt(
          true,
        );
      }

      try {
        const savedPrompt =
          await fetchSavedPromptById(
            token!,
            id!,
          );

        if (isCancelled) {
          return;
        }

        const restoredPrompt =
          savedPromptToGeneratedPrompt(
            savedPrompt,
          );

        setPrompt(
          restoredPrompt,
        );

        setDraftContent(
          restoredPrompt.content,
        );

        setHasPersistentRecord(
          true,
        );

        setIsSaved(
          true,
        );
      } catch (error) {
        if (isCancelled) {
          return;
        }

        /*
         * 404 is normal when the Workspace contains
         * a generated prompt that has not been saved
         * to PostgreSQL yet.
         */

        if (
          error instanceof
            ApiError &&
          error.status ===
            404
        ) {
          if (
            initialPrompt
          ) {
            setHasPersistentRecord(
              false,
            );

            setIsSaved(
              false,
            );

            return;
          }

          setLoadError(
            "This saved prompt could not be found.",
          );

          return;
        }

        devError(
          "Unable to load prompt:",
          error,
        );

        if (
          error instanceof
          ApiError
        ) {
          if (
            error.status ===
            401
          ) {
            setLoadError(
              "Your session is no longer valid. Please sign in again.",
            );
          } else {
            setLoadError(
              error.message,
            );
          }
        } else {
          setLoadError(
            "Unable to load this prompt. Please try again.",
          );
        }
      } finally {
        if (
          !isCancelled
        ) {
          setIsLoadingPrompt(
            false,
          );
        }
      }
    }

    void loadPrompt();

    return () => {
      isCancelled =
        true;
    };
  }, [
    id,
    token,
  ]);

  /*
   * ===================================================
   * COPY FEEDBACK
   * ===================================================
   */

  useEffect(() => {
    if (!copied) {
      return;
    }

    const timeout =
      window.setTimeout(
        () => {
          setCopied(
            false,
          );
        },
        2000,
      );

    return () => {
      window.clearTimeout(
        timeout,
      );
    };
  }, [
    copied,
  ]);

  /*
   * ===================================================
   * TEMPORARY WORKSPACE PERSISTENCE
   * ===================================================
   *
   * sessionStorage is still useful for the active
   * Workspace.
   *
   * PostgreSQL is now responsible for permanent
   * Saved Prompts.
   */

  useEffect(() => {
    if (!prompt) {
      return;
    }

    saveGeneratedPrompt(
      prompt,
    );
  }, [
    prompt,
  ]);

  /*
   * ===================================================
   * SAVE TO POSTGRESQL
   * ===================================================
   */

  async function handleSavePrompt() {
    if (
      !prompt ||
      !token ||
      isSaving
    ) {
      return;
    }

    setIsSaving(
      true,
    );

    setSaveError(
      null,
    );

    try {
      let savedPrompt:
        SavedPrompt;

      /*
       * Existing PostgreSQL record.
       *
       * This happens when the user opens a saved
       * prompt, edits it, and saves the changes.
       */
      if (
        hasPersistentRecord
      ) {
        savedPrompt =
          await updateSavedPromptApi(
            token,
            prompt.id,
            {
              title:
                prompt.title,

              content:
                prompt.content,

              category:
                prompt.category,
            },
          );
      } else {
        /*
         * First permanent save.
         */

        savedPrompt =
          await createSavedPromptApi(
            token,
            {
              id:
                prompt.id,

              title:
                prompt.title,

              content:
                prompt.content,

              category:
                prompt.category,

              isFavorite:
                false,
            },
          );
      }

      /*
       * Synchronize Workspace with the exact
       * server response.
       */

      const synchronizedPrompt =
        savedPromptToGeneratedPrompt(
          savedPrompt,
        );

      setPrompt(
        synchronizedPrompt,
      );

      setDraftContent(
        synchronizedPrompt.content,
      );

      setHasPersistentRecord(
        true,
      );

      setIsSaved(
        true,
      );
    } catch (error) {
      devError(
        "Unable to save prompt:",
        error,
      );

      if (
        error instanceof
        ApiError
      ) {
        if (
          error.status ===
          401
        ) {
          setSaveError(
            "Your session is no longer valid. Please sign in again.",
          );
        } else if (
          error.status ===
          409
        ) {
          /*
           * A record with this ID already exists.
           *
           * This should normally be discovered when
           * the Workspace reloads, but this message
           * prevents silent failure if a race occurs.
           */

          setSaveError(
            "This prompt already exists in your library. Refresh the page and try again.",
          );
        } else {
          setSaveError(
            error.message,
          );
        }
      } else {
        setSaveError(
          "Unable to save your prompt. Please try again.",
        );
      }
    } finally {
      setIsSaving(
        false,
      );
    }
  }

  /*
   * ===================================================
   * EDITING
   * ===================================================
   */

  function handleStartEditing() {
    if (!prompt) {
      return;
    }

    setDraftContent(
      prompt.content,
    );

    setSaveError(
      null,
    );

    setIsEditing(
      true,
    );
  }

  function handleCancelEditing() {
    if (!prompt) {
      return;
    }

    setDraftContent(
      prompt.content,
    );

    setIsEditing(
      false,
    );
  }

  function handleSaveEditing() {
    if (!prompt) {
      return;
    }

    const trimmedContent =
      draftContent.trim();

    if (!trimmedContent) {
      return;
    }

    /*
     * Nothing changed.
     */

    if (
      trimmedContent ===
      prompt.content
    ) {
      setDraftContent(
        prompt.content,
      );

      setIsEditing(
        false,
      );

      return;
    }

    /*
     * Update only the active Workspace first.
     *
     * The permanent PostgreSQL copy is updated
     * when Save Prompt is pressed.
     */

    setPrompt({
      ...prompt,
      content:
        trimmedContent,
    });

    setDraftContent(
      trimmedContent,
    );

    setIsEditing(
      false,
    );

    setIsSaved(
      false,
    );

    setSaveError(
      null,
    );
  }

  /*
   * ===================================================
   * COPY
   * ===================================================
   */

  async function handleCopy() {
    if (!prompt) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        prompt.content,
      );

      setCopied(
        true,
      );
    } catch (error) {
      devError(
        "Unable to copy prompt:",
        error,
      );

      setCopied(
        false,
      );
    }
  }

  /*
   * ===================================================
   * NAVIGATION
   * ===================================================
   */

  function handleBack() {
    navigate(-1);
  }

  function handleStartOver() {
    clearPromptSession();

    navigate("/");
  }

  /*
   * ===================================================
   * RETRY LOAD
   * ===================================================
   */

  function handleRetryLoad() {
    window.location.reload();
  }

  /*
   * ===================================================
   * DERIVED STATE
   * ===================================================
   */

  const canSaveChanges =
    draftContent
      .trim()
      .length >
    0;

  /*
   * ===================================================
   * LOADING
   * ===================================================
   */

  if (
    isLoadingPrompt &&
    !prompt
  ) {
    return (
      <PageContainer>
        <div className="mx-auto flex min-h-100 w-full max-w-4xl items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="size-8 animate-spin rounded-full border-2 border-border border-t-primary" />

            <p className="text-sm text-text-secondary">
              Loading prompt...
            </p>
          </div>
        </div>
      </PageContainer>
    );
  }

  /*
   * ===================================================
   * LOAD ERROR
   * ===================================================
   */

  if (
    loadError &&
    !prompt
  ) {
    return (
      <PageContainer>
        <div className="mx-auto flex min-h-100 w-full max-w-4xl flex-col items-center justify-center px-4 text-center">

          <div className="flex size-12 items-center justify-center rounded-prompt-lg bg-red-50 text-red-600">
            <AlertCircle
              aria-hidden="true"
              className="size-5"
            />
          </div>

          <h1 className="mt-5 text-lg font-semibold text-text-primary">
            Unable to open prompt
          </h1>

          <p className="mt-2 max-w-md text-sm leading-6 text-text-secondary">
            {loadError}
          </p>

          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={
                handleRetryLoad
              }
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-prompt-md border border-border bg-surface px-4 text-sm font-medium text-text-secondary transition-colors hover:bg-background hover:text-text-primary"
            >
              <RefreshCw
                aria-hidden="true"
                className="size-4"
              />

              Try Again
            </button>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/prompts",
                )
              }
              className="inline-flex min-h-10 items-center justify-center rounded-prompt-md bg-primary px-4 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
            >
              My Prompts
            </button>
          </div>

        </div>
      </PageContainer>
    );
  }

  /*
   * ===================================================
   * INVALID WORKSPACE
   * ===================================================
   */

  if (
    !prompt ||
    !id
  ) {
    return (
      <Navigate
        to="/prompts"
        replace
      />
    );
  }

  if (
    prompt.id !==
    id
  ) {
    return (
      <Navigate
        to="/prompts"
        replace
      />
    );
  }

  /*
   * ===================================================
   * RENDER
   * ===================================================
   */

  return (
    <PageContainer>
      <div className="mx-auto w-full max-w-4xl py-4 sm:py-8">

        {/* ========================================= */}
        {/* TOP NAVIGATION                            */}
        {/* ========================================= */}

        <header className="flex items-center justify-between gap-4">

          <button
            type="button"
            onClick={
              handleBack
            }
            className="inline-flex min-h-10 items-center gap-2 rounded-prompt-md px-3 text-sm font-medium text-text-secondary transition-colors hover:bg-surface hover:text-text-primary"
          >
            <ArrowLeft
              aria-hidden="true"
              className="size-4"
            />

            Back
          </button>

          <div className="flex items-center gap-2 text-sm font-medium text-primary">
            <Sparkles
              aria-hidden="true"
              className="size-4"
            />

            Prompt Workspace
          </div>

        </header>

        <main className="mt-8">

          {/* ======================================= */}
          {/* WORKSPACE HEADER                        */}
          {/* ======================================= */}

          <section className="border-b border-border pb-6">

            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

              <div className="min-w-0">

                <div className="flex flex-wrap items-center gap-2">

                  <span className="rounded-full bg-primary-soft px-3 py-1 text-xs font-medium text-primary">
                    {formatCategory(
                      prompt.category,
                    )}
                  </span>

                  <span className="text-xs text-text-muted">
                    {hasPersistentRecord
                      ? "Saved prompt"
                      : "Generated prompt"}
                  </span>

                </div>

                <h1 className="mt-4 wrap-break-word text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
                  {prompt.title}
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-text-secondary">
                  Review, edit, copy, or save your
                  structured prompt.
                </p>

              </div>

              {/* SAVE PROMPT */}

              <button
                type="button"
                onClick={
                  handleSavePrompt
                }
                disabled={
                  isSaved ||
                  isSaving
                }
                className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-prompt-md bg-primary px-4 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:cursor-default disabled:bg-primary-soft disabled:text-primary"
              >

                {isSaved ? (
                  <BookmarkCheck
                    aria-hidden="true"
                    className="size-4"
                  />
                ) : (
                  <Bookmark
                    aria-hidden="true"
                    className="size-4"
                  />
                )}

                {isSaving
                  ? "Saving..."
                  : isSaved
                    ? "Saved"
                    : hasPersistentRecord
                      ? "Save Changes"
                      : "Save Prompt"}

              </button>

            </div>

            {/* SAVE ERROR */}

            {saveError && (
              <div className="mt-4 flex items-start gap-3 rounded-prompt-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">

                <AlertCircle
                  aria-hidden="true"
                  className="mt-0.5 size-4 shrink-0"
                />

                <p className="leading-6">
                  {saveError}
                </p>

              </div>
            )}

          </section>

          {/* ======================================= */}
          {/* PROMPT CARD                             */}
          {/* ======================================= */}

          <section className="mt-7">

            <div className="overflow-hidden rounded-prompt-lg border border-border bg-surface">

              {/* CARD HEADER */}

              <div className="flex flex-col gap-4 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">

                <div>
                  <p className="text-sm font-semibold text-text-primary">
                    Prompt
                  </p>

                  <p className="mt-1 text-xs text-text-muted">
                    {isEditing
                      ? "Editing your prompt"
                      : isSaved
                        ? "Saved to My Prompts"
                        : hasPersistentRecord
                          ? "You have unsaved changes"
                          : "Generated by Smart Builder"}
                  </p>
                </div>

                {!isEditing && (
                  <div className="flex flex-wrap items-center gap-2">

                    {/* EDIT */}

                    <button
                      type="button"
                      onClick={
                        handleStartEditing
                      }
                      className="inline-flex min-h-9 items-center justify-center gap-2 rounded-prompt-md border border-border bg-surface px-3 text-sm font-medium text-text-secondary transition-colors hover:bg-background hover:text-text-primary"
                    >
                      <Pencil
                        aria-hidden="true"
                        className="size-4"
                      />

                      Edit
                    </button>

                    {/* COPY */}

                    <button
                      type="button"
                      onClick={
                        handleCopy
                      }
                      className="inline-flex min-h-9 items-center justify-center gap-2 rounded-prompt-md bg-primary px-3 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
                    >

                      {copied ? (
                        <Check
                          aria-hidden="true"
                          className="size-4"
                        />
                      ) : (
                        <Copy
                          aria-hidden="true"
                          className="size-4"
                        />
                      )}

                      {copied
                        ? "Copied"
                        : "Copy"}

                    </button>

                  </div>
                )}

              </div>

              {/* CONTENT */}

              <div className="p-5 sm:p-6">

                {isEditing ? (
                  <textarea
                    value={
                      draftContent
                    }
                    onChange={(
                      event,
                    ) =>
                      setDraftContent(
                        event.target.value,
                      )
                    }
                    rows={16}
                    autoFocus
                    aria-label="Edit generated prompt"
                    className="min-h-80 w-full resize-y rounded-prompt-md border border-border bg-background px-4 py-4 font-sans text-sm leading-7 text-text-primary outline-none transition placeholder:text-text-muted focus:border-primary focus:ring-4 focus:ring-primary-soft"
                  />
                ) : (
                  <pre className="whitespace-pre-wrap wrap-break-word font-sans text-sm leading-7 text-text-primary">
                    {prompt.content}
                  </pre>
                )}

              </div>

              {/* EDIT ACTIONS */}

              {isEditing && (
                <div className="flex flex-col-reverse gap-3 border-t border-border px-5 py-4 sm:flex-row sm:justify-end sm:px-6">

                  <button
                    type="button"
                    onClick={
                      handleCancelEditing
                    }
                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-prompt-md border border-border bg-surface px-4 text-sm font-medium text-text-secondary transition-colors hover:bg-background hover:text-text-primary"
                  >
                    <X
                      aria-hidden="true"
                      className="size-4"
                    />

                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={
                      handleSaveEditing
                    }
                    disabled={
                      !canSaveChanges
                    }
                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-prompt-md bg-primary px-4 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Check
                      aria-hidden="true"
                      className="size-4"
                    />

                    Apply Changes
                  </button>

                </div>
              )}

            </div>

          </section>

          {/* ======================================= */}
          {/* PROMPT INFORMATION                      */}
          {/* ======================================= */}

          <section className="mt-6 rounded-prompt-lg border border-border bg-surface p-5 sm:p-6">

            <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
              About this prompt
            </p>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">

              <div>
                <p className="text-xs text-text-muted">
                  Category
                </p>

                <p className="mt-1 text-sm font-medium text-text-primary">
                  {formatCategory(
                    prompt.category,
                  )}
                </p>
              </div>

              <div>
                <p className="text-xs text-text-muted">
                  Status
                </p>

                <p className="mt-1 text-sm font-medium text-text-primary">
                  {isSaved
                    ? "Saved"
                    : hasPersistentRecord
                      ? "Unsaved changes"
                      : "Ready to save"}
                </p>
              </div>

            </div>

          </section>

          {/* ======================================= */}
          {/* START OVER                              */}
          {/* ======================================= */}

          <section className="mt-6 flex justify-start">

            <button
              type="button"
              onClick={
                handleStartOver
              }
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-prompt-md px-3 text-sm font-medium text-text-secondary transition-colors hover:bg-surface hover:text-text-primary"
            >
              <RotateCcw
                aria-hidden="true"
                className="size-4"
              />

              Start Over
            </button>

          </section>

        </main>

      </div>
    </PageContainer>
  );
}

export default PromptWorkspacePage;