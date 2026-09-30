import type {
  BuilderAnswer,
  BuilderQuestion,
} from "../../types/builder";

interface QuestionRendererProps {
  question: BuilderQuestion;
  value?: BuilderAnswer;
  onChange?: (value: BuilderAnswer) => void;
}

function QuestionRenderer({
  question,
  value,
  onChange,
}: QuestionRendererProps) {
  switch (question.type) {
    case "text":
      return (
        <input
          type="text"
          value={typeof value === "string" ? value : ""}
          onChange={(event) =>
            onChange?.(event.target.value)
          }
          placeholder={question.placeholder}
          className="
            w-full
            rounded-prompt-md
            border
            border-border
            bg-surface
            px-4
            py-3
            text-sm
            text-text-primary
            outline-none
            transition
            placeholder:text-text-muted
            focus:border-primary
            focus:ring-4
            focus:ring-primary-soft
          "
        />
      );

    case "textarea":
      return (
        <textarea
          rows={5}
          value={typeof value === "string" ? value : ""}
          onChange={(event) =>
            onChange?.(event.target.value)
          }
          placeholder={question.placeholder}
          className="
            w-full
            resize-none
            rounded-prompt-md
            border
            border-border
            bg-surface
            px-4
            py-3
            text-sm
            leading-6
            text-text-primary
            outline-none
            transition
            placeholder:text-text-muted
            focus:border-primary
            focus:ring-4
            focus:ring-primary-soft
          "
        />
      );

    case "single-select":
      return (
        <div className="grid gap-3 sm:grid-cols-2">
          {question.options?.map((option) => {
            const isSelected = value === option.value;

            return (
              <button
                key={option.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() =>
                  onChange?.(option.value)
                }
                className={[
                  "min-h-12 rounded-prompt-md border px-4 py-3 text-left text-sm font-medium transition-colors",
                  isSelected
                    ? "border-primary bg-primary-soft text-primary"
                    : "border-border bg-surface text-text-primary hover:border-primary hover:bg-primary-soft",
                ].join(" ")}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      );

    case "multi-select": {
      const selectedValues = Array.isArray(value)
        ? value
        : [];

      return (
        <div className="grid gap-3 sm:grid-cols-2">
          {question.options?.map((option) => {
            const isSelected =
              selectedValues.includes(option.value);

            function handleSelect() {
              if (!onChange) {
                return;
              }

              if (isSelected) {
                onChange(
                  selectedValues.filter(
                    (item) => item !== option.value,
                  ),
                );

                return;
              }

              onChange([
                ...selectedValues,
                option.value,
              ]);
            }

            return (
              <button
                key={option.id}
                type="button"
                aria-pressed={isSelected}
                onClick={handleSelect}
                className={[
                  "min-h-12 rounded-prompt-md border px-4 py-3 text-left text-sm font-medium transition-colors",
                  isSelected
                    ? "border-primary bg-primary-soft text-primary"
                    : "border-border bg-surface text-text-primary hover:border-primary hover:bg-primary-soft",
                ].join(" ")}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      );
    }

    default:
      return null;
  }
}

export default QuestionRenderer;