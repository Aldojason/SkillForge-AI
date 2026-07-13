import { HTMLAttributes, ReactNode } from "react";

export function ClayCard({
  children,
  className = "",
  inset = false,
  ...rest
}: HTMLAttributes<HTMLDivElement> & { children: ReactNode; inset?: boolean }) {
  return (
    <div
      className={`${inset ? "clay-inset" : "clay-raised"} rounded-clay p-6 ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
