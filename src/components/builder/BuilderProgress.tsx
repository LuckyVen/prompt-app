interface BuilderProgressProps {
  currentStep: number;
  totalSteps: number;
}

function BuilderProgress({
  currentStep,
  totalSteps,
}: BuilderProgressProps) {
  const safeTotal = Math.max(totalSteps, 1);

  const safeCurrent = Math.min(
    Math.max(currentStep, 0),
    safeTotal,
  );

  const percentage =
    (safeCurrent / safeTotal) * 100;

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between gap-4">
        <span className="text-sm font-medium text-text-secondary">
          Step {safeCurrent} of {safeTotal}
        </span>

        <span className="text-sm text-text-muted">
          {Math.round(percentage)}%
        </span>
      </div>

      <div
        className="h-1.5 w-full overflow-hidden rounded-full bg-border-soft"
        role="progressbar"
        aria-label={`Step ${safeCurrent} of ${safeTotal}`}
        aria-valuemin={0}
        aria-valuemax={safeTotal}
        aria-valuenow={safeCurrent}
        aria-valuetext={`${Math.round(
          percentage,
        )}% complete`}
      >
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-300"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
}

export default BuilderProgress;