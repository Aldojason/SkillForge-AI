import { ReactNode } from "react";

const tones: Record<string, string> = {
  violet: "bg-primary/15 text-primary",
  sprout: "bg-sprout/15 text-sprout",
  ember: "bg-ember/15 text-ember",
  muted: "bg-muted/15 text-muted",
};

export function ClayBadge({ children, tone = "violet" }: { children: ReactNode; tone?: keyof typeof tones }) {
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold font-mono ${tones[tone]}`}>
      {children}
    </span>
  );
}
