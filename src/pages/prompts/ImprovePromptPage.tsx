import {
  devError,
} from "../../utils/devLogger";

import {
  useState,
} from "react";

import {
  ArrowLeft,
  Check,
  Copy,
  Sparkles,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import PageContainer from "../../components/layout/PageContainer";

import {
  ApiError,
} from "../../services/api";

import {
  improvePromptWithAi,
} from "../../services/aiService";

/*
 * ===============================================
 * IMPROVE PROMPT PAGE
 * ===============================================
 */

function ImprovePromptPage() {
  const navigate =
    useNavigate();

  /*
   * ===============================================
   * STATE
   * ===============================================
   */

  const [
    originalPrompt,
    setOriginalPrompt,
  ] = useState("");

  const [
    improvedPrompt,
    setImprovedPrompt,
  ] = useState("");

  const [
    isImproving,
    setIsImproving,
  ] = useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  const [
    copied,
    setCopied,
  ] = useState(false);

  /*
   * ===============================================
   * DERIVED STATE
   * ===============================================
   */

  const normalizedPrompt =
    originalPrompt.trim();

  const canImprove =
    normalizedPrompt.length > 0 &&
    !isImproving;

  /*
   * ===============================================
   * IMPROVE PROMPT
   * ===============================================
   */

  async function handleImprovePrompt() {
    /*
     * Prevent duplicate requests.
     */

    if (isImproving) {
      return;
    }

    /*
     * Validate the input before making
     * the network request.
     */

    if (!normalizedPrompt) {
      setErrorMessage(
        "Enter a prompt before trying to improve it.",
      );

      return;
    }

    /*
     * Reset previous request state.
     */

    setErrorMessage("");
    setImprovedPrompt("");
    setCopied(false);
    setIsImproving(true);

    try {
      /*
       * ===========================================
       * AI REQUEST
       * ===========================================
       */

      const result =
        await improvePromptWithAi({
          prompt:
            normalizedPrompt,
        });

      setImprovedPrompt(
        result.improvedPrompt,
      );
    } catch (error) {
      devError(
        "Unable to improve prompt.",
        error,
      );

      /*
       * ===========================================
       * API ERROR
       * ===========================================
       */

      if (error instanceof ApiError) {
        /*
         * Invalid request.
         */

        if (error.status === 400) {
          setErrorMessage(
            error.message,
          );

          return;
        }

        /*
         * AI provider is currently unavailable.
         *
         * This is the expected response until the
         * real AI provider is connected.
         */

        if (error.status === 503) {
          setErrorMessage(
            "AI prompt improvement is temporarily unavailable. You can try again.",
          );

          return;
        }

        /*
         * Other backend/API error.
         */

        setErrorMessage(
          error.message ||
            "Unable to improve the prompt.",
        );

        return;
      }

      /*
       * ===========================================
       * NETWORK / UNKNOWN ERROR
       * ===========================================
       */

      setErrorMessage(
        "Unable to reach the server. Check your connection and try again.",
      );
    } finally {
      /*
       * Always restore the button so the user
       * can retry after a failed request.
       */

      setIsImproving(false);
    }
  }

  /*
   * ===============================================
   * COPY
   * ===============================================
   */

  async function handleCopy() {
    if (!improvedPrompt) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        improvedPrompt,
      );

      setCopied(true);

      window.setTimeout(
        () => {
          setCopied(false);
        },
        1600,
      );
    } catch (error) {
      devError(
        "Unable to copy prompt.",
        error,
      );

      setErrorMessage(
        "Unable to copy the prompt.",
      );
    }
  }

  /*
   * ===============================================
   * BACK
   * ===============================================
   */

  function handleBack() {
    if (isImproving) {
      return;
    }

    navigate("/");
  }

  /*
   * ===============================================
   * RENDER
   * ===============================================
   */

  return (
    <PageContainer>
      <div className="mx-auto w-full max-w-4xl py-4 sm:py-8 lg:py-10">
        {/*
         * =========================================
         * HEADER
         * =========================================
         */}

        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={handleBack}
            disabled={isImproving}
            aria-label="Go back"
            className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-prompt-md border border-border bg-surface text-text-secondary transition-colors hover:bg-background hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ArrowLeft
              size={18}
              strokeWidth={1.8}
            />
          </button>

          <div className="min-w-0">
            <p className="text-sm font-medium text-primary">
              PROMPT.
            </p>

            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
              Improve your prompt
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-text-secondary">
              Paste an existing prompt and let
              PROMPT. make it clearer, more
              structured, and more useful.
            </p>
          </div>
        </div>

        {/*
         * =========================================
         * ORIGINAL PROMPT
         * =========================================
         */}

        <section className="mt-8 overflow-hidden rounded-prompt-lg border border-border bg-surface">
          <div className="border-b border-border px-5 py-4 sm:px-6">
            <h2 className="text-sm font-semibold text-text-primary">
              Your prompt
            </h2>

            <p className="mt-1 text-xs leading-5 text-text-muted">
              Enter the prompt you want to
              improve.
            </p>
          </div>

          <div className="p-5 sm:p-6">
            <label
              htmlFor="original-prompt"
              className="sr-only"
            >
              Prompt to improve
            </label>

            <textarea
              id="original-prompt"
              value={originalPrompt}
              onChange={(event) => {
                setOriginalPrompt(
                  event.target.value,
                );

                /*
                 * Remove an old error once the
                 * user starts editing again.
                 */

                if (errorMessage) {
                  setErrorMessage("");
                }
              }}
              placeholder="Example: Build me a portfolio website..."
              disabled={isImproving}
              rows={10}
              className="min-h-56 w-full resize-y rounded-prompt-md border border-border bg-background px-4 py-3 text-sm leading-6 text-text-primary outline-none transition-colors placeholder:text-text-muted focus:border-primary disabled:cursor-not-allowed disabled:opacity-60"
            />

            {/*
             * =====================================
             * ERROR
             * =====================================
             */}

            {errorMessage && (
              <div
                role="alert"
                aria-live="polite"
                className="mt-4 rounded-prompt-md border border-border bg-background px-4 py-3"
              >
                <p className="text-sm leading-6 text-text-secondary">
                  {errorMessage}
                </p>
              </div>
            )}

            {/*
             * =====================================
             * ACTION
             * =====================================
             */}

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={
                  () =>
                    void handleImprovePrompt()
                }
                disabled={!canImprove}
                aria-busy={isImproving}
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-prompt-md bg-primary px-5 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                <Sparkles
                  size={17}
                  strokeWidth={1.8}
                />

                {isImproving
                  ? "Improving..."
                  : errorMessage
                    ? "Try Again"
                    : "Improve Prompt"}
              </button>
            </div>

            {/*
             * =====================================
             * LOADING STATUS
             * =====================================
             */}

            {isImproving && (
              <p
                role="status"
                aria-live="polite"
                className="mt-3 text-right text-xs text-text-muted"
              >
                Improving your prompt...
              </p>
            )}
          </div>
        </section>

        {/*
         * =========================================
         * IMPROVED PROMPT
         * =========================================
         */}

        {improvedPrompt && (
          <section className="mt-6 overflow-hidden rounded-prompt-lg border border-border bg-surface">
            <div className="flex flex-col gap-3 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div>
                <h2 className="text-sm font-semibold text-text-primary">
                  Improved prompt
                </h2>

                <p className="mt-1 text-xs leading-5 text-text-muted">
                  Review the improved version
                  before using it.
                </p>
              </div>

              <button
                type="button"
                onClick={
                  () => void handleCopy()
                }
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-prompt-md border border-border bg-surface px-4 text-sm font-medium text-text-secondary transition-colors hover:bg-background hover:text-text-primary"
              >
                {copied ? (
                  <Check
                    size={16}
                    strokeWidth={1.8}
                  />
                ) : (
                  <Copy
                    size={16}
                    strokeWidth={1.8}
                  />
                )}

                {copied
                  ? "Copied"
                  : "Copy"}
              </button>
            </div>

            <div className="p-5 sm:p-6">
              <pre className="whitespace-pre-wrap wrap-break-word font-sans text-sm leading-7 text-text-primary">
                {improvedPrompt}
              </pre>
            </div>
          </section>
        )}
      </div>
    </PageContainer>
  );
}

export default ImprovePromptPage;