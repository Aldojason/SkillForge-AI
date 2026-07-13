import { ButtonHTMLAttributes, ReactNode } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "default";
}

export function ClayButton({ children, variant = "default", className = "", ...rest }: Props) {
  const base = "rounded-clay-sm px-5 py-2.5 font-semibold font-body transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
  const styles =
    variant === "primary"
      ? "clay-btn-primary text-[#F2ECDF]"
      : "clay-btn text-ink";
  return (
    <button className={`${base} ${styles} ${className}`} {...rest}>
      {children}
    </button>
  );
}
