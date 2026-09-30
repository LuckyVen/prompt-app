import type {
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

interface IconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

function IconButton({
  children,
  className = "",
  type = "button",
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      className={[
        "inline-flex size-10 shrink-0 items-center justify-center rounded-prompt-md",
        "text-text-secondary transition-colors",
        "hover:bg-background hover:text-text-primary",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}

export default IconButton;