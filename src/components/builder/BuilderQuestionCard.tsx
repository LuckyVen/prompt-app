import type { ReactNode } from "react";

interface BuilderQuestionCardProps {
  title: string;
  description?: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
}

function BuilderQuestionCard({
  title,
  description,
  required = false,
  error,
  children,
}: BuilderQuestionCardProps) {
  return (
    <section className="mt-8">
      <div>
        <div className="flex items-start gap-2">
          <h1 className="text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
            {title}
          </h1>

          {required ? (
            <span
              aria-label="Required"
              className="mt-1 text-sm font-medium text-primary"
            >
              *
            </span>
          ) : (
            <span className="mt-1.5 whitespace-nowrap text-xs text-text-muted">
              Optional
            </span>
          )}
        </div>

        {description && (
          <p className="mt-2 max-w-xl text-sm leading-6 text-text-secondary sm:text-base">
            {description}
          </p>
        )}
      </div>

      <div className="mt-6">
        {children}
      </div>

      {error && (
        <p
          role="alert"
          className="mt-3 text-sm text-red-600"
        >
          {error}
        </p>
      )}
    </section>
  );
}

export default BuilderQuestionCard;