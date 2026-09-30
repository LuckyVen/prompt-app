import { ArrowLeft } from "lucide-react";

interface BuilderHeaderProps {
  onBack: () => void;
}

function BuilderHeader({
  onBack,
}: BuilderHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex min-h-10 items-center gap-2 rounded-prompt-md px-2 text-sm font-medium text-text-secondary transition-colors hover:bg-background hover:text-text-primary"
      >
        <ArrowLeft size={17} />

        Back
      </button>

      <span className="text-sm font-semibold tracking-tight text-text-primary">
        PROMPT.
      </span>
    </div>
  );
}

export default BuilderHeader;