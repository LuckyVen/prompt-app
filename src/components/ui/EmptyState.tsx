import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
}

function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex min-h-72 flex-col items-center justify-center rounded-prompt-lg border border-dashed border-border bg-surface px-6 py-12 text-center">
      <div className="flex size-11 items-center justify-center rounded-prompt-md bg-primary-soft text-primary">
        <Icon size={20} strokeWidth={1.8} />
      </div>

      <h2 className="mt-4 text-base font-semibold text-text-primary">
        {title}
      </h2>

      <p className="mt-1 max-w-sm text-sm leading-6 text-text-secondary">
        {description}
      </p>

      {action && (
        <div className="mt-5">
          {action}
        </div>
      )}
    </div>
  );
}

export default EmptyState;