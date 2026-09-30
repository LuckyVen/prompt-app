import {
  useState,
} from "react";

import type {
  MouseEvent,
} from "react";

import {
  Bookmark,
  ChevronRight,
  CopyPlus,
  Trash2,
  X,
} from "lucide-react";

import type {
  SavedPrompt,
} from "../../types/savedPrompt";

interface PromptCardProps {
  prompt: SavedPrompt;

  onOpen: (
    prompt: SavedPrompt,
  ) => void;

  onToggleFavorite?: (
    prompt: SavedPrompt,
  ) => void;

  onDuplicate?: (
    prompt: SavedPrompt,
  ) => void;

  onDelete?: (
    prompt: SavedPrompt,
  ) => void;
}

function formatCategory(
  category: SavedPrompt["category"],
): string {
  return (
    category.charAt(0).toUpperCase() +
    category.slice(1)
  );
}

function formatDate(
  date: string,
): string {
  const parsedDate =
    new Date(date);

  if (
    Number.isNaN(
      parsedDate.getTime(),
    )
  ) {
    return "";
  }

  return new Intl.DateTimeFormat(
    undefined,
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    },
  ).format(parsedDate);
}

function PromptCard({
  prompt,
  onOpen,
  onToggleFavorite,
  onDuplicate,
  onDelete,
}: PromptCardProps) {
  const [
    isConfirmingDelete,
    setIsConfirmingDelete,
  ] =
    useState(false);

  /*
   * =============================================
   * OPEN
   * =============================================
   */

  function handleOpen() {
    onOpen(prompt);
  }

  /*
   * =============================================
   * FAVORITE
   * =============================================
   */

  function handleFavorite(
    event: MouseEvent<HTMLButtonElement>,
  ) {
    event.stopPropagation();

    onToggleFavorite?.(
      prompt,
    );
  }

  /*
   * =============================================
   * DUPLICATE
   * =============================================
   */

  function handleDuplicate(
    event: MouseEvent<HTMLButtonElement>,
  ) {
    event.stopPropagation();

    onDuplicate?.(
      prompt,
    );
  }

  /*
   * =============================================
   * DELETE CONFIRMATION
   * =============================================
   */

  function handleStartDelete(
    event: MouseEvent<HTMLButtonElement>,
  ) {
    event.stopPropagation();

    setIsConfirmingDelete(
      true,
    );
  }

  function handleCancelDelete(
    event: MouseEvent<HTMLButtonElement>,
  ) {
    event.stopPropagation();

    setIsConfirmingDelete(
      false,
    );
  }

  function handleConfirmDelete(
    event: MouseEvent<HTMLButtonElement>,
  ) {
    event.stopPropagation();

    onDelete?.(
      prompt,
    );
  }

  /*
   * =============================================
   * RENDER
   * =============================================
   */

  return (
    <article className="group min-w-0 overflow-hidden rounded-prompt-lg border border-border bg-surface transition-colors hover:border-primary/30">

      {/* ========================================= */}
      {/* MAIN CONTENT                              */}
      {/* ========================================= */}

      <button
        type="button"
        onClick={
          handleOpen
        }
        aria-label={`Open ${prompt.title}`}
        className="block w-full min-w-0 p-4 text-left sm:p-5 lg:p-6"
      >

        {/* HEADER */}

        <div className="flex min-w-0 items-start justify-between gap-3">

          <span className="shrink-0 rounded-full bg-primary-soft px-3 py-1 text-xs font-medium text-primary">
            {formatCategory(
              prompt.category,
            )}
          </span>

          <span className="min-w-0 shrink text-right text-xs text-text-muted">
            Updated{" "}
            {formatDate(
              prompt.updatedAt,
            )}
          </span>

        </div>

        {/* TITLE */}

        <h2 className="mt-4 wrap-break-word text-sm font-semibold leading-6 text-text-primary sm:text-base">
          {prompt.title}
        </h2>

        {/* CONTENT */}

        <p className="mt-2 line-clamp-3 wrap-break-word text-sm leading-6 text-text-secondary">
          {prompt.content}
        </p>

      </button>

      {/* ========================================= */}
      {/* NORMAL ACTION BAR                         */}
      {/* ========================================= */}

      {!isConfirmingDelete && (
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border-soft px-3 py-3 sm:px-5 lg:px-6">

          <div className="flex min-w-0 flex-wrap items-center gap-1">

            {/* FAVORITE */}

            {onToggleFavorite && (
              <button
                type="button"
                onClick={
                  handleFavorite
                }
                aria-label={
                  prompt.isFavorite
                    ? `Remove ${prompt.title} from favorites`
                    : `Add ${prompt.title} to favorites`
                }
                title={
                  prompt.isFavorite
                    ? "Remove from favorites"
                    : "Add to favorites"
                }
                className={`inline-flex min-h-9 min-w-9 items-center justify-center gap-2 rounded-prompt-md px-2 text-xs font-medium transition-colors sm:px-3 ${
                  prompt.isFavorite
                    ? "bg-primary-soft text-primary"
                    : "text-text-secondary hover:bg-background hover:text-text-primary"
                }`}
              >
                <Bookmark
                  aria-hidden="true"
                  className={`size-4 shrink-0 ${
                    prompt.isFavorite
                      ? "fill-current"
                      : ""
                  }`}
                />

                <span className="hidden sm:inline">
                  {prompt.isFavorite
                    ? "Favorited"
                    : "Favorite"}
                </span>
              </button>
            )}

            {/* DUPLICATE */}

            {onDuplicate && (
              <button
                type="button"
                onClick={
                  handleDuplicate
                }
                aria-label={`Duplicate ${prompt.title}`}
                title="Duplicate prompt"
                className="inline-flex min-h-9 min-w-9 items-center justify-center gap-2 rounded-prompt-md px-2 text-xs font-medium text-text-secondary transition-colors hover:bg-background hover:text-text-primary sm:px-3"
              >
                <CopyPlus
                  aria-hidden="true"
                  className="size-4 shrink-0"
                />

                <span className="hidden sm:inline">
                  Duplicate
                </span>
              </button>
            )}

            {/* DELETE */}

            {onDelete && (
              <button
                type="button"
                onClick={
                  handleStartDelete
                }
                aria-label={`Delete ${prompt.title}`}
                title="Delete prompt"
                className="inline-flex min-h-9 min-w-9 items-center justify-center gap-2 rounded-prompt-md px-2 text-xs font-medium text-text-secondary transition-colors hover:bg-red-50 hover:text-red-600 sm:px-3"
              >
                <Trash2
                  aria-hidden="true"
                  className="size-4 shrink-0"
                />

                <span className="hidden sm:inline">
                  Delete
                </span>
              </button>
            )}

          </div>

          {/* OPEN */}

          <button
            type="button"
            onClick={
              handleOpen
            }
            className="inline-flex min-h-9 shrink-0 items-center gap-1 rounded-prompt-md px-2 text-xs font-medium text-primary transition-colors hover:bg-primary-soft sm:px-3"
          >
            Open

            <ChevronRight
              aria-hidden="true"
              className="size-3.5 shrink-0 transition-transform group-hover:translate-x-0.5"
            />
          </button>

        </div>
      )}

      {/* ========================================= */}
      {/* DELETE CONFIRMATION                       */}
      {/* ========================================= */}

      {isConfirmingDelete && (
        <div className="border-t border-border-soft bg-red-50/50 px-3 py-4 sm:px-5 lg:px-6">

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <div className="min-w-0">
              <p className="text-sm font-medium text-text-primary">
                Delete this prompt?
              </p>

              <p className="mt-1 text-xs leading-5 text-text-secondary">
                This action cannot be undone.
              </p>
            </div>

            <div className="flex w-full items-center gap-2 sm:w-auto">

              {/* CANCEL */}

              <button
                type="button"
                onClick={
                  handleCancelDelete
                }
                className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-prompt-md border border-border bg-surface px-3 text-xs font-medium text-text-secondary transition-colors hover:bg-background hover:text-text-primary sm:flex-none"
              >
                <X
                  aria-hidden="true"
                  className="size-4 shrink-0"
                />

                Cancel
              </button>

              {/* CONFIRM DELETE */}

              <button
                type="button"
                onClick={
                  handleConfirmDelete
                }
                className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-prompt-md bg-red-600 px-3 text-xs font-medium text-white transition-colors hover:bg-red-700 sm:flex-none"
              >
                <Trash2
                  aria-hidden="true"
                  className="size-4 shrink-0"
                />

                Delete
              </button>

            </div>
          </div>

        </div>
      )}

    </article>
  );
}

export default PromptCard;