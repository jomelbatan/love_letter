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
    <li className="group grid grid-cols-[auto_1fr] gap-5 rounded-lg border border-border bg-card p-5 shadow-sm transition-transform hover:-translate-y-1 sm:p-6">
      <div
        className={`grid size-14 place-items-center rounded-md ${color ?? ""}`}
      >
        <Icon className="size-6" />
      </div>
      <div>
        <p className="text-xs font-black text-primary">STEP {number}</p>
        <h3 className="mt-1 font-hand text-xl font-bold">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
      </div>
    </li>
  );
}
