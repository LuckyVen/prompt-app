interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  label?: string;
}

const sizeClasses = {
  sm: "size-4 border-2",
  md: "size-6 border-2",
  lg: "size-8 border-[3px]",
};

function Spinner({
  size = "md",
  label = "Loading",
}: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label={label}
      className={[
        "animate-spin rounded-full border-border border-t-primary",
        sizeClasses[size],
      ].join(" ")}
    >
      <span className="sr-only">
        {label}
      </span>
    </div>
  );
}

export default Spinner;