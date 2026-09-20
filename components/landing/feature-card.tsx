import type { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  text: string;
  tone: string;
}

export function FeatureCard({
  icon: Icon,
  title,
  text,
  tone,
}: FeatureCardProps) {
  return (
    <article className="group relative overflow-hidden border-2 border-border bg-card p-6 transition-colors hover:border-primary/50 sm:p-7">
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute -right-6 -top-6 size-16 rotate-45 opacity-40 ${tone ?? ""}`}
      />
      <span
        className={`relative grid size-14 -rotate-3 place-items-center rounded-full border-2 border-foreground/15 ring-4 ring-card ${tone ?? ""}`}
      >
        <Icon className="size-6" />
      </span>
      <h3 className="mt-7 font-kalam-bold text-xl font-bold">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">{text}</p>
      <span
        aria-hidden="true"
        className="mt-6 block h-px w-10 bg-foreground/15 transition-all group-hover:w-16 group-hover:bg-primary"
      />
    </article>
  );
}
