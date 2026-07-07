import type { HTMLAttributes } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: string[]) {
  return twMerge(clsx(inputs));
}

type CardProps = HTMLAttributes<HTMLDivElement>;

function Card({
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg transition-all duration-300 hover:border-cyan-500/40 hover:shadow-cyan-500/10",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;