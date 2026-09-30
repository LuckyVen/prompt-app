import Button from "../ui/Button";

interface BuilderFooterProps {
  onContinue: () => void;
  disabled?: boolean;
  isLastStep?: boolean;
}

function BuilderFooter({
  onContinue,
  disabled = false,
  isLastStep = false,
}: BuilderFooterProps) {
  return (
    <div className="mt-8 flex justify-end border-t border-border pt-5">
      <Button
        onClick={onContinue}
        disabled={disabled}
      >
        {isLastStep
          ? "Create Prompt"
          : "Continue"}
      </Button>
    </div>
  );
}

export default BuilderFooter;