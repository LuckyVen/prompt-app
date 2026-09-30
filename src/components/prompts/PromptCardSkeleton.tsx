function PromptCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="min-w-0 overflow-hidden rounded-prompt-lg border border-border bg-surface"
    >
      {/* ========================================= */}
      {/* CARD CONTENT                              */}
      {/* ========================================= */}

      <div className="animate-pulse p-4 sm:p-5 lg:p-6">

        {/* HEADER */}

        <div className="flex items-center justify-between gap-4">

          <div className="h-6 w-16 shrink-0 rounded-full bg-border-soft" />

          <div className="h-3 w-20 rounded bg-border-soft sm:w-24" />

        </div>

        {/* TITLE */}

        <div className="mt-5 h-5 w-3/5 rounded bg-border-soft" />

        {/* CONTENT */}

        <div className="mt-4 space-y-2">

          <div className="h-3 w-full rounded bg-border-soft" />

          <div className="h-3 w-11/12 rounded bg-border-soft" />

          <div className="h-3 w-2/3 rounded bg-border-soft" />

        </div>

      </div>

      {/* ========================================= */}
      {/* ACTION BAR                                */}
      {/* ========================================= */}

      <div className="flex animate-pulse items-center justify-between gap-3 border-t border-border-soft px-3 py-3 sm:px-5 lg:px-6">

        <div className="flex gap-2">

          <div className="size-8 rounded-prompt-md bg-border-soft sm:h-8 sm:w-20" />

          <div className="size-8 rounded-prompt-md bg-border-soft sm:h-8 sm:w-20" />

          <div className="size-8 rounded-prompt-md bg-border-soft sm:hidden" />

        </div>

        <div className="h-8 w-14 shrink-0 rounded-prompt-md bg-border-soft" />

      </div>

    </div>
  );
}

export default PromptCardSkeleton;