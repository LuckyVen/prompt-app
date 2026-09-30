import type {
  HTMLAttributes,
  ReactNode,
} from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

function Card({
  children,
  className = "",
  ...props
}: CardProps) {
  return (
    <div
      className={[
        "rounded-prompt-lg border border-border bg-surface",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;