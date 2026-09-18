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
    <article className="bg-card p-6 sm:p-7">
      <span
        className={`grid size-12 -rotate-3 place-items-center rounded-md
          ${tone ?? ""}`}
      >
        <Icon className="size-5" />
      </span>
      <h3 className="mt-7 font-hand text-xl font-bold">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">{text}</p>
    </article>
  );
}
