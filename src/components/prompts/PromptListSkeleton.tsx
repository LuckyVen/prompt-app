import PromptCardSkeleton from "./PromptCardSkeleton";

interface PromptListSkeletonProps {
  count?: number;
}

function PromptListSkeleton({
  count = 4,
}: PromptListSkeletonProps) {
  return (
    <div
      role="status"
      aria-label="Loading prompts"
      className="min-w-0"
    >
      <span className="sr-only">
        Loading prompts...
      </span>

      <div className="grid min-w-0 gap-4 md:grid-cols-2">

        {Array.from({
          length: count,
        }).map((_, index) => (
          <PromptCardSkeleton
            key={index}
          />
        ))}

      </div>
    </div>
  );
}

export default PromptListSkeleton;