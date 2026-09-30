import type { TextareaHTMLAttributes } from "react";
import { useId } from "react";

interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

function Textarea({
  label,
  error,
  hint,
  id,
  className = "",
  ...props
}: TextareaProps) {
  const generatedId = useId();
  const textareaId = id ?? generatedId;

  const descriptionId =
    error || hint ? `${textareaId}-description` : undefined;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={textareaId}
          className="mb-2 block text-sm font-medium text-text-primary"
        >
          {label}
        </label>
      )}

      <textarea
        id={textareaId}
        aria-invalid={Boolean(error)}
        aria-describedby={descriptionId}
        className={[
          "min-h-32 w-full resize-y rounded-prompt-md border bg-surface px-3 py-3 text-sm leading-6 text-text-primary outline-none transition",
          "placeholder:text-text-muted",
          error
            ? "border-error focus:border-error focus:ring-4 focus:ring-error/10"
            : "border-border focus:border-primary focus:ring-4 focus:ring-primary-soft",
          className,
        ].join(" ")}
        {...props}
      />

      {(error || hint) && (
        <p
          id={descriptionId}
          className={[
            "mt-1.5 text-xs",
            error ? "text-error" : "text-text-muted",
          ].join(" ")}
        >
          {error ?? hint}
        </p>
      )}
    </div>
  );
}

export default Textarea;