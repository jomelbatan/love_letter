import type { LucideIcon } from "lucide-react";

interface FlowStepProps {
  number: string;
  icon: LucideIcon;
  title: string;
  text: string;
  color: string;
}

export function FlowStep({
  number,
  icon: Icon,
  title,
  text,
  color,
}: FlowStepProps) {
  return (
    <li className="group relative grid grid-cols-[auto_1fr] gap-5 overflow-hidden border-2 border-border bg-card p-5 transition-colors hover:border-primary/50 sm:p-6">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-2 -top-7 font-kalam-bold text-7xl font-bold text-foreground/5 sm:text-8xl"
      >
        {number}
      </span>
      <div
        className={`relative z-10 grid size-14 rotate-3 place-items-center rounded-full border-2 border-foreground/15 ring-4 ring-card ${color}`}
      >
        <Icon className="size-6" />
      </div>
      <div className="relative z-10">
        <p className="text-xs font-black tracking-wide text-primary">
          STEP {number}
        </p>
        <h3 className="mt-1 font-kalam-bold text-xl font-bold">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
      </div>
    </li>
  );
}
