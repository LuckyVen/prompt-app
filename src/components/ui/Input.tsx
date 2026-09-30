import type { InputHTMLAttributes } from "react";
import { useId } from "react";

interface InputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

function Input({
  label,
  error,
  hint,
  id,
  className = "",
  ...props
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  const descriptionId =
    error || hint ? `${inputId}-description` : undefined;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="mb-2 block text-sm font-medium text-text-primary"
        >
          {label}
        </label>
      )}

      <input
        id={inputId}
        aria-invalid={Boolean(error)}
        aria-describedby={descriptionId}
        className={[
          "h-11 w-full rounded-prompt-md border bg-surface px-3 text-sm text-text-primary outline-none transition",
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

export default Input;